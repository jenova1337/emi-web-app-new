import React, { useState, useEffect } from "react";
import Dashboard from "./Dashboard";
import AddPlan from "./AddPlan";
import ExistingPlans from "./ExistingPlans";
import Profile from "./Profile";
import Login from "./Login";
import SummaryDashboard from "./SummaryDashboard";
import FinishedPlans from "./FinishedPlans"; // ✅ NEW

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState("dashboard");

  /* ---------- check login once */
  useEffect(() => {
    const user = localStorage.getItem("loggedInUser");
    if (user) setIsLoggedIn(true);
  }, []);

  /* ---------- logout helper */
  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setIsLoggedIn(false);
    setView("dashboard");
  };

  /* ---------- if not logged in, show login page */
  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  /* ---------- router‑like view switch */
  const renderView = () => {
    switch (view) {
      case "add":
        return <AddPlan goBack={() => setView("dashboard")} />;

      case "existing":
        return <ExistingPlans goBack={() => setView("dashboard")} />;

      case "profile":
        return (
          <>
            <Profile goBack={() => setView("dashboard")} />
            <button onClick={handleLogout} style={styles.logoutBtn}>
             🚪Logout
            </button>
          </>
        );

      case "summary":
        return <SummaryDashboard goBack={() => setView("dashboard")} />;

      case "finished": // ⚡ must be BEFORE default
        return <FinishedPlans goBack={() => setView("dashboard")} />;

      default:
        return (
          <Dashboard
            onNavigate={setView}
            onLogout={handleLogout}
          />
        );
    }
  };

  return <div>{renderView()}</div>;
};

/* ---------- simple styles */
const styles = {
  logoutBtn: {
    marginTop: "20px",
    backgroundColor: "#dc3545",
    color: "#fff",
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    float: "right",
    marginRight: "20px",
  },
};

export default App;
