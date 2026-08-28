/* 07-hero-slider.js — extracted from index.html <script>; load order = numeric order */
(function () {
  // ----- Hero slides -----
  var slides = document.querySelectorAll('.hero-slide');
  var slideIndex = 0;
  if (slides.length > 1) {
    setInterval(function () {
      slides[slideIndex].classList.remove('active');
      slideIndex = (slideIndex + 1) % slides.length;
      slides[slideIndex].classList.add('active');
    }, 5500);
  }

})();
