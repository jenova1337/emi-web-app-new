import React, { useState } from "react";
import { getPlans, savePlans } from "./storage";

const AddPlan = ({ goBack }) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [monthly, setMonthly] = useState("");
  const [months, setMonths] = useState("");
  const [date, setDate] = useState("");

  const handleAdd = () => {
    const newPlan = {
      id: Date.now(),
      title,
      totalAmount: parseFloat(amount),
      monthlyEmi: parseFloat(monthly),
      months: parseInt(months),
      startDate: date,
      paid: [],
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
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={styles.input}
      /><br />

      <input
        placeholder="Total Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={styles.input}
      /><br />

      <input
        placeholder="Monthly EMI"
        value={monthly}
        onChange={(e) => setMonthly(e.target.value)}
        style={styles.input}
      /><br />

      <input
        placeholder="Months"
        value={months}
        onChange={(e) => setMonths(e.target.value)}
        style={styles.input}
      /><br />

      <input
        placeholder="Start Date (dd/mm/yyyy)"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={styles.input}
      /><br />

      <button onClick={handleAdd} style={styles.button}>✅ Add Plan</button>
      <br /><br />
      <button onClick={goBack} style={styles.backButton}>🔙 Back to Dashboard</button>
    </div>
  );
};

const styles = {
  container: {
    padding: "1.5rem",
    fontFamily: "Arial, sans-serif",
  },
  input: {
    padding: "0.5rem",
    marginBottom: "0.7rem",
    width: "100%",
    maxWidth: "400px",
  },
  button: {
    padding: "0.6rem 1rem",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  backButton: {
    padding: "0.6rem 1rem",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default AddPlan;
