const PWA_VERSION = '10.0.3';

function isStandaloneAppMode() {
  return window.matchMedia('(display-mode: standalone)').matches
    || window.matchMedia('(display-mode: fullscreen)').matches
    || window.navigator.standalone === true;
}

function initLaunchSplash() {
  const splash = document.querySelector('[data-pwa-splash]');
  if (!splash) return;

  if (!isStandaloneAppMode()) {
    document.documentElement.classList.remove('pwa-splash-active');
    splash.hidden = true;
    return;
  }

  splash.hidden = false;

  let finished = false;
  const launchStartedAt = Date.now();
  const minVisibleMs = 900;
  const progressFill = splash.querySelector('[data-splash-progress]');

  requestAnimationFrame(() => {
    splash.classList.add('is-ready');
    if (progressFill) {
      progressFill.style.width = '100%';
    }
  });

  const finishSplash = () => {
    if (finished) return;
    finished = true;

    const elapsed = Date.now() - launchStartedAt;
    const remaining = Math.max(minVisibleMs - elapsed, 0);

    window.setTimeout(() => {
      splash.classList.add('is-hiding');
      document.documentElement.classList.remove('pwa-splash-active');

      window.setTimeout(() => {
        splash.remove();
      }, 500);
    }, remaining);
  };

  if (document.readyState === 'complete') {
    finishSplash();
  } else {
    window.addEventListener('load', finishSplash, { once: true });
  }

  window.setTimeout(finishSplash, 2600);
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`/sw.js?v=${PWA_VERSION}`, { updateViaCache: 'none' })
      .then(reg => {
        reg.update().catch(() => {});
        console.log('SW registered');
      })
      .catch(err => console.log('SW error:', err));
  });
}

initLaunchSplash();

let deferredPrompt;
let installPromptTimer = null;
let installFallbackTimer = null;
let installPopupElement = null;

function shouldShowInstallUI() {
  if (isStandaloneAppMode()) return false;

  const lastDismissed = localStorage.getItem('pwa-install-dismissed');
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  return !lastDismissed || (now - parseInt(lastDismissed, 10)) > oneDay;
}

function removeInstallPopup() {
  if (installPopupElement) {
    installPopupElement.remove();
    installPopupElement = null;
  }
}

function showInstallPopup(mode = 'prompt') {
  if (!shouldShowInstallUI()) return;
  if (installPopupElement) return;

  const isPromptMode = mode === 'prompt' && deferredPrompt;
  const title = isPromptMode ? 'Install Jagdamba App' : 'Install Available';
  const message = isPromptMode
    ? 'Faster access ke liye app install kar lo.'
    : 'Chrome menu me "Install app" ya address bar ke install icon se app install karein.';
  const buttonLabel = isPromptMode ? 'Install Now' : 'How To Install';

  const popup = document.createElement('div');
  popup.innerHTML = `
    <div id="installPopup" style="position:fixed;right:16px;bottom:78px;z-index:9999;width:min(340px,calc(100vw - 24px));background:linear-gradient(145deg,#12306b 0%,#1d4ed8 50%,#0f766e 100%);color:#fff;border-radius:22px;padding:16px 16px 14px;box-shadow:0 16px 40px rgba(15,23,42,0.35);border:1px solid rgba(255,255,255,0.15);animation:installPopupIn 0.35s ease;">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;">
        <div>
          <div style="font-size:15px;font-weight:800;line-height:1.2;">${title}</div>
          <div style="font-size:13px;line-height:1.45;opacity:0.92;margin-top:6px;">${message}</div>
        </div>
        <button id="closePopup" style="background:rgba(255,255,255,0.14);border:none;color:#fff;width:28px;height:28px;border-radius:999px;cursor:pointer;font-size:18px;line-height:1;display:flex;align-items:center;justify-content:center;flex-shrink:0;">&times;</button>
      </div>
      <div style="display:flex;align-items:center;gap:10px;margin-top:14px;">
        <button id="installBtn" style="background:#fff;color:#12306b;border:none;padding:10px 14px;border-radius:999px;font-size:13px;font-weight:800;cursor:pointer;box-shadow:0 6px 18px rgba(255,255,255,0.18);">${buttonLabel}</button>
        <span style="font-size:12px;opacity:0.8;">No Play Store needed</span>
      </div>
    </div>
  `;

  const style = document.createElement('style');
  style.textContent = `
    @keyframes installPopupIn{from{transform:translateY(18px);opacity:0}to{transform:translateY(0);opacity:1}}
    #installBtn:hover{transform:translateY(-1px);}
    #closePopup:hover{background:rgba(255,255,255,0.22);}
    @media (max-width: 480px){
      #installPopup{right:12px !important;bottom:72px !important;padding:14px 14px 12px !important;}
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(popup);
  installPopupElement = popup;

  popup.querySelector('#closePopup').onclick = (e) => {
    e.stopPropagation();
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    removeInstallPopup();
  };

  popup.querySelector('#installBtn').onclick = async (e) => {
    e.stopPropagation();

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      if (result.outcome !== 'accepted') {
        localStorage.setItem('pwa-install-dismissed', Date.now().toString());
      }
      deferredPrompt = null;
      removeInstallPopup();
      return;
    }

    alert('Chrome me address bar ke pass install icon ya browser menu me "Install app" option use karein.');
  };
}

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;

  window.clearTimeout(installPromptTimer);
  installPromptTimer = window.setTimeout(() => {
    if (deferredPrompt) {
      showInstallPopup('prompt');
    }
  }, 4000);
});

window.addEventListener('appinstalled', () => {
  deferredPrompt = null;
  localStorage.removeItem('pwa-install-dismissed');
  removeInstallPopup();
});

window.addEventListener('load', () => {
  window.clearTimeout(installFallbackTimer);
  installFallbackTimer = window.setTimeout(() => {
    if (!deferredPrompt && !isStandaloneAppMode()) {
      showInstallPopup('fallback');
    }
  }, 9000);
});
