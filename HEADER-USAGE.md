# Header Component Usage Guide

## 📁 Files Created
- `components/header.html` - Header HTML structure
- `css/header.css` - Header styles
- `js/header.js` - Header functionality

## 🚀 How to Use

### Method 1: Direct Include (Recommended for static pages)

Add this in your HTML `<head>`:
```html
<link rel="stylesheet" href="../css/header.css">
```

Add this where you want the header:
```html
<!-- Include header component -->
<div id="header-placeholder"></div>
```

Add this before closing `</body>`:
```html
<script src="../js/header.js"></script>
<script>loadHeader();</script>
```

### Method 2: Copy-Paste (For index.html)

1. Copy content from `components/header.html`
2. Paste it in your HTML file
3. Add CSS: `<link rel="stylesheet" href="css/header.css">`
4. Add JS: `<script src="js/header.js"></script>`

## 📝 Example Usage

### For pages in root folder (index.html):
```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="css/header.css">
</head>
<body>
    <div id="header-placeholder"></div>
    
    <!-- Your content here -->
    
    <script src="js/header.js"></script>
    <script>loadHeader();</script>
</body>
</html>
```

### For pages in subfolders (pages/about.html):
```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="../css/header.css">
</head>
<body>
    <div id="header-placeholder"></div>
    
    <!-- Your content here -->
    
    <script src="../js/header.js"></script>
    <script>loadHeader();</script>
</body>
</html>
```

## ✨ Features
- ✅ Responsive design (mobile + desktop)
- ✅ Mobile hamburger menu
- ✅ Active link highlighting
- ✅ Smooth animations
- ✅ Scroll effects
- ✅ Accessibility support

## 🎨 Customization

### Change colors in `css/header.css`:
```css
.nav-link:hover { color: #6366f1; } /* Change hover color */
```

### Update navigation links in `components/header.html`:
```html
<a href="../pages/new-page.html" class="nav-link">New Page</a>
```

## 📱 Mobile Menu
- Automatically shows on screens < 768px
- Toggle with hamburger icon
- Closes on link click

---
**Made for Shree Jagdamba Convent School**
