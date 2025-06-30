import React, { useState } from "react";
import AddPlan from "./AddPlan";
import ExistingPlans from "./ExistingPlans";
import Profile from "./Profile";

export default function Dashboard() {
  const [view, setView] = useState("");

  return (
    <div style={{ padding: 20 }}>
      <h2>Welcome to EMI Tracker Dashboard</h2>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button onClick={() => setView('add')}>➕ Add Plan</button>
        <button onClick={() => setView('existing')}>📂 Existing Plans</button>
        <button onClick={() => setView('profile')}>🙍 Profile</button>
      </div>
      {view === 'add' && <AddPlan />}
      {view === 'existing' && <ExistingPlans />}
      {view === 'profile' && <Profile />}
    </div>
  );
}
