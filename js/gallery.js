// Gallery section content
const gallerySection = document.querySelector('.gallery-section');
window.eventImages = [];

fetch('../json/gallery_events.json?v=' + Date.now())
    .then(response => {
        if (!response.ok) throw new Error('JSON not found');
        return response.json();
    })
    .then(data => {
        let htmlContent = `
            <div class="container">
                <div class="gallery-header">
                    <h2 class="section-title"><span class="highlight-text">Our</span> Gallery</h2>
                    <p class="section-subtitle">Capturing Moments of Excellence & Joy</p>
                </div>
                <div class="gallery-grid">`;
        
        data.events.forEach((event, eventIndex) => {
            const eventImgs = event.images.map(img => img.path);
            window.eventImages[eventIndex] = eventImgs;
            
            htmlContent += `
                <div class="gallery-item" onclick="openEventLightbox(${eventIndex}, 0)" role="button" tabindex="0" aria-label="View ${event.eventName} gallery">
                    <div class="gallery-image-wrapper">
                        <img src="${event.images[0].path}" alt="${event.eventName}" loading="lazy">
                        <div class="photo-badge">
                            <i class="fas fa-images"></i>
                            ${event.images.length}
                        </div>
                        <div class="gallery-overlay">
                            <i class="fas fa-search-plus"></i>
                        </div>
                    </div>
                    <div class="gallery-info">
                        <h3>${event.eventName}</h3>
                        <p><i class="fas fa-calendar"></i> School Event</p>
                    </div>
                </div>`;
        });
        
        htmlContent += '</div></div>';
        gallerySection.innerHTML = htmlContent;
        
        // Add keyboard support
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    item.click();
                }
            });
        });
    })
    .catch(error => {
        console.error('Error loading gallery:', error);
        gallerySection.innerHTML = `
            <div class="container">
                <div class="gallery-header">
                    <h2 class="section-title">Gallery Unavailable</h2>
                    <p class="section-subtitle" style="color: #ef4444;">Unable to load gallery images. Please try again later.</p>
                </div>
            </div>`;
    });
