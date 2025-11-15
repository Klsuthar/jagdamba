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
  showInstallPopup();
});

function showInstallPopup() {
  const popup = document.createElement('div');
  popup.innerHTML = `
    <div style="position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:9999;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#fff;border-radius:20px;padding:20px 24px;box-shadow:0 10px 40px rgba(102,126,234,0.4);max-width:90%;width:400px;animation:slideUp 0.4s ease;">
      <button onclick="this.parentElement.parentElement.remove()" style="position:absolute;top:8px;right:8px;background:rgba(255,255,255,0.2);border:none;color:#fff;width:28px;height:28px;border-radius:50%;cursor:pointer;font-size:18px;line-height:1;">&times;</button>
      <div style="display:flex;align-items:center;gap:16px;">
        <div style="background:rgba(255,255,255,0.2);padding:12px;border-radius:16px;">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
            <line x1="12" y1="18" x2="12" y2="18"/>
          </svg>
        </div>
        <div style="flex:1;">
          <h3 style="margin:0 0 6px 0;font-size:18px;font-weight:700;">Install Our App</h3>
          <p style="margin:0;font-size:14px;opacity:0.95;line-height:1.4;">Get quick access and offline features!</p>
        </div>
      </div>
      <div style="display:flex;gap:10px;margin-top:16px;">
        <button id="installBtn" style="flex:1;background:#fff;color:#667eea;border:none;padding:12px;border-radius:12px;font-weight:600;cursor:pointer;font-size:14px;transition:transform 0.2s;">Install Now</button>
        <button onclick="this.parentElement.parentElement.parentElement.remove()" style="flex:1;background:rgba(255,255,255,0.2);color:#fff;border:none;padding:12px;border-radius:12px;font-weight:600;cursor:pointer;font-size:14px;">Maybe Later</button>
      </div>
    </div>
  `;
  
  const style = document.createElement('style');
  style.textContent = '@keyframes slideUp{from{transform:translateX(-50%) translateY(100px);opacity:0}to{transform:translateX(-50%) translateY(0);opacity:1}}#installBtn:hover{transform:scale(1.05)}';
  document.head.appendChild(style);
  
  document.body.appendChild(popup);
  
  popup.querySelector('#installBtn').onclick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      popup.remove();
    }
  };
  
  setTimeout(() => popup.remove(), 15000);
}
