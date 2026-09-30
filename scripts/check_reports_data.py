import sys
sys.path.append(r"c:\Users\klsut\Documents\jagdamba\scripts")
from generate_all_reports import parse_all_classes, resolve_photo

classes = parse_all_classes()
for c in classes:
    print(f"\n--- {c['name']} ({len(c['students'])} students) ---")
    for s in c['students']:
        photo = s.get('photo_path')
        p_status = "FOUND: " + photo if photo else "MISSING PHOTO"
        if not photo or 'HEMA' in s['name'].upper() or int(s['roll_no']) in [4, 5, 8, 11, 14, 15, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27]:
            print(f"  Roll {s['roll_no']:>2s}: {s['name']:25s} | {p_status}")
