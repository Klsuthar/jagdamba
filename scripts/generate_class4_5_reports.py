import os
import json
import re
import math
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.pdfgen import canvas
import pymupdf

def format_rank(rank):
    if 11 <= (rank % 100) <= 13:
        return f"{rank}th"
    mod10 = rank % 10
    if mod10 == 1:
        return f"{rank}st"
    elif mod10 == 2:
        return f"{rank}nd"
    elif mod10 == 3:
        return f"{rank}rd"
    return f"{rank}th"


def resolve_photo_4_5(student_name, class_label):
    clean_name = student_name.lower().strip()
    clean_name = clean_name.replace('sarsvati', 'sarswati')
    
    # Specific known mapping
    explicit_map = {
        'dindayal': 'class-5-dindayal.jpg',
        'dinesh simar': 'class-5-dinesh-simar.jpg',
        'kaushalya': 'class-5-kaushalya.jpg',
        'manisha': 'class-5-manisha.jpg',
        'naveen simar': 'class-5-naveen-simar.jpg',
        'laxmi': 'class-5-laxmi.jpg',
        'sonakshi kanwar': 'class-5-sonakshi-kanwar.jpg',
        'durlabh': 'class-5-durlabh.jpg',
        'dinesh': 'class-4-dinesh.jpg',
        'divya': 'class-4-divya.jpg',
        'gouri': 'class-4-gouri.jpg',
        'hejal pal': 'class-4-hejal-pal.jpg',
        'kanak': 'class-4-kanak.jpg',
        'mansi': 'class-4-mansi.jpg',
        'manvendra singh': 'class-4-manvendra-singh.jpg',
        'naveen': 'class-4-naveen.jpg',
        'sarsvati kanwar': 'class-4-sarswati-kanwar.jpg',
        'sarswati kanwar': 'class-4-sarswati-kanwar.jpg',
        'shivraj': 'class-4-shivraj.jpg',
        'naresh suthar': 'class-4-naresh-suthar.jpg',
        'praveena': 'class-4-praveena.jpg'
    }
    
    folder = os.path.join('public', 'images', 'students', 'class_4_5')
    if clean_name in explicit_map:
        p = os.path.join(folder, explicit_map[clean_name])
        if os.path.exists(p):
            return p

    # Fallback to general search
    for fn in os.listdir(folder):
        if clean_name.split()[0] in fn.lower():
            return os.path.join(folder, fn)
            
    return None


def parse_class_4_5(marks_file=r'C:\Users\klsut\Downloads\marks.json'):
    with open(marks_file, 'r', encoding='utf-8') as f:
        text = f.read()

    sections = re.split(r'(class\s+[^\n\r]+)', text)
    students_raw = []
    for i in range(1, len(sections), 2):
        if '5/4' in sections[i]:
            students_raw = json.loads(sections[i+1])
            break

    c5_names = ['laxmi', 'sonakshi', 'durlabh']
    subj_order = ['English', 'EVS', 'Maths', 'Hindi']
    subj_map = {'english': 'English', 'evs': 'EVS', 'math': 'Maths', 'maths': 'Maths', 'hindi': 'Hindi'}

    processed = []
    for s in students_raw:
        r = str(s['roll_no']).zfill(2) if str(s['roll_no']).isdigit() else str(s['roll_no'])
        name = str(s['name']).strip()
        marks = s.get('marks', {})

        is_c5 = any(c in name.lower() for c in c5_names)
        clabel = '5th' if is_c5 else '4th'

        total_obtained = 0
        total_max = 80
        absent_count = 0
        absent_subjs = []

        normalized_marks = {}
        for k, v in marks.items():
            canon_k = subj_map.get(k.lower(), k)
            normalized_marks[canon_k] = v

        subj_marks = {}
        for subj in subj_order:
            val = normalized_marks.get(subj, 'A')
            if val is None:
                absent_count += 1
                absent_subjs.append(subj)
                subj_marks[subj] = 'A'
            elif isinstance(val, (int, float)):
                rounded_val = int(math.ceil(val))
                total_obtained += rounded_val
                subj_marks[subj] = rounded_val
            elif str(val).strip().upper() == 'A':
                absent_count += 1
                absent_subjs.append(subj)
                subj_marks[subj] = 'A'
            else:
                try:
                    fval = float(val)
                    rounded_val = int(math.ceil(fval))
                    total_obtained += rounded_val
                    subj_marks[subj] = rounded_val
                except:
                    subj_marks[subj] = str(val)

        pct = (total_obtained / total_max) * 100.0

        if absent_count == 0:
            result = "PASSED" if pct >= 33 else "NEEDS IMPR."
        else:
            result = f"AB ({absent_subjs[0]})" if len(absent_subjs) == 1 else "ABSENT"

        photo_path = resolve_photo_4_5(name, clabel)

        processed.append({
            'roll_no': r,
            'name': name,
            'class': clabel,
            'class_full': f"Class {clabel}",
            'subjects': subj_order,
            'marks': subj_marks,
            'total_obtained': total_obtained,
            'total_max': total_max,
            'percentage': pct,
            'result': result,
            'absent_count': absent_count,
            'photo_path': photo_path
        })

    # Ranking across all 20 students in Class 4th/5th combined
    sorted_students = sorted(processed, key=lambda x: (x['total_obtained'], -int(x['roll_no']) if str(x['roll_no']).isdigit() else 0), reverse=True)
    current_rank = 0
    prev_total = None
    for idx, st in enumerate(sorted_students):
        tot = st['total_obtained']
        if tot != prev_total:
            current_rank = idx + 1
            prev_total = tot

        if current_rank <= 5:
            st['position'] = format_rank(current_rank)
            st['rank_num'] = current_rank
        else:
            st['position'] = None
            st['rank_num'] = None

    return processed


def draw_card_8(c, x, y, w, h, student, logo_path, sign_path):
    """Draw a single report card for 8-per-page layout (w~275, h~195)"""
    corner_r = 5
    
    # 1. Drop shadow
    c.saveState()
    c.setFillColor(colors.HexColor("#e2e8f0"))
    c.roundRect(x + 1.2, y - 1.2, w, h, corner_r, fill=1, stroke=0)
    c.restoreState()
    
    # 2. Main Card Body with clipping
    c.saveState()
    clip_p = c.beginPath()
    clip_p.roundRect(x, y, w, h, corner_r)
    c.clipPath(clip_p, stroke=0)
    
    # Card background
    c.setFillColor(colors.white)
    c.rect(x, y, w, h, fill=1, stroke=0)
    
    # Top Header Background (Dark Navy)
    header_h = 33
    header_y = y + h - header_h
    c.setFillColor(colors.HexColor("#1e3a8a"))
    c.rect(x, header_y, w, header_h, fill=1, stroke=0)
    
    # Gold separator line
    c.setFillColor(colors.HexColor("#ca8a04"))
    c.rect(x, header_y - 2, w, 2, fill=1, stroke=0)
    
    # School Logo
    if logo_path and os.path.exists(logo_path):
        c.drawImage(logo_path, x + 5, header_y + 4, width=25, height=25, preserveAspectRatio=True, mask='auto')
        text_start_x = x + 34
    else:
        text_start_x = x + 10
        
    # School Name & Subtitle
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 8.4)
    c.drawString(text_start_x, header_y + 20, "SHREE JAGDAMBA CONVENT SCHOOL")
    
    c.setFillColor(colors.HexColor("#fef08a"))
    c.setFont("Helvetica-Bold", 6.2)
    c.drawString(text_start_x, header_y + 10, "DHADHERU (CHURU) RAJASTHAN")
    
    c.setFillColor(colors.HexColor("#93c5fd"))
    c.setFont("Helvetica-Bold", 5.8)
    c.drawRightString(x + w - 6, header_y + 4, "Reg. / CBSE Pattern")
    
    # Exam Banner Ribbon
    banner_h = 13
    banner_y = header_y - 2 - banner_h
    c.setFillColor(colors.HexColor("#f1f5f9"))
    c.rect(x, banner_y, w, banner_h, fill=1, stroke=0)
    
    c.setFillColor(colors.HexColor("#1e3a8a"))
    c.setFont("Helvetica-Bold", 7.0)
    c.drawCentredString(x + w/2.0, banner_y + 3.8, "SEPTEMBER MAJOR TEST REPORT - 2026")
    
    # Divider under banner
    c.setStrokeColor(colors.HexColor("#cbd5e1"))
    c.setLineWidth(0.5)
    c.line(x, banner_y, x + w, banner_y)
    
    # Student Profile Section
    profile_top = banner_y - 3
    photo_w = 38
    photo_h = 47
    photo_x = x + 7
    photo_y = profile_top - photo_h - 1
    
    # Photo box border & background
    c.setFillColor(colors.HexColor("#f8fafc"))
    c.setStrokeColor(colors.HexColor("#ca8a04"))
    c.setLineWidth(0.8)
    c.roundRect(photo_x, photo_y, photo_w, photo_h, 2, fill=1, stroke=1)
    
    photo_p = student.get('photo_path')
    if photo_p and os.path.exists(photo_p):
        try:
            c.drawImage(photo_p, photo_x + 1, photo_y + 1, width=photo_w - 2, height=photo_h - 2,
                        preserveAspectRatio=True, anchor='c', mask='auto')
        except:
            c.setFont("Helvetica", 6)
            c.setFillColor(colors.HexColor("#64748b"))
            c.drawCentredString(photo_x + photo_w/2, photo_y + photo_h/2 - 2, "PHOTO")
    else:
        c.setFont("Helvetica", 6)
        c.setFillColor(colors.HexColor("#64748b"))
        c.drawCentredString(photo_x + photo_w/2, photo_y + photo_h/2 - 2, "PHOTO")

    info_x = photo_x + photo_w + 7
    
    # Student Name
    c.setFillColor(colors.HexColor("#0f172a"))
    c.setFont("Helvetica-Bold", 9.2)
    s_name = student['name'].upper()
    if len(s_name) > 18:
        c.setFont("Helvetica-Bold", 8.2)
    c.drawString(info_x, profile_top - 10, s_name)
    
    # Roll No & Class
    c.setFont("Helvetica-Bold", 7.2)
    c.setFillColor(colors.HexColor("#475569"))
    c.drawString(info_x, profile_top - 21, "ROLL NO:")
    c.setFillColor(colors.HexColor("#1e3a8a"))
    c.drawString(info_x + 42, profile_top - 21, f"{student['roll_no']}")
    
    c.setFillColor(colors.HexColor("#475569"))
    c.drawString(info_x + 72, profile_top - 21, "CLASS:")
    c.setFillColor(colors.HexColor("#1e3a8a"))
    c.drawString(info_x + 104, profile_top - 21, f"{student['class']}")
    
    # Total & Percentage
    c.setFillColor(colors.HexColor("#475569"))
    c.drawString(info_x, profile_top - 32, "TOTAL:")
    c.setFillColor(colors.HexColor("#0f172a"))
    tot_val = student['total_obtained']
    tot_str = f"{int(tot_val)}" if isinstance(tot_val, (int, float)) and tot_val.is_integer() else f"{tot_val:.1f}"
    c.drawString(info_x + 42, profile_top - 32, f"{tot_str} / {student['total_max']}")
    
    c.setFillColor(colors.HexColor("#475569"))
    c.drawString(info_x + 90, profile_top - 32, "%:")
    pct_color = colors.HexColor("#059669") if student['percentage'] >= 60 else (colors.HexColor("#ca8a04") if student['percentage'] >= 33 else colors.HexColor("#dc2626"))
    c.setFillColor(pct_color)
    c.setFont("Helvetica-Bold", 7.8)
    c.drawString(info_x + 102, profile_top - 32, f"{student['percentage']:.1f}%")
    
    # Result Pill & Position Pill
    grade_x = info_x
    grade_y = profile_top - 46
    
    # 1. Result Pill
    res_bg = colors.HexColor("#dcfce7") if "PASS" in student['result'] else colors.HexColor("#fee2e2")
    res_fg = colors.HexColor("#15803d") if "PASS" in student['result'] else colors.HexColor("#b91c1c")
    c.setFillColor(res_bg)
    c.setStrokeColor(res_fg)
    c.setLineWidth(0.5)
    c.roundRect(grade_x, grade_y, 52, 11, 2, fill=1, stroke=1)
    c.setFillColor(res_fg)
    c.setFont("Helvetica-Bold", 6.0)
    c.drawCentredString(grade_x + 26, grade_y + 3, student['result'])
    
    # 2. Position in Class Pill (Top 5 only)
    pos = student.get('position')
    if pos:
        pos_x = grade_x + 58
        pos_w = 64
        pos_h = 11
        c.setFillColor(colors.HexColor("#fef3c7"))  # Soft Gold bg
        c.setStrokeColor(colors.HexColor("#d97706")) # Amber border
        c.setLineWidth(0.6)
        c.roundRect(pos_x, grade_y, pos_w, pos_h, 2, fill=1, stroke=1)
        
        c.setFillColor(colors.HexColor("#92400e"))  # Deep Amber text
        c.setFont("Helvetica-Bold", 6.2)
        c.drawCentredString(pos_x + pos_w/2.0, grade_y + 3, f"POSITION: {pos}")

    # Marks Table (4 subjects: English, EVS, Maths, Hindi, Total)
    subj_list = student['subjects']
    col_w = [48, 38, 38, 38, 38, 42]
    headers = ["SUBJECT"] + [s.upper() for s in subj_list] + ["TOTAL"]
    max_vals = ["Max Marks", "20", "20", "20", "20", str(student['total_max'])]

    tbl_w_actual = sum(col_w)
    tbl_x = x + (w - tbl_w_actual) / 2.0
    
    row_h_hdr = 11
    row_h_max = 10
    row_h_obt = 12
    tbl_h = row_h_hdr + row_h_max + row_h_obt
    tbl_bottom = photo_y - 4 - tbl_h
    
    # Table Header Row
    c.setFillColor(colors.HexColor("#1e3a8a"))
    c.rect(tbl_x, tbl_bottom + row_h_max + row_h_obt, tbl_w_actual, row_h_hdr, fill=1, stroke=0)
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 6.2)
    
    cur_x = tbl_x
    for i, h_text in enumerate(headers):
        if i == 0:
            c.drawString(cur_x + 4, tbl_bottom + row_h_max + row_h_obt + 3, h_text)
        else:
            c.drawCentredString(cur_x + col_w[i]/2.0, tbl_bottom + row_h_max + row_h_obt + 3, h_text)
        cur_x += col_w[i]
        
    # Table Max Marks Row
    c.setFillColor(colors.HexColor("#f8fafc"))
    c.rect(tbl_x, tbl_bottom + row_h_obt, tbl_w_actual, row_h_max, fill=1, stroke=0)
    c.setFillColor(colors.HexColor("#64748b"))
    c.setFont("Helvetica", 5.8)
    
    cur_x = tbl_x
    for i, m_text in enumerate(max_vals):
        if i == 0:
            c.drawString(cur_x + 4, tbl_bottom + row_h_obt + 2.5, m_text)
        else:
            c.drawCentredString(cur_x + col_w[i]/2.0, tbl_bottom + row_h_obt + 2.5, m_text)
        cur_x += col_w[i]
        
    # Table Obtained Marks Row
    c.setFillColor(colors.white)
    c.rect(tbl_x, tbl_bottom, tbl_w_actual, row_h_obt, fill=1, stroke=0)
    
    obt_vals = ["Marks Obt."]
    for s_name_col in subj_list:
        v = student['marks'].get(s_name_col, '-')
        obt_vals.append(v)
    obt_vals.append(tot_str)
    
    cur_x = tbl_x
    for i, o_val in enumerate(obt_vals):
        if isinstance(o_val, float):
            val_str = f"{int(o_val)}" if o_val.is_integer() else f"{o_val:.1f}"
        else:
            val_str = str(o_val)

        if i == 0:
            c.setFillColor(colors.HexColor("#334155"))
            c.setFont("Helvetica-Bold", 6.2)
            c.drawString(cur_x + 4, tbl_bottom + 3.5, val_str)
        else:
            if val_str in ['A', 'Inc.']:
                c.setFillColor(colors.HexColor("#dc2626"))
                c.setFont("Helvetica-Bold", 7.2)
            elif i == len(obt_vals) - 1:
                c.setFillColor(colors.HexColor("#1e3a8a"))
                c.setFont("Helvetica-Bold", 7.2)
            else:
                c.setFillColor(colors.HexColor("#0f172a"))
                c.setFont("Helvetica-Bold", 6.8)
            c.drawCentredString(cur_x + col_w[i]/2.0, tbl_bottom + 3.5, val_str)
        cur_x += col_w[i]
        
    # Table grid borders
    c.setStrokeColor(colors.HexColor("#94a3b8"))
    c.setLineWidth(0.5)
    c.rect(tbl_x, tbl_bottom, tbl_w_actual, tbl_h, fill=0, stroke=1)
    c.line(tbl_x, tbl_bottom + row_h_obt, tbl_x + tbl_w_actual, tbl_bottom + row_h_obt)
    c.line(tbl_x, tbl_bottom + row_h_obt + row_h_max, tbl_x + tbl_w_actual, tbl_bottom + row_h_obt + row_h_max)
    cur_x = tbl_x
    for cw in col_w[:-1]:
        cur_x += cw
        c.line(cur_x, tbl_bottom, cur_x, tbl_bottom + tbl_h)

    # Footer Section (Signatures)
    foot_y = y + 5
    
    p_line_x = x + 10
    p_line_w = 68
    c.setStrokeColor(colors.HexColor("#94a3b8"))
    c.setLineWidth(0.5)
    c.setDash([1.5, 1.5], 0)
    c.line(p_line_x, foot_y + 13, p_line_x + p_line_w, foot_y + 13)
    c.setDash([], 0)
    c.setFillColor(colors.HexColor("#475569"))
    c.setFont("Helvetica-Bold", 5.8)
    c.drawCentredString(p_line_x + p_line_w/2.0, foot_y + 4, "Parent's Signature")
    
    t_line_x = x + (w - 60)/2.0
    t_line_w = 60
    c.setStrokeColor(colors.HexColor("#94a3b8"))
    c.setLineWidth(0.5)
    c.setDash([1.5, 1.5], 0)
    c.line(t_line_x, foot_y + 13, t_line_x + t_line_w, foot_y + 13)
    c.setDash([], 0)
    c.setFillColor(colors.HexColor("#475569"))
    c.setFont("Helvetica-Bold", 5.8)
    c.drawCentredString(t_line_x + t_line_w/2.0, foot_y + 4, "Class Teacher")
    
    pr_line_x = x + w - 75
    pr_line_w = 65
    if sign_path and os.path.exists(sign_path):
        try:
            c.drawImage(sign_path, pr_line_x + 12, foot_y + 11, width=42, height=18,
                        preserveAspectRatio=True, mask='auto')
        except:
            pass
            
    c.setStrokeColor(colors.HexColor("#94a3b8"))
    c.setLineWidth(0.5)
    c.line(pr_line_x, foot_y + 13, pr_line_x + pr_line_w, foot_y + 13)
    c.setFillColor(colors.HexColor("#1e3a8a"))
    c.setFont("Helvetica-Bold", 6.0)
    c.drawCentredString(pr_line_x + pr_line_w/2.0, foot_y + 4, "Principal")

    c.restoreState()

    c.saveState()
    c.setStrokeColor(colors.HexColor("#1e3a8a"))
    c.setLineWidth(1.2)
    c.roundRect(x, y, w, h, corner_r, fill=0, stroke=1)
    c.restoreState()


def draw_cutting_lines(c, page_w, page_h, margin_x, margin_y, cols, rows, card_w, card_h, gap_x, gap_y, cards_on_page):
    c.saveState()
    c.setStrokeColor(colors.HexColor("#cbd5e1"))
    c.setLineWidth(0.5)
    c.setDash([3, 3], 0)
    
    actual_rows = (cards_on_page + cols - 1) // cols
    max_y = page_h - margin_y
    min_y = page_h - margin_y - actual_rows * card_h - (actual_rows - 1) * gap_y
    
    if cols > 1:
        mid_x = margin_x + card_w + gap_x / 2.0
        c.line(mid_x, min_y, mid_x, max_y)
        c.setFont("Helvetica", 6)
        c.setFillColor(colors.HexColor("#94a3b8"))
        c.drawCentredString(mid_x, max_y + 3, "✂ CUT HERE ✂")
        c.drawCentredString(mid_x, min_y - 8, "✂ CUT HERE ✂")
        
    for r in range(1, actual_rows):
        row_gap_y = page_h - margin_y - (r * card_h + (r - 0.5) * gap_y)
        c.line(margin_x, row_gap_y, page_w - margin_x, row_gap_y)
        c.setFont("Helvetica", 6)
        c.setFillColor(colors.HexColor("#94a3b8"))
        c.drawString(margin_x - 12, row_gap_y - 2, "✂")
        c.drawString(page_w - margin_x + 2, row_gap_y - 2, "✂")
        
    c.restoreState()


def render_pdf_8_per_page(students, output_pdf, logo_path, sign_path):
    page_w, page_h = A4
    margin_x = 16
    margin_y = 16
    cols = 2
    rows = 4
    cards_per_page = cols * rows
    
    gap_x = 12
    gap_y = 10
    
    card_w = (page_w - 2 * margin_x - (cols - 1) * gap_x) / cols
    card_h = (page_h - 2 * margin_y - (rows - 1) * gap_y) / rows
    
    c = canvas.Canvas(output_pdf, pagesize=A4)
    total_students = len(students)
    
    for i, student in enumerate(students):
        card_idx = i % cards_per_page
        remaining = total_students - (i - card_idx)
        cards_on_page = min(cards_per_page, remaining)
        
        col = card_idx % cols
        row = card_idx // cols
        
        card_x = margin_x + col * (card_w + gap_x)
        card_y = page_h - margin_y - (row + 1) * card_h - row * gap_y
        
        if card_idx == 0:
            draw_cutting_lines(c, page_w, page_h, margin_x, margin_y, cols, rows, card_w, card_h, gap_x, gap_y, cards_on_page)
            
        draw_card_8(c, card_x, card_y, card_w, card_h, student, logo_path, sign_path)
        
        if card_idx == cards_per_page - 1 or i == total_students - 1:
            c.showPage()
            
    c.save()
    print(f"Generated PDF ({total_students} students): {output_pdf}")


if __name__ == '__main__':
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    logo = os.path.join(base_dir, 'public', 'images', 'logo.png')
    sign = os.path.join(base_dir, 'public', 'images', 'sign', 'principal.png')
    out_dir = os.path.join(base_dir, 'Result')
    os.makedirs(out_dir, exist_ok=True)

    students_4_5 = parse_class_4_5()
    pdf_path = os.path.join(out_dir, "Class_4th_5th_Report_Cards_8perPage.pdf")
    render_pdf_8_per_page(students_4_5, pdf_path, logo, sign)

    # Render PNG previews
    doc = pymupdf.open(pdf_path)
    for pno in range(len(doc)):
        pix = doc[pno].get_pixmap(dpi=150)
        preview_img = os.path.join(out_dir, f"Class_4th_5th_Report_8perPage_Page_{pno+1}.png")
        pix.save(preview_img)
        print(f"Saved preview: {preview_img}")

    print("Class 4th/5th generation completed.")
