// About section content
const aboutSection = document.querySelector('.about-section');

const aboutContent = `
    <div class="container">
        <h2 class="section-title">About Us</h2>
        
        <div class="leadership-section">
            <div class="leader-card">
                <div class="leader-img">
                    <img src="../images/Director.jpg" alt="Director">
                </div>
                <h3>Director's Message</h3>
                <p>Education is the power that can transform lives. At Shri Jagdamba School, we help every child reach their full potential.</p>
            </div>
            <div class="leader-card">
                <div class="leader-img">
                    <img src="../images/principal.jpg" alt="Principal">
                </div>
                <h3>Principal's Message</h3>
                <p>Our goal is not only to achieve academic excellence but also to develop moral values and life skills in children.</p>
            </div>
        </div>

        <div class="about-grid">
            <div class="about-card">
                <div class="card-icon">
                    <i class="fas fa-book-open"></i>
                </div>
                <h3>Academic Excellence</h3>
                <p>Combining modern teaching methods with traditional values</p>
            </div>
            <div class="about-card">
                <div class="card-icon">
                    <i class="fas fa-users"></i>
                </div>
                <h3>Collaborative Environment</h3>
                <p>Students, teachers and parents together form a strong education community</p>
            </div>
            <div class="about-card">
                <div class="card-icon">
                    <i class="fas fa-trophy"></i>
                </div>
                <h3>Holistic Development</h3>
                <p>Balanced development in academic, sports, arts and cultural activities</p>
            </div>
        </div>
    </div>
`;

aboutSection.innerHTML = aboutContent;
