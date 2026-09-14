/* Data-driven publication library.
   Add future work in data/publications.json; counts, filters and cards update automatically. */

(() => {
    const CATEGORY_LABELS = {
        'published-journal': 'Published Journal Article',
        'accepted-journal': 'Accepted Journal Article',
        'book-chapter': 'Book Chapter',
        'conference': 'Conference Article'
    };

    const state = {
        publications: [],
        filter: 'all',
        query: '',
        sort: 'newest'
    };

    const escapeHtml = (value = '') => String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');

    function formatAuthors(authors) {
        return authors.split(';').map((author) => {
            const clean = author.trim();
            return /Hassan, M\./i.test(clean)
                ? `<strong>${escapeHtml(clean)}</strong>`
                : escapeHtml(clean);
        }).join('; ');
    }

    function publicationCard(publication) {
        const categoryLabel = CATEGORY_LABELS[publication.category] || publication.category;
        const visual = publication.visual || {};
        const topics = (publication.topics || [])
            .map((topic) => `<span class="publication-topic">${escapeHtml(topic)}</span>`)
            .join('');
        const venueDetails = publication.details
            ? `${escapeHtml(publication.venue)} · ${escapeHtml(publication.details)}`
            : escapeHtml(publication.venue);

        let doiAction = '';
        if (publication.category === 'accepted-journal') {
            doiAction = publication.doi
                ? `<div class="doi-pending"><i data-lucide="clock-3"></i><span><b>DOI assigned</b><code>${escapeHtml(publication.doi)}</code><small>Activation pending during proofing</small></span></div>`
                : `<div class="doi-pending"><i data-lucide="clock-3"></i><span><b>DOI pending</b><small>Publisher production in progress</small></span></div>`;
        } else if (publication.doi) {
            const articleUrl = publication.url || `https://doi.org/${encodeURI(publication.doi)}`;
            const actionLabel = publication.url ? 'View article' : 'View DOI';
            doiAction = `<a class="publication-doi" href="${escapeHtml(articleUrl)}" target="_blank" rel="noopener"><i data-lucide="external-link"></i> ${actionLabel}</a>`;
        }

        const cover = publication.image
            ? `<img class="publication-cover-image" src="${escapeHtml(publication.image)}" alt="Research visual for ${escapeHtml(publication.title)}" loading="lazy">`
            : `<div class="publication-cover-art theme-${escapeHtml(visual.theme || 'systems')}" role="img" aria-label="Topic visual: ${escapeHtml(visual.label || categoryLabel)}">
                    <span class="cover-year">${publication.year}</span>
                    <i data-lucide="${escapeHtml(visual.icon || 'file-text')}"></i>
                    <span class="cover-label">${escapeHtml(visual.label || categoryLabel)}</span>
                    <span class="cover-lines" aria-hidden="true"></span>
               </div>`;

        return `
            <article class="publication-card" data-category="${escapeHtml(publication.category)}">
                <div class="publication-cover">${cover}</div>
                <div class="publication-card-body">
                    <div class="publication-card-meta">
                        <span class="publication-category category-${escapeHtml(publication.category)}">${escapeHtml(categoryLabel)}</span>
                        <span class="publication-year">${publication.year}</span>
                    </div>
                    <h3>${escapeHtml(publication.title)}</h3>
                    <p class="publication-authors">${formatAuthors(publication.authors)}</p>
                    <p class="publication-venue"><i data-lucide="book-open"></i><span>${venueDetails}</span></p>
                    <div class="publication-topics">${topics}</div>
                    <div class="publication-card-action">${doiAction}</div>
                </div>
            </article>`;
    }

    function renderMetrics() {
        Object.keys(CATEGORY_LABELS).forEach((category) => {
            const count = state.publications.filter((item) => item.category === category).length;
            document.querySelectorAll(`[data-metric="${category}"]`).forEach((node) => {
                node.textContent = count;
            });
            document.querySelectorAll(`[data-publication-count="${category}"]`).forEach((node) => {
                node.textContent = count;
            });
        });
        document.querySelectorAll('[data-publication-count="all"]').forEach((node) => {
            node.textContent = state.publications.length;
        });
    }

    function visiblePublications() {
        const query = state.query.toLowerCase().trim();
        const filtered = state.publications.filter((item) => {
            const categoryMatch = state.filter === 'all' || item.category === state.filter;
            const searchable = [
                item.title,
                item.authors,
                item.venue,
                item.year,
                ...(item.topics || [])
            ].join(' ').toLowerCase();
            return categoryMatch && (!query || searchable.includes(query));
        });

        return filtered.sort((a, b) => {
            if (state.sort === 'oldest') return a.year - b.year || a.title.localeCompare(b.title);
            if (state.sort === 'title') return a.title.localeCompare(b.title);
            return b.year - a.year || a.title.localeCompare(b.title);
        });
    }

    function renderPublications() {
        const grid = document.getElementById('publicationGrid');
        const empty = document.getElementById('publicationEmpty');
        const resultCount = document.getElementById('publicationResultCount');
        const acceptedNote = document.getElementById('acceptedDoiNote');
        const publications = visiblePublications();

        grid.innerHTML = publications.map(publicationCard).join('');
        empty.hidden = publications.length !== 0;
        grid.hidden = publications.length === 0;
        resultCount.textContent = `Showing ${publications.length} of ${state.publications.length} publications`;
        acceptedNote.hidden = state.filter !== 'accepted-journal';

        if (window.lucide) window.lucide.createIcons();
    }

    function renderPublishers(publishers) {
        const container = document.getElementById('publisherStrip');
        container.innerHTML = publishers.map((publisher) => `
            <a class="publisher-mark publisher-${escapeHtml(publisher.class)}" href="${escapeHtml(publisher.url)}" target="_blank" rel="noopener" aria-label="${escapeHtml(publisher.name)}">
                <span class="publisher-monogram">${escapeHtml(publisher.mark)}</span>
                <span>${escapeHtml(publisher.name)}</span>
            </a>`
        ).join('');
    }

    function renderReviewThemes(themes) {
        document.getElementById('reviewThemeList').innerHTML = themes
            .map((theme) => `<span><i data-lucide="check"></i>${escapeHtml(theme)}</span>`)
            .join('');
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
    }

    async function initPublicationLibrary() {
        try {
            const response = await fetch('../data/publications.json');
            if (!response.ok) throw new Error(`Publication data returned ${response.status}`);
            const data = await response.json();
            state.publications = data.publications || [];
            renderMetrics();
            renderPublishers(data.publishers || []);
            renderReviewThemes(data.underReviewThemes || []);
            bindControls();
            renderPublications();
        } catch (error) {
            console.error('Could not load publication data:', error);
            document.getElementById('publicationResultCount').textContent = 'Publication data could not be loaded.';
            document.getElementById('publicationEmpty').hidden = false;
        }
    }

    document.addEventListener('DOMContentLoaded', initPublicationLibrary);
})();
