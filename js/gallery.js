// Load and display gallery photos dynamically, with category filtering and a lightbox viewer
let allPhotos = [];

document.addEventListener('DOMContentLoaded', async function () {
    try {
        const response = await fetch('../data/gallery.json');
        const data = await response.json();

        allPhotos = data.photos;

        renderCategoryFilters(data.categories);
        renderPhotos(allPhotos);
        setupLightbox();

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    } catch (error) {
        console.error('Error loading gallery:', error);
    }
});

function renderCategoryFilters(categories) {
    const bar = document.querySelector('.category-filter-bar');
    if (!bar) return;

    const presentCategories = categories.filter(cat =>
        allPhotos.some(p => p.category === cat.name)
    );
    if (presentCategories.length < 2) return;

    const allBtn = document.createElement('button');
    allBtn.className = 'category-filter-btn active';
    allBtn.dataset.category = 'all';
    allBtn.textContent = `All (${allPhotos.length})`;
    bar.appendChild(allBtn);

    presentCategories.forEach(cat => {
        const count = allPhotos.filter(p => p.category === cat.name).length;
        const btn = document.createElement('button');
        btn.className = 'category-filter-btn';
        btn.dataset.category = cat.name;
        btn.textContent = `${cat.name} (${count})`;
        bar.appendChild(btn);
    });

    bar.addEventListener('click', (e) => {
        const btn = e.target.closest('.category-filter-btn');
        if (!btn) return;
        bar.querySelectorAll('.category-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.dataset.category;
        const filtered = category === 'all'
            ? allPhotos
            : allPhotos.filter(p => p.category === category);
        renderPhotos(filtered);
        if (typeof lucide !== 'undefined') lucide.createIcons();
    });
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function renderPhotos(photos) {
    const container = document.querySelector('.gallery-grid');
    if (!container) return;

    container.innerHTML = '';
    photos.forEach(photo => {
        container.appendChild(createPhotoCard(photo));
    });
}

function createPhotoCard(photo) {
    const card = document.createElement('div');
    // "visible" is added immediately: these cards are inserted after page
    // load, so the page's IntersectionObserver (set up once at DOMContentLoaded)
    // never sees them and they'd otherwise stay stuck at opacity:0.
    card.className = 'gallery-card animate-on-scroll visible';
    card.dataset.category = photo.category;

    card.innerHTML = `
        <div class="gallery-image" data-image="../${photo.image}" data-caption="${escapeHtml(photo.caption)}" data-date="${escapeHtml(photo.date)}">
            <img src="../${photo.image}" alt="${escapeHtml(photo.caption)}" loading="lazy">
            <div class="certificate-image-overlay">
                <i data-lucide="zoom-in"></i>
            </div>
        </div>
        <div class="gallery-caption">
            <p>${escapeHtml(photo.caption)}</p>
            <span class="gallery-date">${escapeHtml(photo.date)}</span>
        </div>
    `;

    return card;
}

function setupLightbox() {
    const overlay = document.getElementById('galleryLightbox');
    if (!overlay) return;
    const imgEl = overlay.querySelector('.cert-lightbox-img-wrap img');
    const titleEl = overlay.querySelector('.cert-lightbox-title');
    const metaEl = overlay.querySelector('.cert-lightbox-meta');
    const closeEl = overlay.querySelector('.cert-lightbox-close');

    document.addEventListener('click', (e) => {
        const imageBlock = e.target.closest('.gallery-image');
        if (!imageBlock) return;
        imgEl.src = imageBlock.dataset.image;
        titleEl.textContent = imageBlock.dataset.caption;
        metaEl.textContent = imageBlock.dataset.date;
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
