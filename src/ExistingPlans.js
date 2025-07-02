import React, { useEffect, useState } from "react";

export default function ExistingPlans() {
  const [plans, setPlans] = useState([]);

  // Load plans on mount
  useEffect(() => {
    let savedPlans = JSON.parse(localStorage.getItem("emiPlans")) || [];

    // If no plans found, add a default sample plan
    if (!savedPlans || savedPlans.length === 0) {
      const samplePlan = {
        id: Date.now(),
        title: "Sample Jewel Loan",
        totalAmount: 30000,
        monthlyEmi: 3000,
        months: 10,
        startDate: "01/07/2025",
        paid: [],
      };
      localStorage.setItem("emiPlans", JSON.stringify([samplePlan]));
      savedPlans = [samplePlan];
    }

    setPlans(savedPlans);
  }, []);

  // Mark EMI as paid for today
  const markAsPaid = (index) => {
    const updatedPlans = [...plans];
    const today = new Date().toLocaleDateString("en-GB"); // dd/mm/yyyy

    if (!updatedPlans[index].paid.includes(today)) {
      updatedPlans[index].paid.push(today);
      localStorage.setItem("emiPlans", JSON.stringify(updatedPlans));
      setPlans(updatedPlans);
    } else {
      alert("Already marked as paid for today.");
    }
  };

  // Remaining balance calculation
  const getRemainingAmount = (plan) => {
    return plan.totalAmount - (plan.paid.length * plan.monthlyEmi);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>📂 Existing EMI Plans</h2>

      <button onClick={() => window.location.reload()} style={styles.refreshBtn}>
        🔄 Refresh
      </button>

      {plans.length === 0 ? (
        <p>No EMI plans added yet.</p>
      ) : (
        plans.map((plan, index) => (
          <div key={plan.id} style={styles.card}>
            <h3>{plan.title}</h3>
            <p>💰 Total Amount: ₹{plan.totalAmount}</p>
            <p>📅 Monthly EMI: ₹{plan.monthlyEmi}</p>
            <p>🕒 Duration: {plan.months} months</p>
            <p>📆 Start Date: {plan.startDate}</p>
            <p>✅ Paid Dates: {plan.paid.length > 0 ? plan.paid.join(", ") : "None"}</p>
            <p>📉 Remaining: ₹{getRemainingAmount(plan)}</p>
            <button onClick={() => markAsPaid(index)}>✅ Mark as Paid</button>
          </div>
        ))
      )}
    </div>
  );
}

// Styling
const styles = {
  card: {
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "1rem",
    margin: "1rem 0",
    backgroundColor: "#f9f9f9",
  },
  refreshBtn: {
    padding: "8px 16px",
    marginBottom: "1rem",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};
