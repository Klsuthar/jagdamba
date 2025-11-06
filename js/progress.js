// Class-wise student data - will be loaded from JSON
let classData = {
    class_2: { title: 'कक्षा 2 के छात्र', students: [] },
    class_3: { title: 'कक्षा 3 के छात्र', students: [] }
};

// Student results data
let studentsData = {};

// Load student data and results from JSON files
async function loadStudentData() {
    try {
        const [class2Response, class3Response, class2ResultsResponse, class3ResultsResponse] = await Promise.all([
            fetch('../json/class2_students.json'),
            fetch('../json/class3_students.json'),
            fetch('../json/class2_results.json'),
            fetch('../json/class3_results.json')
        ]);
        
        const class2Students = await class2Response.json();
        const class3Students = await class3Response.json();
        const class2Results = await class2ResultsResponse.json();
        const class3Results = await class3ResultsResponse.json();
        
        console.log('Class 2 Students:', class2Students.length);
        console.log('Class 3 Students:', class3Students.length);
        
        // Map student list data
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
        
        // Map results data
        class2Results.forEach(result => {
            studentsData[result.student_id] = {
                name: result.student_name,
                class: 'कक्षा 2',
                rollNo: result.roll_no.toString().padStart(2, '0'),
                session: result.session,
                examType: result.exam_type,
                photo: `../images/students/class_2/${result.roll_no.toString().padStart(2, '0')}_class2.jpg`,
                subjects: result.subjects,
                attendance: result.attendance
            };
        });
        
        class3Results.forEach(result => {
            studentsData[result.student_id] = {
                name: result.student_name,
                class: 'कक्षा 3',
                rollNo: result.roll_no.toString().padStart(2, '0'),
                session: result.session,
                examType: result.exam_type,
                photo: `../images/students/class_3/${result.roll_no.toString().padStart(2, '0')}_class3.jpg`,
                subjects: result.subjects,
                attendance: result.attendance
            };
        });
        
        console.log('Data loaded successfully');
        console.log('Class 2 students count:', classData.class_2.students.length);
        console.log('Class 3 students count:', classData.class_3.students.length);
    } catch (error) {
        console.error('Error loading student data:', error);
    }
}

// Initialize data on page load
document.addEventListener('DOMContentLoaded', loadStudentData);

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
                <div class="student-avatar">
                    <img src="${student.photo}" alt="${student.name}" onerror="this.onerror=null; this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=2563eb&color=fff&size=150'">
                </div>
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
    const photoElement = document.getElementById('studentPhoto');
    photoElement.src = student.photo;
    photoElement.onerror = function() {
        this.onerror = null;
        this.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=2563eb&color=fff&size=200`;
    };
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


