import React from "react";

const Profile = ({ goBack }) => {
  return (
    <div style={styles.container}>
      <h2>🙍 Profile Details</h2>
      <p>🆔 Name: John Doe</p>
      <p>📧 Email: john@example.com</p>
      <p>📱 Phone: +91 9876543210</p>

      <button onClick={goBack} style={styles.backBtn}>🔙 Back to Dashboard</button>
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    fontFamily: "Arial, sans-serif",
  },
  backBtn: {
    padding: "0.6rem 1rem",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "1rem",
  },
};

export default Profile;
