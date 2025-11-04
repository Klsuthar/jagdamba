# 🚀 Quick Start Guide

## श्री जगदम्बा स्कूल वेबसाइट - तुरंत शुरू करें

---

## 📁 Step 1: File Structure Check

सुनिश्चित करें कि आपके पास यह structure है:

```
Jagadamba/
├── index.html          ✅
├── css/                ✅ (6 files)
├── js/                 ✅ (6 files)
├── sections/           ✅ (progress.html)
├── Photoes/            ✅ (images)
└── lottie/             ✅ (animations)
```

---

## 🌐 Step 2: Open Website

### Option 1: Direct Open
1. `index.html` पर double-click करें
2. Browser में खुल जाएगा

### Option 2: Live Server (Recommended)
1. VS Code में open करें
2. Live Server extension install करें
3. Right-click → "Open with Live Server"

---

## 📱 Step 3: Test Mobile View

### Chrome DevTools:
1. Press `F12`
2. Click device icon (📱)
3. Select "iPhone 12 Pro" या "Samsung Galaxy S20"
4. Test navigation और features

---

## 🎓 Step 4: Test Progress Report

1. Navigate to "प्रगति रिपोर्ट" section
2. Enter student ID:
   - `STU001` - राज कुमार
   - `STU002` - प्रिया शर्मा
   - `STU003` - अमित वर्मा
3. Click "खोजें"
4. View complete report

---

## ✏️ Step 5: Customize Content

### Change School Name:
**File**: `index.html` (line 20)
```html
<h2>श्री जगदम्बा स्कूल</h2>
```

### Change Colors:
**File**: `css/main.css` (lines 1-5)
```css
--primary: #2563eb;    /* Change this */
--secondary: #f59e0b;  /* Change this */
```

### Update Contact Info:
**File**: `js/contact.js` (lines 10-25)
```javascript
<p>Your Address Here</p>
<p>Your Phone Here</p>
<p>Your Email Here</p>
```

### Add Gallery Images:
**File**: `js/gallery.js` (lines 4-11)
```javascript
const galleryData = [
    { thumb: 'path/to/image.jpg', full: 'path/to/image.jpg', alt: 'Description' },
    // Add more...
];
```

---

## 👨‍🎓 Step 6: Add New Students

**File**: `js/progress.js`

```javascript
'STU004': {
    name: 'नया छात्र',
    class: 'कक्षा 10-A',
    rollNo: '20',
    session: '2023-24',
    examType: 'वार्षिक परीक्षा',
    photo: '../Photoes/Student/class_3/student4.jpg',
    subjects: [
        { name: 'हिंदी', obtained: 85, total: 100, grade: 'A' },
        { name: 'अंग्रेजी', obtained: 78, total: 100, grade: 'B' },
        { name: 'गणित', obtained: 92, total: 100, grade: 'A' },
        { name: 'विज्ञान', obtained: 88, total: 100, grade: 'A' },
        { name: 'सामाजिक विज्ञान', obtained: 82, total: 100, grade: 'A' }
    ],
    attendance: 95
}
```

---

## 🎨 Step 7: Replace Images

### Logo:
1. Replace `Photoes/logo.png`
2. Size: 200x200px
3. Format: PNG (transparent background)

### Hero Background:
1. Replace `Photoes/hero-bg.jpg`
2. Size: 1920x1080px
3. Format: JPG

### Gallery Images:
1. Add images to `Photoes/` folder
2. Update `js/gallery.js`
3. Add image paths

---

## 🔍 Common Issues & Solutions

### Issue 1: Images not showing
**Solution**: 
- Check file paths
- Ensure images are in `Photoes/` folder
- Check file names (case-sensitive)

### Issue 2: Mobile nav not working
**Solution**:
- Clear browser cache
- Check `js/main.js` is loaded
- Open browser console for errors

### Issue 3: Progress report not loading
**Solution**:
- Check student ID format (uppercase)
- Verify `js/progress.js` has student data
- Check student photo paths

### Issue 4: Styles not applying
**Solution**:
- Check all CSS files are linked in HTML
- Clear browser cache (Ctrl + F5)
- Verify CSS file paths

---

## 📊 Features Checklist

- ✅ Mobile-friendly navigation
- ✅ Responsive design (all devices)
- ✅ Hero section with animation
- ✅ About section (3 cards)
- ✅ Gallery with lightbox
- ✅ Contact information
- ✅ Student progress report
- ✅ Search functionality
- ✅ Smooth scrolling
- ✅ Active link highlighting

---

## 🎯 Next Steps

### For Basic Use:
1. ✅ Replace logo and images
2. ✅ Update contact information
3. ✅ Add student data
4. ✅ Test on mobile devices

### For Advanced Use:
1. Add more sections
2. Integrate with backend
3. Add admission form
4. Add teacher profiles
5. Add news/announcements

---

## 📱 Mobile Testing Checklist

Test on these screen sizes:
- [ ] 320px (iPhone SE)
- [ ] 375px (iPhone 12)
- [ ] 414px (iPhone 12 Pro Max)
- [ ] 768px (iPad)
- [ ] 1024px (iPad Pro)
- [ ] 1920px (Desktop)

---

## 🆘 Need Help?

### Documentation:
- `README.md` - Complete documentation
- `IMAGES_LIST.md` - Image requirements
- `QUICK_START.md` - This file

### File Structure:
```
css/     → All styling files
js/      → All functionality files
sections/ → Additional pages
Photoes/ → All images
```

### Key Files:
- `index.html` - Main page
- `sections/progress.html` - Progress report
- `css/main.css` - Main styles
- `js/main.js` - Main functionality
- `js/progress.js` - Student data

---

## ✅ Final Checklist

Before going live:
- [ ] All images replaced
- [ ] Contact info updated
- [ ] Student data added
- [ ] Tested on mobile
- [ ] Tested on desktop
- [ ] All links working
- [ ] No console errors
- [ ] Fast loading speed

---

## 🎉 You're Ready!

Your website is now ready to use. Enjoy! 🚀

**Website Features**:
- 📱 100% Mobile Friendly
- 🎨 Modern Design
- ⚡ Fast Loading
- 📊 Progress Reports
- 🖼️ Image Gallery
- 📞 Contact Info

---

**Made with ❤️ for श्री जगदम्बा स्कूल**
