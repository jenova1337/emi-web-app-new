import React, { useEffect } from "react";
import useNetworkStatus from "./useNetworkStatus";

export default function Dashboard({ onNavigate, onLogout }) {
  const online = useNetworkStatus();

  useEffect(() => {
    if (!online) {
      alert("⚠️ You're offline. Changes will sync when back online.");
    }
  }, [online]);

  return (
    <div style={styles.container}>
      {!online && (
        <div style={{ backgroundColor: "#ffc107", padding: "5px", color: "#000" }}>
          ⚠️ You're offline. Changes will sync later.
        </div>
      )}

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

      <div style={styles.card} onClick={() => onNavigate("finished")}>
        ✅ <strong>Finished Plans</strong><br />
        <small>View closed EMI plans & download PDF logs</small>
      </div>

	<div style={{ ...styles.card, backgroundColor: "#e6f7ff" }} onClick={() => onNavigate("monthsummary")}>
 	 📆 <strong>Monthly EMI Summary</strong><br />
	  <small>Month-wise EMI breakdown.</small>
	</div>


      <button onClick={onLogout} style={styles.logoutBtn}>🚪 Logout</button>
    </div>
  );
}

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
