import React, { useState } from "react";

const Login = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    income: "",
    familyIncome: "",
    mobile: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateInputs = () => {
    if (isSignup) {
      const { name, age, gender, income, familyIncome, mobile, email, password } = form;
      if (!name || !age || !gender || !income || !familyIncome || !mobile || !email || !password) {
        alert("Please fill in all fields.");
        return false;
      }

      if (!/^\d{10}$/.test(mobile)) {
        alert("Mobile number must be exactly 10 digits.");
        return false;
      }

      if (age <= 0 || age > 120) {
        alert("Enter a valid age.");
        return false;
      }

      if (income < 0 || familyIncome < 0) {
        alert("Income values must be positive.");
        return false;
      }
    } else {
      const { email, password } = form;
      if (!email || !password) {
        alert("Email and password are required.");
        return false;
      }
    }

    return true;
  };

  const handleAction = () => {
    if (!validateInputs()) return;

    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (isSignup) {
      if (users.find((u) => u.email === form.email)) {
        alert("User already exists!");
        return;
      }
      users.push(form);
      localStorage.setItem("users", JSON.stringify(users));
      alert("Signup successful! Please log in.");
      setIsSignup(false);
      setForm({ name: "", age: "", gender: "", income: "", familyIncome: "", mobile: "", email: "", password: "" });
    } else {
      const found = users.find((u) => u.email === form.email && u.password === form.password);
      if (found) {
        localStorage.setItem("loggedInUser", form.email);
        onLogin();
      } else {
        alert("Invalid credentials!");
      }
    }
  };

  const renderInput = (label, name, type = "text") => (
    <input
      type={type}
      placeholder={label}
      name={name}
      value={form[name]}
      onChange={handleChange}
      style={styles.input}
    />
  );

  return (
    <div style={styles.container}>
      <h2>{isSignup ? "Sign Up" : "Login"}</h2>

      {isSignup && (
        <>
          {renderInput("Full Name", "name")}
          {renderInput("Age", "age", "number")}
          {renderInput("Gender", "gender")}
          {renderInput("Income", "income", "number")}
          {renderInput("Family Income", "familyIncome", "number")}
          {renderInput("Mobile Number", "mobile")}
        </>
      )}

      {renderInput("Email", "email", "email")}
      {renderInput("Password", "password", "password")}

      <button onClick={handleAction} style={styles.button}>
        {isSignup ? "Sign Up" : "Login"}
      </button>

      <p style={{ marginTop: "1rem" }}>
        {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
        <span
          onClick={() => setIsSignup(!isSignup)}
          style={styles.toggleLink}
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
    marginTop: "80px",
    fontFamily: "Arial, sans-serif",
  },
  input: {
    padding: "10px",
    margin: "8px",
    width: "260px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "10px",
  },
  toggleLink: {
    color: "#007bff",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

export default Login;
