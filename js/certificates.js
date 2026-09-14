// Load and display certificates dynamically, with category filtering and a lightbox viewer
let allCertificates = [];

document.addEventListener('DOMContentLoaded', async function () {
    try {
        const response = await fetch('../data/certificates.json');
        const data = await response.json();

        allCertificates = data.certificates;

        renderCategoryFilters(data.categories);
        renderCertificates(allCertificates);
        setupLightbox();

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    } catch (error) {
        console.error('Error loading certificates:', error);
    }
});

function renderCategoryFilters(categories) {
    const bar = document.querySelector('.category-filter-bar');
    if (!bar) return;

    const allBtn = document.createElement('button');
    allBtn.className = 'category-filter-btn active';
    allBtn.dataset.category = 'all';
    allBtn.textContent = `All (${allCertificates.length})`;
    bar.appendChild(allBtn);

    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'category-filter-btn';
        btn.dataset.category = cat.name;
        btn.textContent = `${cat.name} (${cat.count})`;
        bar.appendChild(btn);
    });

    bar.addEventListener('click', (e) => {
        const btn = e.target.closest('.category-filter-btn');
        if (!btn) return;
        bar.querySelectorAll('.category-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.dataset.category;
        const filtered = category === 'all'
            ? allCertificates
            : allCertificates.filter(c => c.category === category);
        renderCertificates(filtered);
        if (typeof lucide !== 'undefined') lucide.createIcons();
    });
}

function renderCertificates(certificates) {
    const container = document.querySelector('.certificates-grid');
    if (!container) return;

    container.innerHTML = '';
    certificates.forEach(cert => {
        container.appendChild(createCertificateCard(cert));
    });
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function createCertificateCard(cert) {
    const card = document.createElement('div');
    // "visible" is added immediately: these cards are inserted after page
    // load, so the page's IntersectionObserver (set up once at DOMContentLoaded)
    // never sees them and they'd otherwise stay stuck at opacity:0.
    card.className = 'certificate-card animate-on-scroll visible';
    card.dataset.category = cert.category;

    const verifyLink = cert.credential_url
        ? `<a href="${escapeHtml(cert.credential_url)}" class="btn btn-ghost btn-sm" target="_blank" rel="noopener">
                <i data-lucide="external-link"></i>
                Verify
           </a>`
        : '';

    card.innerHTML = `
        <div class="certificate-image" data-image="../${cert.image}" data-title="${escapeHtml(cert.title)}" data-issuer="${escapeHtml(cert.issuer)}" data-date="${escapeHtml(cert.date)}" data-pdf="../${cert.certificate_file}">
            <img src="../${cert.image}" alt="${escapeHtml(cert.title)}" loading="lazy">
            <div class="certificate-image-overlay">
                <i data-lucide="zoom-in"></i>
            </div>
        </div>
        <div class="certificate-content">
            <h4>${escapeHtml(cert.title)}</h4>
            <p class="certificate-issuer">
                <i data-lucide="building-2"></i>
                ${escapeHtml(cert.issuer)}
            </p>
            <p class="certificate-date">
                <i data-lucide="calendar"></i>
                Issued: ${escapeHtml(cert.date)}
            </p>
            <div class="certificate-skills">
                ${cert.skills.map(skill => `<span class="skill-tag">${escapeHtml(skill)}</span>`).join('')}
            </div>
            <div class="certificate-actions">
                ${verifyLink}
                <a href="../${cert.certificate_file}" class="btn btn-primary btn-sm" target="_blank">
                    <i data-lucide="download"></i>
                    Download
                </a>
            </div>
        </div>
    `;

    return card;
}

function setupLightbox() {
    const overlay = document.getElementById('certLightbox');
    if (!overlay) return;
    const imgEl = overlay.querySelector('.cert-lightbox-img-wrap img');
    const titleEl = overlay.querySelector('.cert-lightbox-title');
    const metaEl = overlay.querySelector('.cert-lightbox-meta');
    const downloadEl = overlay.querySelector('.cert-lightbox-download');
    const closeEl = overlay.querySelector('.cert-lightbox-close');

    document.addEventListener('click', (e) => {
        const imageBlock = e.target.closest('.certificate-image');
        if (!imageBlock) return;
        imgEl.src = imageBlock.dataset.image;
        titleEl.textContent = imageBlock.dataset.title;
        metaEl.textContent = `${imageBlock.dataset.issuer} • ${imageBlock.dataset.date}`;
        downloadEl.href = imageBlock.dataset.pdf;
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    function close() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    closeEl.addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) close();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
    });
}
