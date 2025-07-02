import React from "react";

const Dashboard = ({ onNavigate, onLogout }) => {
  return (
    <div style={styles.container}>
      <h2>🎉 Welcome to EMI Tracker Dashboard</h2>
      <p>➡️ Choose an option below:</p>

      <div style={styles.card} onClick={() => onNavigate("add")}>
        ➕ <strong>Add Plan</strong><br />
        <small>Create a new EMI plan.</small>
      </div>

      <div style={styles.card} onClick={() => onNavigate("existing")}>
        📂 <strong>Existing Plans</strong><br />
        <small>Manage, mark paid, and track balances.</small>
      </div>

      <div style={styles.card} onClick={() => onNavigate("profile")}>
        🙍 <strong>Profile</strong><br />
        <small>View or edit profile details.</small>
      </div>

      <div style={styles.card} onClick={() => onNavigate("summary")}>
        📊 <strong>Summary</strong><br />
        <small>View EMI stats and pie chart.</small>
      </div>

      <button onClick={onLogout} style={styles.logoutBtn}>🚪 Logout</button>
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    textAlign: "center",
  },
  card: {
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "1.2rem",
    margin: "1rem auto",
    backgroundColor: "#f5f5f5",
    cursor: "pointer",
    maxWidth: "400px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  logoutBtn: {
    marginTop: "2rem",
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default Dashboard;
