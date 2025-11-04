# श्री जगदम्बा स्कूल वेबसाइट

## 📱 Mobile-Friendly School Website

यह एक पूर्ण रूप से मोबाइल-फ्रेंडली स्कूल वेबसाइट है जो छात्रों की प्रगति रिपोर्ट दिखाने की सुविधा के साथ आती है।

## 🗂️ Project Structure

```
Jagadamba/
├── index.html                 # Main homepage
├── README.md                  # Documentation
│
├── css/                       # All CSS files
│   ├── main.css              # Main styles & navigation
│   ├── hero.css              # Hero section styles
│   ├── about.css             # About section styles
│   ├── gallery.css           # Gallery section styles
│   ├── contact.css           # Contact section styles
│   └── progress.css          # Progress report styles
│
├── js/                        # All JavaScript files
│   ├── main.js               # Main navigation & lightbox
│   ├── hero.js               # Hero section functionality
│   ├── about.js              # About section content
│   ├── gallery.js            # Gallery functionality
│   ├── contact.js            # Contact section content
│   └── progress.js           # Progress report functionality
│
├── sections/                  # Additional pages
│   └── progress.html         # Student progress report page
│
├── Photoes/                   # Images folder
│   ├── logo.png              # School logo
│   ├── favicon.ico           # Website favicon
│   ├── hero-bg.jpg           # Hero background image
│   ├── School_outer_look.jpg # School building
│   ├── principal.jpg         # Principal photo
│   ├── Director.jpg          # Director photo
│   ├── Partibha_smman.jpg    # Award ceremony 1
│   ├── Partibha_smman2.jpg   # Award ceremony 2
│   ├── Partibha_smman3.jpg   # Award ceremony 3
│   ├── Result.jpg            # Results image
│   └── Student/              # Student photos
│       ├── class_2/
│       └── class_3/
│
└── lottie/                    # Animation files
    ├── Kids.json             # Kids animation
    └── Bus_Transport.json    # Bus animation
```

## 🎨 Features

### ✅ Mobile-First Design
- Fully responsive on all devices
- Touch-friendly navigation
- Optimized for mobile performance

### ✅ Modular Architecture
- Separate CSS file for each section
- Separate JS file for each section
- Easy to maintain and update

### ✅ Student Progress Report
- Search by student ID
- View detailed marks
- Subject-wise grades
- Attendance tracking
- Performance summary

### ✅ Modern UI/UX
- Smooth animations
- Interactive gallery with lightbox
- Glassmorphism effects
- Beautiful color scheme

## 📸 Images Used

### Required Images:
1. **logo.png** - School logo (40x40px recommended)
2. **favicon.ico** - Browser tab icon
3. **hero-bg.jpg** - Hero section background (1920x1080px recommended)
4. **School_outer_look.jpg** - School building exterior
5. **principal.jpg** - Principal photograph
6. **Director.jpg** - Director photograph
7. **Partibha_smman.jpg** - Award ceremony photo 1
8. **Partibha_smman2.jpg** - Award ceremony photo 2
9. **Partibha_smman3.jpg** - Award ceremony photo 3
10. **Result.jpg** - Results announcement image

### Student Photos:
- Place student photos in `Photoes/Student/class_2/` and `Photoes/Student/class_3/`
- Format: student1.jpg, student2.jpg, etc.

## 🚀 How to Use

### 1. Setup
- Place all images in the `Photoes/` folder
- Ensure folder structure matches above

### 2. Student Progress Report
- Open `sections/progress.html`
- Enter student ID (STU001, STU002, STU003)
- View complete progress report

### 3. Add New Students
Edit `js/progress.js` and add new student data:

```javascript
'STU004': {
    name: 'छात्र का नाम',
    class: 'कक्षा 10-A',
    rollNo: '15',
    session: '2023-24',
    examType: 'वार्षिक परीक्षा',
    photo: '../Photoes/Student/class_3/student4.jpg',
    subjects: [
        { name: 'हिंदी', obtained: 85, total: 100, grade: 'A' },
        // Add more subjects...
    ],
    attendance: 95
}
```

## 🎯 Navigation

### Desktop:
- Top header with navigation links
- Smooth scroll to sections
- Active link highlighting

### Mobile:
- Bottom navigation bar
- Touch-friendly icons
- Easy one-thumb navigation

## 🔧 Customization

### Colors (css/main.css):
```css
--primary: #2563eb;    /* Blue */
--secondary: #f59e0b;  /* Orange */
--accent: #10b981;     /* Green */
```

### Content:
- Edit `js/about.js` for About section
- Edit `js/contact.js` for Contact info
- Edit `js/gallery.js` for Gallery images

## 📱 Browser Support
- Chrome (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)
- Mobile browsers

## 🎓 Sample Student IDs for Testing
- **STU001** - राज कुमार (Class 10-A)
- **STU002** - प्रिया शर्मा (Class 10-B)
- **STU003** - अमित वर्मा (Class 9-A)

## 📞 Support
For any issues or customization needs, contact the school administration.

---

**Made with ❤️ for श्री जगदम्बा स्कूल**
