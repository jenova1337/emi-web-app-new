import React, { useState } from "react";
import Dashboard from "./Dashboard";
import Login from "./Login";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${require('./assets/emi-login-bg.jpeg')})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          width: "320px",
        }}
      >
        {loggedIn ? <Dashboard /> : <Login onLogin={() => setLoggedIn(true)} />}
      </div>
    </div>
  );
}
