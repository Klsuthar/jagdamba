import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';

// Subjects setup matching official school report card
const SUBJECTS = [
  {
    name: 'Hindi',
    t1Max: 10,
    t2Max: 10,
    t3Max: 10,
    hyWrittenMax: 50,
    hyOralMax: 20,
    hyTotalMax: 70,
    yrWrittenMax: 60,
    yrOralMax: 40,
    yrTotalMax: 100,
    totalMax: 200
  },
  {
    name: 'English',
    t1Max: 5,
    t2Max: 5,
    t3Max: 5,
    hyWrittenMax: 25,
    hyOralMax: 10,
    hyTotalMax: 35,
    yrWrittenMax: 30,
    yrOralMax: 20,
    yrTotalMax: 50,
    totalMax: 100
  },
  {
    name: 'Mathematics',
    t1Max: 10,
    t2Max: 10,
    t3Max: 10,
    hyWrittenMax: 50,
    hyOralMax: 20,
    hyTotalMax: 70,
    yrWrittenMax: 60,
    yrOralMax: 40,
    yrTotalMax: 100,
    totalMax: 200
  },
  {
    name: 'EVS',
    t1Max: 10,
    t2Max: 10,
    t3Max: 10,
    hyWrittenMax: 50,
    hyOralMax: 20,
    hyTotalMax: 70,
    yrWrittenMax: 60,
    yrOralMax: 40,
    yrTotalMax: 100,
    totalMax: 200
  }
];

function generateMarks(rollNo, studentName) {
  const seed = (rollNo * 19 + studentName.charCodeAt(0) * 13) % 100;
  // Performance level: 68% to 96%
  const factor = 0.70 + (seed % 26) / 100;

  let totalObtained = 0;
  const subjectsData = SUBJECTS.map((sub, idx) => {
    const subVar = factor + ((idx * 7) % 11 - 5) / 100;
    const clampedVar = Math.min(0.98, Math.max(0.60, subVar));

    const t1 = Math.round(sub.t1Max * clampedVar);
    const t2 = Math.round(sub.t2Max * clampedVar);
    const t3 = Math.round(sub.t3Max * clampedVar);

    const hyW = Math.round(sub.hyWrittenMax * clampedVar);
    const hyO = Math.round(sub.hyOralMax * clampedVar);
    const hyT = hyW + hyO;

    const yrW = Math.round(sub.yrWrittenMax * clampedVar);
    const yrO = Math.round(sub.yrOralMax * clampedVar);
    const yrT = yrW + yrO;

    const subTotal = t1 + t2 + t3 + hyT + yrT;
    totalObtained += subTotal;

    return {
      name: sub.name,
      t1,
      t1Max: sub.t1Max,
      t2,
      t2Max: sub.t2Max,
      t3,
      t3Max: sub.t3Max,
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

  const maxMarks = 700;
  const percentage = parseFloat(((totalObtained / maxMarks) * 100).toFixed(2));
  let grade = 'A+';
  let remark = 'Outstanding';
  if (percentage >= 90) { grade = 'A+'; remark = 'Outstanding'; }
  else if (percentage >= 75) { grade = 'A'; remark = 'Excellent'; }
  else if (percentage >= 60) { grade = 'B'; remark = 'Very Good'; }
  else if (percentage >= 45) { grade = 'C'; remark = 'Good'; }
  else if (percentage >= 33) { grade = 'D'; remark = 'Needs Work'; }
  else { grade = 'F'; remark = 'Fail'; }

  const attendance = `${92 + ((rollNo * 3) % 8)}%`;

  return {
    subjectsData,
    totalObtained,
    maxMarks,
    percentage,
    grade,
    remark,
    attendance
  };
}

// Generate full Excel Workbook and update JSON
const wb = XLSX.utils.book_new();
const allStudentsFlat = [];

for (let c = 1; c <= 5; c++) {
  const jsonPath = path.resolve(`public/json/class${c}/class${c}_students.json`);
  const rawList = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  // Extract student rows with empty mark cells ready for real data entry
  const sheetRows = rawList.map((item) => {
    const roll = Number(item.roll_no) || 1;
    const name = item.student_name || 'Student';
    return {
      'Roll No': roll,
      'Student Name': name,
      'Class': `Class ${c}`,
      'Father Name': item.father_name || '',
      'Mother Name': item.mother_name || '',
      'Session': '2026-27',
      'Attendance': '',
      'Hindi (Test 1 /10)': '',
      'Hindi (Test 2 /10)': '',
      'Hindi (Test 3 /10)': '',
      'Hindi HY Written (/50)': '',
      'Hindi HY Oral (/20)': '',
      'Hindi HY Total (/70)': '',
      'Hindi Yearly Written (/60)': '',
      'Hindi Yearly Oral (/40)': '',
      'Hindi Yearly Total (/100)': '',
      'English (Test 1 /5)': '',
      'English (Test 2 /5)': '',
      'English (Test 3 /5)': '',
      'English HY Written (/25)': '',
      'English HY Oral (/10)': '',
      'English HY Total (/35)': '',
      'English Yearly Written (/30)': '',
      'English Yearly Oral (/20)': '',
      'English Yearly Total (/50)': '',
      'Maths (Test 1 /10)': '',
      'Maths (Test 2 /10)': '',
      'Maths (Test 3 /10)': '',
      'Maths HY Written (/50)': '',
      'Maths HY Oral (/20)': '',
      'Maths HY Total (/70)': '',
      'Maths Yearly Written (/60)': '',
      'Maths Yearly Oral (/40)': '',
      'Maths Yearly Total (/100)': '',
      'EVS (Test 1 /10)': '',
      'EVS (Test 2 /10)': '',
      'EVS (Test 3 /10)': '',
      'EVS HY Written (/50)': '',
      'EVS HY Oral (/20)': '',
      'EVS HY Total (/70)': '',
      'EVS Yearly Written (/60)': '',
      'EVS Yearly Oral (/40)': '',
      'EVS Yearly Total (/100)': '',
      'Total Marks Obtained': '',
      'Max Marks': 700,
      'Percentage %': '',
      'Grade': '',
      'Rank in Class': '',
      'Teacher Remark': ''
    };
  });

  const ws = XLSX.utils.json_to_sheet(sheetRows);
  XLSX.utils.book_append_sheet(wb, ws, `Class ${c}`);
  allStudentsFlat.push(...sheetRows);
}

// Append All Students Master Sheet
const wsAll = XLSX.utils.json_to_sheet(allStudentsFlat);
XLSX.utils.book_append_sheet(wb, wsAll, 'All Students Master');

// Write out Excel file
const excelPath = path.resolve('public/data/Student_List_All_Classes.xlsx');
XLSX.writeFile(wb, excelPath);
console.log('Successfully generated updated Excel with Session 2026-27 data at:', excelPath);
