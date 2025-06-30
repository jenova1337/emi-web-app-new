import React, { useState } from "react";

export default function AddPlan() {
  const [title, setTitle] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [monthly, setMonthly] = useState("");
  const [months, setMonths] = useState("");
  const [reminderDate, setReminderDate] = useState("");

  const handleAdd = () => {
    alert("Plan added! Title: " + title);
  };

  return (
    <div>
      <h3>Add New EMI Plan</h3>
      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} /><br/>
      <input placeholder="Total Amount" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} /><br/>
      <input placeholder="Monthly EMI" value={monthly} onChange={(e) => setMonthly(e.target.value)} /><br/>
      <input placeholder="Months" value={months} onChange={(e) => setMonths(e.target.value)} /><br/>
      <input type="date" value={reminderDate} onChange={(e) => setReminderDate(e.target.value)} /><br/>
      <button onClick={handleAdd}>Add Plan</button>
    </div>
  );
}
