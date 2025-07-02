import React, { useState } from "react";
import { getPlans, savePlans } from "./storage";

const AddPlan = ({ goBack }) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [monthly, setMonthly] = useState("");
  const [months, setMonths] = useState("");
  const [date, setDate] = useState("");

  const handleAdd = () => {
    if (!title || !amount || !monthly || !months || !date) {
      alert("Please fill in all fields.");
      return;
    }

    const newPlan = {
      id: Date.now(),
      title,
      totalAmount: parseFloat(amount),
      monthlyEmi: parseFloat(monthly),
      months: parseInt(months),
      startDate: date,
      payments: [], // ✅ New structure for fixed & excess payments
    };

    const existing = getPlans();
    savePlans([...existing, newPlan]);
    alert("Plan added successfully!");

    // Clear form
    setTitle("");
    setAmount("");
    setMonthly("");
    setMonths("");
    setDate("");
  };

  return (
    <div style={styles.container}>
      <h3>➕ Add New EMI Plan</h3>

      <input
        placeholder="Plan Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={styles.input}
      /><br />

      <input
        placeholder="Total Loan Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        type="number"
        style={styles.input}
      /><br />

      <input
        placeholder="Monthly EMI"
        value={monthly}
        onChange={(e) => setMonthly(e.target.value)}
        type="number"
        style={styles.input}
      /><br />

      <input
        placeholder="Total Months"
        value={months}
        onChange={(e) => setMonths(e.target.value)}
        type="number"
        style={styles.input}
      /><br />

      <input
        placeholder="Start Date (dd/mm/yyyy)"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={styles.input}
      /><br />

      <button onClick={handleAdd} style={styles.addBtn}>✅ Add Plan</button>
      <br /><br />
      <button onClick={goBack} style={styles.backBtn}>🔙 Back to Dashboard</button>
    </div>
  );
};

const styles = {
  container: {
    padding: "1.5rem",
    fontFamily: "Arial, sans-serif",
  },
  input: {
    padding: "10px",
    margin: "8px",
    width: "260px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  addBtn: {
    padding: "10px 20px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  backBtn: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default AddPlan;
