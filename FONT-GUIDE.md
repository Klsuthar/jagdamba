# Font Guide - Shree Jagdamba Convent School Website

## 🎨 Font Family Overview

This website uses a unique combination of modern, clean fonts to create a professional and friendly appearance.

### Primary Fonts

1. **Oswald** - Header/Logo Font (Kept as Original)
   - Used for: School name in header
   - Weight: 500, 600, 700
   - Style: Bold, professional, institutional

2. **Nunito** - Headings Font (NEW)
   - Used for: All headings (h1, h2, h3)
   - Weight: 300, 400, 500, 600, 700, 800
   - Style: Rounded, friendly, modern
   - Perfect for: Titles, section headings, card titles

3. **Quicksand** - Body & Paragraph Font (NEW)
   - Used for: Body text, paragraphs, descriptions
   - Weight: 300, 400, 500, 600, 700
   - Style: Geometric, clean, readable
   - Perfect for: Content, descriptions, labels

## 📍 Font Usage by Section

### Header
- **School Name**: Oswald (600) - Maintains institutional identity

### Homepage (index.html)
- **Hero Title**: Nunito (800) - Bold, welcoming
- **Hero Subtitle**: Quicksand (500) - Friendly, readable
- **Stat Cards Numbers**: Nunito (700) - Strong, clear
- **Stat Cards Labels**: Quicksand (500) - Clean, modern
- **Feature Card Titles**: Nunito (600) - Professional
- **Feature Card Text**: Quicksand - Easy to read

### About Page
- **Page Headings**: Nunito (700) - Professional
- **Mission/Vision Titles**: Nunito (700) - Impactful
- **Body Text**: Quicksand - Comfortable reading
- **Leader Names**: Nunito (800) - Distinguished
- **Excellence Cards**: Nunito headings + Quicksand text

### Gallery Page
- **Section Titles**: Nunito (700) - Clear hierarchy
- **Gallery Item Titles**: Nunito (600) - Organized
- **Descriptions**: Quicksand - Informative

### Contact Page
- **Hero Title**: Nunito (700) - Welcoming
- **Contact Card Titles**: Nunito - Professional
- **Form Labels**: Quicksand (600) - Clear
- **Body Text**: Quicksand - Readable

## 🎯 Why These Fonts?

### Oswald (Header)
- Maintains brand consistency
- Professional and authoritative
- Perfect for institutional identity

### Nunito (Headings)
- Modern and friendly appearance
- Excellent readability at all sizes
- Rounded terminals create warmth
- Great for educational institutions

### Quicksand (Body)
- Geometric sans-serif with personality
- Excellent legibility for long-form content
- Friendly and approachable
- Works well with Nunito

## 🔧 Implementation

### Google Fonts Import
```html
<link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&family=Nunito:wght@300;400;500;600;700;800&family=Oswald:wght@500;600;700&display=swap" rel="stylesheet">
```

### CSS Usage
```css
/* Body - Default */
body {
    font-family: 'Quicksand', 'Nunito', sans-serif;
}

/* All Headings */
h1, h2, h3, h4, h5, h6 {
    font-family: 'Nunito', sans-serif;
}

/* Header Logo */
.logo h2 {
    font-family: 'Oswald', sans-serif;
}

/* Paragraphs & Body Text */
p, span, label {
    font-family: 'Quicksand', sans-serif;
}
```

## 📊 Font Weights Guide

### Nunito Weights
- 300: Light (rarely used)
- 400: Regular (body headings)
- 500: Medium (subheadings)
- 600: Semi-Bold (card titles)
- 700: Bold (main headings)
- 800: Extra Bold (hero titles)

### Quicksand Weights
- 300: Light (subtle text)
- 400: Regular (body text)
- 500: Medium (emphasized text)
- 600: Semi-Bold (labels, buttons)
- 700: Bold (important text)

### Oswald Weights
- 500: Medium (navigation)
- 600: Semi-Bold (logo)
- 700: Bold (emphasis)

## 🎨 Design Philosophy

1. **Hierarchy**: Nunito for headings creates clear visual hierarchy
2. **Readability**: Quicksand ensures comfortable reading experience
3. **Consistency**: Oswald maintains brand identity in header
4. **Personality**: Rounded fonts create friendly, approachable feel
5. **Professionalism**: Clean, modern fonts convey quality education

## 📱 Mobile Optimization

All fonts are optimized for mobile devices:
- Responsive font sizes using clamp()
- Proper line-height for readability
- Optimized font weights for small screens
- Fast loading with font-display: swap

## ✅ Benefits

1. **Unique Identity**: Different from typical school websites
2. **Modern Look**: Contemporary, fresh design
3. **Better Readability**: Optimized for all screen sizes
4. **Professional**: Maintains institutional credibility
5. **Friendly**: Approachable for parents and students
6. **Fast Loading**: Optimized Google Fonts implementation

---

**Last Updated**: December 2024
**Font Combination**: Oswald + Nunito + Quicksand
