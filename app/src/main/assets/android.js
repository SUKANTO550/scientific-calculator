(function() {
  'use strict';

  // Two layouts, switched by tapping the angle indicator ("D") on the display:
  //   full screen (default) - the body fills the window
  //   web dimensions        - exact 845 x 1870 proportions like the web version
  var webDim = false;
  try { webDim = localStorage.getItem('webDim') === '1'; } catch (e) {}

  // Dynamic scale calculation to fit exact screen dimensions
  function updateScale() {
    var w = window.innerWidth || document.documentElement.clientWidth;
    var h = window.innerHeight || document.documentElement.clientHeight;
    if (w > 0 && h > 0) {
      // web dimensions: as large as possible; the outer rim rings (9 each side) and the
      // body thickness under the chin (24 + 9) must still fit, so the outline touches the screen edge
      var scale = webDim ? Math.min(w / (845 + 18), h / (1870 + 9 + 33)) : Math.min(w / 845, h / 1870);
      document.documentElement.style.setProperty('--sb', scale + 'px');
    }
  }
  function applyLayout() {
    document.documentElement.classList.toggle('webdim', webDim);
    updateScale();
  }
  applyLayout();
  var angleInd = document.getElementById('ind-angle');
  if (angleInd) {
    angleInd.addEventListener('click', function () {
      webDim = !webDim;
      try { localStorage.setItem('webDim', webDim ? '1' : '0'); } catch (e) {}
      triggerHaptic();
      applyLayout();
    });
  }

  window.addEventListener('resize', updateScale);
  window.addEventListener('orientationchange', function() {
    setTimeout(updateScale, 100);
  });
  updateScale();

  // Haptic feedback hook
  function triggerHaptic() {
    try {
      if (window.AndroidBridge && window.AndroidBridge.vibrate) {
        window.AndroidBridge.vibrate();
      } else if (navigator.vibrate) {
        navigator.vibrate(12);
      }
    } catch (e) {}
  }
  window.triggerHaptic = triggerHaptic;

  // Hook press function if defined
  function wrapPress() {
    if (typeof window.press === 'function' && !window.press._hooked) {
      var origPress = window.press;
      window.press = function(key) {
        triggerHaptic();
        return origPress.apply(this, arguments);
      };
      window.press._hooked = true;
    }
  }
  wrapPress();
  window.addEventListener('DOMContentLoaded', wrapPress);

  // Android back button handler
  window.__androidBack = function() {
    try {
      if (typeof S !== 'undefined') {
        // Steps screen of an indefinite ∫ / d/dx: back to the answer
        if (S.screen === 'steps') {
          S.screen = 'calc';
          if (typeof render === 'function') render();
          return true;
        }
        // If an overlay/menu/setup/screen is open
        if (S.screen && S.screen !== 'calc') {
          if (typeof backToCalc === 'function') backToCalc();
          else S.screen = 'calc';
          if (typeof render === 'function') render();
          return true;
        }

        // If in calc screen and there are input items
        if (S.root && S.root.items && S.root.items.length > 0) {
          if (typeof ac === 'function') ac();
          if (typeof render === 'function') render();
          return true;
        }
      }
    } catch (e) {
      console.error('Back handling error', e);
    }
    return false; // Let Android minimize/exit
  };

  // Result click to copy
  window.addEventListener('DOMContentLoaded', function() {
    var resultEl = document.getElementById('result');
    if (resultEl) {
      resultEl.title = "Tap to copy result";
      resultEl.addEventListener('click', function(e) {
        // the Steps buttons under an indefinite answer open the steps, they do not copy
        if (e.target.closest && e.target.closest('[data-cas-steps]')) return;
        // indefinite answer: copy only the answer, not the button labels
        var src = resultEl.querySelector('.cas-ans') || resultEl;
        var text = (src.innerText || '').replace(/\s+/g, ' ').trim();
        if (text) {
          if (window.AndroidBridge && window.AndroidBridge.copyText) {
            window.AndroidBridge.copyText(text);
          } else if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
          }
          showToast('Copied: ' + text);
        }
      });
    }

    // Panel Menu / Setup / List Click & Touch delegation
    var panelEl = document.getElementById('panel');
    if (panelEl) {
      setupPanelClicks(panelEl);
    }
  });

  function setupPanelClicks(panel) {
    // taps on menu/setup/list items are handled in screens.js (panelTap)

    // Touch swipe gesture for menu / list paging
    var touchStartY = 0;
    var touchStartX = 0;
    panel.addEventListener('touchstart', function(e) {
      if (e.touches && e.touches[0]) {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
      }
    }, { passive: true });

    panel.addEventListener('touchend', function(e) {
      if (e.changedTouches && e.changedTouches[0]) {
        var dy = e.changedTouches[0].clientY - touchStartY;
        var dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dy) > 35 && Math.abs(dy) > Math.abs(dx)) {
          if (S.screen === 'menu') {
            triggerHaptic();
            if (dy < 0 && S.menuTop < 1) {
              S.menuTop = 1;
              if (typeof render === 'function') render();
            } else if (dy > 0 && S.menuTop > 0) {
              S.menuTop = 0;
              if (typeof render === 'function') render();
            }
          } else if (S.screen === 'setup') {
            triggerHaptic();
            if (dy < 0) setupKey('down');
            else if (dy > 0) setupKey('up');
            if (typeof render === 'function') render();
          } else if (S.screen === 'list') {
            triggerHaptic();
            if (dy < 0) listKey('down');
            else if (dy > 0) listKey('up');
            if (typeof render === 'function') render();
          }
        }
      }
    }, { passive: true });
  }

  function showToast(msg) {
    var t = document.getElementById('android-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'android-toast';
      t.className = 'copied-toast';
      document.body.appendChild(t);
    }
    t.innerText = msg;
    t.classList.add('show');
    clearTimeout(t._hideTimer);
    t._hideTimer = setTimeout(function() {
      t.classList.remove('show');
    }, 1800);
  }

})();
