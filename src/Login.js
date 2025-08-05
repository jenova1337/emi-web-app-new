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
    <div style={styles.bg}>
      <div style={styles.card}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
          alt="avatar"
          style={styles.avatar}
        />
        <h2 style={styles.title}>{isSignup ? "Sign Up" : "Login"}</h2>

        {isSignup && (
          <>
            <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} style={styles.input} />
            <input type="date" placeholder="Date of Birth" value={dob} onChange={(e) => setDob(e.target.value)} style={styles.input} />
            <select value={gender} onChange={(e) => setGender(e.target.value)} style={styles.input}>
              <option value="">-- Select Gender --</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <input placeholder="Income" value={income} onChange={(e) => setIncome(e.target.value)} style={styles.input} />
            <input placeholder="Family Income" value={familyIncome} onChange={(e) => setFamilyIncome(e.target.value)} style={styles.input} />
            <input placeholder="Mobile Number" value={mobile} onChange={(e) => setMobile(e.target.value)} style={styles.input} />
          </>
        )}

        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} />

        <button onClick={isSignup ? handleSignup : handleLogin} style={styles.button}>
          {isSignup ? "Sign Up" : "Login"}
        </button>

        <p style={styles.switchText}>
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            onClick={() => {
              setIsSignup(!isSignup);
              resetFields();
            }}
            style={styles.link}
          >
            {isSignup ? "Login here" : "Sign up here"}
          </span>
        </p>
      </div>
    </div>
  );
};

const styles = {
  bg: {
    backgroundColor: "#e6f2ff",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    padding: "2rem",
    borderRadius: "15px",
    background: "linear-gradient(to bottom right, #a1e3a1, #a1c8e3)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    textAlign: "center",
  },
  avatar: {
    width: "60px",
    marginBottom: "1rem",
  },
  title: {
    marginBottom: "1rem",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  switchText: {
    marginTop: "1rem",
  },
  link: {
    color: "#0000ee",
    textDecoration: "underline",
    cursor: "pointer",
  },
};

export default Login;
