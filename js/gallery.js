// Gallery section content
const gallerySection = document.querySelector('.gallery-section');

const galleryData = [
    { thumb: 'images/School_outer_look.jpg', full: 'images/School_outer_look.jpg', alt: 'स्कूल भवन' },
    { thumb: 'images/principal.jpg', full: 'images/principal.jpg', alt: 'प्रिंसिपल' },
    { thumb: 'images/Director.jpg', full: 'images/Director.jpg', alt: 'निदेशक' },
    { thumb: 'images/Partibha_smman.jpg', full: 'images/Partibha_smman.jpg', alt: 'प्रतिभा सम्मान' },
    { thumb: 'images/Partibha_smman2.jpg', full: 'images/Partibha_smman2.jpg', alt: 'प्रतिभा सम्मान 2' },
    { thumb: 'images/Partibha_smman3.jpg', full: 'images/Partibha_smman3.jpg', alt: 'प्रतिभा सम्मान 3' },
    { thumb: 'images/events/drawing_competition/drawing_competition (1).jpg', full: 'images/events/drawing_competition/drawing_competition (1).jpg', alt: 'चित्रकला प्रतियोगिता 1' },
    { thumb: 'images/events/drawing_competition/drawing_competition (2).jpg', full: 'images/events/drawing_competition/drawing_competition (2).jpg', alt: 'चित्रकला प्रतियोगिता 2' },
    { thumb: 'images/events/drawing_competition/drawing_competition (3).jpg', full: 'images/events/drawing_competition/drawing_competition (3).jpg', alt: 'चित्रकला प्रतियोगिता 3' },
    { thumb: 'images/events/drawing_competition/drawing_competition (4).jpg', full: 'images/events/drawing_competition/drawing_competition (4).jpg', alt: 'चित्रकला प्रतियोगिता 4' },
    { thumb: 'images/events/drawing_competition/drawing_competition (5).jpg', full: 'images/events/drawing_competition/drawing_competition (5).jpg', alt: 'चित्रकला प्रतियोगिता 5' },
    { thumb: 'images/events/drawing_competition/drawing_competition (6).jpg', full: 'images/events/drawing_competition/drawing_competition (6).jpg', alt: 'चित्रकला प्रतियोगिता 6' },
    { thumb: 'images/events/drawing_competition/drawing_competition (7).jpg', full: 'images/events/drawing_competition/drawing_competition (7).jpg', alt: 'चित्रकला प्रतियोगिता 7' },
    { thumb: 'images/events/drawing_competition/drawing_competition (8).jpg', full: 'images/events/drawing_competition/drawing_competition (8).jpg', alt: 'चित्रकला प्रतियोगिता 8' },
    { thumb: 'images/events/drawing_competition/drawing_competition (9).jpg', full: 'images/events/drawing_competition/drawing_competition (9).jpg', alt: 'चित्रकला प्रतियोगिता 9' },
    { thumb: 'images/events/drawing_competition/drawing_competition (10).jpg', full: 'images/events/drawing_competition/drawing_competition (10).jpg', alt: 'चित्रकला प्रतियोगिता 10' }
];

galleryImages = galleryData.map(item => item.full);

const galleryHTML = `
    <div class="container">
        <h2 class="section-title">हमारी गैलरी</h2>
        <div class="gallery-grid">
            ${galleryData.map((item, index) => `
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

gallerySection.innerHTML = galleryHTML;
