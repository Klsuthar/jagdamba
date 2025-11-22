// Show splash only in PWA mode on first load
if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
  const hasSeenSplash = sessionStorage.getItem('pwa-splash-shown');
  
  if (!hasSeenSplash) {
    document.body.classList.add('pwa-loading');
    
    const splash = document.createElement('div');
    splash.id = 'pwa-splash';
    splash.innerHTML = `
      <style>
        #pwa-splash{position:fixed;top:0;left:0;width:100%;height:100%;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);display:flex;align-items:center;justify-content:center;z-index:99999;opacity:1;transition:opacity .5s}
        #pwa-splash.hidden{opacity:0;pointer-events:none}
        .splash-content{text-align:center;padding:20px;animation:fadeInUp .8s ease}
        .splash-logo{width:120px;height:120px;margin:0 auto 24px;background:#fff;border-radius:28px;padding:20px;box-shadow:0 20px 60px rgba(0,0,0,.3);animation:bounceIn 1s ease}
        .splash-logo img{width:100%;height:100%;object-fit:contain}
        .splash-title{color:#fff;font-size:clamp(1.5rem,5vw,2rem);font-weight:700;margin:0 0 8px;text-shadow:0 2px 10px rgba(0,0,0,.2)}
        .splash-subtitle{color:rgba(255,255,255,.9);font-size:clamp(.9rem,3vw,1.1rem);margin:0 0 32px}
        .splash-loader{width:50px;height:50px;border:4px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto}
        @keyframes fadeInUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        @keyframes bounceIn{0%{transform:scale(.3);opacity:0}50%{transform:scale(1.05)}70%{transform:scale(.9)}100%{transform:scale(1);opacity:1}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @media(max-width:768px){.splash-logo{width:100px;height:100px;padding:16px}}
      </style>
      <div class="splash-content">
        <div class="splash-logo"><img src="images/logo.png" alt="Jagdamba School"></div>
        <h1 class="splash-title">Shree Jagdamba School</h1>
        <p class="splash-subtitle">Excellence in Education</p>
        <div class="splash-loader"></div>
      </div>
    `;
    document.body.insertBefore(splash, document.body.firstChild);
    
    window.addEventListener('load', () => {
      setTimeout(() => {
        splash.classList.add('hidden');
        document.body.classList.remove('pwa-loading');
        setTimeout(() => splash.remove(), 500);
        sessionStorage.setItem('pwa-splash-shown', 'true');
      }, 1500);
    });
  }
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => {
        console.log('SW registered');
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'activated' && navigator.serviceWorker.controller) {
              console.log('New version available, reloading...');
              window.location.reload();
            }
          });
        });
      })
      .catch(err => console.log('SW error:', err));
  });
  
  navigator.serviceWorker.addEventListener('message', event => {
    if (event.data && event.data.type === 'FORCE_RELOAD') {
      console.log('Force reload triggered by SW');
      window.location.reload();
    }
  });
}

let deferredPrompt;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  
  const lastDismissed = localStorage.getItem('pwa-install-dismissed');
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  
  if (!lastDismissed || (now - parseInt(lastDismissed)) > oneDay) {
    showInstallPopup();
  }
});

function showInstallPopup() {
  const popup = document.createElement('div');
  popup.innerHTML = `
    <div id="installBtn" style="position:fixed;bottom:80px;right:12px;z-index:9999;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#fff;border-radius:30px;padding:8px 12px;box-shadow:0 3px 10px rgba(102,126,234,0.4);display:flex;align-items:center;gap:6px;cursor:pointer;animation:slideUp 0.3s ease;">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M19 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/>
        <path d="M12 5l7 7-7 7"/>
      </svg>
      <span style="font-size:11px;font-weight:600;">Install</span>
      <button id="closePopup" style="background:rgba(255,255,255,0.3);border:none;color:#fff;width:16px;height:16px;border-radius:50%;cursor:pointer;font-size:10px;line-height:1;margin-left:2px;">&times;</button>
    </div>
  `;
  
  const style = document.createElement('style');
  style.textContent = '@keyframes slideUp{from{transform:translateY(100px);opacity:0}to{transform:translateY(0);opacity:1}}';
  document.head.appendChild(style);
  
  document.body.appendChild(popup);
  
  popup.querySelector('#closePopup').onclick = (e) => {
    e.stopPropagation();
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    popup.remove();
  };
  
  popup.querySelector('#installBtn').onclick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      popup.remove();
    }
  };
  
  setTimeout(() => {
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    popup.remove();
  }, 10000);
}
