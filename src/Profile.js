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

  if (!user) return <div style={styles.loading}>Loading prof
