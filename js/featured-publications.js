(() => {
    const carousel = document.getElementById('publicationCarousel');
    if (!carousel) return;

    const track = carousel.querySelector('.publication-track');
    const slides = [...carousel.querySelectorAll('.publication-slide')];
    const dotsContainer = carousel.querySelector('.publication-dots');
    const counter = carousel.querySelector('.publication-counter');
    const previousButton = carousel.querySelector('.publication-prev');
    const nextButton = carousel.querySelector('.publication-next');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let activeIndex = 0;
    let autoAdvance;
    let touchStartX = 0;

    const dots = slides.map((_, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'publication-dot';
        button.setAttribute('aria-label', `Show publication ${index + 1}`);
        button.addEventListener('click', () => showSlide(index, true));
        dotsContainer.appendChild(button);
        return button;
    });

    function showSlide(index, restart = false) {
        activeIndex = (index + slides.length) % slides.length;
        track.style.transform = `translateX(-${activeIndex * 100}%)`;
        slides.forEach((slide, slideIndex) => {
            const isActive = slideIndex === activeIndex;
            slide.setAttribute('aria-hidden', String(!isActive));
            if ('inert' in slide) slide.inert = !isActive;
        });
        dots.forEach((dot, dotIndex) => {
            const isActive = dotIndex === activeIndex;
            dot.classList.toggle('active', isActive);
            dot.setAttribute('aria-current', isActive ? 'true' : 'false');
        });
        counter.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
        if (restart) startAutoAdvance();
    }

    function startAutoAdvance() {
        window.clearInterval(autoAdvance);
        if (!reducedMotion) {
            autoAdvance = window.setInterval(() => showSlide(activeIndex + 1), 8000);
        }
    }

    previousButton.addEventListener('click', () => showSlide(activeIndex - 1, true));
    nextButton.addEventListener('click', () => showSlide(activeIndex + 1, true));
    carousel.addEventListener('mouseenter', () => window.clearInterval(autoAdvance));
    carousel.addEventListener('mouseleave', startAutoAdvance);
    carousel.addEventListener('focusin', () => window.clearInterval(autoAdvance));
    carousel.addEventListener('focusout', (event) => {
        if (!carousel.contains(event.relatedTarget)) startAutoAdvance();
    });
    carousel.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') showSlide(activeIndex - 1, true);
        if (event.key === 'ArrowRight') showSlide(activeIndex + 1, true);
    });
    carousel.addEventListener('touchstart', (event) => {
        touchStartX = event.changedTouches[0].clientX;
    }, { passive: true });
    carousel.addEventListener('touchend', (event) => {
        const distance = event.changedTouches[0].clientX - touchStartX;
        if (Math.abs(distance) > 45) showSlide(activeIndex + (distance < 0 ? 1 : -1), true);
    }, { passive: true });

    showSlide(0);
    startAutoAdvance();
})();
