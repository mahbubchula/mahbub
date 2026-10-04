/* Data-driven publication library.
   Add future work in data/publications.json; counts, charts, filters and cards update automatically.
   Journal covers and publisher colours come from data/journals.json (see js/covers.js). */

(() => {
    const CATEGORY_LABELS = {
        'published-journal': 'Journal article',
        'accepted-journal': 'Accepted article',
        'book-chapter': 'Book chapter',
        'conference': 'Conference paper'
    };

    const state = {
        publications: [],
        journals: {},
        filter: 'all',
        query: '',
        topic: '',
        sort: 'newest'
    };

    const escapeHtml = (value) => window.PubCovers.escapeHtml(value);

    /* ---------- Formatting helpers ---------- */

    function authorList(authors) {
        return String(authors || '').split(';').map((author) => author.replace(/\*/g, '').trim()).filter(Boolean);
    }

    function formatAuthors(authors) {
        return String(authors || '').split(';').map((author) => {
            const clean = author.trim();
            return /Hassan, M\./i.test(clean) ? `<strong>${escapeHtml(clean)}</strong>` : escapeHtml(clean);
        }).join('; ');
    }

    /* "122, 103789" -> { volume: 122, pages: 103789 }; "16(9), 1–20" -> volume, number, pages */
    function parseDetails(details) {
        const text = String(details || '').trim();
        const journal = text.match(/^(\d+)(?:\((\d+)\))?,\s*(.+)$/);
        if (journal) return { volume: journal[1], number: journal[2], pages: journal[3] };
        const pages = text.match(/pp\.\s*([\d–-]+)/);
        return { pages: pages ? pages[1] : '' };
    }

    function doiUrl(publication) {
        return publication.doi ? `https://doi.org/${publication.doi}` : '';
    }

    function apaCitation(publication) {
        const authors = authorList(publication.authors);
        const authorText = authors.length > 1
            ? `${authors.slice(0, -1).join(', ')}, & ${authors[authors.length - 1]}`
            : authors.join('');
        const parts = parseDetails(publication.details);
        let source = publication.venue;
        if (publication.category === 'published-journal' && parts.volume) {
            source += `, ${parts.volume}${parts.number ? `(${parts.number})` : ''}`;
            if (parts.pages) source += `, ${parts.pages}`;
        } else if (publication.category !== 'published-journal' && parts.pages) {
            source = `In ${source} (pp. ${parts.pages})`;
        }
        const status = publication.category === 'accepted-journal' ? ' Manuscript accepted for publication.' : '';
        const link = doiUrl(publication) ? ` ${doiUrl(publication)}` : '';
        return `${authorText} (${publication.year}). ${publication.title}. ${source}.${status}${link}`;
    }

    function bibtexCitation(publication) {
        const authors = authorList(publication.authors);
        const surname = (authors[0] || 'hassan').split(',')[0].toLowerCase().replace(/[^a-z]/g, '');
        const firstWord = (publication.title.match(/[A-Za-z]{4,}/) || ['paper'])[0].toLowerCase();
        const key = `${surname}${publication.year}${firstWord}`;
        const type = publication.category === 'conference' ? 'inproceedings'
            : publication.category === 'book-chapter' ? 'incollection' : 'article';
        const container = type === 'article' ? 'journal' : 'booktitle';
        const parts = parseDetails(publication.details);
        const fields = [
            ['title', `{${publication.title}}`],
            ['author', authors.join(' and ')],
            [container, publication.venue],
            ['year', publication.year],
            ['volume', type === 'article' ? parts.volume : ''],
            ['number', type === 'article' ? parts.number : ''],
            ['pages', parts.pages ? String(parts.pages).replace('–', '--') : ''],
            ['doi', publication.doi],
            ['note', publication.category === 'accepted-journal' ? 'Accepted for publication' : '']
        ].filter(([, value]) => value);
        const body = fields.map(([name, value]) => `  ${name} = {${value}}`).join(',\n');
        return `@${type}{${key},\n${body}\n}`;
    }

    /* ---------- Cards ---------- */

    function actionLink(publication) {
        if (publication.category === 'accepted-journal' || publication.doiStatus === 'pending-activation') {
            return publication.doi
                ? `<span class="pub-pending" title="DOI assigned; activation pending during proofing"><i data-lucide="clock-3"></i> doi:${escapeHtml(publication.doi)}</span>`
                : `<span class="pub-pending"><i data-lucide="clock-3"></i> DOI pending</span>`;
        }
        const url = publication.url || doiUrl(publication);
        if (!url) return '';
        return `<a class="btn btn-primary btn-sm" href="${escapeHtml(url)}" target="_blank" rel="noopener"><i data-lucide="external-link"></i> Read article</a>`;
    }

    function publicationCard(publication) {
        const categoryLabel = CATEGORY_LABELS[publication.category] || publication.category;
        const coverInfo = window.PubCovers.info(publication, state.journals);
        const topics = (publication.topics || [])
            .map((topic) => `<button type="button" class="pub-topic" data-topic="${escapeHtml(topic)}">${escapeHtml(topic)}</button>`)
            .join('');
        const details = publication.details ? `, ${escapeHtml(publication.details)}` : '';

        return `
            <article class="pub-card" data-category="${escapeHtml(publication.category)}" id="${escapeHtml(publication.id || '')}">
                ${window.PubCovers.render(publication, state.journals)}
                <div class="pub-body">
                    <div class="pub-meta">
                        <span class="pub-type pub-type-${escapeHtml(publication.category)}">${escapeHtml(categoryLabel)}</span>
                        <span>${escapeHtml(publication.year)}</span>
                        ${coverInfo.publisher ? `<span>${escapeHtml(coverInfo.publisher)}</span>` : ''}
                    </div>
                    <h3>${escapeHtml(publication.title)}</h3>
                    <p class="pub-authors">${formatAuthors(publication.authors)}</p>
                    <p class="pub-venue"><em>${escapeHtml(publication.venue)}</em>${details}</p>
                    <div class="pub-topics">${topics}</div>
                    <div class="pub-actions">
                        ${actionLink(publication)}
                        <button type="button" class="btn btn-secondary btn-sm pub-cite-toggle" aria-expanded="false">
                            <i data-lucide="quote"></i> Cite
                        </button>
                    </div>
                    <div class="pub-cite" hidden>
                        <div class="pub-cite-tabs" role="tablist">
                            <button type="button" role="tab" class="active" data-format="apa" aria-selected="true">APA</button>
                            <button type="button" role="tab" data-format="bibtex" aria-selected="false">BibTeX</button>
                        </div>
                        <pre class="pub-cite-text" data-format="apa">${escapeHtml(apaCitation(publication))}</pre>
                        <pre class="pub-cite-text" data-format="bibtex" hidden>${escapeHtml(bibtexCitation(publication))}</pre>
                        <button type="button" class="pub-copy"><i data-lucide="copy"></i> <span>Copy citation</span></button>
                    </div>
                </div>
            </article>`;
    }

    /* ---------- Metrics ---------- */

    function renderMetrics() {
        const all = state.publications;
        Object.keys(CATEGORY_LABELS).forEach((category) => {
            const count = all.filter((item) => item.category === category).length;
            document.querySelectorAll(`[data-metric="${category}"], [data-publication-count="${category}"]`)
                .forEach((node) => { node.textContent = count; });
        });
        document.querySelectorAll('[data-publication-count="all"], [data-metric="all"]')
            .forEach((node) => { node.textContent = all.length; });
        const venues = new Set(all.filter((item) => item.category.endsWith('journal')).map((item) => item.venue));
        document.querySelectorAll('[data-metric="venues"]').forEach((node) => { node.textContent = venues.size; });
    }

    /* ---------- Charts (inline SVG, single series, one hue) ---------- */

    function tooltip() {
        let tip = document.getElementById('chartTooltip');
        if (!tip) {
            tip = document.createElement('div');
            tip.id = 'chartTooltip';
            tip.className = 'chart-tooltip';
            tip.setAttribute('role', 'status');
            document.body.appendChild(tip);
        }
        return tip;
    }

    function bindTooltip(svg) {
        const tip = tooltip();
        svg.querySelectorAll('[data-tip]').forEach((target) => {
            const show = (event) => {
                tip.innerHTML = target.dataset.tip;
                tip.classList.add('visible');
                const rect = target.getBoundingClientRect();
                const x = event && event.clientX ? event.clientX : rect.left + rect.width / 2;
                const y = event && event.clientY ? event.clientY : rect.top;
                tip.style.left = `${x}px`;
                tip.style.top = `${y}px`;
            };
            target.addEventListener('mousemove', show);
            target.addEventListener('focus', () => show());
            target.addEventListener('mouseleave', () => tip.classList.remove('visible'));
            target.addEventListener('blur', () => tip.classList.remove('visible'));
        });
    }

    /* Rounded data-end, square at the baseline */
    function columnPath(x, y, width, height, radius) {
        const r = Math.min(radius, width / 2, height);
        return `M${x},${y + height}V${y + r}Q${x},${y} ${x + r},${y}H${x + width - r}Q${x + width},${y} ${x + width},${y + r}V${y + height}Z`;
    }

    function barPath(x, y, width, height, radius) {
        const r = Math.min(radius, height / 2, width);
        return `M${x},${y}H${x + width - r}Q${x + width},${y} ${x + width},${y + r}V${y + height - r}Q${x + width},${y + height} ${x + width - r},${y + height}H${x}Z`;
    }

    function renderYearChart() {
        const container = document.getElementById('yearChart');
        if (!container) return;
        const counts = {};
        state.publications.forEach((item) => {
            counts[item.year] = counts[item.year] || {};
            counts[item.year][item.category] = (counts[item.year][item.category] || 0) + 1;
        });
        const years = Object.keys(counts).map(Number).sort((a, b) => a - b);
        const totals = years.map((year) => Object.values(counts[year]).reduce((sum, n) => sum + n, 0));
        const max = Math.max(...totals);
        const step = max > 20 ? 10 : 5;
        const top = Math.ceil(max / step) * step;

        const width = 560;
        const height = 260;
        const margin = { top: 24, right: 12, bottom: 34, left: 36 };
        const plotW = width - margin.left - margin.right;
        const plotH = height - margin.top - margin.bottom;
        const band = plotW / years.length;
        const barW = Math.min(48, band * 0.42);

        const grid = [];
        for (let value = 0; value <= top; value += step) {
            const y = margin.top + plotH - (value / top) * plotH;
            grid.push(`<line x1="${margin.left}" x2="${width - margin.right}" y1="${y}" y2="${y}" class="chart-grid"/>`);
            grid.push(`<text x="${margin.left - 8}" y="${y + 4}" text-anchor="end" class="chart-axis">${value}</text>`);
        }

        const bars = years.map((year, index) => {
            const total = totals[index];
            const h = (total / top) * plotH;
            const x = margin.left + band * index + (band - barW) / 2;
            const y = margin.top + plotH - h;
            const breakdown = Object.entries(CATEGORY_LABELS)
                .filter(([key]) => counts[year][key])
                .map(([key, label]) => `${label}s: ${counts[year][key]}`)
                .join('<br>');
            return `
                <g class="chart-mark" tabindex="0" data-tip="<strong>${year}: ${total} publications</strong><br>${breakdown}" aria-label="${year}: ${total} publications">
                    <rect x="${margin.left + band * index}" y="${margin.top}" width="${band}" height="${plotH}" fill="transparent"/>
                    <path d="${columnPath(x, y, barW, h, 4)}" class="chart-bar"/>
                    <text x="${x + barW / 2}" y="${y - 8}" text-anchor="middle" class="chart-value">${total}</text>
                    <text x="${x + barW / 2}" y="${height - 10}" text-anchor="middle" class="chart-axis">${year}</text>
                </g>`;
        }).join('');

        container.innerHTML = `
            <svg viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="yearChartTitle">
                <title id="yearChartTitle">Publications per year</title>
                ${grid.join('')}
                <line x1="${margin.left}" x2="${width - margin.right}" y1="${margin.top + plotH}" y2="${margin.top + plotH}" class="chart-baseline"/>
                ${bars}
            </svg>`;
        bindTooltip(container.querySelector('svg'));

        const table = document.getElementById('yearChartTable');
        if (table) {
            table.innerHTML = `<table><thead><tr><th>Year</th>${Object.values(CATEGORY_LABELS).map((label) => `<th>${label}s</th>`).join('')}<th>Total</th></tr></thead><tbody>${
                years.map((year, index) => `<tr><td>${year}</td>${Object.keys(CATEGORY_LABELS).map((key) => `<td>${counts[year][key] || 0}</td>`).join('')}<td>${totals[index]}</td></tr>`).join('')
            }</tbody></table>`;
        }
    }

    function renderTopicChart() {
        const container = document.getElementById('topicChart');
        if (!container) return;
        const counts = {};
        state.publications.forEach((item) => (item.topics || []).forEach((topic) => {
            counts[topic] = (counts[topic] || 0) + 1;
        }));
        const topics = Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 8);
        const max = topics.length ? topics[0][1] : 1;

        const width = 560;
        const rowH = 30;
        const labelW = 190;
        const height = topics.length * rowH + 8;
        const barMax = width - labelW - 44;
        const barH = 14;

        const rows = topics.map(([topic, count], index) => {
            const y = index * rowH + 4;
            const w = Math.max(4, (count / max) * barMax);
            return `
                <g class="chart-mark chart-topic" tabindex="0" role="button" data-topic="${escapeHtml(topic)}"
                   data-tip="<strong>${escapeHtml(topic)}</strong><br>${count} publications · click to filter" aria-label="${escapeHtml(topic)}: ${count} publications. Filter the list.">
                    <rect x="0" y="${y}" width="${width}" height="${rowH}" fill="transparent"/>
                    <text x="${labelW - 12}" y="${y + rowH / 2 + 4}" text-anchor="end" class="chart-label">${escapeHtml(topic)}</text>
                    <path d="${barPath(labelW, y + (rowH - barH) / 2, w, barH, 4)}" class="chart-bar"/>
                    <text x="${labelW + w + 8}" y="${y + rowH / 2 + 4}" class="chart-value">${count}</text>
                </g>`;
        }).join('');

        container.innerHTML = `
            <svg viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="topicChartTitle">
                <title id="topicChartTitle">Most frequent research topics</title>
                <line x1="${labelW}" x2="${labelW}" y1="0" y2="${height}" class="chart-baseline"/>
                ${rows}
            </svg>`;
        const svg = container.querySelector('svg');
        bindTooltip(svg);
        svg.querySelectorAll('.chart-topic').forEach((node) => {
            const apply = () => setTopic(node.dataset.topic);
            node.addEventListener('click', apply);
            node.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); apply(); }
            });
        });
    }

    /* ---------- Library ---------- */

    function visiblePublications() {
        const query = state.query.toLowerCase().trim();
        const filtered = state.publications.filter((item) => {
            const categoryMatch = state.filter === 'all' || item.category === state.filter;
            const topicMatch = !state.topic || (item.topics || []).includes(state.topic);
            const searchable = [item.title, item.authors, item.venue, item.year, ...(item.topics || [])].join(' ').toLowerCase();
            return categoryMatch && topicMatch && (!query || searchable.includes(query));
        });
        return filtered.sort((a, b) => {
            if (state.sort === 'oldest') return a.year - b.year || a.title.localeCompare(b.title);
            if (state.sort === 'title') return a.title.localeCompare(b.title);
            return b.year - a.year || state.publications.indexOf(a) - state.publications.indexOf(b);
        });
    }

    function renderPublications() {
        const grid = document.getElementById('publicationGrid');
        const empty = document.getElementById('publicationEmpty');
        const resultCount = document.getElementById('publicationResultCount');
        const acceptedNote = document.getElementById('acceptedDoiNote');
        const clear = document.getElementById('publicationClear');
        const publications = visiblePublications();

        grid.innerHTML = publications.map(publicationCard).join('');
        empty.hidden = publications.length !== 0;
        grid.hidden = publications.length === 0;
        const topicNote = state.topic ? ` tagged “${state.topic}”` : '';
        resultCount.textContent = `Showing ${publications.length} of ${state.publications.length} publications${topicNote}`;
        if (acceptedNote) acceptedNote.hidden = state.filter !== 'accepted-journal';
        if (clear) clear.hidden = !state.query && !state.topic;
        if (window.lucide) window.lucide.createIcons();
    }

    function setTopic(topic) {
        state.topic = topic;
        renderPublications();
        document.getElementById('libraryHeading').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function clearSearch() {
        document.getElementById('publicationSearch').value = '';
        state.query = '';
        state.topic = '';
        renderPublications();
    }

    function renderPublishers(publishers) {
        const container = document.getElementById('publisherStrip');
        if (!container) return;
        container.innerHTML = publishers.map((publisher) => `
            <a class="publisher-mark" href="${escapeHtml(publisher.url)}" target="_blank" rel="noopener">${escapeHtml(publisher.name)}</a>`
        ).join('');
    }

    function renderReviewThemes(themes) {
        const list = document.getElementById('reviewThemeList');
        if (!list) return;
        list.innerHTML = themes.map((theme) => `<li>${escapeHtml(theme)}</li>`).join('');
    }

    function fallbackCopy(text, done) {
        const area = document.createElement('textarea');
        area.value = text;
        area.setAttribute('readonly', '');
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        try { document.execCommand('copy'); done(); } catch (error) { /* copying unsupported */ }
        area.remove();
    }

    function copyText(text, button) {
        const label = button.querySelector('span');
        const done = () => {
            label.textContent = 'Copied';
            setTimeout(() => { label.textContent = 'Copy citation'; }, 1800);
        };
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
        } else {
            fallbackCopy(text, done);
        }
    }

    function bindControls() {
        document.querySelectorAll('.publication-filter').forEach((button) => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.publication-filter').forEach((item) => {
                    item.classList.remove('active');
                    item.setAttribute('aria-selected', 'false');
                });
                button.classList.add('active');
                button.setAttribute('aria-selected', 'true');
                state.filter = button.dataset.filter;
                renderPublications();
            });
        });

        document.getElementById('publicationSearch').addEventListener('input', (event) => {
            state.query = event.target.value;
            renderPublications();
        });

        document.getElementById('publicationSort').addEventListener('change', (event) => {
            state.sort = event.target.value;
            renderPublications();
        });

        /* Delegated handlers for card controls */
        document.getElementById('publicationGrid').addEventListener('click', (event) => {
            const topic = event.target.closest('.pub-topic');
            if (topic) { setTopic(topic.dataset.topic); return; }

            const toggle = event.target.closest('.pub-cite-toggle');
            if (toggle) {
                const panel = toggle.closest('.pub-body').querySelector('.pub-cite');
                const open = panel.hidden;
                panel.hidden = !open;
                toggle.setAttribute('aria-expanded', String(open));
                return;
            }

            const tab = event.target.closest('.pub-cite-tabs button');
            if (tab) {
                const panel = tab.closest('.pub-cite');
                panel.querySelectorAll('.pub-cite-tabs button').forEach((item) => {
                    const active = item === tab;
                    item.classList.toggle('active', active);
                    item.setAttribute('aria-selected', String(active));
                });
                panel.querySelectorAll('.pub-cite-text').forEach((text) => {
                    text.hidden = text.dataset.format !== tab.dataset.format;
                });
                return;
            }

            const copy = event.target.closest('.pub-copy');
            if (copy) {
                const visible = copy.closest('.pub-cite').querySelector('.pub-cite-text:not([hidden])');
                copyText(visible.textContent, copy);
            }
        });

        const clear = document.getElementById('publicationClear');
        if (clear) clear.addEventListener('click', clearSearch);
    }

    async function initPublicationLibrary() {
        try {
            const [response, journals] = await Promise.all([
                fetch('../data/publications.json', { cache: 'no-cache' }),
                window.PubCovers.load('../')
            ]);
            if (!response.ok) throw new Error(`Publication data returned ${response.status}`);
            const data = await response.json();
            state.publications = data.publications || [];
            state.journals = journals || {};
            renderMetrics();
            renderYearChart();
            renderTopicChart();
            renderPublishers(data.publishers || []);
            renderReviewThemes(data.underReviewThemes || []);
            bindControls();
            renderPublications();
            if (window.location.hash) {
                const target = document.getElementById(window.location.hash.slice(1));
                if (target) target.scrollIntoView({ block: 'center' });
            }
        } catch (error) {
            console.error('Could not load publication data:', error);
            document.getElementById('publicationResultCount').textContent = 'Publication data could not be loaded.';
            document.getElementById('publicationEmpty').hidden = false;
        }
    }

    document.addEventListener('DOMContentLoaded', initPublicationLibrary);
})();
