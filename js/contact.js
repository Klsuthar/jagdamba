// Form handling
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const successMsg = document.getElementById('formSuccess');
    const errorMsg = document.getElementById('formError');
    const modal = document.getElementById('successModal');

    if (form) {
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
                if (modal) modal.classList.add('show');
                form.reset();
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
                if (modal) setTimeout(() => modal.classList.remove('show'), 5000);
                
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
    }

    // Close modal on outside click
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    }

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
    document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(input => {
        input.addEventListener('focus', () => {
            const label = input.parentElement.querySelector('label');
            if (label) label.style.color = 'var(--primary)';
        });
        input.addEventListener('blur', () => {
            const label = input.parentElement.querySelector('label');
            if (label) label.style.color = '';
        });
    });
});
