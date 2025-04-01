# 🚀 TrackMate: Career Fair Job Tracker

TrackMate is your personal assistant for career fairs — scan QR codes or paste job links to instantly save job postings, deadlines, and skill requirements to your dashboard.

Built with **React**, **Firebase**, and **Gemini API** 💡

---

## 🔧 Setup Instructions

### 1. Clone the Repo
```bash
git clone https://github.com/your-username/trackmate.git
cd trackmate
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Add Firebase Config
Create a `.env` file at the root with your Firebase config:
```
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
```

> ✅ Make sure your Firestore is set up in **Test Mode** initially. You can update rules later for production.

---

## 🚀 Running Locally
```bash
npm start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ✨ Features

- 📥 Scan QR code or paste job link
- 🔍 Auto-parses job details (company, role, deadline, skills)
- ✅ Checkbox to mark "Applied"
- 🗑️ Delete invalid or duplicate entries
- 🔐 Firebase-authenticated per-user database
- 📱 Mobile ready + QR scanner support

---

## 📦 Production Build
```bash
npm run build
```
This builds the app for production in the `build` folder.

---

## 📄 Learn More
- [React Docs](https://reactjs.org/)
- [Firebase Docs](https://firebase.google.com/docs)
- [Create React App Docs](https://create-react-app.dev/)

---

## 🛠 Tech Stack
- React
- Firebase (Auth + Firestore)
- Gemini API (Google AI Studio)
- QrScanner (react-qr-barcode-scanner)
- Tailwind (optional styling)

---

## 💡 Usage Tips
- Use on mobile to enable QR code scanning
- Paste your Gemini API key to parse job links
- All your data is securely tied to your Firebase user account

---

## 🙌 Contributions
Open to suggestions or pull requests — let's make this the go-to app for career fairs!

---

## 📢 License
MIT
