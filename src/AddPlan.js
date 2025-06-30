import React, { useState } from "react";
import { getPlans, savePlans } from "./storage";

const AddPlan = () => {
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
    paid: [], // ✅ very important
  };

  const existing = getPlans();
  savePlans([...existing, newPlan]);
  alert("Plan added successfully!");
  setTitle("");
  setAmount("");
  setMonthly("");
  setMonths("");
  setDate("");
};

  return (
    <div>
      <h3>Add New EMI Plan</h3>
      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} /><br />
      <input placeholder="Total Amount" value={amount} onChange={(e) => setAmount(e.target.value)} /><br />
      <input placeholder="Monthly EMI" value={monthly} onChange={(e) => setMonthly(e.target.value)} /><br />
      <input placeholder="Months" value={months} onChange={(e) => setMonths(e.target.value)} /><br />
      <input placeholder="dd/mm/yyyy" value={date} onChange={(e) => setDate(e.target.value)} /><br />
      <button onClick={handleAdd}>Add Plan</button>
    </div>
  );
};

export default AddPlan;