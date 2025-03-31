import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import "./App.css";
import Dashboard from "./Dashboard";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const signUp = async () => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      setUser(res.user);
    } catch (err) {
      alert(err.message);
    }
  };

  const signIn = async () => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      setUser(res.user);
    } catch (err) {
      alert(err.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <div className="app">
      <div className="container">
        <h1
          className="app-title"
          onClick={() => window.location.reload()}
          style={{
            cursor: "pointer",
            textAlign: "center",
            fontSize: "1.75rem",
            fontWeight: "600",
            marginBottom: "2rem",
          }}
        >
          TrackMate 🚀
        </h1>

        <div className="card">
          {user ? (
            <Dashboard user={user} onLogout={logout} />
          ) : (
            <>
              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  placeholder="you@example.com"
                />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                  placeholder="••••••••"
                />
              </div>
              <div className="button-row">
                <button className="button-primary" onClick={signIn}>
                  Sign In
                </button>
                <button className="button-secondary" onClick={signUp}>
                  Sign Up
                </button>
              </div>
            </>
          )}
          {!user && (
            <div
              className="usage-guide"
              style={{
                marginTop: "2rem",
                background: "#f3f4f6",
                padding: "1.5rem",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                fontSize: "0.95rem",
                color: "#374151",
              }}
            >
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  marginBottom: "0.75rem",
                }}
              >
                What is TrackMate?
              </h2>
              <p style={{ marginBottom: "1.5rem" }}>
                <strong>TrackMate</strong> is your personal career fair
                assistant. It helps you track the jobs you’re interested in by
                letting you quickly save listings through QR scanning or link
                pasting. Perfect for use during fast-paced career fairs.
              </p>

              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  marginBottom: "1rem",
                }}
              >
                How to Use TrackMate
              </h2>
              <ol style={{ paddingLeft: "1.25rem", lineHeight: "1.7" }}>
                <li>📝 Sign up or sign in using your email and password.</li>
                <li>
                  🔑 Paste your Gemini API key on the next screen (you can
                  generate it from Google AI Studio).
                </li>
                <li>
                  📥 Add company applications by scanning a QR code or pasting
                  the job link.
                </li>
                <li>🔍 Track all your saved applications in one place.</li>
                <li>📱 Use on mobile to enable QR scanning functionality.</li>
              </ol>
              <p
                style={{
                  marginTop: "1rem",
                  fontStyle: "italic",
                  color: "#6b7280",
                }}
              >
                Your data is securely saved to your Firebase account. Only you
                can see your applications.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
