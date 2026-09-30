import json
import glob
import os

for c in range(1, 6):
    files = glob.glob(rf"c:\Users\klsut\Documents\jagdamba\public\json\class{c}\*.json")
    print(f"\n--- Class {c} ---")
    for f in sorted(files):
        fname = os.path.basename(f)
        with open(f, encoding='utf-8') as fp:
            try:
                data = json.load(fp)
                if isinstance(data, list):
                    has_name = any('student_name' in x or 'name' in x for x in data if isinstance(x, dict))
                    has_roll = any('roll_no' in x or 'roll' in x for x in data if isinstance(x, dict))
                    print(f"  {fname:20s}: {len(data)} items, has_student_name={has_name}, has_roll={has_roll}")
                else:
                    print(f"  {fname:20s}: dict object")
            except Exception as e:
                print(f"  {fname:20s}: error {e}")
