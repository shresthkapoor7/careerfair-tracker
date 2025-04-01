import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import QrScanner from "react-qr-barcode-scanner";

function Home({ user, apiKey, onLogout }) {
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [companyLink, setCompanyLink] = useState("");
  const [companies, setCompanies] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [scannedUrl, setScannedUrl] = useState("");
  const [scannerError, setScannerError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    setIsMobile(/android|iphone|ipad|ipod/i.test(userAgent));
  }, []);

  const handleAddCompanyClick = () => {
    setShowAddOptions(true);
  };

  const handleScanBarcode = () => {
    setShowAddOptions(false);
    setShowBarcodeScanner(true);
  };

  const handlePasteLink = () => {
    setShowAddOptions(false);
    setShowLinkInput(true);
  };

  const fetchCompanies = async () => {
    if (!user) return;
    const userCompaniesRef = collection(db, "users", user.uid, "companies");
    const snapshot = await getDocs(userCompaniesRef);
    const companyList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCompanies(companyList);
  };

  useEffect(() => {
    fetchCompanies();
  });

  const handleDeleteCompany = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this company?"
    );
    if (!confirmed) return;

    try {
      const companyDocRef = doc(db, "users", user.uid, "companies", id);
      await deleteDoc(companyDocRef);
      setCompanies((prev) => prev.filter((company) => company.id !== id));
    } catch (error) {
      console.error("Failed to delete company:", error);
      alert("Failed to delete the company entry.");
    }
  };

  const handleCheckboxChange = async (id, currentValue) => {
    try {
      const companyDocRef = doc(db, "users", user.uid, "companies", id);
      await updateDoc(companyDocRef, { applied: !currentValue });
      setCompanies((prev) =>
        prev.map((company) =>
          company.id === id ? { ...company, applied: !currentValue } : company
        )
      );
    } catch (error) {
      console.error("Failed to update checkbox:", error);
    }
  };

  const handleLinkSubmit = async (e) => {
    e.preventDefault();
    if (!companyLink) return alert("Please enter a valid company link.");
    const alreadyExists = companies.some((c) => c.link === companyLink);
    if (alreadyExists) return alert("This company has already been added.");

    setLoading(true);

    const encodedLink = encodeURIComponent(companyLink);
    const apiUrl = `https://backend-job-tracker.onrender.com/parse-job?url=${encodedLink}&api_key=${apiKey}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      const userCompaniesRef = collection(db, "users", user.uid, "companies");
      const docRef = await addDoc(userCompaniesRef, {
        ...data,
        link: companyLink,
        applied: false,
      });

      setCompanies((prev) => [
        ...prev,
        { ...data, link: companyLink, id: docRef.id, applied: false },
      ]);
      alert("Company added and saved successfully!");
    } catch (error) {
      console.error("Failed to fetch job data:", error);
      alert("Failed to fetch company data.");
    }

    setLoading(false);
    setCompanyLink("");
    setShowLinkInput(false);
  };

  const handleScannedUrl = async (scannedUrl) => {
    if (!scannedUrl) return;
    const alreadyExists = companies.some((c) => c.link === scannedUrl);
    if (alreadyExists) return alert("This company is already added.");

    setLoading(true);

    const encodedLink = encodeURIComponent(scannedUrl);
    const apiUrl = `https://backend-job-tracker.onrender.com/parse-job?url=${encodedLink}&api_key=${apiKey}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      const userCompaniesRef = collection(db, "users", user.uid, "companies");
      const docRef = await addDoc(userCompaniesRef, {
        ...data,
        link: scannedUrl,
        applied: false,
      });

      setCompanies((prev) => [
        ...prev,
        { ...data, link: scannedUrl, id: docRef.id, applied: false },
      ]);
      alert("Scanned and added successfully!");
    } catch (error) {
      console.error("Error parsing scanned URL:", error);
      alert("Failed to parse scanned URL.");
    }

    setLoading(false);
    setShowBarcodeScanner(false);
    setScannedUrl("");
    setScannerError(false);
  };

  const handleCancel = () => {
    setShowAddOptions(false);
    setShowBarcodeScanner(false);
    setShowLinkInput(false);
    setCompanyLink("");
  };

  return (
    <div className="container">
      <div className="card">
        <h2>CareerFair Tracker</h2>
        <p>Welcome back, {user.email}</p>

        <div className="dashboard-section">
          <h3>Your Applications</h3>
          {companies.length > 0 && (
            <div className="companies-list">
              {companies.map((company, index) => (
                <div key={company.id || index} className="company-card">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h4 style={{ margin: 0 }}>{company.company}</h4>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <input
                        type="checkbox"
                        checked={company.applied || false}
                        onChange={() =>
                          handleCheckboxChange(company.id, company.applied)
                        }
                        title="Mark as applied"
                      />
                      <button
                        onClick={() => handleDeleteCompany(company.id)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#ef4444",
                          fontSize: "1.2rem",
                        }}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {company.role && (
                    <p
                      style={{
                        fontWeight: "500",
                        marginTop: "0.25rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <strong>Role:</strong> {company.role}
                    </p>
                  )}

                  {company.link && (
                    <a
                      href={company.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="company-link"
                    >
                      View Job Posting ↗
                    </a>
                  )}

                  {/* Removed the checkbox from here */}

                  {company.skills && company.skills.length > 0 ? (
                    <div className="skills-container">
                      <p className="skills-label">Required Skills:</p>
                      <div className="skills-list">
                        {company.skills.map((skill, idx) => (
                          <span key={idx} className="skill-tag">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="no-skills">No specific skills required</p>
                  )}

                  <p className="deadline">Deadline: {company.deadline}</p>
                </div>
              ))}
            </div>
          )}

          <button
            className="add-company-btn"
            onClick={handleAddCompanyClick}
            style={{ marginTop: "1.5rem" }}
          >
            Add a Company
          </button>

          {showAddOptions && (
            <div className="add-options">
              <h4>How would you like to add a company?</h4>
              <div className="options-container">
                {isMobile && (
                  <button
                    className="option-btn scan-btn"
                    onClick={handleScanBarcode}
                  >
                    <span>Scan Barcode</span>
                  </button>
                )}
                <button
                  className="option-btn link-btn"
                  onClick={handlePasteLink}
                >
                  <span>Paste Company Link</span>
                </button>
              </div>
              <div className="cancel-container">
                <button className="cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <img
                src="https://i.gifer.com/YQDs.gif"
                alt="Loading..."
                style={{
                  width: "100px",
                  height: "100px",
                  marginBottom: "1rem",
                }}
              />
              <p>Parsing and saving your job info...</p>
            </div>
          ) : (
            <>
              {showLinkInput && (
                <div className="link-input">
                  <h4>Enter Company Link</h4>
                  <div className="input-group">
                    <input
                      type="text"
                      className="input"
                      value={companyLink}
                      onChange={(e) => setCompanyLink(e.target.value)}
                      placeholder="https://company.com/careers"
                      required
                    />
                  </div>
                  <div className="form-buttons">
                    <button
                      onClick={handleLinkSubmit}
                      className="add-company-submit-btn"
                    >
                      Add Company
                    </button>
                    <button className="cancel-btn" onClick={handleCancel}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {showBarcodeScanner && (
                <div className="barcode-scanner">
                  <h4>Scan Company QR Code or Barcode</h4>

                  <QrScanner
                    onUpdate={(err, result) => {
                      if (result) {
                        setScannedUrl(result.text);
                        setScannerError(false);
                      } else if (err && !scannedUrl) {
                        setScannerError(true);
                        console.warn("Scanner error:", err);
                      }
                    }}
                    facingMode="environment"
                    style={{ width: "100%" }}
                  />

                  {scannedUrl && (
                    <div style={{ marginTop: "1rem", textAlign: "center" }}>
                      <p style={{ fontWeight: 500 }}>Scanned Link:</p>
                      <a
                        href={scannedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-block",
                          maxWidth: "100%",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          color: "#2563eb",
                          textDecoration: "underline",
                        }}
                      >
                        {scannedUrl}
                      </a>

                      <div style={{ marginTop: "1rem" }}>
                        <button
                          className="add-company-submit-btn"
                          onClick={() => handleScannedUrl(scannedUrl)}
                        >
                          Add Company
                        </button>
                      </div>
                    </div>
                  )}

                  {scannerError && !scannedUrl && (
                    <p
                      style={{
                        color: "red",
                        marginTop: "1rem",
                        marginBottom: "1rem",
                      }}
                    >
                      Scanner error. Try again.
                    </p>
                  )}

                  <button className="cancel-btn" onClick={handleCancel}>
                    Cancel
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <button className="button-danger" onClick={onLogout}>
        Log Out
      </button>
    </div>
  );
}

export default Home;