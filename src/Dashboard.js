import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { enableNetwork } from "firebase/firestore";
import Home from "./Home"; // Import the Home component

function Dashboard({ onLogout }) {
  const [apiKey, setApiKey] = useState("");
  const [status, setStatus] = useState("loading");
  const [showHome, setShowHome] = useState(false);

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
  };

  const handleContinue = () => {
    setShowHome(true);
  };

  if (!user) return <p>You are not logged in.</p>;

  // If showHome is true, render the Home component instead
  if (showHome) {
    return <Home user={user} onLogout={onLogout} />;
  }

  return (
    <div>
      <h2>Welcome, {user.email}</h2>
      {status === "loading" ? (
        <p className="status-loading">Loading your Gemini API Key...</p>
      ) : (
        <>
          <div className="input-group">
            <label>Gemini API Key</label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Paste your Gemini API key"
              className="input"
            />
          </div>
          <div className="button-row">
            <button className="button-secondary" onClick={handleSave}>
              Save API Key
            </button>
            <button className="button-danger" onClick={onLogout}>
              Log Out
            </button>
          </div>
          <div className="continue-button-container">
            <button className="button-primary continue-button" onClick={handleContinue}>
              Continue
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;