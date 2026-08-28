/* 02-booking-modal.js — extracted from index.html <script>; load order = numeric order */
(function () {
  // ----- Booking modal -----
  var bookServiceBtn = document.getElementById('bookServiceBtn');
  var bookingOverlay = document.getElementById('bookingOverlay');
  var bookingClose = document.getElementById('bookingClose');
  var bookingForm = document.getElementById('bookingForm');
  var bookingSuccess = document.getElementById('bookingSuccess');
  var bookingDone = document.getElementById('bookingDone');

  function openBooking(e) {
    if (e) e.preventDefault();
    if (!bookingOverlay) return;
    bookingOverlay.classList.add('open');
    document.body.classList.add('booking-open');
    if (bookingForm) bookingForm.classList.remove('hide');
    if (bookingSuccess) bookingSuccess.classList.remove('show');
  }
  function closeBooking() {
    if (!bookingOverlay) return;
    bookingOverlay.classList.remove('open');
    document.body.classList.remove('booking-open');
  }
  if (bookServiceBtn) bookServiceBtn.addEventListener('click', openBooking);
  if (bookingClose) bookingClose.addEventListener('click', closeBooking);
  if (bookingDone) bookingDone.addEventListener('click', closeBooking);
  if (bookingOverlay) {
    bookingOverlay.addEventListener('click', function (e) {
      if (e.target === bookingOverlay) closeBooking();
    });
  }
  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();
      bookingForm.classList.add('hide');
      if (bookingSuccess) bookingSuccess.classList.add('show');
    });
  }

})();
