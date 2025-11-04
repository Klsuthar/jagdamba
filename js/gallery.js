// Gallery section content
const gallerySection = document.querySelector('.gallery-section');

const galleryData = [
    { thumb: 'images/School_outer_look.jpg', full: 'images/School_outer_look.jpg', alt: 'स्कूल भवन' },
    { thumb: 'images/principal.jpg', full: 'images/principal.jpg', alt: 'प्रिंसिपल' },
    { thumb: 'images/Director.jpg', full: 'images/Director.jpg', alt: 'निदेशक' },
    { thumb: 'images/Partibha_smman.jpg', full: 'images/Partibha_smman.jpg', alt: 'प्रतिभा सम्मान' },
    { thumb: 'images/Partibha_smman2.jpg', full: 'images/Partibha_smman2.jpg', alt: 'प्रतिभा सम्मान 2' },
    { thumb: 'images/Partibha_smman3.jpg', full: 'images/Partibha_smman3.jpg', alt: 'प्रतिभा सम्मान 3' }
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
