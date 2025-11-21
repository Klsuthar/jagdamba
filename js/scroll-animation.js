// Scroll Animation - Only on desktop for smooth mobile performance
if (window.innerWidth >= 768) {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                animationObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    setTimeout(() => {
        const animateElements = document.querySelectorAll('.stat-card, .feature-card, .contact-card, .info-card, .gallery-item, .about-card, .leader-card, .teacher-card, .mv-card, .student-card');
        
        animateElements.forEach(el => {
            el.classList.add('animate-element');
            animationObserver.observe(el);
        });
    }, 300);
}
