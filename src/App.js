import React, { useState, useEffect } from "react";
import Dashboard from "./Dashboard";
import AddPlan from "./AddPlan";
import ExistingPlans from "./ExistingPlans";
import Profile from "./Profile";
import Login from "./Login";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState("dashboard");

  useEffect(() => {
    const user = localStorage.getItem("loggedInUser");
    if (user) setIsLoggedIn(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  const renderView = () => {
    switch (view) {
      case "add":
        return <AddPlan goBack={() => setView("dashboard")} />;
      case "existing":
        return <ExistingPlans goBack={() => setView("dashboard")} />;
      case "profile":
        return (
          <div>
            <Profile goBack={() => setView("dashboard")} />
            <button onClick={handleLogout} style={styles.logoutBtn}>🚪 Logout</button>
          </div>
        );
      default:
        // ✅ Pass onLogout to Dashboard here
        return <Dashboard onNavigate={setView} onLogout={handleLogout} />;
    }
  };

  return <div>{renderView()}</div>;
};

const styles = {
  logoutBtn: {
    marginTop: "20px",
    backgroundColor: "#dc3545",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    float: "right",
    marginRight: "20px",
  },
};

export default App;
