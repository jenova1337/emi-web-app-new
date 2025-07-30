import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

const Login = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
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

  const handleSignup = async () => {
    if (!name || !dob || !gender || !income || !familyIncome || !mobile || !email || !password) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      await setDoc(doc(db, "users", uid), {
        name,
        dob,
        gender,
        income,
        familyIncome,
        mobile,
        email,
        createdAt: new Date().toISOString(),
      });

      alert("Signup successful!");
      onLogin();
    } catch (err) {
      alert("Signup failed: " + err.message);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin();
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2>{isSignup ? "Sign Up" : "Login"}</h2>

      {isSignup && (
        <>
          <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="date" placeholder="Date of Birth" value={dob} onChange={(e) => setDob(e.target.value)} />
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">-- Select Gender --</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input placeholder="Income" value={income} onChange={(e) => setIncome(e.target.value)} />
          <input placeholder="Family Income" value={familyIncome} onChange={(e) => setFamilyIncome(e.target.value)} />
          <input placeholder="Mobile Number" value={mobile} onChange={(e) => setMobile(e.target.value)} />
        </>
      )}

      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

      <button onClick={isSignup ? handleSignup : handleLogin}>
        {isSignup ? "Sign Up" : "Login"}
      </button>

      <p style={{ marginTop: "1rem" }}>
        {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
        <span
          onClick={() => {
            setIsSignup(!isSignup);
            resetFields();
          }}
          style={{ color: "blue", cursor: "pointer" }}
        >
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
