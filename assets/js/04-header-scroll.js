/* 04-header-scroll.js — extracted from index.html <script>; load order = numeric order */
(function () {
  // ----- Header scroll -----
  var topChrome = document.querySelector('.top-chrome');
  function updateHeaderScroll() {
    if (!topChrome) return;
    if (window.scrollY > 40) topChrome.classList.add('is-scrolled');
    else topChrome.classList.remove('is-scrolled');
  }
  window.addEventListener('scroll', updateHeaderScroll, { passive: true });
  updateHeaderScroll();

})();
