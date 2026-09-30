import json
import openpyxl
import os

# Updated student data with exact Excel names
UPDATED_STUDENTS = {
    1: [
        {"roll_no": 1, "student_name": "BHANU PRATAP SINGH", "father_name": "SURENDRA SINGH", "mother_name": "SANJU KANWAR", "dob": "24/01/2020"},
        {"roll_no": 2, "student_name": "DIVYA SIDH", "father_name": "PARAKASH NATH MAHIYA", "mother_name": "RADHA SIDH", "dob": "01/04/2020"},
        {"roll_no": 3, "student_name": "ISHITA KANWAR", "father_name": "HIMMAT SINGH", "mother_name": "LALITA KANWAR", "dob": "19/09/2019"},
        {"roll_no": 4, "student_name": "KARMVEER SINGH RAJVI", "father_name": "SUMER SINGH RAJAVEE", "mother_name": "SENTI KANWAR", "dob": "31/07/2019"},
        {"roll_no": 5, "student_name": "MAGHARAM BHAMU", "father_name": "SANJAY KUMAR", "mother_name": "LICHMA DEVI", "dob": "07/06/2019"},
        {"roll_no": 6, "student_name": "MANAV SUTHAR", "father_name": "HARI RAM", "mother_name": "MOHINI", "dob": "17/03/2018"},
        {"roll_no": 7, "student_name": "MURALIDHAR JAT", "father_name": "ANOPA RAM JAT", "mother_name": "GOMATI DEVI", "dob": "09/08/2018"},
        {"roll_no": 8, "student_name": "NARESH SUTHAR", "father_name": "GIRDHARI LAL SUTHAR", "mother_name": "KAMLA", "dob": "07/07/2017"},
        {"roll_no": 9, "student_name": "PALVIT", "father_name": "IMRATA RAM", "mother_name": "RADHA", "dob": "24/11/2019"},
        {"roll_no": 10, "student_name": "PIYUSH SUTHAR", "father_name": "GHANSHYAM", "mother_name": "SANTOSH", "dob": "17/11/2017"},
        {"roll_no": 11, "student_name": "RAJAYVERDHAN SINGH RATHORE", "father_name": "NARENDRA SINGH", "mother_name": "SANTOSH KANWAR", "dob": "30/09/2019"},
        {"roll_no": 12, "student_name": "SANDIP", "father_name": "PRADEEP SINGH", "mother_name": "SUNITA KANWAR", "dob": "14/09/2019"},
        {"roll_no": 13, "student_name": "YASHPAL SINGH", "father_name": "RATAN SINGH RAJPUT", "mother_name": "REKHA KANWAR", "dob": "14/07/2019"},
        {"roll_no": 14, "student_name": "NEHA", "father_name": "BABULAL", "mother_name": "SUMAN", "dob": "14/04/2017"},
        {"roll_no": 15, "student_name": "VINOD KHERIYA", "father_name": "", "mother_name": "", "dob": ""},
        {"roll_no": 16, "student_name": "TANISH JAKHAR", "father_name": "SHANKAR NATH", "mother_name": "VIMALA", "dob": "07/12/2021"},
        {"roll_no": 17, "student_name": "SAKSHAM", "father_name": "RAMSWAROOP", "mother_name": "LAXMI", "dob": "07/09/2020"},
        {"roll_no": 18, "student_name": "YOGENDRA SINGH", "father_name": "KARANI SINGH", "mother_name": "SUMAN KANWAR", "dob": "28/08/2018"},
        {"roll_no": 19, "student_name": "DHARMENDRA SIMAR", "father_name": "POKAR RAM", "mother_name": "DROPATI DEVI", "dob": "06/12/2016"},
        {"roll_no": 20, "student_name": "MAHAK", "father_name": "SHANKAR NATH", "mother_name": "SUSHILA SIDH", "dob": "11/07/2016"},
        {"roll_no": 21, "student_name": "GUNJAN CHOUDHARY", "father_name": "HARIRAM SINWAL", "mother_name": "FULA DEVI", "dob": "21/06/2020"},
        {"roll_no": 22, "student_name": "SANTOSH", "father_name": "NANDURAM", "mother_name": "SHARADA", "dob": "17/08/2019"},
        {"roll_no": 23, "student_name": "MIAKSHI", "father_name": "RAM LAL SHARMA", "mother_name": "PRIYANKA AYMA", "dob": "24/07/2020"},
        {"roll_no": 24, "student_name": "PANKAJ KHERIA", "father_name": "BHAGU RAM KHERIA", "mother_name": "MANJU", "dob": "18/12/2019"},
        {"roll_no": 25, "student_name": "PRAVEEN KUMAR", "father_name": "DEDA RAM", "mother_name": "SAROJ DEVI", "dob": "31/08/2019"},
        {"roll_no": 26, "student_name": "RAMDEV SUTHAR", "father_name": "RAJURAM", "mother_name": "PANNA DEVI", "dob": "04/02/2018"},
    ],
    2: [
        {"roll_no": 1, "student_name": "ANUSHKA KANWAR", "father_name": "KALU SINGH BHATI", "mother_name": "BHAGWATI KANWAR", "dob": "15/10/2019"},
        {"roll_no": 2, "student_name": "DEEPIKA", "father_name": "TARA CHAND", "mother_name": "SITA", "dob": "14/07/2018"},
        {"roll_no": 3, "student_name": "DHARNA", "father_name": "BABU LAL", "mother_name": "MANOHARI", "dob": "03/11/2018"},
        {"roll_no": 4, "student_name": "NARENDRA SHARMA", "father_name": "SANWAR MAL", "mother_name": "SHANTI DEVI", "dob": "22/07/2018"},
        {"roll_no": 5, "student_name": "PUNAM", "father_name": "MANOJ KUMAR BAJIYA", "mother_name": "KIRAN DEVI", "dob": "10/09/2018"},
        {"roll_no": 6, "student_name": "RADHIKA", "father_name": "ASHU RAM", "mother_name": "RANJU", "dob": "31/08/2018"},
        {"roll_no": 7, "student_name": "RAKSHA NEHARA", "father_name": "BAL RAM NEHARA", "mother_name": "SUMAN", "dob": "15/08/2019"},
        {"roll_no": 8, "student_name": "ROHIT NYOL", "father_name": "SHYAM SUNDAR NYOL", "mother_name": "KISTURI", "dob": "08/01/2018"},
        {"roll_no": 9, "student_name": "SHIV KUMAR", "father_name": "VIKRAM", "mother_name": "SALOCHANA", "dob": "24/09/2017"},
        {"roll_no": 10, "student_name": "VISHAKHA NEHARA", "father_name": "SHANKAR LAL NEHARA", "mother_name": "MANOJ", "dob": "24/08/2019"},
        {"roll_no": 11, "student_name": "YOGENDRA SINGH", "father_name": "KARANI SINGH", "mother_name": "SUMAN KANWAR", "dob": "28/08/2018"},
        {"roll_no": 12, "student_name": "DHARMENDR PRAJAPAT", "father_name": "BABU LAL PRAJAPAT", "mother_name": "SUMAN", "dob": "30/11/2018"},
        {"roll_no": 13, "student_name": "DIVYA", "father_name": "GIRDHARI LAL", "mother_name": "KAMLA", "dob": "17/11/2018"},
        {"roll_no": 15, "student_name": "TEENA SWAMI", "father_name": "", "mother_name": "", "dob": ""},
        {"roll_no": 17, "student_name": "GAJENDRA SINGH", "father_name": "ARJUN SINGH", "mother_name": "POONAM", "dob": "02/05/2019"},
    ],
    3: [
        {"roll_no": 1, "student_name": "AANAND SUTHAR", "father_name": "MALA RAM", "mother_name": "SANJU", "dob": "09/12/2017"},
        {"roll_no": 2, "student_name": "AKANKSHA", "father_name": "MOHAN LAL", "mother_name": "BABLI", "dob": "06/07/2018"},
        {"roll_no": 3, "student_name": "ARADHYA", "father_name": "MAHENDRA KUMAR", "mother_name": "SANTOSH DEVI", "dob": "04/09/2018"},
        {"roll_no": 4, "student_name": "BHAVESH", "father_name": "GHANSHYAM", "mother_name": "SANTOSH", "dob": "20/07/2018"},
        {"roll_no": 5, "student_name": "DEEPESH SUTHAR", "father_name": "MANOJ KUMAR SUTHAR", "mother_name": "SUNITA DEVI", "dob": "15/02/2018"},
        {"roll_no": 6, "student_name": "DEVENDRA", "father_name": "BABU LAL", "mother_name": "CHAWALI DEVI", "dob": "07/07/2014"},
        {"roll_no": 7, "student_name": "HARDIK SEN", "father_name": "OM PRAKASH NAI", "mother_name": "LAXMI NAI", "dob": "20/08/2017"},
        {"roll_no": 8, "student_name": "KARTIK DAN CHARAN", "father_name": "MAHENDRA DAAN", "mother_name": "SAROJ KANWAR", "dob": "19/01/2018"},
        {"roll_no": 9, "student_name": "KISHAN", "father_name": "RAM LAL", "mother_name": "RUKMANI DEVI", "dob": "30/10/2015"},
        {"roll_no": 10, "student_name": "MUKESH NEHARA", "father_name": "GOPALA RAM NEHARA", "mother_name": "SUMAN", "dob": "13/11/2017"},
        {"roll_no": 11, "student_name": "RIYANS PAL", "father_name": "RAGHVENDRA PAL", "mother_name": "YARSHA PAL", "dob": "22/10/2017"},
        {"roll_no": 12, "student_name": "VIJAY KHERIA", "father_name": "BHAGU RAM KHERIA", "mother_name": "DHAPU", "dob": "07/11/2018"},
        {"roll_no": 13, "student_name": "MAHIR SINGH", "father_name": "UMED SINGH", "mother_name": "MUKESH KANWAR", "dob": "09/08/2018"},
        {"roll_no": 14, "student_name": "YUVRAJ SINGH", "father_name": "PEM SINGH", "mother_name": "MEM KANWAR", "dob": "13/12/2017"},
        {"roll_no": 15, "student_name": "ANUSHKA KANWAR", "father_name": "RAJU SINGH", "mother_name": "MAMTA KANWAR", "dob": "09/01/2018"},
        {"roll_no": 16, "student_name": "PANKAJ NEHRA", "father_name": "SAHIRAM NEHRA", "mother_name": "RAJU DEVI", "dob": "24/05/2018"},
        {"roll_no": 17, "student_name": "SUNITA KHERIYA", "father_name": "DEVENDRA KUMAR", "mother_name": "SHANTI DEVI", "dob": "22/07/2018"},
        {"roll_no": 18, "student_name": "BABU LAL", "father_name": "GIRDHARI LAL", "mother_name": "UDI DEVI", "dob": "15/10/2017"},
        {"roll_no": 19, "student_name": "NAITIK SONI", "father_name": "RAKESH SONI", "mother_name": "LAXMI", "dob": "17/10/2017"},
        {"roll_no": 20, "student_name": "NIHARIKA", "father_name": "ARJUN RAM", "mother_name": "SUNITA JAKHAR", "dob": "24/10/2017"},
        {"roll_no": 21, "student_name": "NEHA BHAMBHU", "father_name": "SANJAY KUMAR", "mother_name": "LICHHMA DEVI", "dob": "21/12/2017"},
        {"roll_no": 22, "student_name": "DIKSHEET CHARAN", "father_name": "LAKHAN DAN CHARAN", "mother_name": "LALITA KANWAR", "dob": "22/08/2017"},
        {"roll_no": 23, "student_name": "AASHISH NEHARA", "father_name": "BAJRANG LAL NEHARA", "mother_name": "CHHOTI DEVI", "dob": "29/08/2016"},
    ],
    4: [
        {"roll_no": 1, "student_name": "ANKIT JANGIR", "father_name": "JAISA RAM KHATI", "mother_name": "ANJU DEVI", "dob": "09/09/2015"},
        {"roll_no": 2, "student_name": "ANURADHA", "father_name": "RAMCHANDRA SINWAL", "mother_name": "DROPATI", "dob": "17/09/2018"},
        {"roll_no": 3, "student_name": "ARAV SINWAL", "father_name": "HARI RAM SINWAL", "mother_name": "DHANNI DEVI", "dob": "28/09/2018"},
        {"roll_no": 4, "student_name": "DHIRAJ", "father_name": "MANOJ KUMAR JANGIR", "mother_name": "SAVITRI SUTHAR", "dob": "25/10/2017"},
        {"roll_no": 5, "student_name": "DINESH", "father_name": "NANDURAM", "mother_name": "SHARADA", "dob": "11/11/2016"},
        {"roll_no": 6, "student_name": "DIVYA", "father_name": "LABHURAM KHERIYA", "mother_name": "RADHA DEVI", "dob": "04/10/2017"},
        {"roll_no": 7, "student_name": "GOURI", "father_name": "OM PRAKASH", "mother_name": "SUMAN", "dob": "03/08/2017"},
        {"roll_no": 8, "student_name": "HEJAL PAL", "father_name": "RAGHVENDRA PAL", "mother_name": "VARSHA PAL", "dob": "18/12/2017"},
        {"roll_no": 9, "student_name": "KANAK", "father_name": "OM PRAKASH SUTHAR", "mother_name": "SANJU DEVI", "dob": "05/09/2017"},
        {"roll_no": 10, "student_name": "MANSI", "father_name": "LABHURAM KHERIYA", "mother_name": "RADHA DEVI", "dob": "24/04/2018"},
        {"roll_no": 11, "student_name": "MANVENDRA SINGH", "father_name": "RAM SINGH", "mother_name": "KAVITA KANWAR", "dob": "03/06/2018"},
        {"roll_no": 12, "student_name": "NAVEEN", "father_name": "LAXMAN RAM KHICHAR", "mother_name": "RAJU DEVI", "dob": "29/11/2016"},
        {"roll_no": 13, "student_name": "NISHTHA SUTHAR", "father_name": "BHANWAR LAL SUTHAR", "mother_name": "SEEMA SUTHAR", "dob": "23/10/2017"},
        {"roll_no": 14, "student_name": "RAVI PRAKASH", "father_name": "GIRDHARI DAS", "mother_name": "SUNDAR DEVI", "dob": "18/05/2018"},
        {"roll_no": 15, "student_name": "SARSWATI KANWAR", "father_name": "RAJU SINGH", "mother_name": "FULA KANWAR", "dob": "08/08/2017"},
        {"roll_no": 16, "student_name": "SHIVRAJ", "father_name": "BHAGWAN", "mother_name": "SUSHILA DEVI", "dob": "04/06/2017"},
        {"roll_no": 17, "student_name": "NARESH SUTHAR", "father_name": "GIRDHARI LAL SUTHAR", "mother_name": "KAMLA", "dob": "07/07/2017"},
        {"roll_no": 18, "student_name": "PRAVEENA", "father_name": "GOVIND RAM JAT", "mother_name": "DHAPU DEVI", "dob": "14/11/2017"},
    ],
    5: [
        {"roll_no": 1, "student_name": "DINDAYAL", "father_name": "SANWAR MAL", "mother_name": "SUNITA DEVI", "dob": "02/01/2017"},
        {"roll_no": 2, "student_name": "DINESH SIMAR", "father_name": "MOHANRAM MEGHWAL", "mother_name": "SAROJ DEVI", "dob": "02/01/2018"},
        {"roll_no": 3, "student_name": "KAUSHALYA", "father_name": "RAKESH", "mother_name": "ANURADHA", "dob": "14/12/2016"},
        {"roll_no": 4, "student_name": "MANISHA", "father_name": "MEGHARAM NEHARA", "mother_name": "MANGI DEVI", "dob": "29/04/2015"},
        {"roll_no": 5, "student_name": "NAVEEN SIMAR", "father_name": "BHANI RAM", "mother_name": "RUKAMANI DEVI", "dob": "04/10/2016"},
        {"roll_no": 6, "student_name": "LAXMI", "father_name": "RAKESH SUTHAR", "mother_name": "CHUKI DEVI", "dob": "07/02/2015"},
        {"roll_no": 7, "student_name": "SONAKSHI KANWAR", "father_name": "JITENDRA SINGH", "mother_name": "RITU NIRWAN", "dob": "06/06/2016"},
        {"roll_no": 8, "student_name": "DURLABH", "father_name": "KAILASH SUTHAR", "mother_name": "LALITA SUTHAR", "dob": "05/04/2016"},
    ]
}

# 1. Update class{c}_students.json in public and dist
for c in range(1, 6):
    for base_dir in ["public", "dist"]:
        path = rf"c:\Users\klsut\Documents\jagdamba\{base_dir}\json\class{c}\class{c}_students.json"
        if not os.path.exists(path):
            continue
        with open(path, "r", encoding="utf-8") as f:
            students = json.load(f)
            
        upd_map = {item['roll_no']: item for item in UPDATED_STUDENTS[c]}
        for s in students:
            r = s['roll_no']
            if r in upd_map:
                u = upd_map[r]
                s['student_name'] = u['student_name']
                s['father_name'] = u['father_name']
                s['mother_name'] = u['mother_name']
                s['dob'] = u['dob']
                
        with open(path, "w", encoding="utf-8") as f:
            json.dump(students, f, indent=2, ensure_ascii=False)
        print(f"Updated {path}")

# 2. Update test1.json and test2.json with the new student names in public and dist
for c in range(1, 6):
    upd_map = {item['roll_no']: item['student_name'] for item in UPDATED_STUDENTS[c]}
    for exam_file in ["test1.json", "test2.json"]:
        for base_dir in ["public", "dist"]:
            path = rf"c:\Users\klsut\Documents\jagdamba\{base_dir}\json\class{c}\{exam_file}"
            if not os.path.exists(path):
                continue
            with open(path, "r", encoding="utf-8") as f:
                exam_data = json.load(f)
            if isinstance(exam_data, list):
                for row in exam_data:
                    r = row.get('roll_no')
                    if r in upd_map:
                        row['student_name'] = upd_map[r]
                with open(path, "w", encoding="utf-8") as f:
                    json.dump(exam_data, f, indent=2, ensure_ascii=False)
                print(f"Updated names in {path}")

# 3. Update Student_List_All_Classes.xlsx in root, public, and dist
for expath in [
    r"c:\Users\klsut\Documents\jagdamba\Student_List_All_Classes.xlsx",
    r"c:\Users\klsut\Documents\jagdamba\public\data\Student_List_All_Classes.xlsx",
    r"c:\Users\klsut\Documents\jagdamba\dist\data\Student_List_All_Classes.xlsx"
]:
    if not os.path.exists(expath):
        continue
    wb = openpyxl.load_workbook(expath)
    for c in range(1, 6):
        sheet_name = f"Class {c}"
        if sheet_name not in wb.sheetnames:
            continue
        ws = wb[sheet_name]
        headers = [ws.cell(1, col).value for col in range(1, ws.max_column + 1)]
        idx_roll = headers.index('roll_no') + 1
        idx_name = headers.index('student_name') + 1
        idx_father = headers.index('father_name') + 1
        idx_mother = headers.index('mother_name') + 1
        idx_dob = headers.index('dob') + 1
        
        upd_map = {item['roll_no']: item for item in UPDATED_STUDENTS[c]}
        for row in range(2, ws.max_row + 1):
            r_val = ws.cell(row, idx_roll).value
            if r_val in upd_map:
                u = upd_map[r_val]
                ws.cell(row, idx_name, value=u['student_name'])
                ws.cell(row, idx_father, value=u['father_name'])
                ws.cell(row, idx_mother, value=u['mother_name'])
                ws.cell(row, idx_dob, value=u['dob'])
                
    wb.save(expath)
    print(f"Updated Excel workbook with Excel names: {expath}")

print("\nALL STUDENT NAMES AND DETAILS UPDATED ACCORDING TO EXCEL!")
