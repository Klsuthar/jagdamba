import openpyxl
import json
import os
import re

excel_path = r"C:\Users\klsut\Documents\STUDENT.xlsx"
wb = openpyxl.load_workbook(excel_path)

def norm(s):
    if not s:
        return ""
    # remove special chars, extra whitespace, lowercase
    s = str(s).strip().upper()
    s = re.sub(r'[^A-Z0-9]', '', s)
    return s

# Read English Medium from STUDENT.xlsx
eng_ws = wb["English Medium"]
eng_students = []
for r in range(2, eng_ws.max_row + 1):
    sno = eng_ws.cell(r, 1).value
    cls = eng_ws.cell(r, 2).value
    sname = eng_ws.cell(r, 3).value
    fname = eng_ws.cell(r, 4).value
    mname = eng_ws.cell(r, 5).value
    dob = eng_ws.cell(r, 6).value
    if hasattr(dob, 'strftime'):
        dob_str = dob.strftime('%d/%m/%Y')
    else:
        dob_str = str(dob) if dob else ''
    
    eng_students.append({
        'sno': sno,
        'class': cls,
        'student_name': sname,
        'father_name': fname,
        'mother_name': mname,
        'dob': dob_str,
        'norm_name': norm(sname),
        'medium': 'English'
    })

# Also read Hindi Medium just in case
hin_ws = wb["Hindi Medium"]
hin_students = []
for r in range(2, hin_ws.max_row + 1):
    sno = hin_ws.cell(r, 1).value
    cls = hin_ws.cell(r, 2).value
    sname = hin_ws.cell(r, 3).value
    fname = hin_ws.cell(r, 4).value
    mname = hin_ws.cell(r, 5).value
    dob = hin_ws.cell(r, 6).value
    if hasattr(dob, 'strftime'):
        dob_str = dob.strftime('%d/%m/%Y')
    else:
        dob_str = str(dob) if dob else ''
    
    hin_students.append({
        'sno': sno,
        'class': cls,
        'student_name': sname,
        'father_name': fname,
        'mother_name': mname,
        'dob': dob_str,
        'norm_name': norm(sname),
        'medium': 'Hindi'
    })

print(f"Loaded from Excel: {len(eng_students)} English medium, {len(hin_students)} Hindi medium students.")

# Now check each class in public/json/
class_map = {1: '1st', 2: '2nd', 3: '3rd', 4: '4th', 5: '5th'}

for c in range(1, 6):
    json_path = rf"c:\Users\klsut\Documents\jagdamba\public\json\class{c}\class{c}_students.json"
    with open(json_path, encoding='utf-8') as f:
        site_students = json.load(f)
    
    cls_label = class_map[c]
    eng_cls = [s for s in eng_students if s['class'] == cls_label]
    hin_cls = [s for s in hin_students if s['class'] == cls_label]
    
    print(f"\n=======================================================")
    print(f"CLASS {c} ({cls_label}): {len(site_students)} website students | {len(eng_cls)} English in Excel")
    print(f"=======================================================")
    
    matched = 0
    unmatched = []
    
    for stu in site_students:
        s_name = stu['student_name']
        s_norm = norm(s_name)
        
        # 1. Exact norm match in English Medium of same class
        exact_matches = [e for e in eng_cls if e['norm_name'] == s_norm]
        
        # 2. If no exact match in same class, check across all classes in English Medium
        cross_class_matches = []
        if not exact_matches:
            cross_class_matches = [e for e in eng_students if e['norm_name'] == s_norm]
            
        # 3. Check partial / fuzzy matches in English Medium
        partial_matches = []
        if not exact_matches and not cross_class_matches:
            for e in eng_students:
                if s_norm in e['norm_name'] or e['norm_name'] in s_norm:
                    partial_matches.append(e)
                    
        # 4. Also check in Hindi Medium
        hindi_matches = []
        if not exact_matches:
            hindi_matches = [h for h in hin_students if h['norm_name'] == s_norm or s_norm in h['norm_name'] or h['norm_name'] in s_norm]
            
        if exact_matches and len(exact_matches) == 1:
            matched += 1
            m = exact_matches[0]
            # print(f"  [OK] Roll {stu['roll_no']}: '{s_name}' -> '{m['student_name']}' | F: {m['father_name']} | M: {m['mother_name']} | DOB: {m['dob']}")
        else:
            unmatched.append({
                'roll_no': stu['roll_no'],
                'site_name': s_name,
                'exact': exact_matches,
                'cross_class': cross_class_matches,
                'partial': partial_matches,
                'hindi': hindi_matches
            })
            
    print(f"Direct clean matches in Class {c}: {matched}/{len(site_students)}")
    if unmatched:
        print(f"Issues / Need Inspection ({len(unmatched)}):")
        for u in unmatched:
            print(f"  Roll {u['roll_no']}: '{u['site_name']}'")
            if u['exact']:
                print(f"    Multiple exact in same class: {[x['student_name'] + ' (F: ' + x['father_name'] + ')' for x in u['exact']]}")
            if u['cross_class']:
                print(f"    Cross-class English match: {[x['class'] + ': ' + x['student_name'] + ' (F: ' + x['father_name'] + ')' for x in u['cross_class']]}")
            if u['partial']:
                print(f"    Partial English match: {[x['class'] + ': ' + x['student_name'] + ' (F: ' + x['father_name'] + ')' for x in u['partial']]}")
            if u['hindi']:
                print(f"    Hindi match: {[x['class'] + ': ' + x['student_name'] + ' (F: ' + x['father_name'] + ')' for x in u['hindi']]}")
            if not u['exact'] and not u['cross_class'] and not u['partial'] and not u['hindi']:
                print(f"    NO MATCH FOUND ANYWHERE IN EXCEL!")
