const studentsSection = document.querySelector('.students-section');

let currentClass = 'class2';
let studentsData = {};

async function loadStudentsData() {
    try {
        const res2 = await fetch('json/class2_students.json');
        studentsData.class2 = await res2.json();
        
        const res3 = await fetch('json/class3_students.json');
        studentsData.class3 = await res3.json();
        
        renderStudentsSection();
    } catch (error) {
        console.error('Error loading students:', error);
    }
}

function renderStudentsSection() {
    const content = `
        <div class="container">
            <h2 class="section-title">हमारे छात्र</h2>
            <div class="class-tabs">
                <button class="class-tab active" onclick="switchClass('class2')">कक्षा 2</button>
                <button class="class-tab" onclick="switchClass('class3')">कक्षा 3</button>
            </div>
            <div class="students-grid" id="studentsGrid"></div>
        </div>
    `;
    studentsSection.innerHTML = content;
    displayStudents(currentClass);
}

function displayStudents(className) {
    const grid = document.getElementById('studentsGrid');
    const students = studentsData[className] || [];
    
    grid.innerHTML = students.map(student => `
        <div class="student-card" onclick="openLightbox(${students.indexOf(student)})">
            <img src="images/students/${student.image}" alt="${student.student_name}" class="student-photo" loading="lazy">
            <div class="student-info">
                <div class="student-name">${student.student_name}</div>
                <div class="student-roll">रोल नंबर: ${student.roll_no}</div>
            </div>
        </div>
    `).join('');
    
    galleryImages = students.map(s => `images/students/${s.image}`);
}

function switchClass(className) {
    currentClass = className;
    document.querySelectorAll('.class-tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    displayStudents(className);
}

loadStudentsData();
