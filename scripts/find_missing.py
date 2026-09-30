import json

total_students = 0
total_missing = 0

for c in range(1, 6):
    path = rf"c:\Users\klsut\Documents\jagdamba\public\json\class{c}\class{c}_students.json"
    with open(path, encoding='utf-8') as f:
        data = json.load(f)
    
    total_students += len(data)
    missing = [s for s in data if not s.get('father_name') or not s.get('mother_name') or not s.get('dob')]
    total_missing += len(missing)
    
    print(f"\n==========================================")
    print(f"Class {c} (Total: {len(data)}, Missing: {len(missing)})")
    print(f"==========================================")
    if missing:
        for s in missing:
            print(f"Roll {s['roll_no']:2d}: {s['student_name']}")
    else:
        print("All students in this class have complete data!")

print(f"\nSUMMARY: {total_missing} out of {total_students} students have missing data.")
