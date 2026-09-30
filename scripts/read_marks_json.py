import json
import re

with open(r"C:\Users\klsut\Downloads\marks.json", encoding="utf-8") as f:
    text = f.read()

sections = re.split(r'(class\s+[^\n\r]+)', text)
for i in range(1, len(sections), 2):
    h = sections[i].strip()
    raw = sections[i+1].strip()
    data = json.loads(raw)
    students = data.get('students', data) if isinstance(data, dict) else data
    print(f"\n--- {h} ({len(students)} students) ---")
    for s in students:
        r_str = str(s.get('roll_no', ''))
        print(f"  Roll {r_str:>2s}: {s.get('name', '')}")
