import openpyxl, json
from detailed_match import detailed_report

print("--- CLASS 1 DETAILED BREAKDOWN ---")
for r in detailed_report[1]:
    clean = len(r['eng_same']) == 1
    status = "OK" if clean else "NEEDS REVIEW"
    print(f"Roll {r['roll']:2d}: {r['name']:20s} [{status}]")
    if not clean:
        if r['eng_same']:
            print("  Multiple English same:", [(x['sno'], x['student_name'], x['father_name']) for x in r['eng_same']])
        if r['eng_part_same']:
            print("  Partial English same :", [(x['sno'], x['student_name'], x['father_name']) for x in r['eng_part_same']])
        if r['eng_other']:
            print("  English other class  :", [(x['class'], x['sno'], x['student_name'], x['father_name']) for x in r['eng_other']])
        if r['eng_part_other']:
            print("  Partial English other:", [(x['class'], x['sno'], x['student_name'], x['father_name']) for x in r['eng_part_other']])
        if r['hin_same']:
            print("  Hindi same class     :", [(x['sno'], x['student_name'], x['father_name']) for x in r['hin_same']])
        if r['hin_other']:
            print("  Hindi other class    :", [(x['class'], x['sno'], x['student_name'], x['father_name']) for x in r['hin_other']])
        if not (r['eng_same'] or r['eng_part_same'] or r['eng_other'] or r['eng_part_other'] or r['hin_same'] or r['hin_other']):
            print("  *** NOT IN EXCEL AT ALL ***")
