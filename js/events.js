// Events section content
const gallerySection = document.querySelector('.gallery-section');

const eventsData = [
    { thumb: '../images/events/drawing_competition/drawing_competition (1).jpg', full: '../images/events/drawing_competition/drawing_competition (1).jpg', alt: 'चित्रकला प्रतियोगिता 1' },
    { thumb: '../images/events/drawing_competition/drawing_competition (2).jpg', full: '../images/events/drawing_competition/drawing_competition (2).jpg', alt: 'चित्रकला प्रतियोगिता 2' },
    { thumb: '../images/events/drawing_competition/drawing_competition (3).jpg', full: '../images/events/drawing_competition/drawing_competition (3).jpg', alt: 'चित्रकला प्रतियोगिता 3' },
    { thumb: '../images/events/drawing_competition/drawing_competition (4).jpg', full: '../images/events/drawing_competition/drawing_competition (4).jpg', alt: 'चित्रकला प्रतियोगिता 4' },
    { thumb: '../images/events/drawing_competition/drawing_competition (5).jpg', full: '../images/events/drawing_competition/drawing_competition (5).jpg', alt: 'चित्रकला प्रतियोगिता 5' },
    { thumb: '../images/events/drawing_competition/drawing_competition (6).jpg', full: '../images/events/drawing_competition/drawing_competition (6).jpg', alt: 'चित्रकला प्रतियोगिता 6' },
    { thumb: '../images/events/drawing_competition/drawing_competition (7).jpg', full: '../images/events/drawing_competition/drawing_competition (7).jpg', alt: 'चित्रकला प्रतियोगिता 7' },
    { thumb: '../images/events/drawing_competition/drawing_competition (8).jpg', full: '../images/events/drawing_competition/drawing_competition (8).jpg', alt: 'चित्रकला प्रतियोगिता 8' },
    { thumb: '../images/events/drawing_competition/drawing_competition (9).jpg', full: '../images/events/drawing_competition/drawing_competition (9).jpg', alt: 'चित्रकला प्रतियोगिता 9' },
    { thumb: '../images/events/drawing_competition/drawing_competition (10).jpg', full: '../images/events/drawing_competition/drawing_competition (10).jpg', alt: 'चित्रकला प्रतियोगिता 10' }
];

galleryImages = eventsData.map(item => item.full);

const eventsHTML = `
    <div class="container">
        <h2 class="section-title">चित्रकला प्रतियोगिता</h2>
        <p style="text-align: center; margin-bottom: 2rem; color: var(--text-secondary);">हमारे विद्यार्थियों की रचनात्मकता का प्रदर्शन</p>
        <div class="gallery-grid">
            ${eventsData.map((item, index) => `
                <div class="gallery-item" onclick="openLightbox(${index})">
                    <img src="${item.thumb}" alt="${item.alt}" loading="lazy">
                    <div class="gallery-overlay">
                        <i class="fas fa-expand"></i>
                    </div>
                </div>
            `).join('')}
        </div>
    </div>
`;

gallerySection.innerHTML = eventsHTML;
