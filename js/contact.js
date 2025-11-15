const contactSection = document.querySelector('.contact-section');

const contactContent = `
    <div class="contact-hero">
        <h1>Get In Touch</h1>
        <p>We'd love to hear from you. Reach out to us anytime!</p>
    </div>

    <div class="container">
        <div class="contact-form-section">
            <h2 class="section-title">Send Us a Message</h2>
            <div class="form-grid">
                <form class="contact-form" id="contactForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="name">Parent Name *</label>
                            <input type="text" id="name" name="name" required placeholder="Your name">
                        </div>
                        <div class="form-group">
                            <label for="phone">Phone *</label>
                            <input type="tel" id="phone" name="phone" required placeholder="98288-69462">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="studentName">Student Name *</label>
                            <input type="text" id="studentName" name="studentName" required placeholder="Student name">
                        </div>
                        <div class="form-group">
                            <label for="class">Class</label>
                            <select id="class" name="class">
                                <option value="">Select class</option>
                                <option value="nursery">Nursery</option>
                                <option value="lkg">LKG</option>
                                <option value="ukg">UKG</option>
                                <option value="1">Class 1</option>
                                <option value="2">Class 2</option>
                                <option value="3">Class 3</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="subject">Subject *</label>
                        <select id="subject" name="subject" required>
                            <option value="">Select subject</option>
                            <option value="admission">Admission Enquiry</option>
                            <option value="feedback">Feedback</option>
                            <option value="complaint">Complaint</option>
                            <option value="leave">Student Leave</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="message">Message *</label>
                        <textarea id="message" name="message" required placeholder="Your message..."></textarea>
                    </div>
                    <button type="submit" class="submit-btn">
                        <i class="fas fa-paper-plane"></i>
                        Send Message
                    </button>
                    <div class="form-success" id="formSuccess">
                        <i class="fas fa-check-circle"></i> Message sent successfully!
                    </div>
                    <div class="form-error" id="formError">
                        <i class="fas fa-exclamation-circle"></i> Please fill all fields.
                    </div>
                </form>

                <div class="quick-info">
                    <h3>Quick Contact Info</h3>
                    <a href="https://maps.google.com/?q=Dhadheru+Bhamuwan+Churu" target="_blank" class="quick-info-item" aria-label="Get directions">
                        <div class="quick-info-icon"><i class="fas fa-map-marker-alt"></i></div>
                        <div class="quick-info-content">
                            <h4>Address</h4>
                            <p>Dhadheru Bhamuwan<br>Churu - 331802, Rajasthan</p>
                        </div>
                    </a>
                    <a href="tel:+919828869462" class="quick-info-item" aria-label="Call school">
                        <div class="quick-info-icon"><i class="fas fa-phone"></i></div>
                        <div class="quick-info-content">
                            <h4>Phone</h4>
                            <p>+91-98288-69462</p>
                        </div>
                    </a>
                    <a href="mailto:jagdamba.educationhub@gmail.com" class="quick-info-item" aria-label="Email school">
                        <div class="quick-info-icon"><i class="fas fa-envelope"></i></div>
                        <div class="quick-info-content">
                            <h4>Email</h4>
                            <p>jagdamba.educationhub@gmail.com</p>
                        </div>
                    </a>
                    <div class="quick-info-item">
                        <div class="quick-info-icon"><i class="fas fa-clock"></i></div>
                        <div class="quick-info-content">
                            <h4>Working Hours</h4>
                            <p>Mon - Sat: 9:30 AM - 3:00 PM<br>Sunday: Closed</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="info-section">
            <div class="info-card">
                <div class="info-icon"><i class="fas fa-graduation-cap"></i></div>
                <h3>Admission Enquiry</h3>
                <p>For admission related queries, please visit the school during working hours or call us.</p>
            </div>
            <div class="info-card">
                <div class="info-icon"><i class="fas fa-bus"></i></div>
                <h3>Transport Facility</h3>
                <p>Safe and reliable bus transport available for students from nearby areas.</p>
            </div>
        </div>

        <div class="map-section">
            <h2 class="section-title">Find Us on Map</h2>
            <div class="map-container">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d403.7138518249634!2d74.34211615948017!3d27.96105086479203!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3914dbcd93d0fd83%3A0x71a2c85322dbb15e!2sShree%20Jagadamba%20Sr.%20Sec.%20School!5e1!3m2!1sen!2sin!4v1762532962708!5m2!1sen!2sin" width="100%" height="400" style="border:0; border-radius: 12px;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="School location map"></iframe>
            </div>
        </div>
    </div>

    <div class="success-modal" id="successModal">
        <div class="modal-content">
            <div class="modal-icon">
                <i class="fas fa-check"></i>
            </div>
            <h3>Thank You!</h3>
            <p>Your message has been sent successfully. We will get back to you soon.</p>
            <button class="modal-btn" onclick="document.getElementById('successModal').classList.remove('show')">Close</button>
        </div>
    </div>
`;

contactSection.innerHTML = contactContent;

// Form handling
const form = document.getElementById('contactForm');
const successMsg = document.getElementById('formSuccess');
const errorMsg = document.getElementById('formError');
const modal = document.getElementById('successModal');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const btn = form.querySelector('.submit-btn');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Validate
    if (!data.name || !data.phone || !data.studentName || !data.subject || !data.message) {
        errorMsg.textContent = 'Please fill all required fields.';
        errorMsg.style.display = 'block';
        setTimeout(() => errorMsg.style.display = 'none', 3000);
        return;
    }
    
    // Disable button
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    // Save to Firebase
    try {
        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
        const { getFirestore, collection, addDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        
        const firebaseConfig = {
            apiKey: "AIzaSyCDD4bEr2ILayjw6PNJp2k0Hd-q1Lb_Q_8",
            authDomain: "shree-jagdamba.firebaseapp.com",
            projectId: "shree-jagdamba",
            storageBucket: "shree-jagdamba.firebasestorage.app",
            messagingSenderId: "510037364219",
            appId: "1:510037364219:web:f2f60eeea7138b6b0d0f5e"
        };
        
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        
        await addDoc(collection(db, 'contactSubmissions'), {
            ...data,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString('en-IN')
        });
        
        // Success
        modal.classList.add('show');
        form.reset();
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        setTimeout(() => modal.classList.remove('show'), 5000);
        
    } catch (error) {
        console.error('Firebase Error:', error);
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        
        // Show specific error
        if (error.code === 'permission-denied') {
            errorMsg.textContent = '⚠️ Database not configured. Please enable Firestore in Firebase Console.';
        } else if (error.message.includes('Failed to get document')) {
            errorMsg.textContent = '⚠️ Please enable Firestore Database in Firebase Console first.';
        } else {
            errorMsg.textContent = '❌ Error: ' + error.message;
        }
        errorMsg.style.display = 'block';
        setTimeout(() => errorMsg.style.display = 'none', 5000);
    }
});

// Close modal on outside click
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('show');
    }
});

// Scroll animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.info-card, .contact-form, .quick-info').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Input focus animations
setTimeout(() => {
    document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.querySelector('label').style.color = 'var(--primary)';
        });
        input.addEventListener('blur', () => {
            input.parentElement.querySelector('label').style.color = '';
        });
    });
}, 100);
