# 🔐 Admin Panel - Quick Start

## 🚀 Quick Setup (5 Minutes)

### 1️⃣ Setup Firebase
Follow the complete guide: **[FIREBASE-SETUP.md](../FIREBASE-SETUP.md)**

### 2️⃣ Update Firebase Config
Replace `YOUR_API_KEY` and other placeholders in:
- `admin/login.html` (line ~60)
- `admin/dashboard.html` (line ~180)
- `js/contact.js` (line ~140)

### 3️⃣ Create Admin User
Firebase Console > Authentication > Add user:
- Email: `admin@jagdamba.com`
- Password: `Admin@123`

### 4️⃣ Access Admin Panel
Open: `admin/login.html`

---

## 📱 Features

### Login Page (`login.html`)
- ✅ Secure email/password authentication
- ✅ Error handling
- ✅ Auto-redirect to dashboard
- ✅ Beautiful gradient design

### Dashboard (`dashboard.html`)
- ✅ Real-time contact submissions
- ✅ Statistics cards (Total, Admission, Feedback, Today)
- ✅ Search by name/phone/student
- ✅ Filter by subject and class
- ✅ View detailed submission
- ✅ Delete submissions
- ✅ Responsive design

---

## 🎯 How It Works

```
Contact Form (pages/contact.html)
         ↓
    Firebase Firestore
         ↓
Admin Dashboard (admin/dashboard.html)
```

1. **User fills contact form** → Data saved to Firebase
2. **Admin logs in** → Sees all submissions in real-time
3. **Admin can view/delete** → Manage submissions easily

---

## 🔒 Security

- ✅ Firebase Authentication required
- ✅ Protected routes (auto-redirect)
- ✅ Firestore security rules
- ✅ No direct database access

---

## 📊 Dashboard Preview

```
┌─────────────────────────────────────────┐
│  Admin Dashboard              [Logout]  │
├─────────────────────────────────────────┤
│  [📧 Total] [🎓 Admission] [💬 Feedback] │
│     15          8              4         │
├─────────────────────────────────────────┤
│  🔍 Search  [Subject ▼]  [Class ▼]      │
├─────────────────────────────────────────┤
│  Date    Name    Phone    Student  ...  │
│  ────────────────────────────────────   │
│  Today   Ram     98288... Sita    [👁️🗑️] │
│  Today   Shyam   98288... Gita    [👁️🗑️] │
└─────────────────────────────────────────┘
```

---

## 🆘 Troubleshooting

**Can't login?**
- Check Firebase config is correct
- Verify user exists in Firebase Console
- Check browser console for errors

**No submissions showing?**
- Submit a test form first
- Check Firestore rules allow read access
- Verify collection name is `contactSubmissions`

**Form not saving?**
- Check Firebase config in `contact.js`
- Verify Firestore is enabled
- Check browser console for errors

---

## 📞 Support

For detailed setup instructions, see: **[FIREBASE-SETUP.md](../FIREBASE-SETUP.md)**

---

**🎓 Shree Jagdamba Convent School**
