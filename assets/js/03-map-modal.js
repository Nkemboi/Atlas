/* 03-map-modal.js — extracted from index.html <script>; load order = numeric order */
(function () {
  // ----- Map modal -----
  var openMapBtn = document.getElementById('openMapBtn');
  var mapOverlay = document.getElementById('mapOverlay');
  var mapClose = document.getElementById('mapClose');

  function openMap(e) {
    if (e) e.preventDefault();
    if (!mapOverlay) return;
    mapOverlay.classList.add('open');
    document.body.classList.add('map-open');
  }
  function closeMap() {
    if (!mapOverlay) return;
    mapOverlay.classList.remove('open');
    document.body.classList.remove('map-open');
  }
  if (openMapBtn) openMapBtn.addEventListener('click', openMap);
  if (mapClose) mapClose.addEventListener('click', closeMap);
  if (mapOverlay) {
    mapOverlay.addEventListener('click', function (e) {
      if (e.target === mapOverlay) closeMap();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (bookingOverlay && bookingOverlay.classList.contains('open')) closeBooking();
    if (mapOverlay && mapOverlay.classList.contains('open')) closeMap();
  });

})();
