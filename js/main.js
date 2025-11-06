// Navigation
const navLinks = document.querySelectorAll('.nav-link');
const mobileNavItems = document.querySelectorAll('.mobile-nav .nav-item');
const header = document.getElementById('header');

// Smooth scroll
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        if (link.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Active nav on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;
    let activeFound = false;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            activeFound = true;
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });

            mobileNavItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === `#${sectionId}`) {
                    item.classList.add('active');
                }
            });
        }
    });

    if (!activeFound) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === 'index.html') {
                link.classList.add('active');
            }
        });
        mobileNavItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === 'index.html') {
                item.classList.add('active');
            }
        });
    }

    // Header shadow
    if (scrollY > 50) {
        header.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    } else {
        header.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    }
});

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.querySelector('.lightbox-image');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');

let currentImageIndex = 0;
let currentEventIndex = 0;
window.galleryImages = [];
window.eventImages = [];

function openEventLightbox(eventIndex, imageIndex) {
    currentEventIndex = eventIndex;
    currentImageIndex = imageIndex;
    lightboxImage.src = window.eventImages[currentEventIndex][currentImageIndex];
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function openLightbox(index) {
    currentImageIndex = index;
    lightboxImage.src = window.galleryImages[currentImageIndex];
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function navigateLightbox(direction) {
    if (window.eventImages[currentEventIndex]) {
        currentImageIndex += direction;
        if (currentImageIndex < 0) currentImageIndex = window.eventImages[currentEventIndex].length - 1;
        if (currentImageIndex >= window.eventImages[currentEventIndex].length) currentImageIndex = 0;
        lightboxImage.src = window.eventImages[currentEventIndex][currentImageIndex];
    } else {
        currentImageIndex += direction;
        if (currentImageIndex < 0) currentImageIndex = window.galleryImages.length - 1;
        if (currentImageIndex >= window.galleryImages.length) currentImageIndex = 0;
        lightboxImage.src = window.galleryImages[currentImageIndex];
    }
}

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
lightboxNext.addEventListener('click', () => navigateLightbox(1));

// Close on ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
});

// Touch swipe
let touchStartX = 0;
lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
});

lightbox.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    if (touchStartX - touchEndX > 50) navigateLightbox(1);
    if (touchEndX - touchStartX > 50) navigateLightbox(-1);
});
