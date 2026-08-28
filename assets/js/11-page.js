/* 11-page.js — internal-page behaviours (added during the multi-page build; homepage unaffected). */
(function () {
  // Plain "Book Service" triggers (CTA bands): open the booking modal.
  document.querySelectorAll('[data-open-booking]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      var openBtn = document.getElementById('bookServiceBtn');
      if (openBtn) openBtn.click();
    });
  });

  // Inline booking forms (contact page): swap to a success note on submit.
  document.querySelectorAll('form[data-inline-booking]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      form.style.display = 'none';
      var ok = form.parentNode.querySelector('.inline-success');
      if (ok) ok.classList.add('show');
    });
  });

  // "Book this service" buttons: preselect the service in the booking form, then open the modal.
  document.querySelectorAll('[data-book-service]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      var value = el.getAttribute('data-book-service');
      var select = document.getElementById('bkService');
      if (select && value) {
        for (var i = 0; i < select.options.length; i++) {
          if (select.options[i].value === value) { select.value = value; break; }
        }
      }
      var openBtn = document.getElementById('bookServiceBtn');
      if (openBtn) openBtn.click();
    });
  });
})();
