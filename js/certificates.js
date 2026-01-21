// Load and display certificates dynamically
document.addEventListener('DOMContentLoaded', async function () {
    try {
        // Fetch certificates data
        const response = await fetch('../data/certificates.json');
        const data = await response.json();

        // Get container
        const container = document.querySelector('.certificates-grid');
        if (!container) return;

        // Clear existing placeholder certificates
        container.innerHTML = '';

        // Create certificate cards
        data.certificates.forEach(cert => {
            const card = createCertificateCard(cert);
            container.appendChild(card);
        });

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

    } catch (error) {
        console.error('Error loading certificates:', error);
    }
});

function createCertificateCard(cert) {
    const card = document.createElement('div');
    card.className = 'certificate-card animate-on-scroll';

    card.innerHTML = `
        <div class="certificate-image">
            <div class="certificate-placeholder">
                <div class="cert-icon">${cert.icon}</div>
                <div class="cert-category">${cert.category}</div>
            </div>
        </div>
        <div class="certificate-content">
            <h4>${cert.title}</h4>
            <p class="certificate-issuer">
                <i data-lucide="building-2"></i>
                ${cert.issuer}
            </p>
            <p class="certificate-date">
                <i data-lucide="calendar"></i>
                Issued: ${cert.date}
            </p>
            <div class="certificate-skills">
                ${cert.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
            <div class="certificate-actions">
                <a href="${cert.credential_url}" class="btn btn-ghost btn-sm" target="_blank" rel="noopener">
                    <i data-lucide="external-link"></i>
                    Verify
                </a>
                <a href="../${cert.certificate_file}" class="btn btn-primary btn-sm" target="_blank">
                    <i data-lucide="download"></i>
                    Download
                </a>
            </div>
        </div>
    `;

    return card;
}

// Add category filtering
function initCategoryFilter() {
    const categories = document.querySelectorAll('.category-filter-btn');
    const certificates = document.querySelectorAll('.certificate-card');

    categories.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;

            // Update active button
            categories.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter certificates
            certificates.forEach(cert => {
                if (category === 'all' || cert.dataset.category === category) {
                    cert.style.display = 'block';
                } else {
                    cert.style.display = 'none';
                }
            });
        });
    });
}
