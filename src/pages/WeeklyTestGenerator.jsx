import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import '../css/main.css';
import '../css/weekly-test.css';

// Predefined School Subjects List
const SUBJECT_OPTIONS = [
  { id: 'mathematics', name: 'Mathematics', hindiName: 'गणित' },
  { id: 'hindi', name: 'Hindi', hindiName: 'हिन्दी' },
  { id: 'english', name: 'English', hindiName: 'अंग्रेज़ी' },
  { id: 'evs', name: 'EVS', hindiName: 'पर्यावरण अध्ययन' },
  { id: 'science', name: 'Science', hindiName: 'विज्ञान' },
  { id: 'sst', name: 'Social Studies', hindiName: 'सामाजिक अध्ययन' },
  { id: 'sanskrit', name: 'Sanskrit', hindiName: 'संस्कृत' },
  { id: 'gk', name: 'General Knowledge', hindiName: 'सामान्य ज्ञान' },
  { id: 'computer', name: 'Computer', hindiName: 'कंप्यूटर' },
  { id: 'drawing', name: 'Drawing', hindiName: 'चित्रकला' }
];

export default function WeeklyTestGenerator() {
  // Test Meta State (Exact official school name)
  const [schoolName, setSchoolName] = useState('SHREE JAGDAMBA CONVENT SCHOOL');
  const [schoolSubtitle, setSchoolSubtitle] = useState('DHADHERU GODARAN, CHURU (RAJ.) • AFFILIATED TO RBSE');
  
  // Subject & Test Setup
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [customSubject, setCustomSubject] = useState('');
  const [testNumber, setTestNumber] = useState('1');
  const [testTitle, setTestTitle] = useState('WEEKLY TEST: MATHEMATICS – TEST #1');
  const [testDate, setTestDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState(1);
  const [maxMarks, setMaxMarks] = useState(20);

  // Incharge & Settings
  const [teacherName, setTeacherName] = useState('Mrs. Renu');
  const [principalName, setPrincipalName] = useState('Mr. Chandan Singh');
  const [showRemarks, setShowRemarks] = useState(true);
  const [cardsPerPage, setCardsPerPage] = useState(9); // Exact 9 cards per A4 page (3x3 grid)

  // Students Data List
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  // UI Modals & Views
  const [activeTab, setActiveTab] = useState('edit'); // 'edit' | 'preview'
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [excelPasteText, setExcelPasteText] = useState('');

  // Quick fill marks state
  const [quickFillVal, setQuickFillVal] = useState('');

  // Active Subject Display Name
  const activeSubjectName = useMemo(() => {
    if (selectedSubject === 'custom') {
      return customSubject.trim() || 'Custom Subject';
    }
    const found = SUBJECT_OPTIONS.find(s => s.name.toLowerCase() === selectedSubject.toLowerCase());
    return found ? `${found.name} (${found.hindiName})` : selectedSubject;
  }, [selectedSubject, customSubject]);

  // Update Test Title automatically when subject or test number changes
  useEffect(() => {
    const subClean = selectedSubject === 'custom' ? (customSubject || 'Subject') : selectedSubject;
    setTestTitle(`WEEKLY TEST: ${subClean.toUpperCase()} – TEST #${testNumber}`);
  }, [selectedSubject, customSubject, testNumber]);

  // Fetch Class Student Presets on Initial Load or Class Change
  const loadClassStudents = async (classNum) => {
    setLoadingStudents(true);
    try {
      const res = await fetch(`/json/class${classNum}/class${classNum}_students.json?v=${Date.now()}`);
      if (!res.ok) throw new Error('Class JSON not found');
      const data = await res.json();
      
      const formatted = data.map((s, idx) => {
        let photoPath = '';
        if (s.image) {
          photoPath = s.image.startsWith('/') ? s.image : `/images/students/${s.image}`;
        }
        return {
          id: `stu_${classNum}_${s.roll_no || idx + 1}`,
          roll_no: s.roll_no || (idx + 1),
          student_name: (s.student_name || `Student ${idx + 1}`).trim().toUpperCase(),
          image: photoPath,
          marks: '',
          isAbsent: false,
          remarks: ''
        };
      });

      setStudents(formatted);
    } catch (err) {
      console.warn('Failed loading class student JSON, setting sample list', err);
      // Fallback sample students
      const fallback = Array.from({ length: 9 }, (_, i) => ({
        id: `stu_${classNum}_${i + 1}`,
        roll_no: i + 1,
        student_name: `STUDENT ${i + 1}`,
        image: '',
        marks: '',
        isAbsent: false,
        remarks: ''
      }));
      setStudents(fallback);
    } finally {
      setLoadingStudents(false);
    }
  };

  useEffect(() => {
    loadClassStudents(selectedClass);
  }, [selectedClass]);

  // Handle Class Pill Click
  const handleSelectClass = (cNum) => {
    setSelectedClass(cNum);
    if (cNum === 1) setTeacherName('Mrs. Renu');
    else if (cNum === 2 || cNum === 3) setTeacherName('Mr. Kanhaiya Lal');
    else setTeacherName('Mr. Chandan Singh');
  };

  // Student Marks & Details Handlers
  const handleMarkChange = (studentId, val) => {
    setStudents(prev => prev.map(s => {
      if (s.id !== studentId) return s;
      if (val === '') return { ...s, marks: '' };
      const numVal = Math.min(Number(maxMarks) || 100, Math.max(0, Number(val)));
      return { ...s, marks: isNaN(numVal) ? '' : numVal };
    }));
  };

  const handleStudentFieldChange = (studentId, field, val) => {
    setStudents(prev => prev.map(s => {
      if (s.id !== studentId) return s;
      return { ...s, [field]: val };
    }));
  };

  const handleToggleAbsent = (studentId) => {
    setStudents(prev => prev.map(s => {
      if (s.id !== studentId) return s;
      const nextAbsent = !s.isAbsent;
      return {
        ...s,
        isAbsent: nextAbsent,
        remarks: nextAbsent ? 'Absent' : (s.remarks === 'Absent' ? '' : s.remarks)
      };
    }));
  };

  const handleAddStudent = () => {
    const nextRoll = students.length > 0 ? Math.max(...students.map(s => Number(s.roll_no) || 0)) + 1 : 1;
    const newStu = {
      id: `stu_custom_${Date.now()}`,
      roll_no: nextRoll,
      student_name: `NEW STUDENT ${nextRoll}`,
      image: '',
      marks: '',
      isAbsent: false,
      remarks: ''
    };
    setStudents(prev => [...prev, newStu]);
  };

  const handleDeleteStudent = (studentId) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
  };

  const handleQuickFill = () => {
    const fill = Number(quickFillVal);
    if (isNaN(fill)) return;
    const clamped = Math.min(fill, Number(maxMarks) || 100);
    setStudents(prev => prev.map(s => {
      if (s.isAbsent) return s;
      return { ...s, marks: clamped };
    }));
    setQuickFillVal('');
  };

  const handleClearAllMarks = () => {
    if (!window.confirm('Are you sure you want to clear all entered marks?')) return;
    setStudents(prev => prev.map(s => ({ ...s, marks: '', isAbsent: false })));
  };

  const parsedMaxMarks = Number(maxMarks) || 20;

  // Process students for display
  const studentResults = useMemo(() => {
    return students.map(stu => {
      const hasMarks = stu.marks !== '' && stu.marks !== null && stu.marks !== undefined;
      const obt = hasMarks ? Number(stu.marks) : null;

      return {
        ...stu,
        obtainedMarks: obt,
        hasMarks: !stu.isAbsent && hasMarks
      };
    });
  }, [students]);

  // Summary Metrics (Clean - NO pass/fail)
  const summaryStats = useMemo(() => {
    const total = studentResults.length;
    const absent = studentResults.filter(s => s.isAbsent).length;
    const appeared = total - absent;

    const presentWithMarks = studentResults.filter(s => !s.isAbsent && s.hasMarks);
    let avg = 0;
    let highest = 0;
    let highestScorer = 'None';

    if (presentWithMarks.length > 0) {
      const sum = presentWithMarks.reduce((acc, s) => acc + (s.obtainedMarks || 0), 0);
      avg = (sum / presentWithMarks.length).toFixed(1);
      
      const maxScorerObj = presentWithMarks.reduce((prev, cur) => ((cur.obtainedMarks || 0) > (prev.obtainedMarks || 0)) ? cur : prev, presentWithMarks[0]);
      highest = maxScorerObj.obtainedMarks;
      highestScorer = `${maxScorerObj.student_name} (${highest}/${parsedMaxMarks})`;
    }

    return {
      total,
      absent,
      appeared,
      avg,
      highest,
      highestScorer
    };
  }, [studentResults, parsedMaxMarks]);

  // Paginated Pages for Exact A4 3x3 Grid Printing
  const paginatedStudents = useMemo(() => {
    const pages = [];
    const perPage = Number(cardsPerPage) || 9;
    for (let i = 0; i < studentResults.length; i += perPage) {
      pages.push(studentResults.slice(i, i + perPage));
    }
    return pages.length > 0 ? pages : [[]];
  }, [studentResults, cardsPerPage]);

  // Direct High-Fidelity PDF Download Handler
  const handleDownloadPdfFile = async () => {
    const element = document.getElementById('printable-test-area');
    if (!element) return;

    setDownloadingPdf(true);

    const loadHtml2Pdf = () => {
      return new Promise((resolve, reject) => {
        if (window.html2pdf) {
          resolve(window.html2pdf);
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        script.onload = () => resolve(window.html2pdf);
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    try {
      const html2pdf = await loadHtml2Pdf();
      const cleanSub = selectedSubject === 'custom' ? (customSubject || 'Subject') : selectedSubject;
      const fileName = `Weekly_Test_Class${selectedClass}_${cleanSub.replace(/\s+/g, '_')}_${testDate}.pdf`;

      const opt = {
        margin: 0,
        filename: fileName,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          logging: false,
          scrollY: 0
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error('PDF generation error, opening print dialog fallback:', err);
      window.print();
    } finally {
      setDownloadingPdf(false);
    }
  };

  // JSON Import & Export Functions
  const handleOpenJsonModal = () => {
    const exportData = {
      schoolName,
      schoolSubtitle,
      testTitle,
      subject: selectedSubject === 'custom' ? customSubject : selectedSubject,
      testNumber,
      testDate,
      selectedClass,
      maxMarks: parsedMaxMarks,
      teacherName,
      principalName,
      students: students.map(s => ({
        roll_no: s.roll_no,
        student_name: s.student_name,
        image: s.image,
        marks: s.marks,
        isAbsent: s.isAbsent,
        remarks: s.remarks
      }))
    };
    setJsonInput(JSON.stringify(exportData, null, 2));
    setJsonError('');
    setShowJsonModal(true);
  };

  const handleApplyJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (parsed.schoolName) setSchoolName(parsed.schoolName);
      if (parsed.schoolSubtitle) setSchoolSubtitle(parsed.schoolSubtitle);
      if (parsed.testTitle) setTestTitle(parsed.testTitle);
      if (parsed.subject) {
        const found = SUBJECT_OPTIONS.find(s => s.name.toLowerCase() === parsed.subject.toLowerCase());
        if (found) setSelectedSubject(found.name);
        else {
          setSelectedSubject('custom');
          setCustomSubject(parsed.subject);
        }
      }
      if (parsed.testNumber) setTestNumber(String(parsed.testNumber));
      if (parsed.testDate) setTestDate(parsed.testDate);
      if (parsed.selectedClass) setSelectedClass(parsed.selectedClass);
      if (parsed.maxMarks) setMaxMarks(Number(parsed.maxMarks));
      if (parsed.teacherName) setTeacherName(parsed.teacherName);
      if (parsed.principalName) setPrincipalName(parsed.principalName);

      if (Array.isArray(parsed.students)) {
        const formatted = parsed.students.map((s, idx) => ({
          id: `stu_imported_${idx}_${Date.now()}`,
          roll_no: s.roll_no || (idx + 1),
          student_name: (s.student_name || `Student ${idx + 1}`).trim().toUpperCase(),
          image: s.image || '',
          marks: s.marks !== undefined && s.marks !== null ? s.marks : '',
          isAbsent: !!s.isAbsent,
          remarks: s.remarks || ''
        }));
        setStudents(formatted);
      }

      setShowJsonModal(false);
      alert('JSON data successfully applied!');
    } catch (err) {
      setJsonError('Invalid JSON format: ' + err.message);
    }
  };

  const handleLoadSampleJson = () => {
    const sample = {
      schoolName: "SHREE JAGDAMBA CONVENT SCHOOL",
      schoolSubtitle: "DHADHERU GODARAN, CHURU (RAJ.) • AFFILIATED TO RBSE",
      testTitle: "WEEKLY TEST: MATHEMATICS – TEST #1",
      subject: "Mathematics",
      testNumber: "1",
      testDate: "2026-08-16",
      selectedClass: 1,
      maxMarks: 20,
      teacherName: "Mrs. Renu",
      principalName: "Mr. Chandan Singh",
      students: [
        { roll_no: 1, student_name: "BHANU PRATAP SINGH", image: "class_1/class-1-bhanu-pratap-singh.jpg", marks: "", isAbsent: false, remarks: "Nice Attempt!" },
        { roll_no: 2, student_name: "DIVYA SIDH", image: "class_1/class-1-divya-sidh.jpg", marks: "", isAbsent: false, remarks: "" },
        { roll_no: 3, student_name: "ISHITA KANWAR", image: "class_1/class-1-ishita-kanwar.jpg", marks: "", isAbsent: false, remarks: "" },
        { roll_no: 4, student_name: "KARMVEER SINGH", image: "class_1/class-1-karmveer-singh.jpg", marks: "", isAbsent: false, remarks: "" },
        { roll_no: 5, student_name: "MAGHARAM BHADU", image: "class_1/class-1-magharam-bhadu.jpg", marks: "", isAbsent: false, remarks: "" },
        { roll_no: 6, student_name: "MANAV SUTHAR", image: "class_1/class-1-manav-suthar.jpg", marks: "", isAbsent: false, remarks: "" },
        { roll_no: 7, student_name: "MURALIDHAR JAT", image: "class_1/class-1-muralidhar-jat.jpg", marks: "", isAbsent: false, remarks: "" },
        { roll_no: 8, student_name: "NARESH", image: "class_1/class-1-naresh.jpg", marks: "", isAbsent: false, remarks: "" },
        { roll_no: 9, student_name: "PALVIT", image: "class_1/class-1-palvit.jpg", marks: "", isAbsent: false, remarks: "" }
      ]
    };
    setJsonInput(JSON.stringify(sample, null, 2));
  };

  const handleDownloadJson = () => {
    const blob = new Blob([jsonInput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weekly_test_${selectedSubject.toLowerCase()}_class${selectedClass}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Excel Paste Parser (Supports: Roll No | Student Name | Marks | Remarks)
  const handleApplyExcel = () => {
    if (!excelPasteText.trim()) return;
    const lines = excelPasteText.trim().split('\n');
    const parsedStudents = [];

    lines.forEach((line, idx) => {
      const parts = line.split('\t').map(p => p.trim());
      if (parts.length === 0 || !parts[0]) return;

      const isFirstRoll = !isNaN(Number(parts[0]));
      const roll_no = isFirstRoll ? Number(parts[0]) : idx + 1;
      const student_name = isFirstRoll ? (parts[1] || `Student ${idx + 1}`) : parts[0];
      const rawMarks = isFirstRoll ? parts[2] : parts[1];
      const isAbs = String(rawMarks).toUpperCase().includes('AB') || String(rawMarks).toUpperCase() === 'A';
      const marksVal = (!isAbs && rawMarks !== undefined && rawMarks !== '' && !isNaN(Number(rawMarks))) ? Number(rawMarks) : '';
      const remarks = isFirstRoll ? (parts[3] || '') : (parts[2] || '');

      parsedStudents.push({
        id: `stu_excel_${idx}_${Date.now()}`,
        roll_no,
        student_name: student_name.toUpperCase(),
        image: '',
        marks: marksVal,
        isAbsent: isAbs,
        remarks: isAbs ? 'Absent' : remarks
      });
    });

    if (parsedStudents.length > 0) {
      setStudents(parsedStudents);
      setShowExcelModal(false);
      setExcelPasteText('');
      alert(`Imported ${parsedStudents.length} students from Excel!`);
    } else {
      alert('Could not parse any valid student lines. Please copy columns from Excel / Google Sheets and paste.');
    }
  };

  // Filtered Students for table search
  const filteredStudents = useMemo(() => {
    if (!searchQuery) return studentResults;
    const q = searchQuery.toLowerCase();
    return studentResults.filter(s => 
      s.student_name.toLowerCase().includes(q) ||
      String(s.roll_no).includes(q) ||
      (s.remarks || '').toLowerCase().includes(q)
    );
  }, [studentResults, searchQuery]);

  return (
    <div className="wt-app-container">
      {/* ----------------- TOP NAVBAR ----------------- */}
      <header className="wt-top-bar no-print">
        <div className="wt-brand">
          <img src="/images/logo.png" alt="Logo" className="wt-brand-logo" />
          <div>
            <h1 className="wt-brand-title">Weekly Test PDF Generator</h1>
            <p className="wt-brand-subtitle">Shree Jagdamba Convent School • Printable A4 Test Cards (3×3 Grid)</p>
          </div>
        </div>

        <div className="wt-top-actions">
          <button 
            className="wt-btn wt-btn-light" 
            onClick={() => setActiveTab(activeTab === 'edit' ? 'preview' : 'edit')}
            title="Toggle between Edit and Preview mode"
          >
            <i className={`fas ${activeTab === 'edit' ? 'fa-eye' : 'fa-edit'}`}></i>
            <span>{activeTab === 'edit' ? 'Preview A4 Cards' : 'Edit Mode'}</span>
          </button>

          <button 
            className="wt-btn wt-btn-light" 
            onClick={handleOpenJsonModal}
            title="Import or Export JSON data"
          >
            <i className="fas fa-code"></i>
            <span>JSON Tool</span>
          </button>

          <button 
            className="wt-btn wt-btn-light" 
            onClick={() => setShowExcelModal(true)}
            title="Paste tab-separated columns from Excel"
          >
            <i className="fas fa-file-excel"></i>
            <span>Excel Paste</span>
          </button>

          {/* Direct High-Fidelity Download PDF Button */}
          <button 
            className="wt-btn wt-btn-download" 
            onClick={handleDownloadPdfFile}
            disabled={downloadingPdf}
            title="Directly Download Multi-Page PDF File"
          >
            <i className={`fas ${downloadingPdf ? 'fa-spinner fa-spin' : 'fa-download'}`}></i>
            <span>{downloadingPdf ? 'Downloading PDF...' : 'Download PDF'}</span>
          </button>

          {/* Browser Print / Save PDF */}
          <button 
            className="wt-btn wt-btn-primary" 
            onClick={() => window.print()}
            title="Print or Save as PDF via Browser"
          >
            <i className="fas fa-print"></i>
            <span>Print PDF</span>
          </button>

          <Link to="/admin/dashboard" className="wt-btn wt-btn-light wt-btn-sm" title="Back to Admin Dashboard">
            <i className="fas fa-arrow-left"></i>
            <span>Admin</span>
          </Link>
        </div>
      </header>

      {/* ----------------- SCREEN EDIT VIEW ----------------- */}
      <div className="wt-layout-wrapper no-print" style={{ display: activeTab === 'preview' ? 'none' : 'block' }}>

        {/* 1. TEST CONFIGURATION CARD */}
        <div className="wt-config-card">
          <div className="wt-card-header">
            <h2 className="wt-card-title">
              <i className="fas fa-sliders-h"></i> Weekly Test Details & Settings (टेस्ट विवरण)
            </h2>
            <span className="wt-badge wt-badge-grade">A4 Portrait 3×3 Grid</span>
          </div>

          <div className="wt-form-grid" style={{ marginBottom: '14px' }}>
            <div className="wt-form-group">
              <label className="wt-form-label">School Name (विद्यालय का नाम)</label>
              <input 
                type="text" 
                className="wt-input" 
                value={schoolName} 
                onChange={e => setSchoolName(e.target.value)} 
              />
            </div>

            <div className="wt-form-group">
              <label className="wt-form-label">School Subtitle / Address</label>
              <input 
                type="text" 
                className="wt-input" 
                value={schoolSubtitle} 
                onChange={e => setSchoolSubtitle(e.target.value)} 
              />
            </div>
          </div>

          {/* Subject Selector Pills */}
          <div style={{ marginBottom: '18px' }}>
            <label className="wt-form-label" style={{ marginBottom: '8px', display: 'block' }}>
              Select Subject (विषय चुनें):
            </label>
            <div className="wt-pills-row">
              {SUBJECT_OPTIONS.map(sub => (
                <button
                  key={sub.id}
                  type="button"
                  className={`wt-pill-btn ${selectedSubject === sub.name ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedSubject(sub.name);
                    setCustomSubject('');
                  }}
                >
                  <i className="fas fa-book"></i> {sub.name} <span style={{ opacity: 0.8, fontSize: '0.8rem' }}>({sub.hindiName})</span>
                </button>
              ))}
              <button
                type="button"
                className={`wt-pill-btn ${selectedSubject === 'custom' ? 'active' : ''}`}
                onClick={() => setSelectedSubject('custom')}
              >
                <i className="fas fa-pen"></i> Other / Custom Subject
              </button>
            </div>

            {selectedSubject === 'custom' && (
              <div style={{ marginTop: '10px', maxWidth: '350px' }}>
                <input 
                  type="text" 
                  className="wt-input" 
                  placeholder="Enter Custom Subject Name (e.g. Sanskrit / GK)"
                  value={customSubject}
                  onChange={e => setCustomSubject(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="wt-form-grid">
            <div className="wt-form-group">
              <label className="wt-form-label">Class (कक्षा चुनें)</label>
              <div className="wt-pills-row">
                {[1, 2, 3, 4, 5].map(cNum => (
                  <button
                    key={cNum}
                    type="button"
                    className={`wt-pill-btn ${selectedClass === cNum ? 'active' : ''}`}
                    onClick={() => handleSelectClass(cNum)}
                  >
                    Class {cNum}
                  </button>
                ))}
              </div>
            </div>

            <div className="wt-form-group">
              <label className="wt-form-label">Test # / Number</label>
              <input 
                type="text" 
                className="wt-input" 
                value={testNumber} 
                onChange={e => setTestNumber(e.target.value)} 
                placeholder="1, 2, 3..."
              />
            </div>

            <div className="wt-form-group">
              <label className="wt-form-label">Max Marks (कुल पूर्णांक)</label>
              <input 
                type="number" 
                className="wt-input" 
                value={maxMarks} 
                onChange={e => setMaxMarks(Number(e.target.value))} 
                min={1}
              />
            </div>

            <div className="wt-form-group">
              <label className="wt-form-label">Test Date</label>
              <input 
                type="date" 
                className="wt-input" 
                value={testDate} 
                onChange={e => setTestDate(e.target.value)} 
              />
            </div>

            <div className="wt-form-group">
              <label className="wt-form-label">Subject / Class Teacher</label>
              <input 
                type="text" 
                className="wt-input" 
                value={teacherName} 
                onChange={e => setTeacherName(e.target.value)} 
              />
            </div>

            <div className="wt-form-group">
              <label className="wt-form-label">Principal Name</label>
              <input 
                type="text" 
                className="wt-input" 
                value={principalName} 
                onChange={e => setPrincipalName(e.target.value)} 
              />
            </div>

            <div className="wt-form-group">
              <label className="wt-form-label">Cards Per A4 Page (3×3 Grid = 9 Cards)</label>
              <select 
                className="wt-select"
                value={cardsPerPage}
                onChange={e => setCardsPerPage(Number(e.target.value))}
              >
                <option value={9}>9 Cards / Page (3 Columns × 3 Rows - Exact Mockup)</option>
                <option value={6}>6 Cards / Page (3 Columns × 2 Rows - Extra Large)</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: '16px', display: 'flex', gap: '20px', flexWrap: 'wrap', borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 600 }}>
              <input 
                type="checkbox" 
                checked={showRemarks} 
                onChange={e => setShowRemarks(e.target.checked)} 
              />
              <span>Show Student Remarks (e.g. Nice Attempt!)</span>
            </label>
          </div>
        </div>

        {/* 2. STATS ANALYTICS BAR */}
        <div className="wt-stats-bar">
          <div className="wt-stat-card">
            <div className="wt-stat-icon" style={{ background: '#eff6ff', color: '#1e3a8a' }}>
              <i className="fas fa-users"></i>
            </div>
            <div>
              <div className="wt-stat-val">{summaryStats.total}</div>
              <div className="wt-stat-lbl">Total Students</div>
            </div>
          </div>

          <div className="wt-stat-card">
            <div className="wt-stat-icon" style={{ background: '#dcfce7', color: '#16a34a' }}>
              <i className="fas fa-user-check"></i>
            </div>
            <div>
              <div className="wt-stat-val">{summaryStats.appeared}</div>
              <div className="wt-stat-lbl">Appeared (Present)</div>
            </div>
          </div>

          <div className="wt-stat-card">
            <div className="wt-stat-icon" style={{ background: '#fef3c7', color: '#b45309' }}>
              <i className="fas fa-user-times"></i>
            </div>
            <div>
              <div className="wt-stat-val">{summaryStats.absent}</div>
              <div className="wt-stat-lbl">Absent Students</div>
            </div>
          </div>

          <div className="wt-stat-card">
            <div className="wt-stat-icon" style={{ background: '#fefce8', color: '#ca8a04' }}>
              <i className="fas fa-trophy"></i>
            </div>
            <div>
              <div className="wt-stat-val" style={{ fontSize: '1.05rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '170px' }} title={summaryStats.highestScorer}>
                {summaryStats.highest} / {parsedMaxMarks}
              </div>
              <div className="wt-stat-lbl">Highest Marks</div>
            </div>
          </div>

          <div className="wt-stat-card">
            <div className="wt-stat-icon" style={{ background: '#f1f5f9', color: '#475569' }}>
              <i className="fas fa-chart-line"></i>
            </div>
            <div>
              <div className="wt-stat-val">{summaryStats.avg}</div>
              <div className="wt-stat-lbl">Class Average</div>
            </div>
          </div>
        </div>

        {/* 3. INTERACTIVE STUDENT TABLE CARD */}
        <div className="wt-table-card">
          <div className="wt-table-toolbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#1e3a8a' }}>
                Class {selectedClass} • {activeSubjectName} Marks Entry
              </h3>
              <div className="wt-table-search">
                <i className="fas fa-search" style={{ color: '#94a3b8' }}></i>
                <input 
                  type="text" 
                  placeholder="Search student, roll no..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Quick Fill */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <input 
                  type="number" 
                  placeholder="Marks" 
                  value={quickFillVal}
                  onChange={e => setQuickFillVal(e.target.value)}
                  style={{ width: '70px', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
                <button type="button" className="wt-btn wt-btn-secondary wt-btn-sm" onClick={handleQuickFill}>
                  Quick Fill All
                </button>
              </div>

              <button type="button" className="wt-btn wt-btn-success wt-btn-sm" onClick={handleAddStudent}>
                <i className="fas fa-user-plus"></i> Add Student
              </button>

              <button type="button" className="wt-btn wt-btn-outline-danger wt-btn-sm" onClick={handleClearAllMarks}>
                <i className="fas fa-eraser"></i> Clear Marks
              </button>
            </div>
          </div>

          <div className="wt-table-scroll">
            <table className="wt-edit-table">
              <thead>
                <tr>
                  <th style={{ width: '65px' }}>Roll No</th>
                  <th style={{ width: '75px' }}>Photo</th>
                  <th style={{ minWidth: '220px' }}>Student Name</th>
                  <th style={{ width: '85px', textAlign: 'center' }}>Absent?</th>
                  <th style={{ textAlign: 'center', width: '130px' }}>
                    Marks Obtained <br />
                    <span style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'none' }}>(Max: {parsedMaxMarks})</span>
                  </th>
                  <th style={{ textAlign: 'center', width: '100px' }}>Max Marks</th>
                  {showRemarks && <th style={{ minWidth: '160px' }}>Remarks</th>}
                  <th style={{ width: '50px', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {loadingStudents ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                      <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i> Loading class students...
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                      No students found. Click "Add Student" or select a Class preset.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((stu) => (
                    <tr key={stu.id} style={{ background: stu.isAbsent ? '#fffbeb' : '' }}>
                      {/* Roll No */}
                      <td>
                        <input 
                          type="number" 
                          className="wt-input-inline" 
                          style={{ width: '55px', textAlign: 'center', fontWeight: 800 }}
                          value={stu.roll_no}
                          onChange={e => handleStudentFieldChange(stu.id, 'roll_no', e.target.value)}
                        />
                      </td>

                      {/* Photo Thumbnail */}
                      <td>
                        <img 
                          src={stu.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(stu.student_name)}&background=1e3a8a&color=fff&size=200&bold=true`} 
                          alt={stu.student_name}
                          className="wt-stu-avatar-screen"
                          onError={(e) => { 
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(stu.student_name)}&background=1e3a8a&color=fff&size=200&bold=true`; 
                          }}
                        />
                      </td>

                      {/* Student Name */}
                      <td>
                        <input 
                          type="text" 
                          className="wt-input-inline" 
                          value={stu.student_name}
                          onChange={e => handleStudentFieldChange(stu.id, 'student_name', e.target.value.toUpperCase())}
                          placeholder="Student Name"
                          style={{ fontWeight: 700 }}
                        />
                      </td>

                      {/* Absent Toggle */}
                      <td style={{ textAlign: 'center' }}>
                        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                          <input 
                            type="checkbox" 
                            checked={stu.isAbsent}
                            onChange={() => handleToggleAbsent(stu.id)}
                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                            title="Mark Student as Absent"
                          />
                          {stu.isAbsent && <span style={{ color: '#b45309', fontWeight: 800, fontSize: '0.75rem' }}>ABS</span>}
                        </label>
                      </td>

                      {/* Single Subject Marks Input */}
                      <td style={{ textAlign: 'center' }}>
                        <input 
                          type="number" 
                          className="wt-input-inline wt-mark-input"
                          value={stu.isAbsent ? '' : (stu.marks ?? '')}
                          disabled={stu.isAbsent}
                          placeholder={stu.isAbsent ? 'ABSENT' : `0-${parsedMaxMarks}`}
                          onChange={e => handleMarkChange(stu.id, e.target.value)}
                          max={parsedMaxMarks}
                          min={0}
                        />
                      </td>

                      {/* Max Marks */}
                      <td style={{ textAlign: 'center', fontWeight: 700, color: '#475569' }}>
                        {parsedMaxMarks}
                      </td>

                      {/* Remarks */}
                      {showRemarks && (
                        <td>
                          <input 
                            type="text" 
                            className="wt-input-inline" 
                            value={stu.remarks || ''}
                            placeholder="e.g. Nice Attempt!"
                            onChange={e => handleStudentFieldChange(stu.id, 'remarks', e.target.value)}
                          />
                        </td>
                      )}

                      {/* Delete Action */}
                      <td style={{ textAlign: 'center' }}>
                        <button 
                          type="button" 
                          className="wt-btn-icon" 
                          onClick={() => handleDeleteStudent(stu.id)}
                          title="Delete student"
                        >
                          <i className="fas fa-trash-alt" style={{ color: '#ef4444' }}></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ----------------- EXACT A4 PORTRAIT PRINT & PREVIEW SECTION ----------------- */}
      <div className="wt-print-preview-container" id="printable-test-area">
        
        {paginatedStudents.map((pageStudents, pageIdx) => (
          <div key={`page_${pageIdx}`} className="wt-a4-page">
            
            {/* Header matching screenshot */}
            <div className="wt-doc-header">
              <div className="wt-header-top">
                <div className="wt-header-logo-box">
                  <img src="/images/logo.png" alt="School Logo" className="wt-header-logo-img" />
                </div>
                <div className="wt-header-center">
                  <h1 className="wt-doc-school-name">{schoolName}</h1>
                  <p className="wt-doc-school-sub">{schoolSubtitle}</p>
                </div>
                <div className="wt-header-logo-box">
                  <img src="/images/logo.png" alt="School Seal" className="wt-header-logo-img" />
                </div>
              </div>

              {/* Banner with Diamond Accents */}
              <div className="wt-banner-wrapper">
                <span className="wt-banner-diamond">◆</span>
                <div className="wt-doc-test-banner">{testTitle}</div>
                <span className="wt-banner-diamond">◆</span>
              </div>

              {/* Metadata Rounded Box */}
              <div className="wt-doc-meta-strip">
                <div className="wt-meta-item">
                  <i className="fas fa-book wt-meta-icon"></i>
                  <span className="wt-meta-lbl">SUBJECT:</span>
                  <span className="wt-meta-val">{activeSubjectName}</span>
                </div>
                <div className="wt-meta-item">
                  <i className="fas fa-users wt-meta-icon"></i>
                  <span className="wt-meta-lbl">CLASS:</span>
                  <span className="wt-meta-val">Class {selectedClass}</span>
                </div>
                <div className="wt-meta-item">
                  <i className="fas fa-calendar-alt wt-meta-icon"></i>
                  <span className="wt-meta-lbl">DATE:</span>
                  <span className="wt-meta-val">{testDate}</span>
                </div>
                <div className="wt-meta-item">
                  <i className="fas fa-star wt-meta-icon"></i>
                  <span className="wt-meta-lbl">MAX MARKS:</span>
                  <span className="wt-meta-val">{parsedMaxMarks}</span>
                </div>
              </div>

              {/* Center Dot Divider */}
              <div className="wt-header-divider-dot">
                <div className="wt-dot-line"></div>
                <div className="wt-center-dot"></div>
                <div className="wt-dot-line"></div>
              </div>
            </div>

            {/* EXACT 3x3 CARDS GRID (9 CARDS) */}
            <div className="wt-cards-grid">
              {pageStudents.map((stu) => (
                <div key={stu.id} className={`wt-screenshot-card ${stu.isAbsent ? 'absent' : ''}`}>
                  
                  {/* Top-Left Roll Badge Ribbon */}
                  <div className="wt-card-roll-ribbon-container">
                    <span className="wt-card-roll-ribbon">
                      ROLL {String(stu.roll_no).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Big Square Student Photo */}
                  <div className="wt-card-photo-square">
                    <img 
                      src={stu.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(stu.student_name)}&background=1e3a8a&color=fff&size=200&bold=true`} 
                      alt={stu.student_name}
                      className="wt-photo-img-square"
                      onError={(e) => { 
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(stu.student_name)}&background=1e3a8a&color=fff&size=200&bold=true`; 
                      }}
                    />
                  </div>

                  {/* Student Name */}
                  <h3 className="wt-card-name-title" title={stu.student_name}>
                    {stu.student_name}
                  </h3>

                  {/* Gold Star Divider Line */}
                  <div className="wt-star-divider">
                    <div className="wt-star-line"></div>
                    <i className="fas fa-star wt-star-icon"></i>
                    <div className="wt-star-line"></div>
                  </div>

                  {/* Marks Box with Clipboard Icon */}
                  {stu.isAbsent ? (
                    <div className="wt-card-marks-pill-box absent-pill">
                      <i className="fas fa-clipboard-list wt-marks-icon"></i>
                      <span className="wt-marks-text">ABSENT</span>
                    </div>
                  ) : (
                    <div className="wt-card-marks-pill-box">
                      <i className="fas fa-clipboard-list wt-marks-icon"></i>
                      <span className="wt-marks-text">
                        MARKS: <span className="wt-marks-score-num">{stu.hasMarks ? stu.marks : '___'}</span> <span className="wt-marks-max-num">/ {parsedMaxMarks}</span>
                      </span>
                    </div>
                  )}

                  {/* Optional Remarks Note */}
                  {showRemarks && stu.remarks && (
                    <span className="wt-card-bottom-remark" title={stu.remarks}>
                      {stu.remarks}
                    </span>
                  )}

                </div>
              ))}
            </div>

          </div>
        ))}

      </div>

      {/* ----------------- JSON IMPORT / EXPORT MODAL ----------------- */}
      {showJsonModal && (
        <div className="wt-modal-overlay no-print" onClick={() => setShowJsonModal(false)}>
          <div className="wt-modal-box" onClick={e => e.stopPropagation()}>
            <div className="wt-modal-header">
              <h3 className="wt-modal-title">
                <i className="fas fa-code"></i> Direct JSON Import / Export
              </h3>
              <button 
                onClick={() => setShowJsonModal(false)}
                style={{ border: 'none', background: 'none', color: '#ffffff', fontSize: '1.4rem', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            <div className="wt-modal-body">
              <p style={{ fontSize: '0.88rem', color: '#475569', marginBottom: '12px' }}>
                Yaha direct JSON paste karke <strong>"Apply JSON Data"</strong> par click karein, ya current test data ko copy/download karein:
              </p>

              {jsonError && (
                <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px 14px', borderRadius: '8px', marginBottom: '12px', fontSize: '0.85rem' }}>
                  <i className="fas fa-exclamation-triangle" style={{ marginRight: '6px' }}></i>
                  {jsonError}
                </div>
              )}

              <textarea 
                className="wt-code-editor"
                value={jsonInput}
                onChange={e => setJsonInput(e.target.value)}
                placeholder="Paste JSON here..."
              />

              <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                <button type="button" className="wt-btn wt-btn-secondary wt-btn-sm" onClick={handleLoadSampleJson}>
                  <i className="fas fa-file-code"></i> Load Sample JSON
                </button>
                <button 
                  type="button" 
                  className="wt-btn wt-btn-secondary wt-btn-sm" 
                  onClick={() => {
                    navigator.clipboard.writeText(jsonInput);
                    alert('JSON copied to clipboard!');
                  }}
                >
                  <i className="fas fa-copy"></i> Copy JSON
                </button>
                <button type="button" className="wt-btn wt-btn-secondary wt-btn-sm" onClick={handleDownloadJson}>
                  <i className="fas fa-download"></i> Download .json File
                </button>
              </div>
            </div>

            <div className="wt-modal-footer">
              <button className="wt-btn wt-btn-secondary" onClick={() => setShowJsonModal(false)}>
                Cancel
              </button>
              <button className="wt-btn wt-btn-primary" onClick={handleApplyJson}>
                <i className="fas fa-check"></i> Apply JSON Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- EXCEL / TSV IMPORT MODAL ----------------- */}
      {showExcelModal && (
        <div className="wt-modal-overlay no-print" onClick={() => setShowExcelModal(false)}>
          <div className="wt-modal-box" onClick={e => e.stopPropagation()}>
            <div className="wt-modal-header">
              <h3 className="wt-modal-title">
                <i className="fas fa-file-excel"></i> Quick Import from Excel / Google Sheets
              </h3>
              <button 
                onClick={() => setShowExcelModal(false)}
                style={{ border: 'none', background: 'none', color: '#ffffff', fontSize: '1.4rem', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            <div className="wt-modal-body">
              <p style={{ fontSize: '0.88rem', color: '#475569', marginBottom: '8px' }}>
                Excel ya Google Sheets mai se columns (e.g. <code>Roll No</code> | <code>Student Name</code> | <code>Marks</code> | <code>Remarks (Optional)</code>) copy karke yaha paste karein:
              </p>

              <textarea 
                className="wt-code-editor"
                style={{ background: '#f8fafc', color: '#0f172a', border: '1px solid #cbd5e1' }}
                value={excelPasteText}
                onChange={e => setExcelPasteText(e.target.value)}
                placeholder={"1\tBHANU PRATAP SINGH\t19\tNice Attempt!\n2\tDIVYA SIDH\t18\t\n3\tISHITA KANWAR\tABS\tAbsent"}
              />
            </div>

            <div className="wt-modal-footer">
              <button className="wt-btn wt-btn-secondary" onClick={() => setShowExcelModal(false)}>
                Cancel
              </button>
              <button className="wt-btn wt-btn-primary" onClick={handleApplyExcel}>
                <i className="fas fa-file-import"></i> Import Students from Excel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
