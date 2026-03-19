import json
import csv

with open('json/class1/class1_students.json', 'r', encoding='utf-8') as f:
    students = json.load(f)

with open('class1_students.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['Roll Number', 'Name'])
    for student in students:
        writer.writerow([student['roll_no'], student['student_name']])

print("Excel file created: class1_students.csv")
