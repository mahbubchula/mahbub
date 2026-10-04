"""Write the shared navigation menu and footer into every page.

Run after changing the menu or footer here:  python scripts/build_layout.py
"""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

NAV_ITEMS = [
    ("index.html", "Home"),
    ("pages/about.html", "About"),
    ("pages/research.html", "Research"),
    ("pages/publications.html", "Publications"),
    ("pages/tools.html", "Tools"),
    ("pages/teaching.html", "Teaching"),
    ("pages/team.html", "Lab"),
    ("pages/certificates.html", "Certificates"),
    ("pages/contact.html", "Contact"),
]

FOOTER_COLUMNS = [
    ("Research", [("pages/research.html", "Research projects"), ("pages/publications.html", "Publications"), ("pages/tools.html", "Research software")]),
    ("Academic", [("pages/teaching.html", "Teaching"), ("pages/team.html", "B'Deshi Research Lab"), ("pages/certificates.html", "Certificates"), ("pages/gallery.html", "Gallery")]),
    ("About", [("pages/about.html", "Biography"), ("pages/contact.html", "Contact")]),
]

PROFILES = [
    ("https://scholar.google.com/citations?hl=en&amp;user=PGwRExQAAAAJ", "Google Scholar"),
    ("https://orcid.org/0009-0006-1956-8159", "ORCID"),
    ("https://www.scopus.com/authid/detail.uri?authorId=59417109900", "Scopus"),
    ("https://www.researchgate.net/profile/Mahbub-Hassan-4", "ResearchGate"),
]

GITHUB_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>'
LINKEDIN_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>'
YOUTUBE_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>'
LOGO_SVG = '''<svg viewBox="0 0 40 40" width="24" height="24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <circle cx="20" cy="20" r="6" fill="#fff" />
                            <circle cx="8" cy="8" r="3" fill="#fff" opacity="0.9" />
                            <circle cx="32" cy="8" r="3" fill="#fff" opacity="0.9" />
                            <circle cx="8" cy="32" r="3" fill="#fff" opacity="0.9" />
                            <circle cx="32" cy="32" r="3" fill="#fff" opacity="0.9" />
                            <line x1="10.5" y1="10.5" x2="15.5" y2="15.5" stroke="#fff" stroke-width="1.6" opacity="0.55" />
                            <line x1="29.5" y1="10.5" x2="24.5" y2="15.5" stroke="#fff" stroke-width="1.6" opacity="0.55" />
                            <line x1="10.5" y1="29.5" x2="15.5" y2="24.5" stroke="#fff" stroke-width="1.6" opacity="0.55" />
                            <line x1="29.5" y1="29.5" x2="24.5" y2="24.5" stroke="#fff" stroke-width="1.6" opacity="0.55" />
                        </svg>'''


def rel(target: str, page: str) -> str:
    """Path from `page` (e.g. pages/about.html) to `target` (site-root relative)."""
    if page.startswith("pages/"):
        return target[len("pages/"):] if target.startswith("pages/") else f"../{target}"
    return target


def nav(page: str) -> str:
    items = []
    for target, label in NAV_ITEMS:
        active = ' active" aria-current="page' if target == page else ""
        items.append(f'                <li><a href="{rel(target, page)}" class="nav-link{active}">{label}</a></li>')
    return '<ul class="nav-menu" id="navMenu">\n' + "\n".join(items) + "\n            </ul>"


def footer(page: str) -> str:
    columns = "\n".join(
        f'''                <div class="footer-column">
                    <h5>{title}</h5>
                    <ul>
{chr(10).join(f'                        <li><a href="{rel(target, page)}">{label}</a></li>' for target, label in links)}
                    </ul>
                </div>'''
        for title, links in FOOTER_COLUMNS
    )
    profiles = "\n".join(
        f'                        <li><a href="{url}" target="_blank" rel="noopener">{label}</a></li>' for url, label in PROFILES
    )
    return f'''<footer class="footer-new">
        <div class="container">
            <div class="footer-top">
                <div class="footer-brand-section">
                    <a href="{rel("index.html", page)}" class="footer-logo">
                        <div class="footer-logo-icon">
                        {LOGO_SVG}
                        </div>
                        <span class="footer-logo-text">Mahbub Hassan</span>
                    </a>
                    <p class="footer-brand-desc">Transportation engineering researcher at Chulalongkorn University working on road safety, travel behaviour, intelligent transportation systems and interpretable AI.</p>
                    <div class="footer-social-links">
                        <a href="https://github.com/mahbubchula" class="footer-social-link" target="_blank" rel="noopener" aria-label="GitHub">{GITHUB_SVG}</a>
                        <a href="https://scholar.google.com/citations?hl=en&amp;user=PGwRExQAAAAJ" class="footer-social-link" target="_blank" rel="noopener" aria-label="Google Scholar"><i data-lucide="graduation-cap"></i></a>
                        <a href="https://orcid.org/0009-0006-1956-8159" class="footer-social-link" target="_blank" rel="noopener" aria-label="ORCID"><i data-lucide="fingerprint"></i></a>
                        <a href="https://www.linkedin.com/in/mahbub-hassan-93b8073b7/" class="footer-social-link" target="_blank" rel="noopener" aria-label="LinkedIn">{LINKEDIN_SVG}</a>
                        <a href="https://www.youtube.com/@dailymahbub" class="footer-social-link" target="_blank" rel="noopener" aria-label="YouTube">{YOUTUBE_SVG}</a>
                        <a href="mailto:mahbub.hassan@ieee.org" class="footer-social-link" aria-label="Email"><i data-lucide="mail"></i></a>
                    </div>
                </div>
{columns}
                <div class="footer-column">
                    <h5>Profiles</h5>
                    <ul>
{profiles}
                    </ul>
                </div>
            </div>

            <div class="footer-middle">
                <div class="footer-contact-item">
                    <div class="footer-contact-icon"><i data-lucide="mail"></i></div>
                    <div class="footer-contact-info">
                        <span class="footer-contact-label">Email</span>
                        <a class="footer-contact-value" href="mailto:mahbub.hassan@ieee.org">mahbub.hassan@ieee.org</a>
                    </div>
                </div>
                <div class="footer-contact-item">
                    <div class="footer-contact-icon"><i data-lucide="building-2"></i></div>
                    <div class="footer-contact-info">
                        <span class="footer-contact-label">Affiliation</span>
                        <span class="footer-contact-value">Department of Civil Engineering, Chulalongkorn University</span>
                    </div>
                </div>
                <div class="footer-contact-item">
                    <div class="footer-contact-icon"><i data-lucide="map-pin"></i></div>
                    <div class="footer-contact-info">
                        <span class="footer-contact-label">Location</span>
                        <span class="footer-contact-value">Bangkok, Thailand</span>
                    </div>
                </div>
            </div>

            <div class="footer-bottom-new">
                <p class="footer-copyright">&copy; 2026 Mahbub Hassan</p>
                <div class="footer-legal-links">
                    <a href="{rel("pages/publications.html", page)}">Publications</a>
                    <a href="{rel("pages/contact.html", page)}">Contact</a>
                    <a href="https://github.com/mahbubchula" target="_blank" rel="noopener">GitHub</a>
                </div>
            </div>
        </div>
    </footer>'''


def main() -> None:
    pages = ["index.html"] + sorted(f"pages/{p.name}" for p in (ROOT / "pages").glob("*.html"))
    for page in pages:
        path = ROOT / page
        text = path.read_text()
        text, nav_count = re.subn(r'<ul class="nav-menu" id="navMenu">.*?</ul>', lambda _: nav(page), text, count=1, flags=re.S)
        text, foot_count = re.subn(r'<footer class="footer(?:-new)?">.*?</footer>', lambda _: footer(page), text, count=1, flags=re.S)
        if nav_count != 1 or foot_count != 1:
            raise SystemExit(f"{page}: expected one menu and one footer (found {nav_count}, {foot_count})")
        path.write_text(text)
    print(f"Updated menu and footer on {len(pages)} pages")


if __name__ == "__main__":
    main()
