import React, { useState } from "react";
import Dashboard from "./Dashboard";
import AddPlan from "./AddPlan";
import ExistingPlans from "./ExistingPlans";
import Profile from "./Profile";

const App = () => {
  const [view, setView] = useState("dashboard");

  const renderView = () => {
    switch (view) {
      case "add":
        return <AddPlan goBack={() => setView("dashboard")} />;
      case "existing":
        return <ExistingPlans goBack={() => setView("dashboard")} />;
      case "profile":
        return <Profile goBack={() => setView("dashboard")} />;
      default:
        return <Dashboard onNavigate={setView} />;
    }
  };

  return <div>{renderView()}</div>;
};

export default App;
