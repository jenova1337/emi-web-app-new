import React, { useState } from "react";

const Login = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAction = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (isSignup) {
      if (users.find((u) => u.email === email)) {
        alert("User already exists!");
        return;
      }
      users.push({ email, password });
      localStorage.setItem("users", JSON.stringify(users));
      alert("Signup successful! Please log in.");
      setIsSignup(false);
    } else {
      const found = users.find((u) => u.email === email && u.password === password);
      if (found) {
        localStorage.setItem("loggedInUser", email);
        onLogin();
      } else {
        alert("Invalid credentials!");
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2>{isSignup ? "Sign Up" : "Login"}</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      /><br />

      <button onClick={handleAction} style={styles.button}>
        {isSignup ? "Sign Up" : "Login"}
      </button>

      <p style={{ marginTop: "1rem" }}>
        {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
        <span
          onClick={() => setIsSignup(!isSignup)}
          style={{ color: "#007bff", cursor: "pointer", textDecoration: "underline" }}
        >
          {isSignup ? "Login" : "Sign Up"}
        </span>
      </p>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "100px",
  },
  input: {
    padding: "10px",
    margin: "10px",
    width: "250px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default Login;
