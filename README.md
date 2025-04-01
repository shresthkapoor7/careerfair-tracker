# TrackMate 🚀

**TrackMate** is your personal career fair assistant built with React and Firebase. It helps you **scan QR codes or paste job links** to instantly save and track job opportunities during fast-paced career fairs. Uses Gemini API for job parsing.

---

### 🔗 Backend Available At
👉 [https://github.com/shresthkapoor7/backend-job-tracker](https://github.com/shresthkapoor7/backend-job-tracker)

---

## 📸 Features

- 🔍 Parse job listings using [Gemini API](https://makersuite.google.com/app)
- 📷 Scan company job QR codes at career fairs
- 🔗 Paste a company job URL directly
- 🧠 Auto-extracts company, role, skills, and deadline
- ✅ Mark companies as *applied*
- 🗑️ Delete irrelevant or duplicate companies
- 🔐 Secure per-user data storage with Firebase Firestore
- 📱 Mobile friendly (camera-based QR scanner support)
- 🧠 Fun rotating messages to keep you motivated

---

## 🪪 Tech Stack

- React (Frontend)
- Firebase Authentication
- Firebase Firestore
- Gemini API (Google AI Studio)
- Vite (for build tooling)
- CSS Modules + Tailwind-like styling

---

## 🛠 Setup Instructions

1. Clone this repo:
   ```bash
   git clone https://github.com/your-username/trackmate.git
   cd trackmate
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup Firebase:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project and Firestore DB (in *test mode* initially)
   - Enable Firebase Authentication (Email/Password)
   - Replace your Firebase config inside `firebase.js`

4. Setup Gemini API:
   - Go to [Google AI Studio](https://makersuite.google.com/)
   - Generate an API key and paste it into the app after signing in

5. Run the development server:
   ```bash
   npm start
   ```

---

## 🚀 Deployment

You can deploy the frontend using:
- **Netlify**, **Vercel**, or **GitHub Pages**

Make sure Firebase Firestore Rules are tightened before going live:
```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      match /companies/{companyId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

---

## 💡 How to Use

1. 📝 Sign up or sign in using your email and password.
2. 🔑 Paste your Gemini API key on the next screen.
3. 📅 Add companies via QR scan or link paste.
4. ✅ Mark them as applied when done.
5. 🔍 All your saved applications show up on your dashboard.
6. 🗑️ You can delete entries if no longer needed.

---

## 👤 Author

**Shresth Kapoor**
GitHub: [@shresthkapoor7](https://github.com/shresthkapoor7)
Email: shresthkapoor7@gmail.com

---

## 📃 License

This project is licensed under the MIT License.

