import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc, setDoc, enableNetwork } from "firebase/firestore";
import Home from "./Home";

function Dashboard({ onLogout }) {
  const [apiKey, setApiKey] = useState("");
  const [status, setStatus] = useState("loading");
  const [showHome, setShowHome] = useState(false);
  const [editing, setEditing] = useState(false);

  const user = auth.currentUser;

  useEffect(() => {
    const fetchKey = async () => {
      if (!user) return;

      try {
        await enableNetwork(db);
        const userDoc = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setApiKey(data.geminiKey || "");
        }
      } catch (err) {
        console.error("Firestore error:", err.message);
      } finally {
        setStatus("loaded");
      }
    };

    fetchKey();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    const userDoc = doc(db, "users", user.uid);
    await setDoc(userDoc, { geminiKey: apiKey });
    alert("API Key saved successfully!");
    setEditing(false);
  };

  const handleContinue = () => {
    setShowHome(true);
  };

  if (!user) return <p>You are not logged in.</p>;

  if (showHome) {
    return <Home user={user} apiKey={apiKey} onLogout={onLogout} />;
  }

  const maskedKey = apiKey
    ? apiKey.slice(0, 4) + "*".repeat(apiKey.length - 4)
    : "";

  return (
    <div>
      <h2>Welcome, {user.email}</h2>
      {status === "loading" ? (
        <p className="status-loading">Loading your Gemini API Key...</p>
      ) : (
        <>
          <div className="input-group">
            <label>Gemini API Key</label>
            {editing ? (
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste your Gemini API key"
                className="input"
              />
            ) : (
              <div
                style={{
                  padding: "0.65rem 0.75rem",
                  background: "#f9fafb",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.375rem",
                  fontFamily: "monospace",
                  fontSize: "0.9rem",
                  overflowX: "auto", // scroll horizontally on overflow
                  whiteSpace: "nowrap", // prevent line break
                  maxWidth: "100%", // prevent it from exceeding parent
                  boxSizing: "border-box",
                }}
              >
                {maskedKey}
              </div>
            )}
          </div>

          <div className="button-row">
            {editing ? (
              <button className="button-secondary" onClick={handleSave}>
                Save API Key
              </button>
            ) : (
              <button
                className="button-secondary"
                onClick={() => setEditing(true)}
              >
                Edit API Key
              </button>
            )}
            <button className="button-danger" onClick={onLogout}>
              Log Out
            </button>
          </div>

          <div className="continue-button-container">
            <button
              className="button-primary continue-button"
              onClick={handleContinue}
            >
              Continue
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
