import json
import os
import openpyxl
import shutil

# Master Mapping for all 90 students across 5 classes
# Format: class_num -> list of dicts with roll_no, student_name, father_name, mother_name, dob, status, note

MAPPING = {
    1: [
        {"roll_no": 1, "name": "BHANU PRATAP SINGH", "father": "SURENDRA SINGH", "mother": "SANJU KANWAR", "dob": "24/01/2020", "status": "MATCHED"},
        {"roll_no": 2, "name": "DIVYA SIDH", "father": "PARAKASH NATH MAHIYA", "mother": "RADHA SIDH", "dob": "01/04/2020", "status": "MATCHED"},
        {"roll_no": 3, "name": "ISHITA KANWAR", "father": "HIMMAT SINGH", "mother": "LALITA KANWAR", "dob": "19/09/2019", "status": "MATCHED"},
        {"roll_no": 4, "name": "KARMVEER SINGH", "father": "SUMER SINGH RAJAVEE", "mother": "SENTI KANWAR", "dob": "31/07/2019", "status": "MATCHED", "note": "Excel: KARMVEER SINGH RAJVI"},
        {"roll_no": 5, "name": "MAGHARAM BHADU", "father": "SANJAY KUMAR", "mother": "LICHMA DEVI", "dob": "07/06/2019", "status": "MATCHED", "note": "Excel: MAGHARAM BHAMU"},
        {"roll_no": 6, "name": "MANAV SUTHAR", "father": "HARI RAM", "mother": "MOHINI", "dob": "17/03/2018", "status": "MATCHED"},
        {"roll_no": 7, "name": "MURALIDHAR JAT", "father": "ANOPA RAM JAT", "mother": "GOMATI DEVI", "dob": "09/08/2018", "status": "MATCHED"},
        {"roll_no": 8, "name": "NARESH", "father": "", "mother": "", "dob": "", "status": "CONFUSION", "note": "Hindi 4th: NARESH SUTHAR (Father: GIRDHARI LAL SUTHAR, Mother: KAMLA, DOB: 07/07/2017)"},
        {"roll_no": 9, "name": "PALVIT", "father": "IMRATA RAM", "mother": "RADHA", "dob": "24/11/2019", "status": "MATCHED"},
        {"roll_no": 10, "name": "PIYUSH SUTHAR", "father": "GHANSHYAM", "mother": "SANTOSH", "dob": "17/11/2017", "status": "MATCHED"},
        {"roll_no": 11, "name": "RAJYAVARDHAN SINGH", "father": "NARENDRA SINGH", "mother": "SANTOSH KANWAR", "dob": "30/09/2019", "status": "MATCHED", "note": "Excel: RAJAYVERDHAN SINGH RATHORE"},
        {"roll_no": 12, "name": "SANDIP", "father": "PRADEEP SINGH", "mother": "SUNITA KANWAR", "dob": "14/09/2019", "status": "MATCHED"},
        {"roll_no": 13, "name": "YASHPAL SINGH", "father": "RATAN SINGH RAJPUT", "mother": "REKHA KANWAR", "dob": "14/07/2019", "status": "MATCHED"},
        {"roll_no": 14, "name": "NEHA", "father": "", "mother": "", "dob": "", "status": "CONFUSION", "note": "Multiple candidates (Hindi 5th: NEHA d/o BABULAL, or Hindi 3rd: NEHA BHAMBHU d/o SANJAY KUMAR)"},
        {"roll_no": 15, "name": "VINOD KHERIYA", "father": "", "mother": "", "dob": "", "status": "NOT_FOUND", "note": "Not found in Excel"},
        {"roll_no": 16, "name": "TANISH JAKHAR", "father": "SHANKAR NATH", "mother": "VIMALA", "dob": "07/12/2021", "status": "MATCHED"},
        {"roll_no": 17, "name": "SAKSHAM", "father": "RAMSWAROOP", "mother": "LAXMI", "dob": "07/09/2020", "status": "MATCHED"},
        {"roll_no": 18, "name": "YOGENDRA", "father": "", "mother": "", "dob": "", "status": "CONFUSION", "note": "English 2nd/3rd: YOGENDRA SINGH (Father: KARANI SINGH, Mother: SUMAN KANWAR, DOB: 28/08/2018)"},
        {"roll_no": 19, "name": "DHARMENDRA", "father": "", "mother": "", "dob": "", "status": "CONFUSION", "note": "Hindi 4th: DHARMENDRA SIMAR (Father: POKAR RAM, Mother: DROPATI DEVI, DOB: 06/12/2016)"},
        {"roll_no": 20, "name": "MAHAK SINWAL", "father": "", "mother": "", "dob": "", "status": "CONFUSION", "note": "Hindi 5th: MAHAK (Father: SHANKAR NATH, Mother: SUSHILA SIDH, DOB: 11/07/2016)"},
        {"roll_no": 21, "name": "GUNJAN", "father": "HARIRAM SINWAL", "mother": "FULA DEVI", "dob": "21/06/2020", "status": "MATCHED", "note": "Excel: GUNJAN CHOUDHARY (Father: HARIRAM SINWAL)"},
        {"roll_no": 22, "name": "SANTOSH KHAIRIYA", "father": "NANDURAM", "mother": "SHARADA", "dob": "17/08/2019", "status": "MATCHED", "note": "Excel: SANTOSH (Father: NANDURAM)"},
        {"roll_no": 23, "name": "MINAXI SHARMA", "father": "RAM LAL SHARMA", "mother": "PRIYANKA AYMA", "dob": "24/07/2020", "status": "MATCHED", "note": "Excel: MIAKSHI (Father: RAM LAL SHARMA)"},
        {"roll_no": 24, "name": "PANKAJ KHAIRIYA", "father": "BHAGU RAM KHERIA", "mother": "MANJU", "dob": "18/12/2019", "status": "MATCHED", "note": "Excel: PANKAJ KHERIA (Father: BHAGU RAM KHERIA)"},
        {"roll_no": 25, "name": "PARVEEN KUMAR", "father": "DEDA RAM", "mother": "SAROJ DEVI", "dob": "31/08/2019", "status": "MATCHED", "note": "Excel: PRAVEEN KUMAR (Father: DEDA RAM)"},
        {"roll_no": 26, "name": "RAMDEV SUTHAR", "father": "", "mother": "", "dob": "", "status": "CONFUSION", "note": "Hindi 3rd: RAMDEV SUTHAR (Father: RAJURAM, Mother: PANNA DEVI, DOB: 04/02/2018)"},
    ],
    2: [
        {"roll_no": 1, "name": "ANUSHKA KANWAR", "father": "KALU SINGH BHATI", "mother": "BHAGWATI KANWAR", "dob": "15/10/2019", "status": "MATCHED"},
        {"roll_no": 2, "name": "DEEPIKA", "father": "", "mother": "", "dob": "", "status": "CONFUSION", "note": "Two candidates in 2nd English: 1) Father: TARA CHAND, Mother: SITA, DOB: 14/07/2018; 2) Father: TARACHAND MEGHWAL, Mother: AMARI DEVI, DOB: 13/11/2019"},
        {"roll_no": 3, "name": "DHARNA", "father": "BABU LAL", "mother": "MANOHARI", "dob": "03/11/2018", "status": "MATCHED"},
        {"roll_no": 4, "name": "NARENDRA SHARMA", "father": "SANWAR MAL", "mother": "SHANTI DEVI", "dob": "22/07/2018", "status": "MATCHED"},
        {"roll_no": 5, "name": "PUNAM", "father": "MANOJ KUMAR BAJIYA", "mother": "KIRAN DEVI", "dob": "10/09/2018", "status": "MATCHED"},
        {"roll_no": 6, "name": "RADHIKA", "father": "ASHU RAM", "mother": "RANJU", "dob": "31/08/2018", "status": "MATCHED"},
        {"roll_no": 7, "name": "RAKSHA NEHARA", "father": "BAL RAM NEHARA", "mother": "SUMAN", "dob": "15/08/2019", "status": "MATCHED"},
        {"roll_no": 8, "name": "ROHIT NYOL", "father": "SHYAM SUNDAR NYOL", "mother": "KISTURI", "dob": "08/01/2018", "status": "MATCHED"},
        {"roll_no": 9, "name": "SHIV KUMAR", "father": "VIKRAM", "mother": "SALOCHANA", "dob": "24/09/2017", "status": "MATCHED"},
        {"roll_no": 10, "name": "VISHAKHA NEHARA", "father": "SHANKAR LAL NEHARA", "mother": "MANOJ", "dob": "24/08/2019", "status": "MATCHED"},
        {"roll_no": 11, "name": "YOGENDRA SINGH", "father": "KARANI SINGH", "mother": "SUMAN KANWAR", "dob": "28/08/2018", "status": "MATCHED"},
        {"roll_no": 12, "name": "DHARMENDR PRAJAPAT", "father": "BABU LAL PRAJAPAT", "mother": "SUMAN", "dob": "30/11/2018", "status": "MATCHED", "note": "Hindi Medium 2nd"},
        {"roll_no": 13, "name": "DIVYA SUTHAR", "father": "", "mother": "", "dob": "", "status": "CONFUSION", "note": "Candidates: Hindi 2nd: DIVYA (Father: GIRDHARI LAL, Mother: KAMLA, DOB: 17/11/2018) vs English 4th: DIVYA (Father: LABHURAM KHERIYA)"},
        {"roll_no": 15, "name": "TEENA SWAMI", "father": "", "mother": "", "dob": "", "status": "NOT_FOUND", "note": "Not found in Excel"},
        {"roll_no": 17, "name": "GAJENDRA SINGH", "father": "ARJUN SINGH", "mother": "POONAM", "dob": "02/05/2019", "status": "MATCHED", "note": "English 1st"},
    ],
    3: [
        {"roll_no": 1, "name": "AANAND SUTHAR", "father": "MALA RAM", "mother": "SANJU", "dob": "09/12/2017", "status": "MATCHED"},
        {"roll_no": 2, "name": "AKANKSHA", "father": "MOHAN LAL", "mother": "BABLI", "dob": "06/07/2018", "status": "MATCHED"},
        {"roll_no": 3, "name": "ARADHYA", "father": "MAHENDRA KUMAR", "mother": "SANTOSH DEVI", "dob": "04/09/2018", "status": "MATCHED"},
        {"roll_no": 4, "name": "BHAVESH", "father": "GHANSHYAM", "mother": "SANTOSH", "dob": "20/07/2018", "status": "MATCHED"},
        {"roll_no": 5, "name": "DEEPESH SUTHAR", "father": "MANOJ KUMAR SUTHAR", "mother": "SUNITA DEVI", "dob": "15/02/2018", "status": "MATCHED"},
        {"roll_no": 6, "name": "DEVENDRA", "father": "BABU LAL", "mother": "CHAWALI DEVI", "dob": "07/07/2014", "status": "MATCHED"},
        {"roll_no": 7, "name": "HARDIK SEN", "father": "OM PRAKASH NAI", "mother": "LAXMI NAI", "dob": "20/08/2017", "status": "MATCHED"},
        {"roll_no": 8, "name": "KARTIK DAN CHARAN", "father": "MAHENDRA DAAN", "mother": "SAROJ KANWAR", "dob": "19/01/2018", "status": "MATCHED"},
        {"roll_no": 9, "name": "KISHAN", "father": "RAM LAL", "mother": "RUKMANI DEVI", "dob": "30/10/2015", "status": "MATCHED"},
        {"roll_no": 10, "name": "MUKESH NEHARA", "father": "GOPALA RAM NEHARA", "mother": "SUMAN", "dob": "13/11/2017", "status": "MATCHED"},
        {"roll_no": 11, "name": "RIYANS PAL", "father": "RAGHVENDRA PAL", "mother": "YARSHA PAL", "dob": "22/10/2017", "status": "MATCHED"},
        {"roll_no": 12, "name": "VIJAY KHERIYA", "father": "BHAGU RAM KHERIA", "mother": "DHAPU", "dob": "07/11/2018", "status": "MATCHED", "note": "Excel: VIJAY KHERIA"},
        {"roll_no": 13, "name": "MAHIR SINGH", "father": "UMED SINGH", "mother": "MUKESH KANWAR", "dob": "09/08/2018", "status": "MATCHED"},
        {"roll_no": 14, "name": "YUVRAJ SINGH", "father": "PEM SINGH", "mother": "MEM KANWAR", "dob": "13/12/2017", "status": "MATCHED"},
        {"roll_no": 15, "name": "ANUSHKA KANWAR", "father": "RAJU SINGH", "mother": "MAMTA KANWAR", "dob": "09/01/2018", "status": "MATCHED"},
        {"roll_no": 16, "name": "PANKAJ NEHARA", "father": "SAHIRAM NEHRA", "mother": "RAJU DEVI", "dob": "24/05/2018", "status": "MATCHED", "note": "Hindi 3rd: PANKAJ NEHRA"},
        {"roll_no": 17, "name": "SUNITA KHERIYA", "father": "DEVENDRA KUMAR", "mother": "SHANTI DEVI", "dob": "22/07/2018", "status": "MATCHED", "note": "Hindi 3rd"},
        {"roll_no": 18, "name": "BABULAL", "father": "GIRDHARI LAL", "mother": "UDI DEVI", "dob": "15/10/2017", "status": "MATCHED", "note": "Hindi 3rd: BABU LAL"},
        {"roll_no": 19, "name": "NAITIK SONI", "father": "RAKESH SONI", "mother": "LAXMI", "dob": "17/10/2017", "status": "MATCHED", "note": "Hindi 3rd"},
        {"roll_no": 20, "name": "NIHARIKA", "father": "ARJUN RAM", "mother": "SUNITA JAKHAR", "dob": "24/10/2017", "status": "MATCHED"},
        {"roll_no": 21, "name": "NEHA BHAMU", "father": "SANJAY KUMAR", "mother": "LICHHMA DEVI", "dob": "21/12/2017", "status": "MATCHED", "note": "Hindi 3rd: NEHA BHAMBHU"},
        {"roll_no": 22, "name": "DIKSHIT CHARAN", "father": "LAKHAN DAN CHARAN", "mother": "LALITA KANWAR", "dob": "22/08/2017", "status": "MATCHED", "note": "Excel: DIKSHEET CHARAN"},
        {"roll_no": 23, "name": "AASISH", "father": "BAJRANG LAL NEHARA", "mother": "CHHOTI DEVI", "dob": "29/08/2016", "status": "MATCHED", "note": "Excel: AASHISH NEHARA"},
    ],
    4: [
        {"roll_no": 1, "name": "ANKIT JANGIR", "father": "JAISA RAM KHATI", "mother": "ANJU DEVI", "dob": "09/09/2015", "status": "MATCHED"},
        {"roll_no": 2, "name": "ANURADHA", "father": "RAMCHANDRA SINWAL", "mother": "DROPATI", "dob": "17/09/2018", "status": "MATCHED"},
        {"roll_no": 3, "name": "ARAV SINWAL", "father": "HARI RAM SINWAL", "mother": "DHANNI DEVI", "dob": "28/09/2018", "status": "MATCHED"},
        {"roll_no": 4, "name": "DHIRAJ", "father": "MANOJ KUMAR JANGIR", "mother": "SAVITRI SUTHAR", "dob": "25/10/2017", "status": "MATCHED"},
        {"roll_no": 5, "name": "DINESH", "father": "NANDURAM", "mother": "SHARADA", "dob": "11/11/2016", "status": "MATCHED"},
        {"roll_no": 6, "name": "DIVYA", "father": "LABHURAM KHERIYA", "mother": "RADHA DEVI", "dob": "04/10/2017", "status": "MATCHED"},
        {"roll_no": 7, "name": "GOURI", "father": "OM PRAKASH", "mother": "SUMAN", "dob": "03/08/2017", "status": "MATCHED"},
        {"roll_no": 8, "name": "HEJAL PAL", "father": "RAGHVENDRA PAL", "mother": "VARSHA PAL", "dob": "18/12/2017", "status": "MATCHED"},
        {"roll_no": 9, "name": "KANAK", "father": "OM PRAKASH SUTHAR", "mother": "SANJU DEVI", "dob": "05/09/2017", "status": "MATCHED"},
        {"roll_no": 10, "name": "MANSI", "father": "LABHURAM KHERIYA", "mother": "RADHA DEVI", "dob": "24/04/2018", "status": "MATCHED"},
        {"roll_no": 11, "name": "MANVENDRA SINGH", "father": "RAM SINGH", "mother": "KAVITA KANWAR", "dob": "03/06/2018", "status": "MATCHED"},
        {"roll_no": 12, "name": "NAVEEN", "father": "LAXMAN RAM KHICHAR", "mother": "RAJU DEVI", "dob": "29/11/2016", "status": "MATCHED"},
        {"roll_no": 13, "name": "NISHTHA", "father": "BHANWAR LAL SUTHAR", "mother": "SEEMA SUTHAR", "dob": "23/10/2017", "status": "MATCHED", "note": "Excel: NISHTHA SUTHAR"},
        {"roll_no": 14, "name": "RAVI PRAKASH", "father": "GIRDHARI DAS", "mother": "SUNDAR DEVI", "dob": "18/05/2018", "status": "MATCHED"},
        {"roll_no": 15, "name": "SARSWATI KANWAR", "father": "RAJU SINGH", "mother": "FULA KANWAR", "dob": "08/08/2017", "status": "MATCHED"},
        {"roll_no": 16, "name": "SHIVRAJ", "father": "BHAGWAN", "mother": "SUSHILA DEVI", "dob": "04/06/2017", "status": "MATCHED"},
        {"roll_no": 17, "name": "NARESH SUTHAR", "father": "GIRDHARI LAL SUTHAR", "mother": "KAMLA", "dob": "07/07/2017", "status": "MATCHED", "note": "Hindi 4th"},
        {"roll_no": 18, "name": "PRAVEENA", "father": "GOVIND RAM JAT", "mother": "DHAPU DEVI", "dob": "14/11/2017", "status": "MATCHED", "note": "Hindi 4th"},
    ],
    5: [
        {"roll_no": 1, "name": "DINDAYAL", "father": "SANWAR MAL", "mother": "SUNITA DEVI", "dob": "02/01/2017", "status": "MATCHED", "note": "English 4th"},
        {"roll_no": 2, "name": "DINESH SIMAR", "father": "MOHANRAM MEGHWAL", "mother": "SAROJ DEVI", "dob": "02/01/2018", "status": "MATCHED", "note": "English 4th"},
        {"roll_no": 3, "name": "KAUSHALYA", "father": "RAKESH", "mother": "ANURADHA", "dob": "14/12/2016", "status": "MATCHED", "note": "English 4th"},
        {"roll_no": 4, "name": "MANISHA", "father": "MEGHARAM NEHARA", "mother": "MANGI DEVI", "dob": "29/04/2015", "status": "MATCHED", "note": "English 4th"},
        {"roll_no": 5, "name": "NAVEEN SIMAR", "father": "BHANI RAM", "mother": "RUKAMANI DEVI", "dob": "04/10/2016", "status": "MATCHED", "note": "English 4th"},
        {"roll_no": 6, "name": "LAXMI", "father": "RAKESH SUTHAR", "mother": "CHUKI DEVI", "dob": "07/02/2015", "status": "MATCHED", "note": "Hindi 5th"},
        {"roll_no": 7, "name": "SONAKSHI KANWAR", "father": "JITENDRA SINGH", "mother": "RITU NIRWAN", "dob": "06/06/2016", "status": "MATCHED", "note": "Hindi 5th"},
        {"roll_no": 8, "name": "DURLABH", "father": "KAILASH SUTHAR", "mother": "LALITA SUTHAR", "dob": "05/04/2016", "status": "MATCHED", "note": "English 5th"},
    ]
}

# 1. Update public/json/class{c}/class{c}_students.json and dist/json/class{c}/class{c}_students.json
for c in range(1, 6):
    pub_path = rf"c:\Users\klsut\Documents\jagdamba\public\json\class{c}\class{c}_students.json"
    dist_path = rf"c:\Users\klsut\Documents\jagdamba\dist\json\class{c}\class{c}_students.json"
    
    with open(pub_path, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    class_map = {item['roll_no']: item for item in MAPPING[c]}
    
    for stu in data:
        r = stu['roll_no']
        if r in class_map:
            mapping_item = class_map[r]
            stu['father_name'] = mapping_item['father']
            stu['mother_name'] = mapping_item['mother']
            stu['dob'] = mapping_item['dob']
            
    # Write back to public
    with open(pub_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"Updated: {pub_path}")
    
    # Write back to dist if directory exists
    if os.path.exists(os.path.dirname(dist_path)):
        with open(dist_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"Updated: {dist_path}")

# 2. Update Student_List_All_Classes.xlsx and public/data/Student_List_All_Classes.xlsx
excel_paths = [
    r"c:\Users\klsut\Documents\jagdamba\Student_List_All_Classes.xlsx",
    r"c:\Users\klsut\Documents\jagdamba\public\data\Student_List_All_Classes.xlsx",
    r"c:\Users\klsut\Documents\jagdamba\dist\data\Student_List_All_Classes.xlsx"
]

for expath in excel_paths:
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
        idx_father = headers.index('father_name') + 1
        idx_mother = headers.index('mother_name') + 1
        idx_dob = headers.index('dob') + 1
        
        class_map = {item['roll_no']: item for item in MAPPING[c]}
        for row in range(2, ws.max_row + 1):
            r_val = ws.cell(row, idx_roll).value
            if r_val in class_map:
                m = class_map[r_val]
                ws.cell(row, idx_father, value=m['father'])
                ws.cell(row, idx_mother, value=m['mother'])
                ws.cell(row, idx_dob, value=m['dob'])
                
    wb.save(expath)
    print(f"Updated Excel workbook: {expath}")

print("\nALL STUDENT DATA UPDATES COMPLETED SUCCESSFULLY!")
