/* ============================================
   PUBLICATION COVERS
   Shared by the home page and the publication library.
   Shows the journal cover image when data/journals.json lists one;
   otherwise draws a typographic cover plate in the publisher colour.
   ============================================ */
window.PubCovers = (() => {
    const FALLBACK_COLOR = '#16324F';
    const TYPE_LABELS = {
        'published-journal': 'Journal',
        'accepted-journal': 'Journal',
        'book-chapter': 'Book chapter',
        'conference': 'Proceedings'
    };

    const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[char]);

    let journalsPromise;

    function load(base) {
        if (!journalsPromise) {
            journalsPromise = fetch(`${base}data/journals.json`, { cache: 'no-cache' })
                .then((response) => (response.ok ? response.json() : {}))
                .catch(() => ({}));
        }
        return journalsPromise;
    }

    /* Publisher for venues not listed in journals.json (conference proceedings,
       book chapters) is read from the end of the "details" field, e.g. "pp. 1–6, IEEE". */
    function publisherFor(publication, journals) {
        const venue = (journals.venues || {})[publication.venue];
        if (venue && venue.publisher) return venue.publisher;
        const details = publication.details || '';
        if (/\bIEEE\b/.test(details) || /\bIEEE\b/.test(publication.venue)) return 'IEEE';
        if (/Springer/i.test(details)) return 'Springer';
        if (/Elsevier/i.test(details)) return 'Elsevier';
        return '';
    }

    /* Short display name: explicit "short", else an acronym in brackets, else the venue. */
    function shortVenue(publication, journals) {
        const venue = (journals.venues || {})[publication.venue];
        if (venue && venue.short) return venue.short;
        const acronym = (publication.venue || '').match(/\(([^)]+)\)\s*$/);
        if (acronym && publication.category === 'conference') return acronym[1];
        return publication.venue || '';
    }

    function info(publication, journals) {
        const publisher = publisherFor(publication, journals);
        const publisherData = (journals.publishers || {})[publisher] || {};
        const venue = (journals.venues || {})[publication.venue] || {};
        return {
            publisher,
            color: publisherData.color || FALLBACK_COLOR,
            cover: venue.cover || '',
            title: shortVenue(publication, journals),
            type: TYPE_LABELS[publication.category] || 'Publication'
        };
    }

    function plate(publication, data) {
        return `
            <div class="cover-plate" style="--plate:${escapeHtml(data.color)}">
                <span class="cover-plate-publisher">${escapeHtml(data.publisher || data.type)}</span>
                <span class="cover-plate-title">${escapeHtml(data.title)}</span>
                <span class="cover-plate-foot"><span>${escapeHtml(data.type)}</span><span>${escapeHtml(publication.year)}</span></span>
            </div>`;
    }

    /* Returns HTML for a cover. If the image fails to load, the plate is shown instead. */
    function render(publication, journals) {
        const data = info(publication, journals);
        const fallback = plate(publication, data);
        if (!data.cover) return `<div class="pub-cover">${fallback}</div>`;
        const prefix = window.location.pathname.includes('/pages/') ? '../' : '';
        return `
            <div class="pub-cover has-image">
                <img src="${escapeHtml(prefix + data.cover)}" alt="Cover of ${escapeHtml(publication.venue)}" loading="lazy" decoding="async"
                     onerror="this.parentElement.classList.remove('has-image'); this.remove();">
                ${fallback}
            </div>`;
    }

    return { load, render, info, escapeHtml };
})();
