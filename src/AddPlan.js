import React, { useState } from "react";
import { auth, db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const AddPlan = ({ goBack }) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [monthly, setMonthly] = useState("");
  const [months, setMonths] = useState("");
  const [date, setDate] = useState("");

  const clear = () => {
    setTitle("");
    setAmount("");
    setMonthly("");
    setMonths("");
    setDate("");
  };

  const isValidDate = (d) => {
    const parts = d.split("/");
    if (parts.length !== 3) return false;
    const [day, month, year] = parts.map(Number);
    if (
      isNaN(day) || isNaN(month) || isNaN(year) ||
      day < 1 || day > 31 || month < 1 || month > 12 || year < 1900
    ) return false;

    const parsed = new Date(year, month - 1, day);
    return parsed.getDate() === day &&
           parsed.getMonth() === month - 1 &&
           parsed.getFullYear() === year;
  };

  const handleAdd = async () => {
    if (!title || !amount || !monthly || !months || !date) {
      alert("Please fill in all fields.");
      return;
    }

    if (!isValidDate(date)) {
      alert("Please enter a valid date in dd/mm/yyyy format.");
      return;
    }

    if (+amount <= 0 || +monthly <= 0 || +months <= 0) {
      alert("Amounts and months must be greater than 0.");
      return;
    }

    const uid = auth.currentUser?.uid;
    if (!uid) {
      alert("User not authenticated.");
      return;
    }

    await addDoc(collection(db, "users", uid, "plans"), {
      title,
      totalAmount: +amount,
      monthlyEmi: +monthly,
      months: +months,
      startDate: date,
      payments: [],
      createdAt: serverTimestamp()
    });

    alert("✅ Plan added successfully!");
    clear();
  };

  return (
    <div style={styles.ct}>
      <h3>Add New EMI Plan</h3>
      <input style={styles.in} placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
      <input style={styles.in} placeholder="Total Amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} />
      <input style={styles.in} placeholder="Monthly EMI" type="number" value={monthly} onChange={e => setMonthly(e.target.value)} />
      <input style={styles.in} placeholder="Total Months" type="number" value={months} onChange={e => setMonths(e.target.value)} />
      <input style={styles.in} placeholder="Start Date (dd/mm/yyyy)" value={date} onChange={e => setDate(e.target.value)} />

      <button style={styles.add} onClick={handleAdd}>➕ Add Plan</button>
      <button style={styles.back} onClick={goBack}>🔙 Back</button>
    </div>
  );
};

const styles = {
  ct: { padding: "1.5rem", fontFamily: "Arial" },
  in: { display: "block", margin: "8px 0", padding: "10px", width: "260px" },
  add: { padding: "8px 16px", background: "#28a745", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" },
  back: { padding: "8px 16px", background: "#007bff", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", marginLeft: 8 }
};

export default AddPlan;
