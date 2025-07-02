import React, { useEffect, useState } from "react";

const Profile = ({ goBack }) => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    const email = localStorage.getItem("loggedInUser");
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const foundUser = users.find((u) => u.email === email);
    setUser(foundUser);
    setForm(foundUser || {});
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateInputs = () => {
    if (!form.name || !form.age || !form.gender || !form.income || !form.familyIncome || !form.mobile) {
      alert("All fields are required.");
      return false;
    }

    if (!/^\d{10}$/.test(form.mobile)) {
      alert("Mobile number must be exactly 10 digits.");
      return false;
    }

    if (form.age <= 0 || form.age > 120) {
      alert("Enter a valid age.");
      return false;
    }

    if (form.income < 0 || form.familyIncome < 0) {
      alert("Income values must be positive.");
      return false;
    }

    return true;
  };

  const saveChanges = () => {
    if (!validateInputs()) return;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map((u) =>
      u.email === form.email ? { ...u, ...form } : u
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setUser(form);
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div style={styles.container}>
      <h2>🙍 Profile Details</h2>

      {isEditing ? (
        <>
          <Input label="Name" name="name" value={form.name} onChange={handleChange} />
          <Input label="Age" name="age" value={form.age} onChange={handleChange} type="number" />
          <Input label="Gender" name="gender" value={form.gender} onChange={handleChange} />
          <Input label="Income" name="income" value={form.income} onChange={handleChange} type="number" />
          <Input label="Family Income" name="familyIncome" value={form.familyIncome} onChange={handleChange} type="number" />
          <Input label="Mobile Number" name="mobile" value={form.mobile} onChange={handleChange} />
          <Input label="Email (Read only)" name="email" value={form.email} readOnly />

          <button onClick={saveChanges} style={styles.saveBtn}>💾 Save</button>
          <button onClick={() => setIsEditing(false)} style={styles.cancelBtn}>❌ Cancel</button>
        </>
      ) : (
        <>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Age:</strong> {user.age}</p>
          <p><strong>Gender:</strong> {user.gender}</p>
          <p><strong>Income:</strong> ₹{user.income}</p>
          <p><strong>Family Income:</strong> ₹{user.familyIncome}</p>
          <p><strong>Mobile:</strong> {user.mobile}</p>
          <p><strong>Email:</strong> {user.email}</p>

          <button onClick={() => setIsEditing(true)} style={styles.editBtn}>✏️ Edit Profile</button>
        </>
      )}

      <button onClick={goBack} style={styles.backBtn}>🔙 Back to Dashboard</button>
    </div>
  );
};

const Input = ({ label, name, value, onChange, type = "text", readOnly }) => (
  <div style={{ marginBottom: "10px" }}>
    <label><strong>{label}:</strong></label><br />
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      style={styles.input}
    />
  </div>
);

const styles = {
  container: {
    padding: "2rem",
    fontFamily: "Arial",
  },
  input: {
    padding: "8px",
    width: "250px",
    marginTop: "5px",
  },
  editBtn: {
    marginTop: "15px",
    padding: "8px 12px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  saveBtn: {
    padding: "8px 12px",
    backgroundColor: "green",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    marginRight: "10px",
    cursor: "pointer",
  },
  cancelBtn: {
    padding: "8px 12px",
    backgroundColor: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  backBtn: {
    marginTop: "20px",
    backgroundColor: "#333",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    display: "block",
  },
};

export default Profile;
