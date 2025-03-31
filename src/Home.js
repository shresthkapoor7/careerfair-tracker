import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

function Home({ user, apiKey, onLogout }) {
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [companyLink, setCompanyLink] = useState("");
  const [companies, setCompanies] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

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

  useEffect(() => {
    const fetchCompanies = async () => {
      if (!user) return;
      const userCompaniesRef = collection(db, "users", user.uid, "companies");
      const snapshot = await getDocs(userCompaniesRef);
      const companyList = snapshot.docs.map((doc) => doc.data());
      setCompanies(companyList);
    };

    fetchCompanies();
  }, [user]);

  const handleLinkSubmit = async (e) => {
    e.preventDefault();

    if (!companyLink) return alert("Please enter a valid company link.");
    const alreadyExists = companies.some((c) => c.link === companyLink);
    if (alreadyExists) return alert("This company has already been added.");

    const encodedLink = encodeURIComponent(companyLink);
    const apiUrl = `https://backend-job-tracker.onrender.com/parse-job?url=${encodedLink}&api_key=${apiKey}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      console.log("Parsed job data:", data);

      // Save to Firestore
      const userCompaniesRef = collection(db, "users", user.uid, "companies");
      await addDoc(userCompaniesRef, { ...data, link: companyLink });

      // Add to local state
      setCompanies((prev) => [...prev, { ...data, link: companyLink }]);

      alert("Company added and saved successfully!");
    } catch (error) {
      console.error("Failed to fetch job data:", error);
      alert("Failed to fetch company data.");
    }

    setCompanyLink("");
    setShowLinkInput(false);
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
                <div key={index} className="company-card">
                  <h4>{company.company}</h4>
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
                  <button className="option-btn scan-btn" onClick={handleScanBarcode}>
                    <span>Scan Barcode</span>
                  </button>
                )}
                <button className="option-btn link-btn" onClick={handlePasteLink}>
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
                <button onClick={handleLinkSubmit} className="add-company-submit-btn">
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
              <h4>Scan Company Barcode</h4>
              <div className="scanner-container">
                <div className="mock-scanner">
                  <p>Camera access required</p>
                </div>
              </div>
              <button className="cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          )}
        </div>

        <button className="button-danger" onClick={onLogout}>
          Log Out
        </button>
      </div>
    </div>
  );
}

export default Home;