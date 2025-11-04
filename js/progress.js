// Sample student data
const studentsData = {
    'STU001': {
        name: 'राज कुमार',
        class: 'कक्षा 10-A',
        rollNo: '01',
        session: '2023-24',
        examType: 'वार्षिक परीक्षा',
        photo: '../images/students/class2/1_class2.jpg',
        subjects: [
            { name: 'हिंदी', obtained: 85, total: 100, grade: 'A' },
            { name: 'अंग्रेजी', obtained: 78, total: 100, grade: 'B' },
            { name: 'गणित', obtained: 92, total: 100, grade: 'A' },
            { name: 'विज्ञान', obtained: 88, total: 100, grade: 'A' },
            { name: 'सामाजिक विज्ञान', obtained: 82, total: 100, grade: 'A' }
        ],
        attendance: 95
    },
    'STU002': {
        name: 'प्रिया शर्मा',
        class: 'कक्षा 10-B',
        rollNo: '05',
        session: '2023-24',
        examType: 'वार्षिक परीक्षा',
        photo: '../images/students/class2/2_class2.jpg',
        subjects: [
            { name: 'हिंदी', obtained: 90, total: 100, grade: 'A' },
            { name: 'अंग्रेजी', obtained: 88, total: 100, grade: 'A' },
            { name: 'गणित', obtained: 95, total: 100, grade: 'A' },
            { name: 'विज्ञान', obtained: 92, total: 100, grade: 'A' },
            { name: 'सामाजिक विज्ञान', obtained: 87, total: 100, grade: 'A' }
        ],
        attendance: 98
    },
    'STU003': {
        name: 'अमित वर्मा',
        class: 'कक्षा 9-A',
        rollNo: '12',
        session: '2023-24',
        examType: 'वार्षिक परीक्षा',
        photo: '../images/students/class2/3_class2.jpg',
        subjects: [
            { name: 'हिंदी', obtained: 75, total: 100, grade: 'B' },
            { name: 'अंग्रेजी', obtained: 70, total: 100, grade: 'B' },
            { name: 'गणित', obtained: 80, total: 100, grade: 'A' },
            { name: 'विज्ञान', obtained: 78, total: 100, grade: 'B' },
            { name: 'सामाजिक विज्ञान', obtained: 72, total: 100, grade: 'B' }
        ],
        attendance: 92
    }
};

function searchStudent() {
    const studentId = document.getElementById('studentId').value.trim().toUpperCase();
    const reportCard = document.getElementById('reportCard');
    const noResult = document.getElementById('noResult');

    if (!studentId) {
        alert('कृपया छात्र आईडी दर्ज करें');
        return;
    }

    const student = studentsData[studentId];

    if (student) {
        displayReport(student, studentId);
        reportCard.classList.add('show');
        noResult.classList.remove('show');
    } else {
        reportCard.classList.remove('show');
        noResult.classList.add('show');
    }
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

// Enter key support
document.getElementById('studentId').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchStudent();
    }
});
