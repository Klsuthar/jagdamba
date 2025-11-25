// Smooth scroll optimization
let ticking = false;

// Debounce scroll events
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

// Optimize touch scrolling
document.addEventListener('touchstart', () => {}, { passive: true });
document.addEventListener('touchmove', () => {}, { passive: true });

// Prevent scroll jank
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
