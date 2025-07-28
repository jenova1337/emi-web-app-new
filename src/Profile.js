import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updatePassword } from "firebase/auth";
import { db } from "../firebase";
import useAuth from "../auth/useAuth";

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setProfile(userData);
          setForm(userData); // initial set only
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };

    if (user) fetchProfile();
  }, [user]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, form);
      setProfile(form);
      setEditing(false);
      alert("✅ Profile updated!");
    } catch (err) {
      alert("❌ Failed to update profile: " + err.message);
    }
  };

  const handlePasswordChange = async () => {
    try {
      await updatePassword(user, newPassword);
      alert("✅ Password updated!");
      setNewPassword("");
    } catch (err) {
      alert("❌ Error: " + err.message);
    }
  };

  if (!profile) return <p>Loading profile…</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>👤 Profile Details</h2>

      {editing ? (
        <>
          <input type="text" name="name" value={form.name || ""} onChange={handleEditChange} placeholder="Name" /><br />
          <input type="number" name="age" value={form.age || ""} onChange={handleEditChange} placeholder="Age" /><br />
          <input type="text" name="gender" value={form.gender || ""} onChange={handleEditChange} placeholder="Gender" /><br />
          <input type="text" name="mobile" value={form.mobile || ""} onChange={handleEditChange} placeholder="Mobile" /><br />
          <input type="number" name="bikeCount" value={form.bikeCount || ""} onChange={handleEditChange} placeholder="No. of Bikes" /><br />

          <button onClick={handleSaveProfile}>💾 Save</button>
        </>
      ) : (
        <>
          <p>🧑 Name: {profile.name || "-"}</p>
          <p>🎂 Age: {profile.age || "-"}</p>
          <p>⚧️ Gender: {profile.gender || "-"}</p>
          <p>📧 Email: {profile.email || user.email}</p>
          <p>📱 Mobile: {profile.mobile || "-"}</p>
          <p>🏍️ Bike Count: {profile.bikeCount || "-"}</p>

          <button onClick={() => setEditing(true)}>✏️ Edit Profile</button>
        </>
      )}

      {/* 🔐 Change Password Section */}
      <div style={{ marginTop: "30px" }}>
        <h3>🔑 Change Password</h3>
        <input
          type="password"
          value={newPassword}
          placeholder="New Password"
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button onClick={handlePasswordChange}>Update Password</button>
      </div>
    </div>
  );
};

export default Profile;
