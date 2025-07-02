import React, { useEffect, useState } from "react";

const Profile = ({ goBack }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem("loggedInUser");
    if (email) {
      const storedUser = localStorage.getItem("user_" + email);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  if (!user) {
    return <div style={styles.loading}>Loading profile...</div>;
  }

  return (
    <div style={styles.container}>
      <h2>🙍 Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Age:</strong> {user.age}</p>
      <p><strong>Gender:</strong> {user.gender}</p>
      <p><strong>Income:</strong> ₹{user.income}</p>
      <p><strong>Family Income:</strong> ₹{user.familyIncome}</p>
      <p><strong>Mobile:</strong> {user.mobile}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <button onClick={goBack} style={styles.backBtn}>🔙 Back to Dashboard</button>
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
  },
  loading: {
    textAlign: "center",
    marginTop: "2rem",
    fontSize: "18px",
  },
  backBtn: {
    marginTop: "1.5rem",
    padding: "10px 15px",
    backgroundColor: "#333",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Profile;
