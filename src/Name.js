// src/Name.js
import React from "react";

const Name = ({ goBack }) => {
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>🚀 EMI Tracker Pro</h2>
      <p>Simple. Powerful. Organized.</p>

      <button
        onClick={goBack}
        style={{
          marginTop: "20px",
          padding: "10px 16px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        🔙 Back to Dashboard
      </button>
    </div>
  );
};

export default Name;
