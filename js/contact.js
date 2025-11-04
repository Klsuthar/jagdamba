// Contact section content
const contactSection = document.querySelector('.contact-section');

const contactContent = `
    <div class="container">
        <h2 class="section-title">संपर्क करें</h2>
        <div class="contact-grid">
            <div class="contact-card">
                <div class="contact-icon">
                    <i class="fas fa-map-marker-alt"></i>
                </div>
                <h3>पता</h3>
                <p>123, शिक्षा मार्ग<br>गुरुकुल नगर, दिल्ली - 110001</p>
            </div>
            <div class="contact-card">
                <div class="contact-icon">
                    <i class="fas fa-phone"></i>
                </div>
                <h3>फोन</h3>
                <p>+91-11-12345678<br>+91-98765-43210</p>
            </div>
            <div class="contact-card">
                <div class="contact-icon">
                    <i class="fas fa-envelope"></i>
                </div>
                <h3>ईमेल</h3>
                <p>info@shreejagadambaschool.com<br>admission@shreejagadambaschool.com</p>
            </div>
        </div>
    </div>
`;

contactSection.innerHTML = contactContent;
