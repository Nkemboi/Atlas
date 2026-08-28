/* 10-intro-video.js — extracted from index.html <script>; load order = numeric order */
(function () {
  // ----- Intro video modal -----
  (function () {
    var modal = document.getElementById('video-modal');
    var btn = document.getElementById('proceed-btn');
    var label = document.getElementById('proceed-label');
    var fill = document.getElementById('intro-progress-fill');
    var muteBtn = document.getElementById('mute-btn');
    var iframe = document.getElementById('intro-video');
    if (!modal || !btn) return; // already removed (repeat visitor)

    document.body.classList.add('video-modal-open');

    function closeModal() {
      if (iframe) iframe.src = '';
      modal.classList.add('hidden');
      document.body.classList.remove('video-modal-open');
      setTimeout(function () {
        if (modal && modal.parentNode) modal.parentNode.removeChild(modal);
      }, 400);
    }
    btn.addEventListener('click', function () {
      if (btn.disabled) return;
      closeModal();
    });

    // Skip countdown + progress bar
    var SKIP_SECONDS = 10;
    var remaining = SKIP_SECONDS;
    if (fill) fill.style.width = '0%';
    var countdown = setInterval(function () {
      remaining -= 1;
      if (fill) fill.style.width = (((SKIP_SECONDS - remaining) / SKIP_SECONDS) * 100) + '%';
      if (remaining <= 0) {
        clearInterval(countdown);
        if (fill) fill.style.width = '100%';
        btn.disabled = false;
        if (label) label.textContent = 'Proceed to Website';
      } else {
        if (label) label.textContent = 'Skip in ' + remaining + 's';
      }
    }, 1000);

    // Mute / unmute via YouTube postMessage API
    if (muteBtn && iframe) {
      var isMuted = false;
      function sendYT(func, args) {
        try {
          iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: func, args: args || [] }), '*');
        } catch (e) {}
      }
      muteBtn.addEventListener('click', function () {
        isMuted = !isMuted;
        if (isMuted) {
          sendYT('mute');
          muteBtn.classList.remove('is-unmuted');
          muteBtn.setAttribute('aria-label', 'Unmute video');
          muteBtn.setAttribute('aria-pressed', 'false');
        } else {
          sendYT('unMute');
          sendYT('setVolume', [100]);
          muteBtn.classList.add('is-unmuted');
          muteBtn.setAttribute('aria-label', 'Mute video');
          muteBtn.setAttribute('aria-pressed', 'true');
        }
      });
    }
  })();

})();
