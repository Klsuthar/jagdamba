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
