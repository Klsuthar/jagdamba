// Gallery section content
const gallerySection = document.querySelector('.gallery-section');
window.eventImages = [];

fetch('../json/gallery_events.json')
    .then(response => response.json())
    .then(data => {
        let htmlContent = '<div class="container"><h2 class="section-title">हमारी गैलरी</h2>';
        
        data.events.forEach((event, eventIndex) => {
            const eventImgs = event.images.map(img => img.path);
            window.eventImages[eventIndex] = eventImgs;
            
            htmlContent += `<h3 style="margin: 2rem 0 1rem; color: var(--primary); text-align: center;">${event.eventName}</h3>`;
            htmlContent += '<div class="gallery-grid">';
            
            event.images.forEach((img, imgIndex) => {
                htmlContent += `
                    <div class="gallery-item" onclick="openEventLightbox(${eventIndex}, ${imgIndex})">
                        <img src="${img.path}" alt="${img.alt}" loading="lazy">
                        <div class="gallery-overlay">
                            <i class="fas fa-expand"></i>
                        </div>
                    </div>
                `;
            });
            
            htmlContent += '</div>';
        });
        
        htmlContent += '</div>';
        gallerySection.innerHTML = htmlContent;
    })
    .catch(error => console.error('Error loading gallery:', error));
