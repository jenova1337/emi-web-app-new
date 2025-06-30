import React, { useEffect, useState } from "react";

export default function ExistingPlans() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
  const savedPlans = JSON.parse(localStorage.getItem("emiPlans")) || [];

  // If no plans are saved, add a default sample
  if (savedPlans.length === 0) {
    const samplePlan = {
      id: Date.now(),
      title: "Sample Jewel Plan",
      totalAmount: 12000,
      monthlyEmi: 1000,
      months: 12,
      startDate: "01/07/2025",
      paid: [],
    };
    localStorage.setItem("emiPlans", JSON.stringify([samplePlan]));
    setPlans([samplePlan]);
  } else {
    setPlans(savedPlans);
  }
}, []);

  const markAsPaid = (index) => {
    const updatedPlans = [...plans];
    const today = new Date().toLocaleDateString("en-GB"); // dd/mm/yyyy

    // Avoid duplicate payment on same day
    if (!updatedPlans[index].paid.includes(today)) {
      updatedPlans[index].paid.push(today);
      localStorage.setItem("emiPlans", JSON.stringify(updatedPlans));
      setPlans(updatedPlans);
    } else {
      alert("Already marked as paid for today.");
    }
  };

  const getRemainingAmount = (plan) => {
    return plan.totalAmount - plan.paid.length * plan.monthlyEmi;
  };

  return (
    <div>
      <h2>📂 Existing EMI Plans</h2>
      {plans.length === 0 ? (
        <p>No EMI plans added yet.</p>
      ) : (
        plans.map((plan, index) => (
          <div key={index} style={styles.card}>
            <h3>{plan.title}</h3>
            <p>💰 Total Amount: ₹{plan.totalAmount}</p>
            <p>📅 Monthly EMI: ₹{plan.monthlyEmi}</p>
            <p>🕒 Months: {plan.months}</p>
            <p>📆 Start Date: {plan.startDate}</p>
            <p>✅ Paid Dates: {plan.paid.join(", ") || "None"}</p>
            <p>📉 Remaining: ₹{getRemainingAmount(plan)}</p>
            <button onClick={() => markAsPaid(index)}>✅ Mark as Paid</button>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "1rem",
    margin: "1rem 0",
    backgroundColor: "#f9f9f9",
  },
};