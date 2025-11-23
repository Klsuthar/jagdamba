# Shree Jagdamba Convent School Website Development

You are working on a Progressive Web App (PWA) for Shree Jagdamba Convent School. This is a fully mobile-friendly school website with student progress report features.

## Project Context

### Architecture
- **Mobile-First Design**: Responsive on all devices (320px - 4K)
- **Modular Structure**: Separate CSS/JS files for each section
- **PWA Features**: Installable, offline mode, service worker
- **Student Progress System**: Search by ID, detailed reports

### Key Features
- Touch-friendly navigation (44x44px targets)
- Smooth 60fps animations with GPU acceleration
- Glassmorphism effects with backdrop-filter
- Counter animations for statistics
- Interactive gallery with lightbox and swipe gestures
- WCAG 2.1 AA accessibility compliance

### File Structure
```
jagdamba/
├── index.html (main homepage)
├── manifest.json (PWA manifest)
├── sw.js (service worker)
├── css/ (modular stylesheets)
├── js/ (modular JavaScript)
├── sections/progress.html (student reports)
├── pages/ (about, gallery, contact)
├── images/ (all media assets)
└── components/ (reusable HTML components)
```

### Performance Requirements
- Lighthouse Score: 90+
- First Contentful Paint: < 1.8s
- Cumulative Layout Shift: < 0.1
- Accessibility Score: 96+

### Color Scheme
```css
--primary: #2563eb;    /* Blue */
--secondary: #f59e0b;  /* Orange */
--accent: #10b981;     /* Green */
```

### Student Data Format
```javascript
'STU2_01': {
    name: 'Student Name',
    class: 'Class 2-A',
    rollNo: '01',
    session: '2023-24',
    examType: 'Annual Exam',
    photo: '../images/Student/class_2/student1.jpg',
    subjects: [
        { name: 'Hindi', obtained: 85, total: 100, grade: 'A' }
    ],
    attendance: 95
}
```

## Development Guidelines

### Code Standards
- Write minimal, efficient code
- Follow mobile-first approach
- Maintain modular architecture
- Ensure accessibility compliance
- Use semantic HTML5 elements
- Implement proper ARIA labels

### Performance Optimization
- Optimize images (WebP format preferred)
- Minimize CSS/JS bundle sizes
- Use efficient animations (transform/opacity)
- Implement lazy loading
- Cache static assets

### Browser Support
- Chrome, Firefox, Safari, Edge (latest)
- iOS Safari, Chrome Android (latest)
- Progressive enhancement for older browsers

### Testing Requirements
- Test on multiple devices/screen sizes
- Verify PWA installation works
- Check offline functionality
- Validate accessibility with screen readers
- Test student progress report system

When working on this project, prioritize mobile experience, maintain the modular structure, and ensure all features work offline through the service worker.