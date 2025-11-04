// About section content
const aboutSection = document.querySelector('.about-section');

const aboutContent = `
    <div class="container">
        <h2 class="section-title">हमारे बारे में</h2>
        <div class="about-grid">
            <div class="about-card">
                <div class="card-icon">
                    <i class="fas fa-graduation-cap"></i>
                </div>
                <h3>प्रिंसिपल का संदेश</h3>
                <p>श्री जगदम्बा स्कूल में हम प्रत्येक छात्र के सर्वांगीण विकास पर ध्यान देते हैं। हमारा उद्देश्य न केवल शैक्षणिक उत्कृष्टता प्राप्त करना है बल्कि बच्चों में नैतिक मूल्यों का विकास करना भी है।</p>
            </div>
            <div class="about-card">
                <div class="card-icon">
                    <i class="fas fa-book-open"></i>
                </div>
                <h3>शैक्षणिक उत्कृष्टता</h3>
                <p>हमारी अनुभवी शिक्षक टीम आधुनिक शिक्षा पद्धतियों के साथ पारंपरिक मूल्यों का संयोजन करके छात्रों को भविष्य के लिए तैयार करती है।</p>
            </div>
            <div class="about-card">
                <div class="card-icon">
                    <i class="fas fa-users"></i>
                </div>
                <h3>सहयोगी वातावरण</h3>
                <p>हमारे स्कूल में छात्र, शिक्षक और अभिभावक मिलकर एक मजबूत शिक्षा समुदाय का निर्माण करते हैं जो हर बच्चे के सफल भविष्य में योगदान देता है।</p>
            </div>
        </div>
    </div>
`;

aboutSection.innerHTML = aboutContent;
