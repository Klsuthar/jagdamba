const aboutSection = document.querySelector('.about-section');

const aboutContent = `
    <div class="about-hero">
        <h1>About Us</h1>
        <p>Empowering Young Minds Since Inception</p>
    </div>

    <div class="container">
        <div class="stats-grid">
            <div class="stat-card">
                <i class="fas fa-users"></i>
                <div class="stat-number" data-target="120">0</div>
                <div class="stat-label">Students</div>
            </div>
            <div class="stat-card">
                <i class="fas fa-chalkboard-teacher"></i>
                <div class="stat-number" data-target="4">0</div>
                <div class="stat-label">Teachers</div>
            </div>
            <div class="stat-card">
                <i class="fas fa-school"></i>
                <div class="stat-number" data-target="4">0</div>
                <div class="stat-label">Classes</div>
            </div>
            <div class="stat-card">
                <i class="fas fa-trophy"></i>
                <div class="stat-number" data-target="100">0</div>
                <div class="stat-label">Success Rate</div>
            </div>
        </div>

        <div class="mission-vision">
            <div class="mv-card">
                <div class="mv-icon"><i class="fas fa-bullseye"></i></div>
                <h3><span class="highlight-text">Our</span> Mission</h3>
                <p>To provide quality education that nurtures intellectual curiosity, moral values, and prepares students for a successful future.</p>
            </div>
            <div class="mv-card">
                <div class="mv-icon"><i class="fas fa-eye"></i></div>
                <h3><span class="highlight-text">Our</span> Vision</h3>
                <p>To be a leading educational institution that shapes confident, compassionate, and capable individuals ready to contribute to society.</p>
            </div>
        </div>
    </div>
`;

aboutSection.innerHTML = aboutContent;

// Load leadership cards
fetch('../components/principal-card.html')
    .then(r => r.text())
    .then(html => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const container = document.querySelector('.container');
        const teachersSection = container.querySelector('.section-title');
        container.insertBefore(tempDiv.firstElementChild, teachersSection);
    });

const aboutContent2 = `
        <h2 class="section-title">Our Teachers</h2>
        <div class="teachers-grid">
            <div class="teacher-card">
                <a href="https://klsuthar.github.io/KanhaiyalalSuthar/" target="_blank" class="teacher-link">
                    <div class="teacher-img">
                        <img src="../images/teachers/kanhaiyalal.webp" alt="Kanhaiya lal" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        <div class="teacher-initials" style="display:none;">KL</div>
                    </div>
                    <div class="teacher-content">
                        <h3>Kanhaiya lal</h3>
                        <p class="teacher-subject">Maths & Computer Teacher</p>
                        <p class="teacher-degree">BSc in Maths & BEd</p>
                        <p class="teacher-institute">Sadguru Institute of Education, Jaipur</p>
                    </div>
                </a>
            </div>
            <div class="teacher-card">
                <div class="teacher-img">
                    <img src="../images/teachers/pooja.webp" alt="Pooja Bhamu" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div class="teacher-initials" style="display:none;">PB</div>
                </div>
                <div class="teacher-content">
                    <h3>Pooja Bhamu</h3>
                    <p class="teacher-subject">Hindi Teacher</p>
                    <p class="teacher-degree">BA & DLIS</p>
                    <p class="teacher-institute">from VMOU</p>
                </div>
            </div>
            <div class="teacher-card">
                <div class="teacher-img">
                    <img src="../images/teachers/renu.webp" alt="Renu Noyal" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div class="teacher-initials" style="display:none;">RN</div>
                </div>
                <div class="teacher-content">
                    <h3>Renu Noyal</h3>
                    <p class="teacher-subject">EVS Teacher</p>
                    <p class="teacher-degree">BA and BEd</p>
                </div>
            </div>
        </div>

        <h2 class="section-title">Why Choose Us</h2>
        <div class="excellence-grid">
            <div class="excellence-card">
                <div class="excellence-number">01</div>
                <div class="excellence-icon"><i class="fas fa-graduation-cap"></i></div>
                <h3>Academic Excellence</h3>
                <p>Modern teaching methods with traditional values</p>
            </div>
            <div class="excellence-card">
                <div class="excellence-number">02</div>
                <div class="excellence-icon"><i class="fas fa-users"></i></div>
                <h3>Collaborative Environment</h3>
                <p>Strong community of students, teachers & parents</p>
            </div>
            <div class="excellence-card">
                <div class="excellence-number">03</div>
                <div class="excellence-icon"><i class="fas fa-chart-line"></i></div>
                <h3>Holistic Development</h3>
                <p>Balanced growth in academics, sports & arts</p>
            </div>
            <div class="excellence-card">
                <div class="excellence-number">04</div>
                <div class="excellence-icon"><i class="fas fa-chalkboard-teacher"></i></div>
                <h3>Expert Faculty</h3>
                <p>Experienced and dedicated teaching staff</p>
            </div>
            <div class="excellence-card">
                <div class="excellence-number">05</div>
                <div class="excellence-icon"><i class="fas fa-laptop"></i></div>
                <h3>Smart Classes</h3>
                <p>Technology-enabled learning environment</p>
            </div>
            <div class="excellence-card">
                <div class="excellence-number">06</div>
                <div class="excellence-icon"><i class="fas fa-shield-alt"></i></div>
                <h3>Safe Environment</h3>
                <p>Secure campus with caring supervision</p>
            </div>
        </div>

        <div class="feature-image">
            <img src="../images/stikers/student_with_teacher.webp" alt="Students with Teacher">
        </div>

        <div class="school-footer">
            <img src="../images/logo.png" alt="School Logo" class="footer-logo">
            <h3>Shree Jagdamba Convent School</h3>
            <p>Excellence in Education</p>
        </div>
    </div>
`;

document.querySelector('.container').insertAdjacentHTML('beforeend', aboutContent2);

// Counter animation
const animateCounter = (el) => {
    const target = +el.dataset.target;
    const increment = target / 100;
    let current = 0;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            el.textContent = target + (el.parentElement.querySelector('.stat-label').textContent === 'Success Rate' ? '%' : '+');
            clearInterval(timer);
        } else {
            el.textContent = Math.ceil(current);
        }
    }, 20);
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(counter => observer.observe(counter));

// Scroll animations
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.teacher-card, .excellence-card, .mv-card, .principal-card, .highlight-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease';
    scrollObserver.observe(el);
});
