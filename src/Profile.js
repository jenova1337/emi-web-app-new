import React, { useEffect, useState } from "react";

const Profile = ({ goBack }) => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    const email = localStorage.getItem("loggedInUser");
    if (email) {
      const storedUser = localStorage.getItem("user_" + email);
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setForm(parsed);
      }
    }
  }, []);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSave = () => {
    const updatedUser = { ...form };
    localStorage.setItem("user_" + updatedUser.email, JSON.stringify(updatedUser));
    localStorage.setItem("loggedInUser", updatedUser.email);
    setUser(updatedUser);
    setEditing(false);
    alert("Profile updated successfully!");
  };

  if (!user) return <div style={styles.loading}>Loading profile...</div>;

  return (
    <div style={styles.container}>
      <h2>👤 Profile</h2>
      <button onClick={goBack} style={styles.backBtn}>🔙 Back to Dashboard</button>

      <div style={styles.profileBox}>
        <div>
          <label>Name:</label>
          {editing ? (
            <input
              type="text"
              value={form.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          ) : (
            <span>{user.name}</span>
          )}
        </div>

        <div>
          <label>Email:</label>
          <span>{user.email}</span>
        </div>
{/* Name row already here */}

<div>
  <label>Age:</label>
  {editing ? (
    <input
      type="number"
      value={form.age || ""}
      onChange={(e) => handleChange("age", e.target.value)}
    />
  ) : (
    <span>{user.age}</span>
  )}
</div>

<div>
  <label>Gender:</label>
  {editing ? (
    <select
      value={form.gender || ""}
      onChange={(e) => handleChange("gender", e.target.value)}
    >
      <option value="">-- select --</option>
      <option value="Male">Male</option>
      <option value="Female">Female</option>
      <option value="Other">Other</option>
    </select>
  ) : (
    <span>{user.gender}</span>
  )}
</div>

<div>
  <label>Income:</label>
  {editing ? (
    <input
      type="number"
      value={form.income || ""}
      onChange={(e) => handleChange("income", e.target.value)}
    />
  ) : (
    <span>{user.income}</span>
  )}
</div>

<div>
  <label>Family Income:</label>
  {editing ? (
    <input
      type="number"
      value={form.familyIncome || ""}
      onChange={(e) => handleChange("familyIncome", e.target.value)}
    />
  ) : (
    <span>{user.familyIncome}</span>
  )}
</div>

        <div>
          <label>Mobile:</label>
          {editing ? (
            <input
              type="text"
              value={form.mobile || ""}
              onChange={(e) => handleChange("mobile", e.target.value)}
            />
          ) : (
            <span>{user.mobile}</span>
          )}
        </div>

        {editing ? (
          <button onClick={handleSave} style={styles.saveBtn}>💾 Save</button>
        ) : (
          <button onClick={() => setEditing(true)} style={styles.editBtn}>✏️ Edit Profile</button>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "1rem",
  },
  backBtn: {
    marginBottom: "1rem",
    padding: "8px 16px",
    backgroundColor: "#333",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  profileBox: {
    backgroundColor: "#f1f1f1",
    padding: "1rem",
    borderRadius: "8px",
    maxWidth: "400px",
    lineHeight: "2rem",
  },
  editBtn: {
    marginTop: "1rem",
    backgroundColor: "#007bff",
    color: "white",
    padding: "6px 12px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  saveBtn: {
    marginTop: "1rem",
    backgroundColor: "#28a745",
    color: "white",
    padding: "6px 12px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  loading: {
    padding: "2rem",
    fontSize: "1.2rem",
  },
};

export default Profile;
