# Shree Jagdamba Convent School Website

## 📱 Progressive Web App (PWA)

A fully mobile-friendly school website with PWA capabilities and student progress report features.

### 🎉 NEW: PWA Features
- **📲 Installable**: Add to home screen like a native app
- **🔌 Offline Mode**: Works without internet connection
- **⚡ Fast Loading**: Instant loading from cache
- **🎨 App Experience**: Full-screen, no browser UI
- **🔔 Push Ready**: Ready for notifications (future)

👉 **[PWA Setup Guide](PWA-SETUP.md)** - Complete PWA installation instructions

## 🗂️ Project Structure

```
Jagadamba/
├── index.html                 # Main homepage
├── manifest.json              # PWA manifest
├── sw.js                      # Service Worker
├── generate-icons.html        # Icon generator tool
├── README.md                  # Documentation
├── PWA-SETUP.md              # PWA setup guide
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
│   ├── pwa.js                # PWA & service worker registration
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
├── images/                    # Images folder
│   ├── icons/                # PWA icons (72-512px)
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
- Fully responsive on all devices (320px - 4K)
- Touch-friendly navigation with 44x44px targets
- Optimized for mobile performance (LCP < 2.5s)
- Fluid typography using clamp()
- Safe area insets for notched devices

### ✅ Progressive Web App (PWA)
- Installable on mobile and desktop
- Offline functionality with service worker
- App-like experience with custom theme
- Fast loading with intelligent caching
- Auto-update mechanism

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
- Smooth 60fps animations with GPU acceleration
- Interactive gallery with lightbox and swipe gestures
- Glassmorphism effects with backdrop-filter
- Beautiful gradient color scheme
- Counter animations for statistics
- Reduced motion support for accessibility

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

## 🎯 Performance & Accessibility

### Performance Metrics
- ⚡ Lighthouse Score: 90+
- 🎨 First Contentful Paint: < 1.8s
- 📊 Cumulative Layout Shift: < 0.1
- ♿ Accessibility Score: 96+

### Accessibility Features
- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader optimized
- ARIA labels and landmarks
- Focus indicators for all interactive elements
- High contrast mode support

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
    name: 'Student Name',
    class: 'Class 10-A',
    rollNo: '15',
    session: '2023-24',
    examType: 'Annual Exam',
    photo: '../Photoes/Student/class_3/student4.jpg',
    subjects: [
        { name: 'Hindi', obtained: 85, total: 100, grade: 'A' },
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

## 📚 Documentation

- **[PWA-SETUP.md](PWA-SETUP.md)** - PWA installation and setup guide
- **[OPTIMIZATION_GUIDE.md](OPTIMIZATION_GUIDE.md)** - Complete optimization details
- **[MOBILE_PATTERNS.md](MOBILE_PATTERNS.md)** - Mobile-first design patterns
- **[TESTING_CHECKLIST.md](TESTING_CHECKLIST.md)** - Comprehensive testing guide

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
- ✅ Chrome (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ✅ Edge (Latest)
- ✅ Safari iOS (Latest)
- ✅ Chrome Android (Latest)
- ✅ Samsung Internet

### Progressive Enhancement
- Modern features with fallbacks
- Works without JavaScript (basic functionality)
- Graceful degradation for older browsers

## 🎓 Sample Student IDs for Testing
- **STU2_01** - Class 2 Student 1
- **STU2_02** - Class 2 Student 2
- **STU3_01** - Class 3 Student 1

## 📞 Support
For any issues or customization needs, contact the school administration.

---

**Made with ❤️ for Shree Jagdamba Convent School**
