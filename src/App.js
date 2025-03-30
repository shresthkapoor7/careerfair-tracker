import React, { useState } from "react";
import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import "./App.css"; // using your existing CSS classes

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(auth.currentUser || null);

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
      <div className="container" style={{ maxWidth: "600px", marginTop: "3rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: "600", marginBottom: "1.5rem" }}>
          CareerFair Tracker Login
        </h1>

        <div style={{
          background: "#fff",
          padding: "2rem",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
        }}>
          {user ? (
            <>
              <p style={{ marginBottom: "1.5rem" }}>
                Welcome, <strong>{user.email}</strong>
              </p>
              <button
                onClick={logout}
                style={{
                  background: "#ef4444",
                  color: "#fff",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "8px",
                  border: "none",
                  width: "100%",
                  fontWeight: "500",
                  cursor: "pointer"
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <div className="input-group" style={{ marginBottom: "1rem" }}>
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  placeholder="you@example.com"
                />
              </div>
              <div className="input-group" style={{ marginBottom: "1.5rem" }}>
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                  placeholder="••••••••"
                />
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  onClick={signIn}
                  className="button-primary"
                  style={{
                    background: "#3b82f6",
                    color: "#fff",
                    padding: "0.75rem 1rem",
                    borderRadius: "8px",
                    border: "none",
                    flex: 1,
                    cursor: "pointer"
                  }}
                >
                  Sign In
                </button>
                <button
                  onClick={signUp}
                  className="button-secondary"
                  style={{
                    background: "#10b981",
                    color: "#fff",
                    padding: "0.75rem 1rem",
                    borderRadius: "8px",
                    border: "none",
                    flex: 1,
                    cursor: "pointer"
                  }}
                >
                  Sign Up
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;