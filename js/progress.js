const CLASS_CONFIGS = [
    { number: 1, classKey: 'class_1', configKey: 'class1', className: 'Class 1', idPrefix: 'STU1_' },
    { number: 2, classKey: 'class_2', configKey: 'class2', className: 'Class 2', idPrefix: 'STU2_' },
    { number: 3, classKey: 'class_3', configKey: 'class3', className: 'Class 3', idPrefix: 'STU3_' },
    { number: 4, classKey: 'class_4', configKey: 'class4', className: 'Class 4', idPrefix: 'STU4_' }
];

const ADDITIONAL_ACTIVITY_HEADERS = [
    'Subject',
    'First Evalution',
    'Second Evalution',
    'Third Evalution',
    'Fourth Evalution',
    'Fifth Evalution',
    'Overall'
];

const ADDITIONAL_ACTIVITY_ROWS = [
    ['Work Experience', 'A+', 'A+', 'A+', 'A+', 'A+', 'A+'],
    ['Arts Education', 'A+', 'A+', 'A+', 'A+', 'A+', 'A+'],
    ['Heath & Physical Education', 'A+', 'A+', 'A+', 'A+', 'A+', 'A+']
];

let classData = CLASS_CONFIGS.reduce((acc, cfg) => {
    acc[cfg.classKey] = { title: `${cfg.className} Students`, students: [] };
    return acc;
}, {});

let studentsData = {};
let studentExams = {};
let classResults = CLASS_CONFIGS.reduce((acc, cfg) => {
    acc[cfg.classKey] = [];
    return acc;
}, {});
let examConfig = null;
let attendanceData = CLASS_CONFIGS.reduce((acc, cfg) => {
    acc[cfg.classKey] = {};
    return acc;
}, {});
let studentDataLoadPromise = null;
let isStudentDataReady = false;
let studentDataLoadProgress = { completed: 0, total: 1 };

function normalizeRollNo(value) {
    const digits = String(value ?? '').replace(/\D/g, '');
    return digits ? digits.padStart(2, '0') : '';
}

function buildStudentId(classCfg, rollNo) {
    const normalizedRollNo = normalizeRollNo(rollNo);
    return normalizedRollNo ? `${classCfg.idPrefix}${normalizedRollNo}` : '';
}

function buildStudentPhotoPath(classCfg, rollNo, imagePath = '') {
    if (imagePath) {
        return `../images/students/${imagePath}`;
    }

    const normalizedRollNo = normalizeRollNo(rollNo);
    return normalizedRollNo
        ? `../images/students/class_${classCfg.number}/${normalizedRollNo}_class${classCfg.number}.webp`
        : '';
}

function syncClassStudentsWithResults(classCfg) {
    const classKey = classCfg.classKey;
    const existingStudents = classData[classKey].students || [];
    const existingIds = new Set(existingStudents.map(student => student.id));
    const derivedStudents = (classResults[classKey] || [])
        .filter(student => student.id && !existingIds.has(student.id))
        .map(student => ({
            id: student.id,
            name: student.name,
            rollNo: normalizeRollNo(student.rollNo),
            fatherName: student.fatherName || '',
            motherName: student.motherName || '',
            dob: student.dob || '',
            photo: student.photo || buildStudentPhotoPath(classCfg, student.rollNo)
        }));

    classData[classKey].students = [...existingStudents, ...derivedStudents]
        .filter(student => student.id && student.rollNo)
        .sort((a, b) => parseInt(a.rollNo, 10) - parseInt(b.rollNo, 10));
}

async function safeFetchJson(path, fallback = []) {
    try {
        const response = await fetch(`${path}?v=${Date.now()}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${path}: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.warn(`Using fallback for ${path}`, error);
        return fallback;
    }
}

function getClassConfigByStudentId(studentId) {
    return CLASS_CONFIGS.find(cfg => studentId.startsWith(cfg.idPrefix)) || null;
}

function setProgressStatus(message = '', state = 'info') {
    const statusElement = document.getElementById('progressStatus');
    const loaderElement = document.getElementById('progressLoader');
    if (!statusElement) {
        return;
    }

    statusElement.textContent = message;
    if (loaderElement) {
        loaderElement.dataset.state = state;
        loaderElement.style.display = message ? 'grid' : 'none';
    }
}

function updateLoadingProgress(detail = 'Loading records...') {
    const fillElement = document.getElementById('progressFill');
    const percentElement = document.getElementById('progressPercent');
    const substatusElement = document.getElementById('progressSubstatus');
    const stepElement = document.getElementById('progressStep');
    const total = Math.max(studentDataLoadProgress.total, 1);
    const completed = Math.min(studentDataLoadProgress.completed, total);
    const percent = Math.round((completed / total) * 100);

    if (fillElement) {
        fillElement.style.width = `${percent}%`;
    }

    if (percentElement) {
        percentElement.textContent = `${percent}%`;
    }

    if (substatusElement) {
        substatusElement.textContent = detail;
    }

    if (stepElement) {
        stepElement.textContent = `${completed}/${total} completed`;
    }
}

function resetLoadingProgress(total, detail) {
    studentDataLoadProgress = { completed: 0, total: Math.max(total, 1) };
    updateLoadingProgress(detail);
}

function setLoadingTotal(total, detail) {
    studentDataLoadProgress.total = Math.max(total, 1);
    updateLoadingProgress(detail);
}

function markLoadingStep(detail) {
    studentDataLoadProgress.completed += 1;
    updateLoadingProgress(detail);
}

function setClassButtonsDisabled(disabled) {
    const classSelection = document.querySelector('.class-selection');
    document.querySelectorAll('.class-btn').forEach(button => {
        button.disabled = disabled;
    });

    if (classSelection) {
        classSelection.setAttribute('aria-busy', disabled ? 'true' : 'false');
    }
}

async function ensureStudentDataLoaded() {
    if (isStudentDataReady) {
        return true;
    }

    if (!studentDataLoadPromise) {
        setClassButtonsDisabled(true);
        setProgressStatus('Loading student progress data, please wait...', 'loading');

        studentDataLoadPromise = loadStudentData()
            .then(() => {
                isStudentDataReady = true;
                setProgressStatus('');
                return true;
            })
            .catch(error => {
                setProgressStatus('Could not load student progress data. Please refresh and try again.', 'error');
                throw error;
            })
            .finally(() => {
                setClassButtonsDisabled(!isStudentDataReady);
            });
    }

    return studentDataLoadPromise;
}

async function loadStudentData() {
    try {
        resetLoadingProgress(1, 'Loading exam setup');
        examConfig = await safeFetchJson('../json/exam_config.json', { session: '', classes: {} });

        const examFileCount = CLASS_CONFIGS.reduce((count, cfg) => {
            const classConfig = examConfig.classes?.[cfg.configKey];
            if (!classConfig) {
                return count;
            }

            return count + (classConfig.tests?.length || 0) + (classConfig.exams?.length || 0);
        }, 0);

        const studentRequests = CLASS_CONFIGS.map(cfg =>
            safeFetchJson(`../json/class${cfg.number}/class${cfg.number}_students.json`, [])
                .then(data => {
                    markLoadingStep(`${cfg.className} student list ready`);
                    return data;
                })
        );
        const attendanceRequests = CLASS_CONFIGS.map(cfg =>
            safeFetchJson(`../json/class${cfg.number}/attendance.json`, [])
                .then(data => {
                    markLoadingStep(`${cfg.className} attendance ready`);
                    return data;
                })
        );

        setLoadingTotal(1 + studentRequests.length + attendanceRequests.length + examFileCount, 'Loading class records');
        markLoadingStep('Exam setup loaded');

        const studentsByClass = await Promise.all(studentRequests);
        const attendanceByClass = await Promise.all(attendanceRequests);

        CLASS_CONFIGS.forEach((cfg, index) => {
            const classStudents = studentsByClass[index] || [];
            const classAttendance = attendanceByClass[index] || [];

            classAttendance.forEach(a => {
                if (a && a.student_id) {
                    attendanceData[cfg.classKey][a.student_id] = a.attendance;
                }
            });

            classData[cfg.classKey].students = classStudents
                .map(s => {
                    const rollNo = normalizeRollNo(s.roll_no);
                    if (!rollNo) {
                        return null;
                    }

                    return {
                        id: buildStudentId(cfg, rollNo),
                        name: s.student_name || 'Student',
                        rollNo,
                        fatherName: s.father_name || '',
                        motherName: s.mother_name || '',
                        dob: s.dob || '',
                        photo: buildStudentPhotoPath(cfg, rollNo, s.image)
                    };
                })
                .filter(Boolean)
                .sort((a, b) => parseInt(a.rollNo, 10) - parseInt(b.rollNo, 10));
        });

        for (const cfg of CLASS_CONFIGS) {
            if (examConfig.classes && examConfig.classes[cfg.configKey]) {
                await loadExamResults(cfg);
            }

            syncClassStudentsWithResults(cfg);
        }

        console.log('Data loaded successfully');
        return true;
    } catch (error) {
        console.error('Error loading student data:', error);
        throw error;
    }
}

async function loadExamResults(classCfg) {
    const { configKey, classKey, className, idPrefix } = classCfg;
    const classConfig = examConfig.classes[configKey];
    if (!classConfig) {
        return;
    }
    const exams = classConfig.exams || [];
    const tests = classConfig.tests || [];
    
    for (const exam of [...tests, ...exams]) {
        if (exam.file) {
            try {
                const results = await safeFetchJson(`../${exam.file}`, []);
                markLoadingStep(`${className} ${exam.name} ready`);
                
                results.forEach(result => {
                    const rollNo = normalizeRollNo(result.roll_no);
                    const studentId = result.student_id || buildStudentId(classCfg, rollNo);
                    if (!studentId) {
                        return;
                    }
                    
                    let subjects = [];
                    if (result.subjects && Array.isArray(result.subjects) && result.subjects.length > 0) {
                        subjects = result.subjects;
                    } else if ('hindi' in result || 'english' in result) {
                        const maxMarks = exam.max_marks || {};
                        subjects = [
                            { name: 'Hindi', obtained: result.hindi, total: maxMarks.hindi || 10, grade: 'A' },
                            { name: 'English', obtained: result.english, total: maxMarks.english || 5, grade: 'A' },
                            { name: 'Mathematics', obtained: result.mathematics, total: maxMarks.mathematics || 10, grade: 'A' },
                            { name: 'EVS', obtained: result.evs, total: maxMarks.evs || 10, grade: 'A' }
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
                        
                        const subjectConfig = exam.subjects || {};
                        const hindiTotal = (subjectConfig.hindi?.written || 0) + (subjectConfig.hindi?.oral || 0);
                        const englishTotal = (subjectConfig.english?.written || 0) + (subjectConfig.english?.oral || 0);
                        const mathTotal = (subjectConfig.mathematics?.written || 0) + (subjectConfig.mathematics?.oral || 0);
                        const evsTotal = (subjectConfig.evs?.written || 0) + (subjectConfig.evs?.oral || 0);
                        
                        subjects = [
                            { name: 'Hindi', written: hw, oral: ho, obtained: ((hw||0) + (ho||0)) || null, total: hindiTotal, grade: 'A' },
                            { name: 'English', written: ew, oral: eo, obtained: ((ew||0) + (eo||0)) || null, total: englishTotal, grade: 'A' },
                            { name: 'Mathematics', written: mw, oral: mo, obtained: ((mw||0) + (mo||0)) || null, total: mathTotal, grade: 'A' },
                            { name: 'EVS', written: evw, oral: evo, obtained: ((evw||0) + (evo||0)) || null, total: evsTotal, grade: 'A' }
                        ];
                    }
                    
                    const attendance = attendanceData[classKey][studentId] || result.attendance || 0;

                    const studentMeta = classData[classKey].students.find(s => s.id === studentId);
                    
                    const data = {
                        name: result.student_name || studentMeta?.name || 'Student',
                        class: className,
                        rollNo: studentMeta?.rollNo || rollNo,
                        session: examConfig.session,
                        examType: exam.name,
                        fatherName: result.father_name || studentMeta?.fatherName || '',
                        motherName: result.mother_name || studentMeta?.motherName || '',
                        photo: studentMeta?.photo || buildStudentPhotoPath(classCfg, rollNo, result.image),
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
    ensureStudentDataLoaded();
    
    // Handle browser back button
    window.addEventListener('popstate', (e) => {
        e.preventDefault();
        goBack();
    });
    
    // Push initial state
    history.pushState({ page: 'class-selection' }, '', '');
});

async function selectClass(className) {
    try {
        await ensureStudentDataLoaded();
    } catch (error) {
        return;
    }

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

async function showStudentReport(studentId) {
    try {
        await ensureStudentDataLoaded();
    } catch (error) {
        return;
    }

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

let currentExamConfigs = [];

function renderAdditionalActivityTable() {
    const headerCells = ADDITIONAL_ACTIVITY_HEADERS.map((header, index) => {
        const cellClass = index === 0 ? 'subject-col' : 'exam-header';
        return `<th class="${cellClass}">${header}</th>`;
    }).join('');

    const rows = ADDITIONAL_ACTIVITY_ROWS.map(row => `
        <tr>
            <td class="subject-name">${row[0]}</td>
            ${row.slice(1).map(value => `<td class="mark-cell total-cell activity-grade-cell">${value}</td>`).join('')}
        </tr>
    `).join('');

    return `
        <div class="exams-container supplementary-table-section">
            <div class="table-wrapper">
                <table class="marks-table activity-table">
                    <thead>
                        <tr>${headerCells}</tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        </div>
    `;
}

function displayAllExams(student, studentId, allExams) {
    const classCfg = getClassConfigByStudentId(studentId);
    if (!classCfg) {
        return;
    }

    currentExamConfigs = allExams.map(exam => {
        const configExams = examConfig.classes[classCfg.configKey].exams || [];
        const configTests = examConfig.classes[classCfg.configKey].tests || [];
        return [...configTests, ...configExams].find(e => e.name === exam.examType) || {};
    });
    const photoElement = document.getElementById('studentPhoto');
    const printPhotoElement = document.getElementById('printPhoto');
    const studentData = Object.values(classData).flatMap(c => c.students).find(s => s.id === studentId);
    
    photoElement.src = studentData ? studentData.photo : student.photo;
    printPhotoElement.src = studentData ? studentData.photo : student.photo;
    
    photoElement.onerror = printPhotoElement.onerror = function() {
        this.onerror = null;
        this.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=2563eb&color=fff&size=200`;
    };
    
    document.getElementById('studentName').textContent = student.name;
    document.getElementById('printStudentName').textContent = student.name;
    document.getElementById('studentClass').textContent = student.class;
    document.getElementById('printStudentClass').textContent = student.class;
    document.getElementById('rollNo').textContent = student.rollNo;
    document.getElementById('fatherName').textContent = studentData?.fatherName || student.fatherName || '';
    document.getElementById('motherName').textContent = studentData?.motherName || student.motherName || '';
    document.getElementById('session').textContent = student.session;
    document.getElementById('attendance').textContent = `${student.attendance}%`;

    let totalObtained = 0;
    let totalMax = 0;
    allExams.forEach(exam => {
        exam.subjects.forEach(sub => {
            totalObtained += sub.obtained !== null ? sub.obtained : 0;
            totalMax += sub.total || 0;
        });
    });
    
    let percentage = 0;
    if (totalMax > 0) {
        percentage = (totalObtained / totalMax) * 100;
    }
    document.getElementById('percentage').textContent = `${percentage.toFixed(2)}%`;
    document.getElementById('totalMarks').textContent = `${totalObtained}/${totalMax}`;
    document.getElementById('rank').textContent = calculateRank(studentId, percentage);

    const container = document.getElementById('allExamsContainer');
    
    const additionalActivityTableHTML = renderAdditionalActivityTable();

    if (!allExams.length || !allExams[0].subjects || allExams[0].subjects.length === 0) {
        container.innerHTML = `
            <p style="text-align: center; color: #999; margin-top: 2rem;">No exam data available</p>
            ${additionalActivityTableHTML}
        `;
        return;
    }
    
    const subjects = allExams[0].subjects.map(s => s.name);
    let headerCols = '<th class="subject-col">Subject</th>';
    let colspanCount = [];
    allExams.forEach(exam => {
        const hasWrittenOral = exam.examType.includes('Yearly') || exam.examType.includes('Half Yearly');
        const colspan = hasWrittenOral ? 3 : 1;
        colspanCount.push(hasWrittenOral);
        headerCols += `<th colspan="${colspan}" class="exam-header">${exam.examType}</th>`;
    });
    
    let subHeaderCols = '<th class="subject-col"></th>';
    colspanCount.forEach(hasWrittenOral => {
        if (hasWrittenOral) {
            subHeaderCols += '<th class="sub-header">Written</th><th class="sub-header">Oral</th><th class="sub-header">Total</th>';
        } else {
            subHeaderCols += '<th class="sub-header">Marks</th>';
        }
    });
    
    let rows = '';
    subjects.forEach((subject, idx) => {
        let row = `<tr><td class="subject-name">${subject}</td>`;
        
        allExams.forEach((exam, examIdx) => {
            const sub = exam.subjects.find(s => s.name === subject) || {};
            if (colspanCount[examIdx]) {
                const w = sub.written !== undefined ? sub.written : null;
                const o = sub.oral !== undefined ? sub.oral : null;
                const t = sub.obtained !== null ? sub.obtained : null;
                const max = sub.total || 100;
                
                const examCfg = currentExamConfigs[examIdx];
                const subKey = subject.toLowerCase();
                const subCfg = examCfg.subjects?.[subKey] || {};
                const wMax = subCfg.written || '';
                const oMax = subCfg.oral || '';
                row += `<td class="mark-cell"><div class="mark-fraction"><span class="mark-obtained">${w !== null ? w : ''}</span><div class="mark-divider"></div><span class="mark-max">${wMax}</span></div></td>`;
                row += `<td class="mark-cell"><div class="mark-fraction"><span class="mark-obtained">${o !== null ? o : ''}</span><div class="mark-divider"></div><span class="mark-max">${oMax}</span></div></td>`;
                row += `<td class="mark-cell total-cell"><div class="mark-fraction"><span class="mark-obtained">${t !== null ? t : ''}</span><div class="mark-divider"></div><span class="mark-max">${max}</span></div></td>`;
            } else {
                const obt = sub.obtained !== null ? sub.obtained : null;
                const max = sub.total || 10;
                row += `<td class="mark-cell total-cell"><div class="mark-fraction"><span class="mark-obtained">${obt !== null ? obt : ''}</span><div class="mark-divider"></div><span class="mark-max">${max}</span></div></td>`;
            }
        });
        
        row += '</tr>';
        rows += row;
    });
    
    const tableHTML = `
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
    
    container.innerHTML = tableHTML + additionalActivityTableHTML;
}

function getGrade(percentage) {
    if (percentage >= 90) return 'A+';
    if (percentage >= 75) return 'A';
    if (percentage >= 60) return 'B';
    if (percentage >= 45) return 'C';
    if (percentage >= 33) return 'D';
    return 'F';
}

function calculateRank(studentId, percentage) {
    const classCfg = getClassConfigByStudentId(studentId);
    if (!classCfg) {
        return '-';
    }
    const classKey = classCfg.classKey;
    
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

function printMarksheet() {
    // Scroll to top so print captures from the beginning
    window.scrollTo(0, 0);
    
    // Set document title to StudentName_Class for PDF filename
    const originalTitle = document.title;
    const studentName = document.getElementById('studentName').textContent.trim();
    const studentClass = document.getElementById('studentClass').textContent.trim();
    document.title = studentName + '_' + studentClass;
    
    // Small delay to let the layout settle
    setTimeout(function() {
        window.print();
        // Restore original title after print dialog closes
        setTimeout(function() {
            document.title = originalTitle;
        }, 1000);
    }, 300);
}
