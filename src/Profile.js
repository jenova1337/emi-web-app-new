import React, { useEffect, useState } from "react";

const Profile = ({ goBack }) => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  /* ────────────────────────────────
     Load user from localStorage
  ──────────────────────────────── */
  useEffect(() => {
    const email = localStorage.getItem("loggedInUser");
    if (email) {
      const stored = localStorage.getItem("user_" + email);
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setForm(parsed);
      }
    }
  }, []);

  /* ────────────────────────────────
     Form helpers
  ──────────────────────────────── */
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const updatedUser = { ...form };
    localStorage.setItem("user_" + updatedUser.email, JSON.stringify(updatedUser));
    localStorage.setItem("loggedInUser", updatedUser.email);
    setUser(updatedUser);
    setEditing(false);
    alert("Profile updated successfully!");
  };

  if (!user) return <div style={styles.loading}>Loading profile…</div>;

  /* Simple helper for rendering editable vs read‑only field */
  const Field = ({ label, valueKey, type = "text" }) => (
    <div style={styles.row}>
      <label>{label}:</label>
      {editing && valueKey !== "email" ? (
        <input
          type={type}
          value={form[valueKey] || ""}
          onChange={(e) => handleChange(valueKey, e.target.value)}
        />
      ) : (
        <span>{user[valueKey] || "-"}</span>
      )}
    </div>
  );

  return (
    <div style={styles.container}>
      <h2>👤 Profile</h2>
      <button onClick={goBack} style={styles.backBtn}>🔙 Back to Dashboard</button>

      <div style={styles.profileBox}>
        <Field label="Name"          valueKey="name" />
        <Field label="Age"           valueKey="age"  type="number" />
        <Field label="Gender"        valueKey="gender" />
        <Field label="Income"        valueKey="income" type="number" />
        <Field label="Family Income" valueKey="familyIncome" type="number" />
        <Field label="Mobile"        valueKey="mobile" />
        <Field label="Email"         valueKey="email" />   {/* read‑only */}

        {editing ? (
          <button onClick={handleSave} style={styles.saveBtn}>💾 Save</button>
        ) : (
          <button onClick={() => setEditing(true)} style={styles.editBtn} ✏️ Edit Profile</button>
        )}
      </div>
    </div>
  );
};

/* ────────────────────────────────
   Simple styles
──────────────────────────────── */
const styles = {
  container: { padding: "1rem" },
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
  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "0.5rem",
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
