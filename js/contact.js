// Contact section content
const contactSection = document.querySelector('.contact-section');

const contactContent = `
    <div class="container">
        <h2 class="section-title">Contact Us</h2>
        <div class="contact-grid">
            <div class="contact-card">
                <div class="contact-icon">
                    <i class="fas fa-map-marker-alt"></i>
                </div>
                <h3>Address</h3>
                <p>Dhadheru Bhamuwan<br>Churu - 331802</p>
            </div>
            <div class="contact-card">
                <div class="contact-icon">
                    <i class="fas fa-phone"></i>
                </div>
                <h3>Phone</h3>
                <p>+91-98288-69462</p>
            </div>
            <div class="contact-card">
                <div class="contact-icon">
                    <i class="fas fa-envelope"></i>
                </div>
                <h3>Email</h3>
                <p>jagdamba.educationhub@gmail.com</p>
            </div>
        </div>
    </div>
`;

contactSection.innerHTML = contactContent;
