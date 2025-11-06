// Gallery section content
const gallerySection = document.querySelector('.gallery-section');
window.eventImages = [];

fetch('../json/gallery_events.json')
    .then(response => {
        if (!response.ok) throw new Error('JSON not found');
        return response.json();
    })
    .then(data => {
        let htmlContent = '<div class="container"><h2 class="section-title">हमारी गैलरी</h2><div class="gallery-grid">';
        
        data.events.forEach((event, eventIndex) => {
            const eventImgs = event.images.map(img => img.path);
            window.eventImages[eventIndex] = eventImgs;
            
            htmlContent += `
                <div class="gallery-item" onclick="openEventLightbox(${eventIndex}, 0)" style="position: relative;">
                    <img src="${event.images[0].path}" alt="${event.eventName}" loading="lazy">
                    <div class="gallery-overlay">
                        <i class="fas fa-expand"></i>
                    </div>
                    <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(0,0,0,0.8)); padding: 1rem; color: white;">
                        <h3 style="margin: 0; font-size: 1.1rem;">${event.eventName}</h3>
                        <p style="margin: 0.3rem 0 0; font-size: 0.9rem; opacity: 0.9;">${event.images.length} छवियाँ</p>
                    </div>
                </div>
            `;
        });
        
        htmlContent += '</div></div>';
        gallerySection.innerHTML = htmlContent;
        console.log('Gallery loaded successfully');
    })
    .catch(error => {
        console.error('Error loading gallery:', error);
        gallerySection.innerHTML = '<div class="container"><h2 class="section-title">Error: ' + error.message + '</h2></div>';
    });
