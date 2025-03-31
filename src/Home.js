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

  // Mock function for barcode scanning
  const handleScanComplete = (result) => {
    console.log("Barcode scanned:", result);
    setShowBarcodeScanner(false);
    // Process the barcode result here
    alert("Company barcode scanned successfully!");
  };

  return (
    <div className="container">
      <div className="card">
        <h2>CareerFair Tracker</h2>
        <p>Welcome back, {user.email}</p>

        <div className="dashboard-section">
          <h3>Your Applications</h3>
          <div className="card">
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
                <div className="options-buttons">
                  <button
                    className="option-btn scan-btn"
                    onClick={handleScanBarcode}
                  >
                    Scan Barcode
                  </button>
                  <button
                    className="option-btn link-btn"
                    onClick={handlePasteLink}
                  >
                    Paste Company Link
                  </button>
                </div>
                <button
                  className="cancel-btn"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            ) : showBarcodeScanner ? (
              <div className="barcode-scanner">
                <h4>Scan Company Barcode</h4>
                <div className="scanner-container">
                  {/* This would be replaced with an actual barcode scanner component */}
                  <div className="mock-scanner">
                    <p>Camera access required</p>
                    {/* Mock button to simulate scanning */}
                    <button
                      onClick={() => handleScanComplete("COMPANY12345")}
                      className="scan-complete-btn"
                    >
                      Simulate Successful Scan
                    </button>
                  </div>
                </div>
                <button
                  className="cancel-btn"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="link-input">
                <h4>Enter Company Link</h4>
                <form onSubmit={handleLinkSubmit}>
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
                      type="submit"
                      className="submit-btn"
                    >
                      Add Company
                    </button>
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
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