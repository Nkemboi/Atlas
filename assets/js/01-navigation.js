/* 01-navigation.js — extracted from index.html <script>; load order = numeric order */
(function () {
  // ----- Explore menu -----
  var exploreBtn = document.getElementById('exploreBtn');
  var navOverlay = document.getElementById('navOverlay');
  var navClose = document.getElementById('navClose');
  var servicesToggle = document.getElementById('servicesToggle');
  var servicesSubmenu = document.getElementById('servicesSubmenu');

  function openMenu() {
    if (!navOverlay) return;
    navOverlay.classList.add('open');
    document.body.classList.add('menu-open');
  }
  function closeMenu() {
    if (!navOverlay) return;
    navOverlay.classList.remove('open');
    document.body.classList.remove('menu-open');
  }
  if (exploreBtn) exploreBtn.addEventListener('click', openMenu);
  if (navClose) navClose.addEventListener('click', closeMenu);
  if (servicesToggle && servicesSubmenu) {
    servicesToggle.addEventListener('click', function () {
      var open = servicesSubmenu.classList.toggle('open');
      servicesToggle.classList.toggle('expanded', open);
      servicesToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  if (navOverlay) {
    navOverlay.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navOverlay && navOverlay.classList.contains('open')) closeMenu();
  });

})();
