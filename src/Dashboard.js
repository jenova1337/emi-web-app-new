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

      <div
        style={styles.card}
        onClick={() => onNavigate("add")}
        onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        ➕ <strong>Add Plan</strong><br />
        <small>Create a new EMI plan.</small>
      </div>

      <div
        style={styles.card}
        onClick={() => onNavigate("existing")}
        onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        📂 <strong>Existing Plans</strong><br />
        <small>Manage, mark paid, and track balances.</small>
      </div>

      <div
        style={styles.card}
        onClick={() => onNavigate("profile")}
        onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        🙍 <strong>Profile</strong><br />
        <small>View or edit profile details.</small>
      </div>

      <div
        style={styles.card}
        onClick={() => onNavigate("summary")}
        onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        📊 <strong>Summary</strong><br />
        <small>View EMI stats and pie chart.</small>
      </div>

      <div
        style={styles.card}
        onClick={() => onNavigate("finished")}
        onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        ✅ <strong>Finished Plans</strong><br />
        <small>View closed EMI plans & download PDF logs</small>
      </div>

      <div
        style={styles.card}
        onClick={() => onNavigate("monthsummary")}
        onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        📆 <strong>Monthly EMI Summary</strong><br />
        <small>Month-wise EMI breakdown.</small>
      </div>

      <button onClick={onLogout} style={styles.logoutBtn}>
        🚪 Logout
      </button>
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
    borderRadius: "12px",
    padding: "1.2rem",
    margin: "1rem auto",
    background: "linear-gradient(135deg, #a0e9fd, #a1f7c5)", // blue-green gradient
    color: "#003333",
    fontWeight: "500",
    cursor: "pointer",
    maxWidth: "400px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    transition: "transform 0.2s ease-in-out",
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
