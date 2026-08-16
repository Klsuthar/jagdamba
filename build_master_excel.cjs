const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const BASE_DIR = __dirname;
const PUBLIC_JSON_DIR = path.join(BASE_DIR, 'public', 'json');
const PUBLIC_DATA_DIR = path.join(BASE_DIR, 'public', 'data');
const ROOT_EXCEL_PATH = path.join(BASE_DIR, 'Student_List_All_Classes.xlsx');
const PUBLIC_EXCEL_PATH = path.join(PUBLIC_DATA_DIR, 'Student_List_All_Classes.xlsx');

if (!fs.existsSync(PUBLIC_DATA_DIR)) {
  fs.mkdirSync(PUBLIC_DATA_DIR, { recursive: true });
}

function safeReadJson(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8').trim();
      if (content && content !== '[]' && content !== '{}') {
        return JSON.parse(content);
      }
    }
  } catch (err) {
    console.warn('Could not read json:', filePath, err.message);
  }
  return null;
}

const wb = XLSX.utils.book_new();

for (let classNum = 1; classNum <= 5; classNum++) {
  const classKey = `class${classNum}`;
  const classDir = path.join(PUBLIC_JSON_DIR, classKey);

  // Read student roster
  let students = safeReadJson(path.join(classDir, `class${classNum}_students.json`));
  if (!students || !Array.isArray(students) || students.length === 0) {
    // Default roster if empty
    students = [
      { roll_no: 1, student_name: 'AAKASH KUMAR', father_name: 'RAMESH KUMAR', mother_name: 'SUNITA DEVI', dob: '10-05-2018', image: `class_${classNum}/01_class${classNum}.webp` },
      { roll_no: 2, student_name: 'BHAWNA', father_name: 'SURESH SHARMA', mother_name: 'SARITA DEVI', dob: '15-08-2018', image: `class_${classNum}/02_class${classNum}.webp` },
      { roll_no: 3, student_name: 'CHETAN', father_name: 'MAHESH VERMA', mother_name: 'KAVITA', dob: '20-12-2017', image: `class_${classNum}/03_class${classNum}.webp` },
      { roll_no: 4, student_name: 'DIVYA', father_name: 'RAKESH SUTHAR', mother_name: 'SUMAN', dob: '04-03-2019', image: `class_${classNum}/04_class${classNum}.webp` },
      { roll_no: 5, student_name: 'HARSH', father_name: 'VIKRAM SINGH', mother_name: 'MUKESH KANWAR', dob: '11-11-2018', image: `class_${classNum}/05_class${classNum}.webp` }
    ];
  }

  // Read attendance
  const attendanceList = safeReadJson(path.join(classDir, 'attendance.json')) || [];
  const attendanceMap = {};
  if (Array.isArray(attendanceList)) {
    attendanceList.forEach(item => {
      if (item.roll_no || item.student_id) {
        const roll = String(item.roll_no || '').replace(/\D/g, '');
        attendanceMap[roll] = item.attendance || item.present_days || '';
      }
    });
  }

  // Read exam files
  const test1 = safeReadJson(path.join(classDir, 'test1.json')) || [];
  const test2 = safeReadJson(path.join(classDir, 'test2.json')) || [];
  const halfYearly = safeReadJson(path.join(classDir, 'half_yearly.json')) || [];
  const test3 = safeReadJson(path.join(classDir, 'test3.json')) || [];
  const yearly = safeReadJson(path.join(classDir, 'yearly.json')) || [];

  const getExamRow = (list, rollNo) => {
    if (!Array.isArray(list)) return {};
    const normRoll = String(rollNo).padStart(2, '0');
    return list.find(item => String(item.roll_no).padStart(2, '0') === normRoll || item.roll_no == rollNo) || {};
  };

  const sheetData = students.map(student => {
    const rollStr = String(student.roll_no).padStart(2, '0');
    const t1 = getExamRow(test1, student.roll_no);
    const t2 = getExamRow(test2, student.roll_no);
    const hy = getExamRow(halfYearly, student.roll_no);
    const t3 = getExamRow(test3, student.roll_no);
    const yr = getExamRow(yearly, student.roll_no);

    return {
      roll_no: Number(student.roll_no) || 0,
      student_name: student.student_name || '',
      father_name: student.father_name || '',
      mother_name: student.mother_name || '',
      dob: student.dob || '',
      attendance: attendanceMap[rollStr] || student.attendance || '',
      
      // Test 1 Marks (Max 10 per subject, empty until real data entered)
      test1_hindi: t1.hindi !== undefined ? t1.hindi : '',
      test1_english: t1.english !== undefined ? t1.english : '',
      test1_maths: t1.mathematics !== undefined ? t1.mathematics : '',
      test1_evs: t1.evs !== undefined ? t1.evs : '',

      // Test 2 Marks (Max 10 per subject, empty until real data entered)
      test2_hindi: t2.hindi !== undefined ? t2.hindi : '',
      test2_english: t2.english !== undefined ? t2.english : '',
      test2_maths: t2.mathematics !== undefined ? t2.mathematics : '',
      test2_evs: t2.evs !== undefined ? t2.evs : '',

      // Half Yearly Marks (Written / Oral, empty until real data entered)
      half_yearly_hindi_written: hy.hindi_written !== undefined ? hy.hindi_written : '',
      half_yearly_hindi_oral: hy.hindi_oral !== undefined ? hy.hindi_oral : '',
      half_yearly_english_written: hy.english_written !== undefined ? hy.english_written : '',
      half_yearly_english_oral: hy.english_oral !== undefined ? hy.english_oral : '',
      half_yearly_maths_written: hy.maths_written !== undefined ? hy.maths_written : '',
      half_yearly_maths_oral: hy.maths_oral !== undefined ? hy.maths_oral : '',
      half_yearly_evs_written: hy.evs_written !== undefined ? hy.evs_written : '',
      half_yearly_evs_oral: hy.evs_oral !== undefined ? hy.evs_oral : '',

      // Test 3 Marks (Max 10 per subject, empty until real data entered)
      test3_hindi: t3.hindi !== undefined ? t3.hindi : '',
      test3_english: t3.english !== undefined ? t3.english : '',
      test3_maths: t3.mathematics !== undefined ? t3.mathematics : '',
      test3_evs: t3.evs !== undefined ? t3.evs : '',

      // Yearly Marks (Written / Oral, empty until real data entered)
      yearly_hindi_written: yr.hindi_written !== undefined ? yr.hindi_written : '',
      yearly_hindi_oral: yr.hindi_oral !== undefined ? yr.hindi_oral : '',
      yearly_english_written: yr.english_written !== undefined ? yr.english_written : '',
      yearly_english_oral: yr.english_oral !== undefined ? yr.english_oral : '',
      yearly_maths_written: yr.maths_written !== undefined ? yr.maths_written : '',
      yearly_maths_oral: yr.maths_oral !== undefined ? yr.maths_oral : '',
      yearly_evs_written: yr.evs_written !== undefined ? yr.evs_written : '',
      yearly_evs_oral: yr.evs_oral !== undefined ? yr.evs_oral : '',

      image: student.image || `class_${classNum}/${rollStr}_class${classNum}.webp`
    };
  });

  const ws = XLSX.utils.json_to_sheet(sheetData);
  XLSX.utils.book_append_sheet(wb, ws, `Class ${classNum}`);
  console.log(`Sheet Class ${classNum} generated with ${sheetData.length} students.`);
}

XLSX.writeFile(wb, PUBLIC_EXCEL_PATH);
XLSX.writeFile(wb, ROOT_EXCEL_PATH);
console.log('Master Excel File generated successfully.');
