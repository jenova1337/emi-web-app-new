import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { updatePassword } from "firebase/auth";

const Profile = ({ goBack }) => {
  const [data, setData] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (cur) => {
      if (!cur) {
        alert("User not authenticated.");
        goBack();
        return;
      }
      const snap = await getDoc(doc(db, "users", cur.uid));
      if (snap.exists()) {
        const userData = snap.data();
        setData(userData);
        setForm(userData);
      } else {
        const fallback = {
          name: "",
          age: "",
          gender: "",
          income: "",
          familyIncome: "",
          mobile: "",
          email: cur.email,
        };
        await setDoc(doc(db, "users", cur.uid), fallback);
        setData(fallback);
        setForm(fallback);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const change = (k, v) => {
    setForm((prev) => ({ ...prev, [k]: v }));
  };

  const save = async () => {
    await setDoc(doc(db, "users", auth.currentUser.uid), form);
    setData(form);
    setEdit(false);
    alert("Saved!");
  };

  const handlePasswordChange = async () => {
    try {
      await updatePassword(auth.currentUser, newPassword);
      alert("Password changed successfully.");
      setNewPassword("");
      setShowPasswordChange(false);
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  if (loading) return <p style={styles.loading}>Loading…</p>;

  return (
    <div style={styles.container}>
      <h2>👤 Profile</h2>
      <button style={styles.backBtn} onClick={goBack}>🔙 Back to Dashboard</button>
      <div style={styles.profileBox}>
        <Row field="name" label="Name" type="text" form={form} data={data} edit={edit} change={change} />
        <Row field="age" label="Age" type="number" form={form} data={data} edit={edit} change={change} />
        <Row field="gender" label="Gender" type="select" form={form} data={data} edit={edit} change={change} />
        <Row field="income" label="Income" type="number" form={form} data={data} edit={edit} change={change} />
        <Row field="familyIncome" label="Family Income" type="number" form={form} data={data} edit={edit} change={change} />
        <Row field="mobile" label="Mobile" type="text" form={form} data={data} edit={edit} change={change} />
        <Row field="email" label="Email" type="text" form={form} data={data} edit={edit} change={change} />

        {edit ? (
          <button style={styles.saveBtn} onClick={save}>💾 Save</button>
        ) : (
          <button style={styles.editBtn} onClick={() => setEdit(true)}>✏️ Edit Profile</button>
        )}

        <button style={styles.passBtn} onClick={() => setShowPasswordChange((v) => !v)}>🔐 Change Password</button>

        {showPasswordChange && (
          <div style={styles.passBox}>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button style={styles.passSave} onClick={handlePasswordChange}>✅ Update</button>
          </div>
        )}
      </div>
    </div>
  );
};

const Row = ({ field, label, type, form, data, edit, change }) => (
  <div style={styles.row}>
    <label>{label}: </label>
    {edit && field !== "email" ? (
      type === "select" ? (
        <select value={form[field] || ""} onChange={(e) => change(field, e.target.value)}>
          <option value="">--</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
      ) : (
        <input type={type} value={form[field] || ""} onChange={(e) => change(field, e.target.value)} />
      )
    ) : (
      <span>{data[field]}</span>
    )}
  </div>
);

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
  passBtn: {
    marginTop: "1rem",
    backgroundColor: "#ff9800",
    color: "white",
    padding: "6px 12px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  passBox: {
    marginTop: "1rem",
  },
  passSave: {
    marginLeft: "0.5rem",
    backgroundColor: "#17a2b8",
    color: "white",
    padding: "5px 10px",
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
