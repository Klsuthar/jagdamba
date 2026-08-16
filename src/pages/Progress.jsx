import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import '../css/main.css';
import '../css/progress.css';

// Class Configurations & Metadata
const CLASSES_DATA = [
  {
    key: 'class1',
    number: 1,
    name: 'Class 1',
    grade: '1st Grade',
    icon: 'fa-book-reader',
    totalStudents: 25,
    incharge: 'Mrs. Renu',
    description: 'Foundational literacy, mathematics, creative activities, and environmental awareness.'
  },
  {
    key: 'class2',
    number: 2,
    name: 'Class 2',
    grade: '2nd Grade',
    icon: 'fa-pencil-alt',
    totalStudents: 16,
    incharge: 'Mr. Kanhaiya Lal',
    description: 'Primary language comprehension, numeracy skills, general science, and arts.'
  },
  {
    key: 'class3',
    number: 3,
    name: 'Class 3',
    grade: '3rd Grade',
    icon: 'fa-award',
    totalStudents: 23,
    incharge: 'Mr. Kanhaiya Lal',
    description: 'Intermediate primary curriculum, structured science & social studies, mathematics.'
  },
  {
    key: 'class4',
    number: 4,
    name: 'Class 4',
    grade: '4th Grade',
    icon: 'fa-graduation-cap',
    totalStudents: 18,
    incharge: 'Mr. Chandan Singh',
    description: 'Advanced primary learning, problem solving, English grammar, and environmental science.'
  },
  {
    key: 'class5',
    number: 5,
    name: 'Class 5',
    grade: '5th Grade',
    icon: 'fa-user-graduate',
    totalStudents: 8,
    incharge: 'Mr. Chandan Singh',
    description: 'Senior primary board preparation, leadership, comprehensive assessment, and sports.'
  },
];

// Subjects setup matching official school report card
const REPORT_SUBJECTS = [
  {
    name: 'Mathematics',
    hyWrittenMax: 30,
    hyOralMax: 70,
    hyTotalMax: 100,
    yrWrittenMax: 30,
    yrOralMax: 70,
    yrTotalMax: 100,
    totalMax: 200
  },
  {
    name: 'Hindi',
    hyWrittenMax: 30,
    hyOralMax: 70,
    hyTotalMax: 100,
    yrWrittenMax: 30,
    yrOralMax: 70,
    yrTotalMax: 100,
    totalMax: 200
  },
  {
    name: 'English',
    hyWrittenMax: 15,
    hyOralMax: 35,
    hyTotalMax: 50,
    yrWrittenMax: 15,
    yrOralMax: 35,
    yrTotalMax: 50,
    totalMax: 100
  },
  {
    name: 'EVS',
    hyWrittenMax: 50,
    hyOralMax: null,
    hyTotalMax: 50,
    yrWrittenMax: 50,
    yrOralMax: null,
    yrTotalMax: 50,
    totalMax: 100
  }
];

// Helper to parse numeric values safely
function parseMark(val) {
  if (val === null || val === undefined || val === '' || val === '—' || val === '-') return null;
  const num = Number(val);
  return isNaN(num) ? null : num;
}

// Compute real marks for a student dynamically based on loaded exam files
function computeStudentMarks(student, classExamData, allClassStudents = []) {
  if (!student) return null;
  const roll = student.rollNo;

  const findRecord = (list) => {
    if (!Array.isArray(list) || list.length === 0) return null;
    return list.find(item => {
      const itemRoll = String(item.roll_no ?? item.roll ?? '').replace(/\D/g, '');
      return itemRoll === String(roll) || item.student_id === student.id;
    }) || null;
  };

  const t1Data = findRecord(classExamData?.test1);
  const t2Data = findRecord(classExamData?.test2);
  const t3Data = findRecord(classExamData?.test3);
  const hyData = findRecord(classExamData?.halfYearly);
  const yrData = findRecord(classExamData?.yearly);

  let anyMarkPresent = false;
  let totalObtained = 0;
  let totalConductedMax = 0;

  const subjectsData = REPORT_SUBJECTS.map((sub) => {
    const key = sub.name.toLowerCase(); // 'mathematics', 'hindi', 'english', 'evs'
    const mathsKey = key === 'mathematics' ? 'maths' : key;

    // 3 Periodic Tests (10 Marks each - Written only)
    const t1 = parseMark(t1Data?.[`${key}_written`] ?? t1Data?.[`${mathsKey}_written`] ?? t1Data?.[key] ?? t1Data?.[mathsKey]);
    const t2 = parseMark(t2Data?.[`${key}_written`] ?? t2Data?.[`${mathsKey}_written`] ?? t2Data?.[key] ?? t2Data?.[mathsKey]);
    const t3 = parseMark(t3Data?.[`${key}_written`] ?? t3Data?.[`${mathsKey}_written`] ?? t3Data?.[key] ?? t3Data?.[mathsKey]);
    let totalT = null;
    if (t1 !== null || t2 !== null || t3 !== null) {
      totalT = (t1 || 0) + (t2 || 0) + (t3 || 0);
      anyMarkPresent = true;
    }

    // Half Yearly (Written & Oral)
    const hyW = parseMark(hyData?.[`${key}_written`] ?? hyData?.[`${mathsKey}_written`] ?? hyData?.[key]?.written ?? hyData?.[mathsKey]?.written ?? hyData?.[key]);
    const hyO = sub.hyOralMax !== null
      ? parseMark(hyData?.[`${key}_oral`] ?? hyData?.[`${mathsKey}_oral`] ?? hyData?.[key]?.oral ?? hyData?.[mathsKey]?.oral)
      : null;
    let hyT = null;
    if (hyW !== null || hyO !== null) {
      hyT = (hyW || 0) + (hyO || 0);
      anyMarkPresent = true;
      totalObtained += hyT;
      totalConductedMax += sub.hyTotalMax;
    }

    // Yearly (Written & Oral)
    const yrW = parseMark(yrData?.[`${key}_written`] ?? yrData?.[`${mathsKey}_written`] ?? yrData?.[key]?.written ?? yrData?.[mathsKey]?.written ?? yrData?.[key]);
    const yrO = sub.yrOralMax !== null
      ? parseMark(yrData?.[`${key}_oral`] ?? yrData?.[`${mathsKey}_oral`] ?? yrData?.[key]?.oral ?? yrData?.[mathsKey]?.oral)
      : null;
    let yrT = null;
    if (yrW !== null || yrO !== null) {
      yrT = (yrW || 0) + (yrO || 0);
      anyMarkPresent = true;
      totalObtained += yrT;
      totalConductedMax += sub.yrTotalMax;
    }

    // Subject SubTotal
    let subTotal = null;
    if (hyT !== null || yrT !== null) {
      subTotal = (hyT || 0) + (yrT || 0);
    }

    return {
      name: sub.name,
      test1: t1,
      test1Max: 10,
      test2: t2,
      test2Max: 10,
      test3: t3,
      test3Max: 10,
      totalTest: totalT,
      totalTestMax: 30,
      hyWritten: hyW,
      hyWrittenMax: sub.hyWrittenMax,
      hyOral: hyO,
      hyOralMax: sub.hyOralMax,
      hyTotal: hyT,
      hyTotalMax: sub.hyTotalMax,
      yrWritten: yrW,
      yrWrittenMax: sub.yrWrittenMax,
      yrOral: yrO,
      yrOralMax: sub.yrOralMax,
      yrTotal: yrT,
      yrTotalMax: sub.yrTotalMax,
      subTotal,
      totalMax: sub.totalMax
    };
  });

  const maxMarks = 600;
  const percentage = anyMarkPresent && totalConductedMax > 0
    ? parseFloat(((totalObtained / totalConductedMax) * 100).toFixed(2))
    : null;

  let grade = null;
  let remark = null;
  if (percentage !== null) {
    if (percentage >= 90) { grade = 'A+'; remark = 'Outstanding academic performance with exemplary subject mastery.'; }
    else if (percentage >= 75) { grade = 'A'; remark = 'Excellent conceptual clarity and commendable participation in class.'; }
    else if (percentage >= 60) { grade = 'B'; remark = 'Very good academic progress with steady improvement across subjects.'; }
    else if (percentage >= 45) { grade = 'C'; remark = 'Good effort. Continued regular practice is recommended.'; }
    else if (percentage >= 33) { grade = 'D'; remark = 'Satisfactory. Needs focused guidance and consistent daily revision.'; }
    else { grade = 'F'; remark = 'Needs intensive remedial support and extra guidance.'; }
  }

  // Calculate Rank among students who have marks in this class
  let displayRank = student.rank || '—';
  if (anyMarkPresent && allClassStudents.length > 0) {
    const studentsWithMarks = allClassStudents
      .map(s => computeStudentMarks(s, classExamData))
      .filter(res => res && res.hasMarks)
      .sort((a, b) => (b.totalObtained || 0) - (a.totalObtained || 0));

    const rankIdx = studentsWithMarks.findIndex(r => r.totalObtained === totalObtained);
    if (rankIdx !== -1) {
      const rNum = rankIdx + 1;
      const suffix = rNum === 1 ? 'st' : rNum === 2 ? 'nd' : rNum === 3 ? 'rd' : 'th';
      displayRank = `${rNum}${suffix}`;
    }
  }

  return {
    hasMarks: anyMarkPresent,
    subjectsData,
    totalObtained: anyMarkPresent ? totalObtained : null,
    totalConductedMax,
    maxMarks,
    percentage,
    grade,
    remark,
    displayRank,
    attendance: student?.attendance || '—'
  };
}

export default function Progress() {
  // Navigation State driven by URL Search Params for seamless browser back/forward navigation
  const [searchParams, setSearchParams] = useSearchParams();
  const classParam = searchParams.get('class');
  const studentParam = searchParams.get('student');

  // Data & Filter State
  const [allStudents, setAllStudents] = useState([]);
  const [classExamData, setClassExamData] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('roll-asc');
  const [showDownloadNotice, setShowDownloadNotice] = useState(false);

  // Derive Current Selected Class & Student from URL
  const selectedClassKey = classParam || null;

  const selectedStudent = useMemo(() => {
    if (!studentParam || allStudents.length === 0) return null;
    return allStudents.find(s => s.id === studentParam || String(s.rollNo) === studentParam) || null;
  }, [studentParam, allStudents]);

  const currentStep = useMemo(() => {
    if (studentParam && selectedStudent) return 'marksheet';
    if (classParam) return 'students';
    return 'classes';
  }, [studentParam, selectedStudent, classParam]);

  // Load student lists & exam results dynamically from JSON files
  useEffect(() => {
    async function fetchStudents() {
      setLoading(true);
      try {
        const classNums = [1, 2, 3, 4, 5];
        const examMap = {};

        const promises = classNums.map(async (num) => {
          const cKey = `class${num}`;
          const [studentsRes, attRes, t1Res, t2Res, t3Res, hyRes, yrRes] = await Promise.all([
            fetch(`/json/class${num}/class${num}_students.json?v=${Date.now()}`).then(res => (res.ok ? res.json() : [])).catch(() => []),
            fetch(`/json/class${num}/attendance.json?v=${Date.now()}`).then(res => (res.ok ? res.json() : [])).catch(() => []),
            fetch(`/json/class${num}/test1.json?v=${Date.now()}`).then(res => (res.ok ? res.json() : [])).catch(() => []),
            fetch(`/json/class${num}/test2.json?v=${Date.now()}`).then(res => (res.ok ? res.json() : [])).catch(() => []),
            fetch(`/json/class${num}/test3.json?v=${Date.now()}`).then(res => (res.ok ? res.json() : [])).catch(() => []),
            fetch(`/json/class${num}/half_yearly.json?v=${Date.now()}`).then(res => (res.ok ? res.json() : [])).catch(() => []),
            fetch(`/json/class${num}/yearly.json?v=${Date.now()}`).then(res => (res.ok ? res.json() : [])).catch(() => [])
          ]);

          examMap[cKey] = {
            attendance: attRes || [],
            test1: t1Res || [],
            test2: t2Res || [],
            test3: t3Res || [],
            halfYearly: hyRes || [],
            yearly: yrRes || []
          };

          const attMap = {};
          (attRes || []).forEach(item => {
            const r = String(item.roll_no ?? item.roll ?? '').replace(/\D/g, '');
            if (r) {
              attMap[r] = item.attendance || (item.present_days ? `${item.present_days} / ${item.total_days || 200} Days` : '');
            }
          });

          return (studentsRes || []).map(item => {
            const roll = Number(item.roll_no) || 1;
            const formattedRoll = String(roll).padStart(2, '0');
            const imagePath = item.image.startsWith('/') ? item.image : `/images/students/${item.image}`;
            const attVal = attMap[String(roll)] || item.attendance || '—';
            return {
              id: `STU${num}_${formattedRoll}`,
              rollNo: roll,
              rollFormatted: formattedRoll,
              name: item.student_name || 'Student',
              classKey: cKey,
              className: `Class ${num}`,
              classNumber: num,
              image: imagePath,
              fatherName: item.father_name || '',
              motherName: item.mother_name || '',
              dob: item.dob || '',
              attendance: attVal,
              session: '2026-27'
            };
          });
        });

        const results = await Promise.all(promises);
        setAllStudents(results.flat());
        setClassExamData(examMap);
      } catch (error) {
        console.error('Failed to load student data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStudents();
  }, []);

  // Current selected class object
  const currentClassObj = useMemo(() => {
    return CLASSES_DATA.find(c => c.key === selectedClassKey) || null;
  }, [selectedClassKey]);

  // Students in currently selected class
  const classStudentsList = useMemo(() => {
    if (!selectedClassKey) return [];
    return allStudents.filter(s => s.classKey === selectedClassKey);
  }, [allStudents, selectedClassKey]);

  // Filtered & Sorted Class Students
  const filteredClassStudents = useMemo(() => {
    return classStudentsList
      .filter(stu => {
        const q = searchQuery.toLowerCase().trim();
        return (
          !q ||
          stu.name.toLowerCase().includes(q) ||
          stu.rollNo.toString().includes(q)
        );
      })
      .sort((a, b) => {
        if (sortBy === 'roll-asc') return a.rollNo - b.rollNo;
        if (sortBy === 'roll-desc') return b.rollNo - a.rollNo;
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
        return 0;
      });
  }, [classStudentsList, searchQuery, sortBy]);

  // Handle Selecting a Class
  const handleSelectClass = (classKey) => {
    setSearchQuery('');
    setSearchParams({ class: classKey });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Selecting a Student
  const handleSelectStudent = (student) => {
    setSearchParams({ class: student.classKey, student: student.id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigation handlers inside Marksheet view
  const handleNextStudent = useCallback(() => {
    if (!selectedStudent || filteredClassStudents.length === 0) return;
    const currentIndex = filteredClassStudents.findIndex(s => s.id === selectedStudent.id);
    const nextIndex = (currentIndex + 1) % filteredClassStudents.length;
    const nextStu = filteredClassStudents[nextIndex];
    setSearchParams({ class: nextStu.classKey, student: nextStu.id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedStudent, filteredClassStudents, setSearchParams]);

  const handlePrevStudent = useCallback(() => {
    if (!selectedStudent || filteredClassStudents.length === 0) return;
    const currentIndex = filteredClassStudents.findIndex(s => s.id === selectedStudent.id);
    const prevIndex = (currentIndex - 1 + filteredClassStudents.length) % filteredClassStudents.length;
    const prevStu = filteredClassStudents[prevIndex];
    setSearchParams({ class: prevStu.classKey, student: prevStu.id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedStudent, filteredClassStudents, setSearchParams]);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e) {
      if (currentStep !== 'marksheet') return;
      if (e.key === 'ArrowRight') handleNextStudent();
      if (e.key === 'ArrowLeft') handlePrevStudent();
      if (e.key === 'Escape') {
        if (showDownloadNotice) setShowDownloadNotice(false);
        else if (selectedClassKey) setSearchParams({ class: selectedClassKey });
        else setSearchParams({});
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, handleNextStudent, handlePrevStudent, showDownloadNotice, selectedClassKey, setSearchParams]);

  // Dynamically set PDF file name format: class_x-student_name on Save / Print
  useEffect(() => {
    if (currentStep === 'marksheet' && selectedStudent) {
      const classNum = selectedStudent.classNumber || (selectedClassKey ? selectedClassKey.replace(/\D/g, '') : '1');
      const safeStudentName = (selectedStudent.name || 'student')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_-]/g, '');

      const targetTitle = `class_${classNum}-${safeStudentName}`;
      const originalTitle = document.title;

      const handleBeforePrint = () => {
        document.title = targetTitle;
      };

      const handleAfterPrint = () => {
        document.title = originalTitle;
      };

      window.addEventListener('beforeprint', handleBeforePrint);
      window.addEventListener('afterprint', handleAfterPrint);

      return () => {
        window.removeEventListener('beforeprint', handleBeforePrint);
        window.removeEventListener('afterprint', handleAfterPrint);
      };
    }
  }, [currentStep, selectedStudent, selectedClassKey]);

  // Print Action
  const handlePrint = () => {
    if (selectedStudent) {
      const classNum = selectedStudent.classNumber || (selectedClassKey ? selectedClassKey.replace(/\D/g, '') : '1');
      const safeStudentName = (selectedStudent.name || 'student')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_-]/g, '');

      const targetTitle = `class_${classNum}-${safeStudentName}`;
      const prevTitle = document.title;
      document.title = targetTitle;

      window.print();

      setTimeout(() => {
        document.title = prevTitle;
      }, 1500);
    } else {
      window.print();
    }
  };

  return (
    <main>
      <section className="progress-portal-section">
        <div className="progress-container">
          
          {/* ========================================================================= */}
          {/* STEP 1: CLASS SELECTION SCREEN                                            */}
          {/* ========================================================================= */}
          {currentStep === 'classes' && (
            <motion.div
              key="classes-screen"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="portal-hero">
                <div className="portal-badge">
                  <i className="fas fa-graduation-cap"></i>
                  <span>Academic Session 2026-27</span>
                  <span>•</span>
                  <span>Shree Jagdamba Convent School</span>
                </div>
                
                <h1 className="portal-title">
                  Select Your <span>Class</span>
                </h1>
                
                <p className="portal-subtitle">
                  Please select a class from the list below to view enrolled students, attendance records, and comprehensive academic progress reports.
                </p>
              </div>

              {loading ? (
                <div className="portal-empty-state">
                  <i className="fas fa-spinner fa-spin portal-empty-icon"></i>
                  <h3>Loading Academic Records...</h3>
                  <p>Fetching student archives for Session 2026-27.</p>
                </div>
              ) : (
                <div className="class-selection-grid">
                  {CLASSES_DATA.map((cls) => {
                    const studentCount = allStudents.filter(s => s.classKey === cls.key).length || cls.totalStudents;
                    return (
                      <motion.div
                        key={cls.key}
                        className="class-card-box"
                        whileHover={{ y: -8 }}
                        onClick={() => handleSelectClass(cls.key)}
                      >
                        <div>
                          <div className="class-card-header">
                            <div className="class-card-icon">
                              <i className={`fas ${cls.icon}`}></i>
                            </div>
                            <span className="class-card-pill">
                              {studentCount} Students
                            </span>
                          </div>

                          <h2 className="class-card-name">{cls.name}</h2>
                          <p className="class-card-desc">{cls.description}</p>

                          <div className="class-card-meta">
                            <div className="class-card-meta-row">
                              <span className="class-meta-label">Class Teacher:</span>
                              <span className="class-meta-val">{cls.incharge}</span>
                            </div>
                            <div className="class-card-meta-row">
                              <span className="class-meta-label">Session:</span>
                              <span className="class-meta-val">2026-27 Active</span>
                            </div>
                          </div>
                        </div>

                        <button
                          className="class-card-btn"
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectClass(cls.key);
                          }}
                        >
                          <span>Open {cls.name} Students</span>
                          <i className="fas fa-arrow-right"></i>
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: CLASS STUDENTS ROSTER SCREEN                                      */}
          {/* ========================================================================= */}
          {currentStep === 'students' && currentClassObj && (
            <motion.div
              key="students-screen"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Top Navigation Bar */}
              <div className="portal-nav-top-bar">
                <button
                  className="portal-back-btn"
                  onClick={() => {
                    setSearchParams({});
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  type="button"
                >
                  <i className="fas fa-arrow-left"></i>
                  <span>Back to Class Selection</span>
                </button>

                <div className="portal-breadcrumb-tag">
                  <i className={`fas ${currentClassObj.icon}`}></i>
                  <span>{currentClassObj.name} ({classStudentsList.length} Students)</span>
                </div>
              </div>

              {/* Class Title Header */}
              <div className="portal-hero" style={{ marginBottom: '1.8rem' }}>
                <h1 className="portal-title">
                  {currentClassObj.name} <span>Student Roster</span>
                </h1>
                <p className="portal-subtitle">
                  Class Teacher: <strong>{currentClassObj.incharge}</strong> • Academic Session: <strong>2026-27</strong> • Select a student to open their detailed marksheet.
                </p>
              </div>

              {/* Toolbar: Search, Sort & View Controls */}
              <div className="portal-toolbar">
                <div className="search-box-wrap">
                  <i className="fas fa-search search-icon"></i>
                  <input
                    type="text"
                    className="search-input"
                    placeholder={`Search ${currentClassObj.name} student by name or roll number...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      className="search-clear-btn"
                      onClick={() => setSearchQuery('')}
                      title="Clear search"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>

                <div className="toolbar-actions">
                  <div className="sort-select-wrap">
                    <select
                      className="sort-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="roll-asc">Roll No: Low to High</option>
                      <option value="roll-desc">Roll No: High to Low</option>
                      <option value="name-asc">Name: A to Z</option>
                      <option value="name-desc">Name: Z to A</option>
                    </select>
                    <i className="fas fa-chevron-down sort-select-icon"></i>
                  </div>
                </div>
              </div>

              {/* Students Content Area */}
              {filteredClassStudents.length === 0 ? (
                <div className="portal-empty-state">
                  <i className="fas fa-search portal-empty-icon"></i>
                  <h3>No Student Found</h3>
                  <p>No student in {currentClassObj.name} matches your search query "{searchQuery}".</p>
                  <button
                    className="portal-back-btn"
                    onClick={() => setSearchQuery('')}
                  >
                    Reset Filter
                  </button>
                </div>
              ) : (
                /* GRID VIEW */
                <div className="students-grid-view">
                  {filteredClassStudents.map((student) => (
                    <motion.div
                      key={student.id}
                      className="student-card-item"
                      whileHover={{ y: -6 }}
                      onClick={() => handleSelectStudent(student)}
                    >
                      <div className="card-top-badges">
                        <span className="card-roll-tag">
                          Roll {student.rollFormatted}
                        </span>
                        <span className="card-class-tag">
                          {student.className}
                        </span>
                      </div>

                      <div className="student-avatar-frame">
                        <img
                          src={student.image}
                          alt={student.name}
                          className="student-card-img"
                          loading="lazy"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=4f46e5&color=fff&size=200&bold=true`;
                          }}
                        />
                      </div>

                      <h3 className="student-card-name" title={student.name}>
                        {student.name}
                      </h3>

                      <div className="student-card-footer">
                        <button className="view-report-btn" type="button">
                          <i className="fas fa-file-invoice"></i>
                          <span>View Marksheet</span>
                          <i className="fas fa-chevron-right" style={{ fontSize: '0.7rem' }}></i>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: SELECTED STUDENT PROGRESS & MARKSHEET SCREEN                      */}
          {/* ========================================================================= */}
          {currentStep === 'marksheet' && selectedStudent && (
            <motion.div
              key="marksheet-screen"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Top Navigation Bar */}
              <div className="portal-nav-top-bar">
                <button
                  className="portal-back-btn"
                  onClick={() => {
                    setSearchParams({ class: selectedStudent.classKey });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  type="button"
                >
                  <i className="fas fa-arrow-left"></i>
                  <span>Back to {selectedStudent.className} Students</span>
                </button>

                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button
                    className="portal-back-btn"
                    onClick={handlePrevStudent}
                    title="Previous Student (Left Arrow)"
                    type="button"
                  >
                    <i className="fas fa-chevron-left"></i>
                    <span>Prev</span>
                  </button>
                  <button
                    className="portal-back-btn"
                    onClick={handleNextStudent}
                    title="Next Student (Right Arrow)"
                    type="button"
                  >
                    <span>Next</span>
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>

              {/* Official Marksheet Document (Matches Full Enhanced Reference Design) */}
              <div className="student-marksheet-section" id="printableMarksheet">
                
                {/* School Header Banner */}
                <div className="marksheet-school-banner">
                  <div className="school-logo-frame">
                    <img
                      src="/images/logo.png"
                      alt="School Emblem"
                      className="school-emblem-img"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>

                  <div className="school-name-block">
                    <h1 className="school-official-name">
                      SHREE JAGDAMBA CONVENT SCHOOL
                    </h1>
                    <div className="school-churu-ornament">
                      <span className="ornament-line"></span>
                      <span className="churu-badge">DHADHERU, CHURU</span>
                      <span className="ornament-line"></span>
                    </div>
                    <div className="school-official-sub">
                      ★ AN ENGLISH MEDIUM CO-EDUCATIONAL SCHOOL ★
                    </div>
                    
                    {/* Ribbon Banner */}
                    <div className="marksheet-report-ribbon-wrap">
                      <div className="marksheet-report-ribbon">
                        ★ PROGRESS REPORT ★
                      </div>
                    </div>

                    <div className="student-main-name">
                      {selectedStudent.name}
                    </div>

                    <div className="student-badge-row">
                      <span className="student-class-pill">
                        CLASS {selectedStudent.classNumber}
                      </span>
                      <span className="session-pill">
                        SESSION: 2026-27
                      </span>
                    </div>
                  </div>

                  <div className="marksheet-student-photo-box">
                    <img
                      src={selectedStudent.image}
                      alt={selectedStudent.name}
                      className="marksheet-student-photo"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedStudent.name)}&background=0d3b66&color=fff&size=200&bold=true`;
                      }}
                    />
                  </div>
                </div>

                {(() => {
                  const currentClassExam = classExamData[selectedStudent.classKey] || {};
                  const reportData = computeStudentMarks(selectedStudent, currentClassExam, classStudentsList);
                  if (!reportData) return null;

                  return (
                    <>
                      {/* Student Bio Information Card */}
                      <div className="marksheet-bio-card-table">
                        <div className="bio-col-half">
                          <div className="bio-field-item">
                            <span className="bio-field-label">
                              <span className="bio-icon bio-icon-blue"><i className="fas fa-user"></i></span>
                              ROLL NUMBER
                            </span>
                            <span className="bio-colon">:</span>
                            <span className="bio-field-val bio-bold">{selectedStudent.rollFormatted}</span>
                          </div>

                          <div className="bio-field-item">
                            <span className="bio-field-label">
                              <span className="bio-icon bio-icon-blue"><i className="fas fa-female"></i></span>
                              MOTHER NAME
                            </span>
                            <span className="bio-colon">:</span>
                            <span className="bio-field-val">
                              {selectedStudent.motherName ? selectedStudent.motherName : <span className="dotted-placeholder">.....................................................</span>}
                            </span>
                          </div>

                          <div className="bio-field-item">
                            <span className="bio-field-label">
                              <span className="bio-icon bio-icon-green"><i className="fas fa-calendar-alt"></i></span>
                              ATTENDANCE
                            </span>
                            <span className="bio-colon">:</span>
                            <span className="bio-field-val bio-bold">
                              {reportData.attendance !== '—' ? reportData.attendance : <><span className="dotted-placeholder">.....................................................</span> —</>}
                            </span>
                          </div>

                          <div className="bio-field-item">
                            <span className="bio-field-label">
                              <span className="bio-icon bio-icon-blue"><i className="fas fa-award"></i></span>
                              MARKS OBTAINED
                            </span>
                            <span className="bio-colon">:</span>
                            <span className="bio-field-val bio-bold">
                              {reportData.hasMarks ? reportData.totalObtained : <span className="dotted-placeholder">...................................</span>} / 600
                            </span>
                          </div>
                        </div>

                        <div className="bio-col-half bio-right-col">
                          <div className="bio-field-item">
                            <span className="bio-field-label">
                              <span className="bio-icon bio-icon-blue"><i className="fas fa-user-tie"></i></span>
                              FATHER NAME
                            </span>
                            <span className="bio-colon">:</span>
                            <span className="bio-field-val">
                              {selectedStudent.fatherName ? selectedStudent.fatherName : <span className="dotted-placeholder">.....................................................</span>}
                            </span>
                          </div>

                          <div className="bio-field-item">
                            <span className="bio-field-label">
                              <span className="bio-icon bio-icon-green"><i className="fas fa-percentage"></i></span>
                              PERCENTAGE
                            </span>
                            <span className="bio-colon">:</span>
                            <span className="bio-field-val bio-bold">
                              {reportData.percentage !== null ? `${reportData.percentage}%` : '—'}
                            </span>
                          </div>

                          <div className="bio-field-item">
                            <span className="bio-field-label">
                              <span className="bio-icon bio-icon-blue"><i className="fas fa-chart-bar"></i></span>
                              RANK
                            </span>
                            <span className="bio-colon">:</span>
                            <span className="bio-field-val bio-bold">{reportData.displayRank !== '—' ? reportData.displayRank : '—'}</span>
                          </div>
                        </div>
                      </div>

                      {/* 1. Periodic Tests Table (10 Marks each - Written only) */}
                      <div className="marksheet-section-title-bar">
                        Test MARKS
                      </div>
                      <div className="marksheet-data-table-wrap">
                        <table className="marksheet-table tests-table">
                          <thead>
                            <tr className="main-header-row">
                              <th className="subject-col-header">SUBJECT</th>
                              <th>FIRST TEST<br/><span className="sub-th-max">(Max Marks: 10)</span></th>
                              <th>SECOND TEST<br/><span className="sub-th-max">(Max Marks: 10)</span></th>
                              <th>THIRD TEST<br/><span className="sub-th-max">(Max Marks: 10)</span></th>
                              <th>TOTAL TEST<br/><span className="sub-th-max">(Max Marks: 30)</span></th>
                            </tr>
                          </thead>
                          <tbody>
                            {reportData.subjectsData.map((sub, idx) => {
                              const iconEl = sub.name === 'Mathematics' ? (
                                <span className="sub-icon-badge math-bg">+-<br/>*x</span>
                              ) : sub.name === 'Hindi' ? (
                                <span className="sub-icon-badge hindi-bg">अ</span>
                              ) : sub.name === 'English' ? (
                                <span className="sub-icon-badge eng-bg">Eng</span>
                              ) : (
                                <span className="sub-icon-badge evs-bg">🌿</span>
                              );

                              return (
                                <tr key={idx}>
                                  <td className="subject-name-cell">
                                    {iconEl}
                                    <span className="subject-title-text">{sub.name}</span>
                                  </td>
                                  <td className="marks-cell">
                                    {sub.test1 !== null ? (
                                      <><strong className="mark-val">{sub.test1}</strong> <span className="sub-max-label">/ 10</span></>
                                    ) : (
                                      <><span className="empty-cell-dash">—</span> <span className="sub-max-label">/ 10</span></>
                                    )}
                                  </td>
                                  <td className="marks-cell">
                                    {sub.test2 !== null ? (
                                      <><strong className="mark-val">{sub.test2}</strong> <span className="sub-max-label">/ 10</span></>
                                    ) : (
                                      <><span className="empty-cell-dash">—</span> <span className="sub-max-label">/ 10</span></>
                                    )}
                                  </td>
                                  <td className="marks-cell">
                                    {sub.test3 !== null ? (
                                      <><strong className="mark-val">{sub.test3}</strong> <span className="sub-max-label">/ 10</span></>
                                    ) : (
                                      <><span className="empty-cell-dash">—</span> <span className="sub-max-label">/ 10</span></>
                                    )}
                                  </td>
                                  <td className="marks-cell bold-cell sub-total-cell">
                                    {sub.totalTest !== null ? (
                                      <><strong className="mark-val">{sub.totalTest}</strong> <span className="sub-max-label">/ 30</span></>
                                    ) : (
                                      <><span className="empty-cell-dash">—</span> <span className="sub-max-label">/ 30</span></>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* 2. Academic Examination Table (Half Yearly & Yearly) */}
                      <div className="marksheet-section-title-bar">
                        EXAMINATION MARKS
                      </div>
                      <div className="marksheet-data-table-wrap">
                        <table className="marksheet-table academic-exam-table">
                          <thead>
                            <tr className="main-header-row">
                              <th rowSpan="2" className="subject-col-header">SUBJECT</th>
                              <th colSpan="3" className="exam-group-green">HALF YEARLY EXAM</th>
                              <th colSpan="3" className="exam-group-blue">YEARLY EXAM</th>
                            </tr>
                            <tr className="sub-header-row">
                              <th>WRITTEN<br/><span className="sub-th-max">(Max Marks)</span></th>
                              <th>ORAL<br/><span className="sub-th-max">(Max Marks)</span></th>
                              <th>TOTAL<br/><span className="sub-th-max">(Max Marks)</span></th>
                              <th>WRITTEN<br/><span className="sub-th-max">(Max Marks)</span></th>
                              <th>ORAL<br/><span className="sub-th-max">(Max Marks)</span></th>
                              <th>TOTAL<br/><span className="sub-th-max">(Max Marks)</span></th>
                            </tr>
                          </thead>
                          <tbody>
                            {reportData.subjectsData.map((sub, idx) => {
                              const iconEl = sub.name === 'Mathematics' ? (
                                <span className="sub-icon-badge math-bg">+-<br/>*x</span>
                              ) : sub.name === 'Hindi' ? (
                                <span className="sub-icon-badge hindi-bg">अ</span>
                              ) : sub.name === 'English' ? (
                                <span className="sub-icon-badge eng-bg">Eng</span>
                              ) : (
                                <span className="sub-icon-badge evs-bg">🌿</span>
                              );

                              return (
                                <tr key={idx}>
                                  <td className="subject-name-cell">
                                    {iconEl}
                                    <span className="subject-title-text">{sub.name}</span>
                                  </td>
                                  <td className="marks-cell">
                                    {sub.hyWritten !== null ? (
                                      <><strong className="mark-val">{sub.hyWritten}</strong> <span className="sub-max-label">/ {sub.hyWrittenMax}</span></>
                                    ) : (
                                      <><span className="empty-cell-dash">—</span> <span className="sub-max-label">/ {sub.hyWrittenMax}</span></>
                                    )}
                                  </td>
                                  <td className="marks-cell">
                                    {sub.hyOralMax !== null ? (
                                      sub.hyOral !== null ? (
                                        <><strong className="mark-val">{sub.hyOral}</strong> <span className="sub-max-label">/ {sub.hyOralMax}</span></>
                                      ) : (
                                        <><span className="empty-cell-dash">—</span> <span className="sub-max-label">/ {sub.hyOralMax}</span></>
                                      )
                                    ) : (
                                      <span className="empty-cell-dash">/ 50</span>
                                    )}
                                  </td>
                                  <td className="marks-cell bold-cell sub-total-cell">
                                    {sub.hyTotal !== null ? (
                                      <><strong className="mark-val">{sub.hyTotal}</strong> <span className="sub-max-label">/ {sub.hyTotalMax}</span></>
                                    ) : (
                                      <><span className="empty-cell-dash">—</span> <span className="sub-max-label">/ {sub.hyTotalMax}</span></>
                                    )}
                                  </td>
                                  <td className="marks-cell">
                                    {sub.yrWritten !== null ? (
                                      <><strong className="mark-val">{sub.yrWritten}</strong> <span className="sub-max-label">/ {sub.yrWrittenMax}</span></>
                                    ) : (
                                      <><span className="empty-cell-dash">—</span> <span className="sub-max-label">/ {sub.yrWrittenMax}</span></>
                                    )}
                                  </td>
                                  <td className="marks-cell">
                                    {sub.yrOralMax !== null ? (
                                      sub.yrOral !== null ? (
                                        <><strong className="mark-val">{sub.yrOral}</strong> <span className="sub-max-label">/ {sub.yrOralMax}</span></>
                                      ) : (
                                        <><span className="empty-cell-dash">—</span> <span className="sub-max-label">/ {sub.yrOralMax}</span></>
                                      )
                                    ) : (
                                      <span className="empty-cell-dash">/ 50</span>
                                    )}
                                  </td>
                                  <td className="marks-cell bold-cell sub-total-cell">
                                    {sub.yrTotal !== null ? (
                                      <><strong className="mark-val">{sub.yrTotal}</strong> <span className="sub-max-label">/ {sub.yrTotalMax}</span></>
                                    ) : (
                                      <><span className="empty-cell-dash">—</span> <span className="sub-max-label">/ {sub.yrTotalMax}</span></>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* 3. Formative Assessment (Evaluation) Table */}
                      <div className="marksheet-section-title-bar formative-bar">
                        FORMATIVE ASSESSMENT (EVALUATION)
                      </div>
                      <div className="marksheet-data-table-wrap">
                        <table className="marksheet-table formative-eval-table">
                          <thead>
                            <tr className="main-header-row">
                              <th className="subject-col-header">SUBJECT</th>
                              <th className="eval-th-green">FIRST<br/>EVALUATION</th>
                              <th className="eval-th-teal">SECOND<br/>EVALUATION</th>
                              <th className="eval-th-blue">THIRD<br/>EVALUATION</th>
                              <th className="eval-th-purple">FOURTH<br/>EVALUATION</th>
                              <th className="eval-th-orange">FIFTH<br/>EVALUATION</th>
                              <th className="eval-th-navy">OVERALL</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reportData.subjectsData.map((sub, idx) => {
                              const iconEl = sub.name === 'Mathematics' ? (
                                <span className="sub-icon-badge math-bg">+-<br/>*x</span>
                              ) : sub.name === 'Hindi' ? (
                                <span className="sub-icon-badge hindi-bg">अ</span>
                              ) : sub.name === 'English' ? (
                                <span className="sub-icon-badge eng-bg">Eng</span>
                              ) : (
                                <span className="sub-icon-badge evs-bg">🌿</span>
                              );

                              return (
                                <tr key={idx}>
                                  <td className="subject-name-cell">
                                    {iconEl}
                                    <span className="subject-title-text">{sub.name}</span>
                                  </td>
                                  <td className="grade-cell">{reportData.hasMarks ? reportData.grade : ''}</td>
                                  <td className="grade-cell">{reportData.hasMarks ? reportData.grade : ''}</td>
                                  <td className="grade-cell">{reportData.hasMarks ? reportData.grade : ''}</td>
                                  <td className="grade-cell">{reportData.hasMarks ? reportData.grade : ''}</td>
                                  <td className="grade-cell">{reportData.hasMarks ? reportData.grade : ''}</td>
                                  <td className="grade-cell bold-cell">{reportData.hasMarks ? reportData.grade : ''}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Bottom 3 Cards Grid: Grading Scale | Teacher's Remarks | Personality */}
                      <div className="marksheet-middle-cards-grid">
                        {/* Card 1: Grading Scale */}
                        <div className="middle-card grading-card">
                          <div className="middle-card-header blue-text">
                            <i className="fas fa-chart-pie"></i>
                            <span>GRADING SCALE</span>
                          </div>
                          <div className="grading-scale-body">
                            <table className="mini-grading-table">
                              <tbody>
                                <tr>
                                  <td className="g-cell-bold">A+</td>
                                  <td>90% and above</td>
                                  <td>Outstanding</td>
                                </tr>
                                <tr>
                                  <td className="g-cell-bold">A</td>
                                  <td>75% – 89%</td>
                                  <td>Excellent</td>
                                </tr>
                                <tr>
                                  <td className="g-cell-bold">B+</td>
                                  <td>60% – 74%</td>
                                  <td>Very Good</td>
                                </tr>
                                <tr>
                                  <td className="g-cell-bold">B</td>
                                  <td>45% – 59%</td>
                                  <td>Good</td>
                                </tr>
                                <tr>
                                  <td className="g-cell-bold">C</td>
                                  <td>Below 45%</td>
                                  <td>Needs Improvement</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Card 2: Teacher's Remarks */}
                        <div className="middle-card remarks-card">
                          <div className="middle-card-header blue-text">
                            <i className="fas fa-edit"></i>
                            <span>TEACHER'S REMARKS</span>
                          </div>
                          <div className="remarks-card-body">
                            <div className="remarks-dotted-lines">
                              <div className="remark-line-dotted first-line">
                                {reportData.remark ? reportData.remark : ''}
                              </div>
                              <div className="remark-line-dotted"></div>
                              <div className="remark-line-dotted"></div>
                              <div className="remark-line-dotted"></div>
                            </div>
                            <div className="book-pen-illustration">
                              <img
                                src="/images/icons/book.png"
                                alt="Remarks Book and Pen"
                                className="book-pen-img"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Card 3: Personality Development */}
                        <div className="middle-card personality-card">
                          <div className="middle-card-header orange-text">
                            <i className="fas fa-user-circle"></i>
                            <span>PERSONALITY DEVELOPMENT</span>
                          </div>
                          <div className="personality-card-body">
                            <table className="personality-table">
                              <tbody>
                                <tr>
                                  <td className="trait-label">Discipline</td>
                                  <td className="trait-stars">★★★★★</td>
                                </tr>
                                <tr>
                                  <td className="trait-label">Sincerity</td>
                                  <td className="trait-stars">★★★★★</td>
                                </tr>
                                <tr>
                                  <td className="trait-label">Confidence</td>
                                  <td className="trait-stars">★★★★★</td>
                                </tr>
                                <tr>
                                  <td className="trait-label">Behaviour</td>
                                  <td className="trait-stars">★★★★★</td>
                                </tr>
                                <tr>
                                  <td className="trait-label">Neatness</td>
                                  <td className="trait-stars">★★★★★</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>

                      {/* Footer Signatures and Rosette Badge Strip */}
                      <div className="marksheet-footer-signatures-row">
                        {/* Left Signature Block */}
                        <div className="footer-sig-block left-sig">
                          <div className="footer-deco-icon">
                            <i className="fas fa-book-reader"></i>
                          </div>
                          <div className="sig-action-area">
                            <div className="sig-solid-line"></div>
                            <span className="sig-title-text">CLASS TEACHER SIGNATURE</span>
                          </div>
                        </div>

                        {/* Center Rosette Badge (Using provided badge.png) */}
                        <div className="footer-rosette-badge">
                          <img
                            src="/images/icons/badge.png"
                            alt="Keep Up The Good Work"
                            className="footer-rosette-img"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>

                        {/* Right Signature Block */}
                        <div className="footer-sig-block right-sig">
                          <div className="sig-action-area">
                            <div className="sig-solid-line"></div>
                            <span className="sig-title-text">PRINCIPAL SIGNATURE</span>
                          </div>
                          <div className="footer-deco-icon">
                            <i className="fas fa-graduation-cap"></i>
                          </div>
                        </div>
                      </div>

                    </>
                  );
                })()}

              </div>

              {/* ========================================================================= */}
              {/* SAVE AS PDF BUTTON                                                        */}
              {/* ========================================================================= */}
              <div className="marksheet-download-action-bar">
                <div className="download-action-buttons">
                  <button
                    className="btn-print-preview"
                    onClick={handlePrint}
                    type="button"
                  >
                    <i className="fas fa-file-pdf"></i>
                    <span>Save as PDF (A4)</span>
                  </button>
                </div>

                <div className="download-session-notice">
                  <i className="fas fa-info-circle"></i>
                  <span>Format: <strong>A4 Portrait (Single Page)</strong>. When saving, ensure <em>Destination: Save as PDF</em> is selected.</span>
                </div>
              </div>

              {/* Classmates Quick Carousel at Bottom */}
              <div className="marksheet-classmates-strip">
                <div className="strip-title">
                  <i className="fas fa-users"></i>
                  <span>Browse Classmates in {selectedStudent.className}:</span>
                </div>
                <div className="strip-carousel">
                  {classStudentsList.map(cStudent => {
                    const isCurrent = cStudent.id === selectedStudent.id;
                    return (
                      <button
                        key={cStudent.id}
                        className={`strip-student-pill ${isCurrent ? 'current' : ''}`}
                        onClick={() => {
                          setSearchParams({ class: cStudent.classKey, student: cStudent.id });
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        type="button"
                      >
                        <img
                          src={cStudent.image}
                          alt=""
                          className="strip-thumb"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(cStudent.name)}&size=50`;
                          }}
                        />
                        <span>Roll {cStudent.rollFormatted} {cStudent.name.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </motion.div>
          )}

        </div>
      </section>

      {/* ========================================================================= */}
      {/* NOTICE MODAL: MARKSHEET DOWNLOAD NOTICE                                   */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showDownloadNotice && (
          <div className="notice-modal-backdrop" onClick={() => setShowDownloadNotice(false)}>
            <motion.div
              className="notice-modal-card"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              <div className="notice-modal-icon">
                <i className="fas fa-clock"></i>
              </div>

              <h3 className="notice-modal-title">Official Download Notice</h3>
              
              <p className="notice-modal-desc">
                The official downloadable PDF marksheet with authentication stamp will be available once the complete <strong>Session 2026-27</strong> annual academic session and final evaluations conclude.
                <br /><br />
                You can currently use the <strong>"Print / Preview Copy"</strong> option to view or print the interim student record.
              </p>

              <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center' }}>
                <button
                  className="btn-print-preview"
                  onClick={() => {
                    setShowDownloadNotice(false);
                    handlePrint();
                  }}
                  type="button"
                >
                  <i className="fas fa-print"></i>
                  <span>Print Preview</span>
                </button>

                <button
                  className="notice-modal-btn"
                  onClick={() => setShowDownloadNotice(false)}
                  type="button"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
