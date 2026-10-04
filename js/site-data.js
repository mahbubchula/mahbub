/* ============================================
   SITE DATA
   Keeps publication figures consistent across pages by reading them
   from data/publications.json, and renders the recent-publications list
   on the home page.
   - [data-pub-stat="total|journals|published-journal|accepted-journal|book-chapter|conference"]
   - #recentPublications
   ============================================ */
(() => {
    const base = window.location.pathname.includes('/pages/') ? '../' : '';
    const RECENT_COUNT = 5;
    const CATEGORY_LABELS = {
        'published-journal': 'Journal article',
        'accepted-journal': 'Accepted article',
        'book-chapter': 'Book chapter',
        'conference': 'Conference paper'
    };

    const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[char]);

    function countPublications(publications) {
        const counts = { total: publications.length };
        publications.forEach(({ category }) => {
            counts[category] = (counts[category] || 0) + 1;
        });
        counts.journals = (counts['published-journal'] || 0) + (counts['accepted-journal'] || 0);
        return counts;
    }

    function applyCounts(counts) {
        document.querySelectorAll('[data-pub-stat]').forEach((element) => {
            const value = counts[element.dataset.pubStat];
            if (value === undefined) return;
            const suffix = element.dataset.suffix || '';
            element.dataset.count = value;
            element.textContent = `${value}${suffix}`;
        });
    }

    function formatAuthors(authors) {
        return escapeHtml(authors).replace(/Hassan, M\.(\s*\*)?/g, (match) => `<strong>${match}</strong>`);
    }

    function renderRecent(publications, journals) {
        const list = document.getElementById('recentPublications');
        if (!list) return;

        const recent = publications
            .map((publication, index) => ({ publication, index }))
            .sort((a, b) => (b.publication.year - a.publication.year) || (a.index - b.index))
            .slice(0, RECENT_COUNT)
            .map(({ publication }) => publication);

        list.innerHTML = recent.map((publication) => {
            const doi = publication.doi ? String(publication.doi).trim() : '';
            const pending = publication.doiStatus === 'pending-activation';
            let link = '';
            if (doi && !pending) {
                link = `<a href="https://doi.org/${escapeHtml(doi)}" target="_blank" rel="noopener">doi:${escapeHtml(doi)}</a>`;
            } else if (publication.url) {
                link = `<a href="${escapeHtml(publication.url)}" target="_blank" rel="noopener">View record</a>`;
            } else if (doi) {
                link = `<span class="recent-pending">doi:${escapeHtml(doi)} (activation pending)</span>`;
            }
            const details = publication.details ? `, ${escapeHtml(publication.details)}` : '';
            return `
                <li class="recent-item">
                    ${window.PubCovers ? window.PubCovers.render(publication, journals) : ''}
                    <div class="recent-meta">
                        <span class="recent-year">${escapeHtml(publication.year)}</span>
                        <span class="recent-type">${CATEGORY_LABELS[publication.category] || 'Publication'}</span>
                    </div>
                    <div class="recent-body">
                        <h3>${escapeHtml(publication.title)}</h3>
                        <p class="recent-authors">${formatAuthors(publication.authors)}</p>
                        <p class="recent-venue"><em>${escapeHtml(publication.venue)}</em>${details}</p>
                        ${link ? `<p class="recent-link">${link}</p>` : ''}
                    </div>
                </li>`;
        }).join('');
    }

    fetch(`${base}data/publications.json`, { cache: 'no-cache' })
        .then((response) => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
        })
        .then(async (data) => {
            const publications = Array.isArray(data) ? data : data.publications || [];
            applyCounts(countPublications(publications));
            const journals = window.PubCovers ? await window.PubCovers.load(base) : {};
            renderRecent(publications, journals);
        })
        .catch(() => {
            const list = document.getElementById('recentPublications');
            if (list) {
                list.innerHTML = `<li class="recent-placeholder">See the <a href="${base}pages/publications.html">full publication list</a>.</li>`;
            }
        });
})();
