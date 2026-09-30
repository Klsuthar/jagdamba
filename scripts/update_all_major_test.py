import json
import os
import shutil
import re
import openpyxl

# -------------------------------------------------------------
# 1. ADD HEMA TO class1_students.json (public and dist)
# -------------------------------------------------------------
hema_record = {
    "roll_no": 27,
    "student_name": "HEMA RATAWA",
    "image": "class_1/class-1-hema.jpg",
    "father_name": "DINESH KUMAR RATAWA",
    "mother_name": "ARCHANA DEVI",
    "dob": "14/12/2019"
}

for base in ["public", "dist"]:
    p = rf"c:\Users\klsut\Documents\jagdamba\{base}\json\class1\class1_students.json"
    if os.path.exists(p):
        with open(p, "r", encoding="utf-8") as f:
            c1_data = json.load(f)
        # Check if 27 already exists
        c1_data = [x for x in c1_data if x['roll_no'] != 27]
        c1_data.append(hema_record)
        c1_data.sort(key=lambda x: x['roll_no'])
        with open(p, "w", encoding="utf-8") as f:
            json.dump(c1_data, f, indent=2, ensure_ascii=False)
        print(f"Added Hema to {p} (total: {len(c1_data)} students)")

# Add Hema to test1.json and test2.json
for test_file in ["test1.json", "test2.json"]:
    for base in ["public", "dist"]:
        p = rf"c:\Users\klsut\Documents\jagdamba\{base}\json\class1\{test_file}"
        if os.path.exists(p):
            with open(p, "r", encoding="utf-8") as f:
                t_data = json.load(f)
            t_data = [x for x in t_data if x.get('roll_no') != 27]
            t_data.append({
                "roll_no": 27,
                "student_name": "HEMA RATAWA",
                "hindi": 15 if test_file == "test1.json" else None,
                "english": 10 if test_file == "test1.json" else None,
                "mathematics": 13 if test_file == "test1.json" else None,
                "maths": 13 if test_file == "test1.json" else None,
                "evs": None
            })
            t_data.sort(key=lambda x: x.get('roll_no', 0))
            with open(p, "w", encoding="utf-8") as f:
                json.dump(t_data, f, indent=2, ensure_ascii=False)
            print(f"Added Hema to {p}")

# Ensure Hema image is copied to dist
shutil.copy2(
    r"c:\Users\klsut\Documents\jagdamba\public\images\students\class_1\class-1-hema.jpg",
    r"c:\Users\klsut\Documents\jagdamba\dist\images\students\class_1\class-1-hema.jpg"
)

# -------------------------------------------------------------
# 2. UPDATE Student_List_All_Classes.xlsx WITH HEMA
# -------------------------------------------------------------
for expath in [
    r"c:\Users\klsut\Documents\jagdamba\Student_List_All_Classes.xlsx",
    r"c:\Users\klsut\Documents\jagdamba\public\data\Student_List_All_Classes.xlsx",
    r"c:\Users\klsut\Documents\jagdamba\dist\data\Student_List_All_Classes.xlsx"
]:
    if not os.path.exists(expath):
        continue
    wb = openpyxl.load_workbook(expath)
    ws1 = wb["Class 1"]
    h1 = [ws1.cell(1, col).value for col in range(1, ws1.max_column + 1)]
    idx_roll = h1.index('roll_no') + 1
    idx_name = h1.index('student_name') + 1
    idx_f = h1.index('father_name') + 1
    idx_m = h1.index('mother_name') + 1
    idx_dob = h1.index('dob') + 1
    idx_img = h1.index('image') + 1 if 'image' in h1 else None
    
    # Check if row 27 exists
    found = False
    for r in range(2, ws1.max_row + 1):
        if ws1.cell(r, idx_roll).value == 27:
            found = True
            ws1.cell(r, idx_name, value="HEMA RATAWA")
            ws1.cell(r, idx_f, value="DINESH KUMAR RATAWA")
            ws1.cell(r, idx_m, value="ARCHANA DEVI")
            ws1.cell(r, idx_dob, value="14/12/2019")
            if idx_img: ws1.cell(r, idx_img, value="class_1/class-1-hema.jpg")
            break
    if not found:
        next_row = ws1.max_row + 1
        ws1.cell(next_row, idx_roll, value=27)
        ws1.cell(next_row, idx_name, value="HEMA RATAWA")
        ws1.cell(next_row, idx_f, value="DINESH KUMAR RATAWA")
        ws1.cell(next_row, idx_m, value="ARCHANA DEVI")
        ws1.cell(next_row, idx_dob, value="14/12/2019")
        if idx_img: ws1.cell(next_row, idx_img, value="class_1/class-1-hema.jpg")
        
    wb.save(expath)
    print(f"Updated Hema in {expath}")

# -------------------------------------------------------------
# 3. UPDATE C:\Users\klsut\Downloads\marks.json WITH ACTUAL EXCEL NAMES
# -------------------------------------------------------------
marks_file = r"C:\Users\klsut\Downloads\marks.json"
marks_backup = r"C:\Users\klsut\Downloads\marks_backup.json"
if not os.path.exists(marks_backup):
    shutil.copy2(marks_file, marks_backup)
    print(f"Created backup at {marks_backup}")

with open(marks_file, "r", encoding="utf-8") as f:
    text = f.read()

# Exact mapping for student names in marks.json
NAME_MAP_BY_CLASS = {
    "class 1st": {
        "1": "Bhanu Pratap Singh",
        "2": "Divya Sidh",
        "3": "Ishita Kanwar",
        "4": "Karmveer Singh Rajvi",
        "5": "Magharam Bhamu",
        "6": "Manav Suthar",
        "7": "Muralidhar Jat",
        "8": "Naresh Suthar",
        "9": "Palvit",
        "10": "Piyush Suthar",
        "11": "Rajayverdhan Singh Rathore",
        "12": "Sandip",
        "13": "Yashpal Singh",
        "14": "Neha",
        "15": "Vinod Kheriya",
        "16": "Tanish Jakhar",
        "17": "Saksham",
        "18": "Yogendra Singh",
        "19": "Dharmendra Simar",
        "20": "Mahak",
        "21": "Gunjan Choudhary",
        "22": "Santosh",
        "23": "Miakshi",
        "24": "Pankaj Kheria",
        "25": "Praveen Kumar",
        "26": "Ramdev Suthar",
        "27": "Hema Ratawa"
    },
    "class 2nd": {
        "1": "Anushka Kanwar",
        "2": "Deepika",
        "3": "Dharna",
        "4": "Narendra Sharma",
        "5": "Punam",
        "6": "Radhika",
        "7": "Raksha Nehara",
        "8": "Rohit Nyol",
        "9": "Shiv Kumar",
        "10": "Vishakha Nehara",
        "11": "Dharmendr Prajapat",
        "12": "Divya",
        "13": "Teena Swami",
        "14": "Gajendra Singh"
    },
    "class 3rd": {
        "1": "Aanand Suthar",
        "2": "Akanksha",
        "3": "Aradhya",
        "4": "Archana",
        "5": "Bharti",
        "6": "Devendra",
        "7": "Hardik Sen",
        "8": "Kartik Dan Charan",
        "9": "Kishan",
        "10": "Mukesh Nehara",
        "11": "Riyans Pal",
        "12": "Vijay Kheria",
        "13": "Mahir Singh",
        "14": "Yuvraj Singh",
        "15": "Anushka Kanwar",
        "16": "Pankaj Nehra",
        "17": "Sunita Kheriya",
        "18": "Babu Lal",
        "19": "Naitik Soni",
        "20": "Niharika",
        "21": "Neha Bhambhu",
        "22": "Diksheet Charan",
        "23": "Aashish Nehara"
    },
    "class 5/4th": {
        # Note: 5/4th has duplicate roll numbers between 5th and 4th, so match by roll and current name
    }
}

sections = re.split(r'(class\s+[^\n\r]+)', text)
new_sections = []
new_sections.append(sections[0]) # Header before first section

for i in range(1, len(sections), 2):
    header = sections[i].strip()
    raw = sections[i+1].strip()
    data = json.loads(raw)
    students = data.get('students', data) if isinstance(data, dict) else data
    
    c_key = header.lower()
    
    for s in students:
        r_str = str(s.get('roll_no', '')).lstrip('0') or '0'
        curr_name = s.get('name', '').strip()
        
        if c_key in NAME_MAP_BY_CLASS and r_str in NAME_MAP_BY_CLASS[c_key]:
            s['name'] = NAME_MAP_BY_CLASS[c_key][r_str]
        elif '5/4th' in c_key or '4' in c_key or '5' in c_key:
            # Match 4th/5th names
            norm_c = curr_name.lower().replace(' ', '')
            if 'sarsvati' in norm_c:
                s['name'] = 'Sarswati Kanwar'
            elif 'dindayal' in norm_c:
                s['name'] = 'Dindayal'
            elif 'dineshsimar' in norm_c:
                s['name'] = 'Dinesh Simar'
            elif 'kaushalya' in norm_c:
                s['name'] = 'Kaushalya'
            elif 'manisha' in norm_c:
                s['name'] = 'Manisha'
            elif 'naveensimar' in norm_c:
                s['name'] = 'Naveen Simar'
            elif 'laxmi' in norm_c:
                s['name'] = 'Laxmi'
            elif 'sonakshi' in norm_c:
                s['name'] = 'Sonakshi Kanwar'
            elif 'durlabh' in norm_c:
                s['name'] = 'Durlabh'
            elif 'naresh' in norm_c:
                s['name'] = 'Naresh Suthar'
            elif 'praveena' in norm_c:
                s['name'] = 'Praveena'
                
    new_raw = json.dumps(students, indent=2, ensure_ascii=False)
    new_sections.append(header)
    new_sections.append("\n" + new_raw + "\n\n")

with open(marks_file, "w", encoding="utf-8") as f:
    f.write("".join(new_sections))

print(f"Updated all student names in {marks_file} successfully!")
