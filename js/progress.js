let classData = {
    class_1: { title: 'Class 1 Students', students: [] },
    class_2: { title: 'Class 2 Students', students: [] },
    class_3: { title: 'Class 3 Students', students: [] }
};

let studentsData = {};
let studentExams = {};
let classResults = { class_1: [], class_2: [], class_3: [] };
let examConfig = null;

async function loadStudentData() {
    try {
        const configResponse = await fetch('../json/exam_config.json');
        examConfig = await configResponse.json();
        
        const [class1Students, class2Students, class3Students] = await Promise.all([
            fetch('../json/class1/class1_students.json').then(r => r.json()),
            fetch('../json/class2/class2_students.json').then(r => r.json()),
            fetch('../json/class3/class3_students.json').then(r => r.json())
        ]);
        
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
                    
                    const data = {
                        name: result.student_name,
                        class: className,
                        rollNo: result.roll_no.toString().padStart(2, '0'),
                        session: examConfig.session,
                        examType: exam.name,
                        photo: `../images/students/${classKey}/${result.roll_no.toString().padStart(2, '0')}_${classKey}.webp`,
                        subjects: subjects,
                        attendance: result.attendance || 0
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
                <p>Roll No: ${student.rollNo}</p>
            </div>
        `;
        studentsGrid.innerHTML += studentCard;
    });

    classSelection.style.display = 'none';
    studentsList.style.display = 'block';
    backButton.style.display = 'block';
}

function showStudentReport(studentId) {
    const exams = studentExams[studentId];
    const studentsList = document.getElementById('studentsList');
    const reportCard = document.getElementById('reportCard');

    if (!exams || exams.length === 0) {
        alert('Progress report for this student is not available yet');
        return;
    }

    displayAllExams(exams[0], studentId, exams);
    studentsList.style.display = 'none';
    reportCard.classList.add('show');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goBack() {
    const classSelection = document.querySelector('.class-selection');
    const studentsList = document.getElementById('studentsList');
    const reportCard = document.getElementById('reportCard');
    const backButton = document.getElementById('backButton');

    if (reportCard.classList.contains('show')) {
        reportCard.classList.remove('show');
        studentsList.style.display = 'block';
    } else if (studentsList.style.display === 'block') {
        studentsList.style.display = 'none';
        classSelection.style.display = 'block';
        backButton.style.display = 'none';
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
    let headerCols = '<th style="padding: 8px; border: 1px solid #ddd; background: #f8f9fa; font-weight: 600;">Subject</th>';
    let colspanCount = [];
    allExams.forEach(exam => {
        const hasWrittenOral = exam.examType.includes('Yearly') || exam.examType.includes('Half Yearly');
        const colspan = hasWrittenOral ? 4 : 2;
        colspanCount.push(hasWrittenOral);
        headerCols += `<th colspan="${colspan}" style="padding: 8px; border: 1px solid #ddd; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 0.9rem;">${exam.examType}</th>`;
    });
    
    let subHeaderCols = '<th style="padding: 6px; border: 1px solid #ddd; background: #f8f9fa;"></th>';
    colspanCount.forEach(hasWrittenOral => {
        if (hasWrittenOral) {
            subHeaderCols += '<th style="padding: 6px; border: 1px solid #ddd; background: #f0f0f0; font-size: 0.85rem;">W</th><th style="padding: 6px; border: 1px solid #ddd; background: #f0f0f0; font-size: 0.85rem;">O</th><th style="padding: 6px; border: 1px solid #ddd; background: #f0f0f0; font-size: 0.85rem;">T</th><th style="padding: 6px; border: 1px solid #ddd; background: #f0f0f0; font-size: 0.85rem;">Max</th>';
        } else {
            subHeaderCols += '<th style="padding: 6px; border: 1px solid #ddd; background: #f0f0f0; font-size: 0.85rem;">Obt</th><th style="padding: 6px; border: 1px solid #ddd; background: #f0f0f0; font-size: 0.85rem;">Max</th>';
        }
    });
    
    let rows = '';
    subjects.forEach((subject, idx) => {
        let row = `<tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: 500;">${subject}</td>`;
        allExams.forEach((exam, examIdx) => {
            const sub = exam.subjects[idx];
            if (colspanCount[examIdx]) {
                const w = sub.written !== undefined ? (sub.written || '') : '';
                const o = sub.oral !== undefined ? (sub.oral || '') : '';
                const t = sub.obtained !== null && sub.obtained !== 0 ? sub.obtained : '';
                row += `<td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${w}</td>`;
                row += `<td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${o}</td>`;
                row += `<td style="padding: 8px; border: 1px solid #ddd; text-align: center; font-weight: 600;">${t}</td>`;
                row += `<td style="padding: 8px; border: 1px solid #ddd; text-align: center; color: #666;">${sub.total}</td>`;
            } else {
                const obt = sub.obtained !== null && sub.obtained !== 0 ? sub.obtained : '';
                row += `<td style="padding: 8px; border: 1px solid #ddd; text-align: center; font-weight: 600;">${obt}</td>`;
                row += `<td style="padding: 8px; border: 1px solid #ddd; text-align: center; color: #666;">${sub.total}</td>`;
            }
        });
        row += '</tr>';
        rows += row;
    });
    
    container.innerHTML = `
        <div style="margin-top: 1.5rem; overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem; background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <thead>
                    <tr>${headerCols}</tr>
                    <tr>${subHeaderCols}</tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
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


