// src/App.js
import React, { useState, useEffect } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import AddPlan from './AddPlan';
import ExistingPlans from './ExistingPlans';
import FinishedPlans from './FinishedPlans';
import Profile from './Profile';
import SummaryDashboard from './SummaryDashboard';
import MonthWiseEmiSummary from './MonthWiseEmiSummary'; // ✅ Added this line
import { auth } from './firebase';

function App() {
  const [user, setUser] = useState(null);
  const [selectedTab, setSelectedTab] = useState('dashboard');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  if (!user) {
    return <Login />;
  }

  const renderTab = () => {
    switch (selectedTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'addPlan':
        return <AddPlan />;
      case 'existingPlans':
        return <ExistingPlans />;
      case 'finishedPlans':
        return <FinishedPlans />;
      case 'profile':
        return <Profile />;
      case 'summary':
        return <SummaryDashboard />;
      case 'monthSummary':
        return <MonthWiseEmiSummary />; // ✅ Added this
      default:
        return <Dashboard />;
    }
  };

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-around', padding: 10, backgroundColor: '#333', color: '#fff' }}>
        <button onClick={() => setSelectedTab('dashboard')}>Dashboard</button>
        <button onClick={() => setSelectedTab('addPlan')}>Add Plan</button>
        <button onClick={() => setSelectedTab('existingPlans')}>Existing Plans</button>
        <button onClick={() => setSelectedTab('finishedPlans')}>Finished Plans</button>
        <button onClick={() => setSelectedTab('summary')}>Summary</button>
        <button onClick={() => setSelectedTab('monthSummary')}>Monthly EMI Summary</button>
        <button onClick={() => setSelectedTab('profile')}>Profile</button>
        <button onClick={() => auth.signOut()}>Logout</button>
      </nav>
      <main style={{ padding: 20 }}>
        {renderTab()}
      </main>
    </div>
  );
}

export default App;
