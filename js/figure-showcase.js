// Research highlights: rotating figures in the opening screen, with a full-size viewer.
(function () {
    const dialog = document.getElementById('figureDialog');
    const deck = document.getElementById('heroDeck');
    if (!dialog || !deck) return;

    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const slides = Array.from(deck.querySelectorAll('.hero-deck-slide'));
    const label = (index) => String(index + 1).padStart(2, '0');

    /* ---------- full-size viewer ---------- */
    const img = document.getElementById('figureDialogImg');
    const num = document.getElementById('figureDialogNum');
    const title = document.getElementById('figureDialogTitle');
    const text = document.getElementById('figureDialogText');
    let current = 0;

    function show(index) {
        current = (index + slides.length) % slides.length;
        const slide = slides[current];
        img.src = slide.dataset.full;
        img.alt = slide.querySelector('img').alt;
        num.textContent = label(current);
        title.textContent = slide.dataset.title;
        text.textContent = slide.dataset.text;
    }
    function open(index) {
        show(index);
        if (typeof dialog.showModal === 'function') dialog.showModal();
        else window.open(slides[current].dataset.full, '_blank', 'noopener');
    }
    document.getElementById('figureDialogPrev').addEventListener('click', () => show(current - 1));
    document.getElementById('figureDialogNext').addEventListener('click', () => show(current + 1));
    document.getElementById('figureDialogClose').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') show(current - 1);
        if (event.key === 'ArrowRight') show(current + 1);
    });
    // keep the opening screen in step with the viewer, and return focus to it
    dialog.addEventListener('close', () => { go(current); slides[current].focus(); });

    /* ---------- rotating deck ---------- */
    const deckNum = document.getElementById('heroDeckNum');
    const deckTitle = document.getElementById('heroDeckTitle');
    const deckCount = document.getElementById('heroDeckCount');
    const pause = document.getElementById('heroDeckPause');
    let active = 0;
    let timer = null;

    function go(index) {
        slides[active].classList.remove('is-active');
        slides[active].setAttribute('tabindex', '-1');
        slides[active].setAttribute('aria-hidden', 'true');
        active = (index + slides.length) % slides.length;
        const slide = slides[active];
        slide.querySelector('img').loading = 'eager';
        slide.classList.add('is-active');
        slide.removeAttribute('tabindex');
        slide.removeAttribute('aria-hidden');
        deckNum.textContent = label(active);
        deckTitle.textContent = slide.dataset.title;
        deckCount.textContent = (active + 1) + ' / ' + slides.length;
        // warm up the next image so the change is smooth
        slides[(active + 1) % slides.length].querySelector('img').loading = 'eager';
    }
    function start() {
        if (calm || timer) return;
        timer = window.setInterval(() => go(active + 1), 4200);
        pause.setAttribute('aria-pressed', 'false');
        pause.setAttribute('aria-label', 'Pause the rotating figures');
        deck.classList.remove('is-paused');
    }
    function stop() {
        if (timer) { window.clearInterval(timer); timer = null; }
        pause.setAttribute('aria-pressed', 'true');
        pause.setAttribute('aria-label', 'Play the rotating figures');
        deck.classList.add('is-paused');
    }
    pause.addEventListener('click', () => (timer ? stop() : start()));
    document.getElementById('heroDeckPrev').addEventListener('click', () => { stop(); go(active - 1); });
    document.getElementById('heroDeckNext').addEventListener('click', () => { stop(); go(active + 1); });
    slides.forEach((slide, index) => slide.addEventListener('click', () => { stop(); open(index); }));
    deck.addEventListener('focusin', stop);
    if (calm) pause.hidden = true; else start();
})();
