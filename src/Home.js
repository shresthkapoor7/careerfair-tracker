import React, { useState } from "react";

function Home({ user, onLogout }) {
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [companyLink, setCompanyLink] = useState("");

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

  const handleLinkSubmit = (e) => {
    e.preventDefault();
    // Here you would process the company link
    console.log("Processing company link:", companyLink);
    // Reset the form and state
    setCompanyLink("");
    setShowLinkInput(false);
    // You would normally add the company to your database here
    alert("Company added successfully!");
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
          <div className="card inner-card">
            {!showAddOptions && !showBarcodeScanner && !showLinkInput ? (
              <>
                <p>You haven't tracked any applications yet.</p>
                <button
                  className="add-company-btn"
                  onClick={handleAddCompanyClick}
                >
                  Add a Company
                </button>
              </>
            ) : showAddOptions ? (
              <div className="add-options">
                <h4>How would you like to add a company?</h4>
                <div className="options-container">
                  <button
                    className="option-btn scan-btn"
                    onClick={handleScanBarcode}
                  >
                    <span>Scan Barcode</span>
                  </button>
                  <button
                    className="option-btn link-btn"
                    onClick={handlePasteLink}
                  >
                    <span>Paste Company Link</span>
                  </button>
                </div>
                <div className="cancel-container">
                  <button
                    className="cancel-btn"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : showLinkInput ? (
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
                  <button
                    className="cancel-btn"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="barcode-scanner">
                <h4>Scan Company Barcode</h4>
                <div className="scanner-container">
                  <div className="mock-scanner">
                    <p>Camera access required</p>
                  </div>
                </div>
                <button
                  className="cancel-btn"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-section">
          <h3>Upcoming Career Fairs</h3>
          <div className="card">
            <div className="event-item">
              <h4>Spring 2025 Career Fair</h4>
              <p>April 15, 2025 • 10:00 AM - 4:00 PM</p>
              <p>Student Union Building</p>
            </div>
          </div>
        </div>

        <button className="button-danger" onClick={onLogout}>Log Out</button>
      </div>
    </div>
  );
}

export default Home;