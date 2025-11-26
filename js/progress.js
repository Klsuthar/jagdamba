let classData = {
    class_1: { title: 'Class 1 Students', students: [] },
    class_2: { title: 'Class 2 Students', students: [] },
    class_3: { title: 'Class 3 Students', students: [] }
};

let studentsData = {};
let studentExams = {};
let classResults = { class_1: [], class_2: [], class_3: [] };
let examConfig = null;
let attendanceData = { class_1: {}, class_2: {}, class_3: {} };

async function loadStudentData() {
    try {
        const configResponse = await fetch('../json/exam_config.json');
        examConfig = await configResponse.json();
        
        const [class1Students, class2Students, class3Students, class1Attendance, class2Attendance, class3Attendance] = await Promise.all([
            fetch('../json/class1/class1_students.json').then(r => r.json()),
            fetch('../json/class2/class2_students.json').then(r => r.json()),
            fetch('../json/class3/class3_students.json').then(r => r.json()),
            fetch('../json/class1/attendance.json').then(r => r.json()),
            fetch('../json/class2/attendance.json').then(r => r.json()),
            fetch('../json/class3/attendance.json').then(r => r.json())
        ]);
        
        class1Attendance.forEach(a => attendanceData.class_1[a.student_id] = a.attendance);
        class2Attendance.forEach(a => attendanceData.class_2[a.student_id] = a.attendance);
        class3Attendance.forEach(a => attendanceData.class_3[a.student_id] = a.attendance);
        
        classData.class_1.students = class1Students.map(s => ({
            id: `STU1_${s.roll_no.toString().padStart(2, '0')}`,
            name: s.student_name,
            rollNo: s.roll_no.toString().padStart(2, '0'),
            photo: `../images/students/${s.image}`
        }));
        
        classData.class_2.students = class2Students.map(s => ({
            id: `STU2_${s.roll_no.toString().padStart(2, '0')}`,
            name: s.student_name,
            rollNo: s.roll_no.toString().padStart(2, '0'),
            photo: `../images/students/${s.image}`
        }));
        
        classData.class_3.students = class3Students.map(s => ({
            id: `STU3_${s.roll_no.toString().padStart(2, '0')}`,
            name: s.student_name,
            rollNo: s.roll_no.toString().padStart(2, '0'),
            photo: `../images/students/${s.image}`
        }));
        
        await loadExamResults('class1', 'class_1', 'Class 1', 'STU1_');
        await loadExamResults('class2', 'class_2', 'Class 2', 'STU2_');
        await loadExamResults('class3', 'class_3', 'Class 3', 'STU3_');
        
        console.log('Data loaded successfully');
    } catch (error) {
        console.error('Error loading student data:', error);
    }
}

async function loadExamResults(configKey, classKey, className, idPrefix) {
    const classConfig = examConfig.classes[configKey];
    const exams = classConfig.exams || [];
    const tests = classConfig.tests || [];
    
    for (const exam of [...tests, ...exams]) {
        if (exam.file) {
            try {
                const results = await fetch(`../${exam.file}`).then(r => r.json());
                
                results.forEach(result => {
                    const studentId = result.student_id || `${idPrefix}${result.roll_no.toString().padStart(2, '0')}`;
                    
                    let subjects = [];
                    if (result.subjects && Array.isArray(result.subjects) && result.subjects.length > 0) {
                        subjects = result.subjects;
                    } else if ('hindi' in result || 'english' in result) {
                        subjects = [
                            { name: 'Hindi', obtained: result.hindi, total: 10, grade: 'A' },
                            { name: 'English', obtained: result.english, total: 5, grade: 'A' },
                            { name: 'Mathematics', obtained: result.mathematics, total: 10, grade: 'A' },
                            { name: 'EVS', obtained: result.evs, total: 10, grade: 'A' }
                        ];
                    } else if ('hindi_written' in result || 'hindi_oral' in result) {
                        const hw = result.hindi_written;
                        const ho = result.hindi_oral;
                        const ew = result.english_written;
                        const eo = result.english_oral;
                        const mw = result.math_written;
                        const mo = result.math_oral;
                        const evw = result.evs_written;
                        const evo = result.evs_oral;
                        
                        subjects = [
                            { name: 'Hindi', written: hw, oral: ho, obtained: ((hw||0) + (ho||0)) || null, total: 100, grade: 'A' },
                            { name: 'English', written: ew, oral: eo, obtained: ((ew||0) + (eo||0)) || null, total: 50, grade: 'A' },
                            { name: 'Mathematics', written: mw, oral: mo, obtained: ((mw||0) + (mo||0)) || null, total: 100, grade: 'A' },
                            { name: 'EVS', written: evw, oral: evo, obtained: ((evw||0) + (evo||0)) || null, total: 100, grade: 'A' }
                        ];
                    }
                    
                    const attendance = attendanceData[classKey][studentId] || result.attendance || 0;
                    
                    const data = {
                        name: result.student_name,
                        class: className,
                        rollNo: result.roll_no.toString().padStart(2, '0'),
                        session: examConfig.session,
                        examType: exam.name,
                        photo: `../images/students/${classKey}/${result.roll_no.toString().padStart(2, '0')}_${classKey}.webp`,
                        subjects: subjects,
                        attendance: attendance
                    };
                    
                    if (!studentExams[studentId]) {
                        studentExams[studentId] = [];
                    }
                    studentExams[studentId].push(data);
                    
                    studentsData[studentId] = data;
                    if (!classResults[classKey].find(s => s.id === studentId)) {
                        classResults[classKey].push({ id: studentId, ...data });
                    }
                });
            } catch (error) {
                console.error(`Error loading ${exam.file}:`, error);
            }
        }
    }
}

// Initialize data on page load
document.addEventListener('DOMContentLoaded', () => {
    loadStudentData();
    
    // Handle browser back button
    window.addEventListener('popstate', (e) => {
        e.preventDefault();
        goBack();
    });
    
    // Push initial state
    history.pushState({ page: 'class-selection' }, '', '');
});

function selectClass(className) {
    const classInfo = classData[className];
    const studentsList = document.getElementById('studentsList');
    const classTitle = document.getElementById('classTitle');
    const studentsGrid = document.getElementById('studentsGrid');
    const backButton = document.getElementById('backButton');
    const classSelection = document.querySelector('.class-selection');

    currentClassStudents = classInfo.students;
    classTitle.textContent = classInfo.title;
    studentsGrid.innerHTML = '';

    classInfo.students.forEach(student => {
        const studentCard = `
            <div class="student-card" onclick="showStudentReport('${student.id}')">
                <div class="student-avatar">
                    <img src="${student.photo}" alt="${student.name}" onerror="this.onerror=null; this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=2563eb&color=fff&size=150'">
                </div>
                <h4>${student.name}</h4>
                <p>Roll No: ${student.rollNo}</p>
            </div>
        `;
        studentsGrid.innerHTML += studentCard;
    });

    classSelection.style.display = 'none';
    studentsList.style.display = 'block';
    backButton.style.display = 'block';
    history.pushState({ page: 'student-list' }, '', '');
}

let currentStudentId = null;
let currentClassStudents = [];

function showStudentReport(studentId) {
    const exams = studentExams[studentId];
    const studentsList = document.getElementById('studentsList');
    const reportCard = document.getElementById('reportCard');

    if (!exams || exams.length === 0) {
        alert('Progress report for this student is not available yet');
        return;
    }

    currentStudentId = studentId;
    displayAllExams(exams[0], studentId, exams);
    updateNavigationButtons();
    renderHorizontalStudentList();
    studentsList.style.display = 'none';
    reportCard.classList.add('show');
    
    setTimeout(() => {
        const reportCard = document.getElementById('reportCard');
        const offset = reportCard.offsetTop - 80;
        window.scrollTo({ top: offset, behavior: 'smooth' });
    }, 100);
    
    history.pushState({ page: 'report-card' }, '', '');
}

function goBack() {
    const classSelection = document.querySelector('.class-selection');
    const studentsList = document.getElementById('studentsList');
    const reportCard = document.getElementById('reportCard');
    const backButton = document.getElementById('backButton');

    if (reportCard.classList.contains('show')) {
        reportCard.classList.remove('show');
        studentsList.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (studentsList.style.display === 'block') {
        studentsList.style.display = 'none';
        classSelection.style.display = 'block';
        backButton.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function displayAllExams(student, studentId, allExams) {
    const photoElement = document.getElementById('studentPhoto');
    const studentData = classData.class_1.students.concat(classData.class_2.students, classData.class_3.students).find(s => s.id === studentId);
    photoElement.src = studentData ? studentData.photo : student.photo;
    photoElement.onerror = function() {
        this.onerror = null;
        this.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=2563eb&color=fff&size=200`;
    };
    document.getElementById('studentName').textContent = student.name;
    document.getElementById('studentClass').textContent = student.class;
    document.getElementById('displayId').textContent = studentId;
    document.getElementById('rollNo').textContent = student.rollNo;
    document.getElementById('session').textContent = student.session;
    document.getElementById('attendance').textContent = `${student.attendance}%`;

    const container = document.getElementById('allExamsContainer');
    
    if (!allExams[0].subjects || allExams[0].subjects.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999; margin-top: 2rem;">No exam data available</p>';
        return;
    }
    
    const subjects = allExams[0].subjects.map(s => s.name);
    let headerCols = '<th class="subject-col">Subject</th>';
    let colspanCount = [];
    allExams.forEach(exam => {
        const hasWrittenOral = exam.examType.includes('Yearly') || exam.examType.includes('Half Yearly');
        const colspan = hasWrittenOral ? 4 : 2;
        colspanCount.push(hasWrittenOral);
        headerCols += `<th colspan="${colspan}" class="exam-header">${exam.examType}</th>`;
    });
    
    let subHeaderCols = '<th class="subject-col"></th>';
    colspanCount.forEach(hasWrittenOral => {
        if (hasWrittenOral) {
            subHeaderCols += '<th class="sub-header">W</th><th class="sub-header">O</th><th class="sub-header">T</th><th class="sub-header">Max</th>';
        } else {
            subHeaderCols += '<th class="sub-header">Obt</th><th class="sub-header">Max</th>';
        }
    });
    
    let rows = '';
    subjects.forEach((subject, idx) => {
        let row = `<tr><td class="subject-name">${subject}</td>`;
        allExams.forEach((exam, examIdx) => {
            const sub = exam.subjects[idx];
            if (colspanCount[examIdx]) {
                const w = sub.written !== undefined ? (sub.written || 0) : 0;
                const o = sub.oral !== undefined ? (sub.oral || 0) : 0;
                const t = sub.obtained !== null ? sub.obtained : 0;
                const wClass = w < (sub.total * 0.4 / 2) ? 'low' : w >= (sub.total * 0.75 / 2) ? 'high' : '';
                const oClass = o < (sub.total * 0.4 / 2) ? 'low' : o >= (sub.total * 0.75 / 2) ? 'high' : '';
                const tClass = t < (sub.total * 0.4) ? 'low' : t >= (sub.total * 0.75) ? 'high' : '';
                row += `<td class="mark-cell ${wClass}">${w || ''}</td>`;
                row += `<td class="mark-cell ${oClass}">${o || ''}</td>`;
                row += `<td class="mark-cell total ${tClass}">${t || ''}</td>`;
                row += `<td class="mark-cell max">${sub.total}</td>`;
            } else {
                const obt = sub.obtained !== null ? sub.obtained : 0;
                const obtClass = obt < (sub.total * 0.4) ? 'low' : obt >= (sub.total * 0.75) ? 'high' : '';
                row += `<td class="mark-cell total ${obtClass}">${obt || ''}</td>`;
                row += `<td class="mark-cell max">${sub.total}</td>`;
            }
        });
        row += '</tr>';
        rows += row;
    });
    
    container.innerHTML = `
        <div class="exams-container">
            <div class="table-wrapper">
                <table class="marks-table">
                    <thead>
                        <tr>${headerCols}</tr>
                        <tr>${subHeaderCols}</tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        </div>
    `;
}

function calculateRank(studentId, percentage) {
    const classKey = studentId.startsWith('STU1_') ? 'class_1' : 
                     studentId.startsWith('STU2_') ? 'class_2' : 'class_3';
    
    const rankings = classResults[classKey].map(student => {
        let total = 0, max = 0;
        student.subjects.forEach(sub => {
            total += sub.obtained !== null ? sub.obtained : 0;
            max += sub.total;
        });
        return { id: student.id, percentage: max > 0 ? (total / max) * 100 : 0 };
    }).sort((a, b) => b.percentage - a.percentage);
    
    const rank = rankings.findIndex(r => r.id === studentId) + 1;
    
    if (rank === 1) return '🥇 1st';
    if (rank === 2) return '🥈 2nd';
    if (rank === 3) return '🥉 3rd';
    return `${rank}th`;
}

function navigateStudent(direction) {
    const currentIndex = currentClassStudents.findIndex(s => s.id === currentStudentId);
    let newIndex;
    
    if (direction === 'prev') {
        newIndex = currentIndex > 0 ? currentIndex - 1 : currentClassStudents.length - 1;
    } else {
        newIndex = currentIndex < currentClassStudents.length - 1 ? currentIndex + 1 : 0;
    }
    
    showStudentReport(currentClassStudents[newIndex].id);
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevStudentBtn');
    const nextBtn = document.getElementById('nextStudentBtn');
    
    if (currentClassStudents.length <= 1) {
        prevBtn.disabled = true;
        nextBtn.disabled = true;
    } else {
        prevBtn.disabled = false;
        nextBtn.disabled = false;
    }
}

function renderHorizontalStudentList() {
    const container = document.getElementById('horizontalStudentList');
    container.innerHTML = '';
    
    currentClassStudents.forEach(student => {
        const card = document.createElement('div');
        card.className = `horizontal-student-card ${student.id === currentStudentId ? 'active' : ''}`;
        card.onclick = () => showStudentReport(student.id);
        
        card.innerHTML = `
            <img src="${student.photo}" alt="${student.name}" 
                 onerror="this.onerror=null; this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=667eea&color=fff&size=80'">
            <p>${student.name}</p>
        `;
        
        container.appendChild(card);
    });
    
    // Scroll active card into view
    setTimeout(() => {
        const activeCard = container.querySelector('.active');
        if (activeCard) {
            activeCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }, 100);
}


