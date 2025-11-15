# 🔥 Firebase Setup Guide - Admin Panel

Complete guide to setup Firebase authentication and database for the admin panel.

## 📋 Prerequisites
- Google Account
- Basic understanding of Firebase

---

## 🚀 Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: `jagdamba-school`
4. Disable Google Analytics (optional)
5. Click **"Create project"**

---

## 🔧 Step 2: Setup Firestore Database

1. In Firebase Console, go to **"Firestore Database"**
2. Click **"Create database"**
3. Select **"Start in production mode"**
4. Choose location: `asia-south1` (Mumbai)
5. Click **"Enable"**

### Setup Security Rules:
Go to **"Rules"** tab and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Contact submissions - only authenticated users can read/write
    match /contactSubmissions/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Click **"Publish"**

---

## 🔐 Step 3: Setup Authentication

1. Go to **"Authentication"** in Firebase Console
2. Click **"Get started"**
3. Click **"Email/Password"** provider
4. Enable **"Email/Password"**
5. Click **"Save"**

### Create Admin User:
1. Go to **"Users"** tab
2. Click **"Add user"**
3. Enter:
   - Email: `admin@jagdamba.com`
   - Password: `Admin@123` (change this!)
4. Click **"Add user"**

---

## 🌐 Step 4: Register Web App

1. In Firebase Console, click **⚙️ Settings** > **"Project settings"**
2. Scroll to **"Your apps"** section
3. Click **Web icon** `</>`
4. Enter app nickname: `Jagdamba School Website`
5. Check **"Also set up Firebase Hosting"**
6. Click **"Register app"**

### Copy Firebase Config:
You'll see something like:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "jagdamba-school.firebaseapp.com",
  projectId: "jagdamba-school",
  storageBucket: "jagdamba-school.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

**COPY THIS CONFIG!** You'll need it in the next step.

---

## 📝 Step 5: Update Your Code

Replace Firebase config in these 3 files:

### 1. `admin/login.html`
Find line ~60 and replace:
```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    // ... paste your config here
};
```

### 2. `admin/dashboard.html`
Find line ~180 and replace with your config

### 3. `js/contact.js`
Find line ~140 and replace with your config

---

## 🎯 Step 6: Test Everything

### Test Contact Form:
1. Open `pages/contact.html`
2. Fill and submit the form
3. Check Firebase Console > Firestore Database
4. You should see a new document in `contactSubmissions` collection

### Test Admin Login:
1. Open `admin/login.html`
2. Login with:
   - Email: `admin@jagdamba.com`
   - Password: `Admin@123`
3. You should be redirected to dashboard
4. You should see the contact form submission

---

## 🔒 Security Best Practices

### 1. Change Default Password:
```
Go to Firebase Console > Authentication > Users
Click on admin user > Reset password
```

### 2. Add More Admins:
```
Firebase Console > Authentication > Users > Add user
```

### 3. Enable 2FA (Recommended):
```
Firebase Console > Authentication > Sign-in method
Enable "Email link (passwordless sign-in)"
```

### 4. Setup Firestore Indexes:
```
Firebase Console > Firestore Database > Indexes
Create index on: contactSubmissions > timestamp (Descending)
```

---

## 📱 Step 7: Deploy to Firebase Hosting (Optional)

### Install Firebase CLI:
```bash
npm install -g firebase-tools
```

### Login to Firebase:
```bash
firebase login
```

### Initialize Project:
```bash
cd jagdamba
firebase init hosting
```

Select:
- Use existing project: `jagdamba-school`
- Public directory: `.` (current directory)
- Single-page app: `No`
- Overwrite files: `No`

### Deploy:
```bash
firebase deploy
```

Your site will be live at: `https://jagdamba-school.web.app`

---

## 🎨 Admin Panel Features

### ✅ Dashboard Features:
- 📊 Real-time statistics
- 🔍 Search and filter submissions
- 👁️ View detailed submission
- 🗑️ Delete submissions
- 📱 Fully responsive design

### ✅ Security Features:
- 🔐 Email/Password authentication
- 🚫 Protected routes (auto-redirect if not logged in)
- 🔒 Secure Firestore rules
- 🔑 Session management

---

## 🆘 Troubleshooting

### Issue: "Firebase not defined"
**Solution:** Check if Firebase config is correctly added

### Issue: "Permission denied"
**Solution:** Check Firestore security rules and ensure user is authenticated

### Issue: "Can't login"
**Solution:** Verify email/password in Firebase Console > Authentication > Users

### Issue: "Form not saving"
**Solution:** Check browser console for errors and verify Firebase config

---

## 📞 Admin Panel Access

### Login URL:
```
http://localhost/admin/login.html
or
https://your-domain.com/admin/login.html
```

### Default Credentials:
```
Email: admin@jagdamba.com
Password: Admin@123
```

**⚠️ IMPORTANT: Change the default password immediately!**

---

## 🎓 What You Get

### For Parents/Students:
- ✅ Easy contact form
- ✅ Instant submission confirmation
- ✅ No page reload needed

### For Admin:
- ✅ Secure login system
- ✅ Real-time dashboard
- ✅ All submissions in one place
- ✅ Search and filter options
- ✅ View detailed information
- ✅ Delete unwanted submissions

---

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

---

**Made with ❤️ for Shree Jagdamba Convent School**

Need help? Contact your web developer.
