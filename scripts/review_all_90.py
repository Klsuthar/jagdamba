import json
from full_audit import full_audit

for c in range(1, 6):
    class_students = [r for r in full_audit if r['class_num'] == c]
    print(f"\n================================================================================")
    print(f"CLASS {c} (Total: {len(class_students)})")
    print(f"================================================================================")
    for s in class_students:
        rec = s.get('excel_record')
        m_type = s['match_type']
        if rec:
            src = f"[{rec['medium']} {rec['class']}]"
            print(f"Roll {s['roll_no']:2d}: {s['site_name']:22s} -> {rec['student_name']:25s} | Father: {rec['father_name']:20s} | Mother: {rec['mother_name']:18s} | DOB: {rec['dob']:10s} {src} ({m_type})")
        else:
            print(f"Roll {s['roll_no']:2d}: {s['site_name']:22s} -> [UNMATCHED / AMBIGUOUS / NOT FOUND] ({m_type}) - {s['notes']}")
            if s.get('candidates'):
                for cand in s['candidates']:
                    print(f"         Candidate: [{cand['medium']} {cand['class']}] {cand['student_name']} (Father: {cand['father_name']}, Mother: {cand['mother_name']}, DOB: {cand['dob']})")
