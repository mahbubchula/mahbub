/* Apply the saved or system colour theme before first paint to avoid a flash.
   Mirrors the logic in initThemeToggle() in main.js. */
(function () {
    var saved = null;
    try { saved = localStorage.getItem('theme'); } catch (e) { /* storage unavailable */ }
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'light' || (saved !== 'dark' && !prefersDark)) {
        document.body.classList.add('light-mode');
    }
})();
