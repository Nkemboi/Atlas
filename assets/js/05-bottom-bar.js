/* 05-bottom-bar.js — extracted from index.html <script>; load order = numeric order */
(function () {
  // ----- Bottom bar visibility -----
  var bottomBar = document.querySelector('.bottom-bar');
  var heroEl = document.getElementById('top');
  function updateBottomBarVisibility() {
    if (!bottomBar) return;
    if (!heroEl) { bottomBar.classList.add('is-visible'); return; } // internal pages have no #top hero: keep the bar visible
    if (window.innerWidth > 640) {
      bottomBar.classList.add('is-visible');
      return;
    }
    var heroBottom = heroEl.offsetTop + heroEl.offsetHeight;
    if (window.scrollY > heroBottom - 80) bottomBar.classList.add('is-visible');
    else bottomBar.classList.remove('is-visible');
  }
  window.addEventListener('scroll', updateBottomBarVisibility, { passive: true });
  window.addEventListener('resize', updateBottomBarVisibility);
  updateBottomBarVisibility();

})();
