if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SW registered'))
      .catch(err => console.log('SW error:', err));
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
    setTimeout(() => {
      if (deferredPrompt) {
        showInstallPopup();
      }
    }, 120000); // 2 minutes = 120000 milliseconds
  }
});

function showInstallPopup() {
  const popup = document.createElement('div');
  popup.innerHTML = `
    <div id="installPopup" style="position:fixed;bottom:70px;left:50%;transform:translateX(-50%);z-index:9999;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#fff;border-radius:50px;padding:10px 16px;box-shadow:0 6px 20px rgba(102,126,234,0.5);display:flex;align-items:center;gap:10px;animation:slideUp 0.4s ease;max-width:calc(100% - 24px);">
      <span style="font-size:13px;font-weight:700;white-space:nowrap;">Install Our App</span>
      <button id="installBtn" style="background:rgba(255,255,255,0.95);color:#667eea;border:none;padding:8px 16px;border-radius:20px;font-size:13px;font-weight:700;cursor:pointer;transition:all 0.3s;box-shadow:0 2px 8px rgba(0,0,0,0.1);white-space:nowrap;">Install</button>
      <button id="closePopup" style="background:rgba(255,255,255,0.2);border:none;color:#fff;width:24px;height:24px;border-radius:50%;cursor:pointer;font-size:16px;line-height:1;display:flex;align-items:center;justify-content:center;transition:all 0.3s;flex-shrink:0;">&times;</button>
    </div>
  `;
  
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideUp{from{transform:translate(-50%,100px);opacity:0}to{transform:translate(-50%,0);opacity:1}}
    #closePopup:hover{background:rgba(255,255,255,0.3);transform:scale(1.1);}
    #installBtn:hover{background:#fff;transform:scale(1.05);box-shadow:0 4px 12px rgba(0,0,0,0.15);}
    #installBtn:active{transform:scale(0.95);}
    @media (max-width: 360px) {
      #installPopup{padding:8px 12px;gap:8px;}
      #installPopup span{font-size:12px;}
      #installBtn{padding:6px 12px;font-size:12px;}
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(popup);
  
  popup.querySelector('#closePopup').onclick = (e) => {
    e.stopPropagation();
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    popup.remove();
  };
  
  popup.querySelector('#installBtn').onclick = async (e) => {
    e.stopPropagation();
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      deferredPrompt = null;
      popup.remove();
      if (result.outcome === 'accepted') {
        localStorage.setItem('pwa-install-dismissed', Date.now().toString());
      }
    }
  };
  
  setTimeout(() => {
    if (popup.parentNode) {
      localStorage.setItem('pwa-install-dismissed', Date.now().toString());
      popup.remove();
    }
  }, 15000);
}
