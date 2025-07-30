import React, { useState } from "react";

const Login = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [dob, setDob] = useState(""); // NEW
  const [gender, setGender] = useState(""); // Changed to dropdown
  const [income, setIncome] = useState("");
  const [familyIncome, setFamilyIncome] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const resetFields = () => {
    setName("");
    setDob("");
    setGender("");
    setIncome("");
    setFamilyIncome("");
    setMobile("");
    setEmail("");
    setPassword("");
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleSignup = () => {
    if (!name || !dob || !gender || !income || !familyIncome || !mobile || !email || !password) {
      alert("Please fill all fields.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    const user = {
      name,
      dob,
      age: calculateAge(dob),
      gender,
      income,
      familyIncome,
      mobile,
      email,
      password,
    };

    localStorage.setItem("user_" + email, JSON.stringify(user));
    localStorage.setItem("loggedInUser", email);
    alert("Signup successful!");
    onLogin();
  };

  const handleLogin = () => {
    const user = JSON.parse(localStorage.getItem("user_" + email));
    if (!user) {
      alert("User not found. Please sign up first.");
      return;
    }

    if (user.password !== password) {
      alert("Incorrect password.");
      return;
    }

    localStorage.setItem("loggedInUser", email);
    onLogin();
  };

  return (
    <div style={styles.container}>
      <h2>{isSignup ? "Sign Up" : "Login"}</h2>

      {isSignup && (
        <>
          <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <label>Date of Birth:</label>
          <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
          <label>Gender:</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">-- Select Gender --</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          <input placeholder="Income" value={income} onChange={(e) => setIncome(e.target.value)} />
          <input placeholder="Family Income" value={familyIncome} onChange={(e) => setFamilyIncome(e.target.value)} />
          <input placeholder="Mobile Number" value={mobile} onChange={(e) => setMobile(e.target.value)} />
        </>
      )}

      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

      <button onClick={isSignup ? handleSignup : handleLogin}>
        {isSignup ? "Sign Up" : "Login"}
      </button>

      <p style={{ marginTop: "1rem" }}>
        {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
        <span onClick={() => { setIsSignup(!isSignup); resetFields(); }} style={{ color: "blue", cursor: "pointer" }}>
          {isSignup ? "Login here" : "Sign up here"}
        </span>
      </p>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "2rem auto",
    padding: "2rem",
    border: "1px solid #ccc",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
    textAlign: "center",
  },
};

export default Login;
