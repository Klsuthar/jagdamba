// About section content
const aboutSection = document.querySelector('.about-section');

const aboutContent = `
    <div class="container">
        <h2 class="section-title">हमारे बारे में</h2>
        
        <div class="leadership-section">
            <div class="leader-card">
                <div class="leader-img">
                    <img src="../images/Director.jpg" alt="निदेशक">
                </div>
                <h3>निदेशक का संदेश</h3>
                <p>शिक्षा वह शक्ति है जो जीवन को बदल सकती है। श्री जगदम्बा स्कूल में हम हर बच्चे को उनकी पूरी क्षमता तक पहुंचने में मदद करते हैं।</p>
            </div>
            <div class="leader-card">
                <div class="leader-img">
                    <img src="../images/principal.jpg" alt="प्रिंसिपल">
                </div>
                <h3>प्रिंसिपल का संदेश</h3>
                <p>हमारा उद्देश्य न केवल शैक्षणिक उत्कृष्टता प्राप्त करना है बल्कि बच्चों में नैतिक मूल्यों और जीवन कौशल का विकास करना भी है।</p>
            </div>
        </div>

        <div class="about-grid">
            <div class="about-card">
                <div class="card-icon">
                    <i class="fas fa-book-open"></i>
                </div>
                <h3>शैक्षणिक उत्कृष्टता</h3>
                <p>आधुनिक शिक्षा पद्धतियों के साथ पारंपरिक मूल्यों का संयोजन</p>
            </div>
            <div class="about-card">
                <div class="card-icon">
                    <i class="fas fa-users"></i>
                </div>
                <h3>सहयोगी वातावरण</h3>
                <p>छात्र, शिक्षक और अभिभावक मिलकर मजबूत शिक्षा समुदाय</p>
            </div>
            <div class="about-card">
                <div class="card-icon">
                    <i class="fas fa-trophy"></i>
                </div>
                <h3>समग्र विकास</h3>
                <p>शैक्षिक, खेल, कला और सांस्कृतिक गतिविधियों में संतुलित विकास</p>
            </div>
        </div>
    </div>
`;

aboutSection.innerHTML = aboutContent;
