/* 08-services-carousel.js — extracted from index.html <script>; load order = numeric order */
(function () {
  // ----- Services select + carousel -----
  var servicesSelect = document.getElementById('service-select') || document.getElementById('servicesSelect');
  var bayGrid = document.getElementById('bayGrid');
  if (servicesSelect && bayGrid) {
    servicesSelect.addEventListener('change', function () {
      var val = servicesSelect.value;
      var target = document.getElementById(val) || document.querySelector('[data-bay="' + val + '"]') || document.getElementById('bay-' + val);
      if (!target) {
        // try option value as id
        target = document.getElementById(servicesSelect.value);
      }
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        document.querySelectorAll('.bay').forEach(function (b) { b.classList.remove('is-active'); });
        target.classList.add('is-active');
      }
    });
  }
  var carouselPrev = document.getElementById('carouselPrev');
  var carouselNext = document.getElementById('carouselNext');
  var bays = bayGrid ? bayGrid.querySelectorAll('.bay') : [];
  var activeBayIndex = 0;
  function goToBay(i) {
    if (!bays.length) return;
    activeBayIndex = (i + bays.length) % bays.length;
    bays[activeBayIndex].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    bays.forEach(function (b) { b.classList.remove('is-active'); });
    bays[activeBayIndex].classList.add('is-active');
  }
  if (carouselPrev) carouselPrev.addEventListener('click', function () { goToBay(activeBayIndex - 1); });
  if (carouselNext) carouselNext.addEventListener('click', function () { goToBay(activeBayIndex + 1); });

})();
