import json

for c in range(1, 6):
    path = rf"c:\Users\klsut\Documents\jagdamba\public\json\class{c}\class{c}_students.json"
    with open(path, encoding='utf-8') as f:
        data = json.load(f)
    print(f"\n--- Class {c} ({len(data)} students) ---")
    for s in data[:5]:
        print(f"  Roll {s['roll_no']:2d}: {s['student_name']:28s} | F: {s['father_name']:20s} | M: {s['mother_name']:18s} | DOB: {s['dob']}")
