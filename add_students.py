import json

students_data = [
    {"id": "STU3_11", "roll": 11, "name": "KANAK", "att": 91, "yearly": [7,6,5,8]},
    {"id": "STU3_12", "roll": 12, "name": "KAUSHALYA", "att": 88, "yearly": [10,10,10,10]},
    {"id": "STU3_13", "roll": 13, "name": "LAXMI", "att": 96, "yearly": [9,7,9,7]},
    {"id": "STU3_14", "roll": 14, "name": "MAHESH BAJYA", "att": 94, "yearly": [7,7,10,7]},
    {"id": "STU3_15", "roll": 15, "name": "MANISHA NEHRA", "att": 90, "yearly": [1,3,3,4]},
    {"id": "STU3_16", "roll": 16, "name": "MANSI", "att": 95, "yearly": [10,10,9,10]},
    {"id": "STU3_17", "roll": 17, "name": "MANVANDER SINGH", "att": 97, "yearly": [5,6,9,3]},
    {"id": "STU3_18", "roll": 18, "name": "NARESH SUTHAR", "att": 87, "yearly": [7,None,9,10]},
    {"id": "STU3_19", "roll": 19, "name": "NAVEEN", "att": 94, "yearly": [10,5,6,5]},
    {"id": "STU3_20", "roll": 20, "name": "NISHTHA SUTHAR", "att": 92, "yearly": [10,10,9,7]},
    {"id": "STU3_21", "roll": 21, "name": "PRAVEENA", "att": 89, "yearly": [10,6,7,None]},
    {"id": "STU3_22", "roll": 22, "name": "RAVI PRAKASH", "att": 96, "yearly": [7,6,8,9]},
    {"id": "STU3_23", "roll": 23, "name": "SARSWATI", "att": 93, "yearly": [10,9,8,6]},
    {"id": "STU3_24", "roll": 24, "name": "SONAKSHI", "att": 91, "yearly": [None,None,None,7]}
]

with open('c:/Users/klsut/Documents/GitHub/Jagadamba/jagdamba/json/class3_results.json', 'r') as f:
    data = json.load(f)

for s in students_data:
    student = {
        "student_id": s["id"],
        "roll_no": s["roll"],
        "student_name": s["name"],
        "session": "2023-24",
        "exams": {
            "class_test_1": {
                "exam_type": "Class Test 1",
                "subjects": [
                    {"name": "Hindi", "written": None, "written_max": 10},
                    {"name": "English", "written": None, "written_max": 10},
                    {"name": "Mathematics", "written": None, "written_max": 10},
                    {"name": "EVS", "written": None, "written_max": 10}
                ]
            },
            "class_test_2": {
                "exam_type": "Class Test 2",
                "subjects": [
                    {"name": "Hindi", "written": None, "written_max": 10},
                    {"name": "English", "written": None, "written_max": 10},
                    {"name": "Mathematics", "written": None, "written_max": 10},
                    {"name": "EVS", "written": None, "written_max": 10}
                ]
            },
            "class_test_3": {
                "exam_type": "Class Test 3",
                "subjects": [
                    {"name": "Hindi", "written": None, "written_max": 10},
                    {"name": "English", "written": None, "written_max": 10},
                    {"name": "Mathematics", "written": None, "written_max": 10},
                    {"name": "EVS", "written": None, "written_max": 10}
                ]
            },
            "half_yearly": {
                "exam_type": "Half Yearly Exam",
                "subjects": [
                    {"name": "Hindi", "written": None, "written_max": 30, "oral": None, "oral_max": 70},
                    {"name": "English", "written": None, "written_max": 15, "oral": None, "oral_max": 35},
                    {"name": "Mathematics", "written": None, "written_max": 30, "oral": None, "oral_max": 70},
                    {"name": "EVS", "written": None, "written_max": 30, "oral": None, "oral_max": 70}
                ]
            },
            "yearly": {
                "exam_type": "Yearly Exam",
                "subjects": [
                    {"name": "Hindi", "written": s["yearly"][0], "written_max": 30, "oral": None, "oral_max": 70},
                    {"name": "English", "written": s["yearly"][1], "written_max": 15, "oral": None, "oral_max": 35},
                    {"name": "Mathematics", "written": s["yearly"][2], "written_max": 30, "oral": None, "oral_max": 70},
                    {"name": "EVS", "written": s["yearly"][3], "written_max": 30, "oral": None, "oral_max": 70}
                ]
            }
        },
        "attendance": s["att"]
    }
    data.append(student)

with open('c:/Users/klsut/Documents/GitHub/Jagadamba/jagdamba/json/class3_results.json', 'w') as f:
    json.dump(data, f, indent=2)

print("Done! All 24 students added.")
