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
                <h3>Gopal Krishan Bhambhu</h3>
                <p class="leader-title">Director</p>
                <p>Education is the power that can transform lives. At Shri Jagdamba School, we help every child reach their full potential.</p>
            </div>
            <div class="leader-card">
                <div class="leader-img">
                    <img src="../images/principal.jpg" alt="Headmaster">
                </div>
                <h3>Ram Partap Guruwa</h3>
                <p class="leader-title">Headmaster</p>
                <p>Our goal is not only to achieve academic excellence but also to develop moral values and life skills in children.</p>
            </div>
        </div>

        <div class="teachers-section">
            <h2 class="section-subtitle">Our Teachers</h2>
            <div class="teachers-grid">
                <div class="teacher-card">
                    <a href="https://klsuthar.github.io/KanhaiyalalSuthar/" target="_blank" class="teacher-link">
                        <div class="teacher-img">
                            <img src="../images/teachers/kanhaiyalal.jpg" alt="Kanhaiyalal" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                            <div class="teacher-initials" style="display:none;">KA</div>
                        </div>
                        <h3>Kanhaiyalal</h3>
                        <p class="teacher-subject">Maths Teacher, Computer Teacher</p>
                    </a>
                </div>
                <div class="teacher-card">
                    <div class="teacher-img">
                        <img src="../images/teachers/pooja.jpg" alt="Pooja" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        <div class="teacher-initials" style="display:none;">PO</div>
                    </div>
                    <h3>Pooja</h3>
                    <p class="teacher-subject">Hindi Teacher</p>
                </div>
                <div class="teacher-card">
                    <div class="teacher-img">
                        <img src="../images/teachers/renu.jpg" alt="Renu" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        <div class="teacher-initials" style="display:none;">RE</div>
                    </div>
                    <h3>Renu</h3>
                    <p class="teacher-subject">EVS Teacher</p>
                </div>
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
