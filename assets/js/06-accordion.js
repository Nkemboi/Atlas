/* 06-accordion.js — extracted from index.html <script>; load order = numeric order */
(function () {
  // ----- Why accordion -----
  document.querySelectorAll('.why-accordion .why-trigger').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var accordion = btn.closest('.why-accordion');
      var item = btn.closest('.why-item');
      var wasOpen = item.classList.contains('open');
      document.querySelectorAll('.why-accordion .why-item').forEach(function (i) {
        if (accordion && i.closest('.why-accordion') !== accordion) return;
        i.classList.remove('open');
        var t = i.querySelector('.why-trigger');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

})();
