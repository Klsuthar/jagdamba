// Class-wise student data - will be loaded from JSON
let classData = {
    class_2: { title: 'कक्षा 2 के छात्र', students: [] },
    class_3: { title: 'कक्षा 3 के छात्र', students: [] }
};

// Load student data from JSON files
async function loadStudentData() {
    try {
        const [class2Response, class3Response] = await Promise.all([
            fetch('../json/class2_students.json'),
            fetch('../json/class3_students.json')
        ]);
        
        const class2Students = await class2Response.json();
        const class3Students = await class3Response.json();
        
        classData.class_2.students = class2Students.map(student => ({
            id: `STU2_${student.roll_no.toString().padStart(2, '0')}`,
            name: student.student_name,
            rollNo: student.roll_no.toString().padStart(2, '0'),
            photo: `../images/students/${student.image}`
        }));
        
        classData.class_3.students = class3Students.map(student => ({
            id: `STU3_${student.roll_no.toString().padStart(2, '0')}`,
            name: student.student_name,
            rollNo: student.roll_no.toString().padStart(2, '0'),
            photo: `../images/students/${student.image}`
        }));
    } catch (error) {
        console.error('Error loading student data:', error);
    }
}

// Initialize data on page load
document.addEventListener('DOMContentLoaded', loadStudentData);

// Sample progress data for students (can be expanded)
const studentsData = {
    'STU2_01': {
        name: 'AAKANSHA',
        class: 'कक्षा 2',
        rollNo: '01',
        session: '2023-24',
        examType: 'वार्षिक परीक्षा',
        photo: '../images/students/class_2/01_class2.jpg',
        subjects: [
            { name: 'हिंदी', obtained: 85, total: 100, grade: 'A' },
            { name: 'अंग्रेजी', obtained: 78, total: 100, grade: 'B' },
            { name: 'गणित', obtained: 92, total: 100, grade: 'A' },
            { name: 'विज्ञान', obtained: 88, total: 100, grade: 'A' }
        ],
        attendance: 95
    }
};

function selectClass(className) {
    const classInfo = classData[className];
    const studentsList = document.getElementById('studentsList');
    const classTitle = document.getElementById('classTitle');
    const studentsGrid = document.getElementById('studentsGrid');
    const backButton = document.getElementById('backButton');
    const classSelection = document.querySelector('.class-selection');

    classTitle.textContent = classInfo.title;
    studentsGrid.innerHTML = '';

    classInfo.students.forEach(student => {
        const studentCard = `
            <div class="student-card" onclick="showStudentReport('${student.id}')">
                <img src="${student.photo}" alt="${student.name}" onerror="this.src='../images/logo.png'">
                <h4>${student.name}</h4>
                <p>रोल नं: ${student.rollNo}</p>
            </div>
        `;
        studentsGrid.innerHTML += studentCard;
    });

    classSelection.style.display = 'none';
    studentsList.style.display = 'block';
    backButton.style.display = 'block';
}

function showStudentReport(studentId) {
    const student = studentsData[studentId];
    const reportCard = document.getElementById('reportCard');
    const studentsList = document.getElementById('studentsList');
    const backButton = document.getElementById('backButton');

    if (student) {
        displayReport(student, studentId);
        studentsList.style.display = 'none';
        reportCard.classList.add('show');
    } else {
        alert('इस छात्र की प्रगति रिपोर्ट अभी उपलब्ध नहीं है');
    }
}

function goBack() {
    const classSelection = document.querySelector('.class-selection');
    const studentsList = document.getElementById('studentsList');
    const reportCard = document.getElementById('reportCard');
    const backButton = document.getElementById('backButton');

    reportCard.classList.remove('show');
    studentsList.style.display = 'none';
    backButton.style.display = 'none';
    classSelection.style.display = 'block';
}

function displayReport(student, studentId) {
    // Basic info
    document.getElementById('studentPhoto').src = student.photo;
    document.getElementById('studentName').textContent = student.name;
    document.getElementById('studentClass').textContent = student.class;
    document.getElementById('displayId').textContent = studentId;
    document.getElementById('rollNo').textContent = student.rollNo;
    document.getElementById('session').textContent = student.session;
    document.getElementById('examType').textContent = student.examType;

    // Subjects table
    const subjectsBody = document.getElementById('subjectsBody');
    subjectsBody.innerHTML = '';
    
    let totalObtained = 0;
    let totalMax = 0;

    student.subjects.forEach(subject => {
        totalObtained += subject.obtained;
        totalMax += subject.total;

        const row = `
            <tr>
                <td>${subject.name}</td>
                <td>${subject.obtained}</td>
                <td>${subject.total}</td>
                <td><span class="grade ${subject.grade}">${subject.grade}</span></td>
            </tr>
        `;
        subjectsBody.innerHTML += row;
    });

    // Performance summary
    const percentage = ((totalObtained / totalMax) * 100).toFixed(2);
    document.getElementById('totalMarks').textContent = `${totalObtained}/${totalMax}`;
    document.getElementById('percentage').textContent = `${percentage}%`;
    document.getElementById('rank').textContent = calculateRank(percentage);

    // Attendance
    const attendanceFill = document.getElementById('attendanceFill');
    setTimeout(() => {
        attendanceFill.style.width = `${student.attendance}%`;
        attendanceFill.textContent = `${student.attendance}%`;
    }, 300);
}

function calculateRank(percentage) {
    if (percentage >= 90) return '1st';
    if (percentage >= 80) return '2nd';
    if (percentage >= 70) return '3rd';
    return '4th';
}


