import React, { useState, useEffect } from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";
import AddPlan from "./AddPlan";
import ExistingPlans from "./ExistingPlans";
import FinishedPlans from "./FinishedPlans";
import SummaryDashboard from "./SummaryDashboard";
import Profile from "./Profile";
import MonthWiseEmiSummary from "./MonthWiseEmiSummary"; // ✅ Import added
import { auth } from "./firebase";

function App() {
  const [user, setUser] = useState(null);
  const [selectedTab, setSelectedTab] = useState("dashboard");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth.signOut();
  };

  if (!user) {
    return <Login />;
  }

  return (
    <div
      style={{
        backgroundImage: "linear-gradient(to right, #dfe9f3 0%, white 100%)",
        minHeight: "100vh",
        padding: "10px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "10px" }}>
        <button onClick={() => setSelectedTab("dashboard")}>🏠 Dashboard</button>
        <button onClick={() => setSelectedTab("addPlan")}>➕ Add Plan</button>
        <button onClick={() => setSelectedTab("existingPlans")}>📋 Existing Plans</button>
        <button onClick={() => setSelectedTab("finishedPlans")}>✅ Finished Plans</button>
        <button onClick={() => setSelectedTab("summary")}>📊 Summary</button>
        <button onClick={() => setSelectedTab("monthSummary")}>📅 Monthly Summary</button> {/* ✅ New tab */}
        <button onClick={() => setSelectedTab("profile")}>👤 Profile</button>
        <button onClick={handleLogout}>🚪 Logout</button>
      </div>

      {/* Main tab content rendering */}
      {selectedTab === "dashboard" && <Dashboard onTabChange={setSelectedTab} />}
      {selectedTab === "addPlan" && <AddPlan />}
      {selectedTab === "existingPlans" && <ExistingPlans />}
      {selectedTab === "finishedPlans" && <FinishedPlans />}
      {selectedTab === "summary" && <SummaryDashboard />}
      {selectedTab === "monthSummary" && <MonthWiseEmiSummary />} {/* ✅ New component */}
      {selectedTab === "profile" && <Profile />}
    </div>
  );
}

export default App;
