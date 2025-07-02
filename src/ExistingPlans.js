import React, { useEffect, useState } from "react";

export default function ExistingPlans({ goBack }) {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    let savedPlans = JSON.parse(localStorage.getItem("emiPlans")) || [];

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

  const getRemainingAmount = (plan) => {
    return plan.totalAmount - (plan.paid.length * plan.monthlyEmi);
  };

  // 🗑 Delete a single plan
  const deletePlan = (id) => {
    if (window.confirm("Are you sure you want to delete this EMI plan?")) {
      const updated = plans.filter((plan) => plan.id !== id);
      localStorage.setItem("emiPlans", JSON.stringify(updated));
      setPlans(updated);
    }
  };

  // 🧼 Clear all plans
  const clearAllPlans = () => {
    if (window.confirm("⚠️ This will delete ALL EMI plans. Are you sure?")) {
      localStorage.removeItem("emiPlans");
      setPlans([]);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>📂 Existing EMI Plans</h2>

      <button onClick={() => window.location.reload()} style={styles.btn}>🔄 Refresh</button>
      <button onClick={clearAllPlans} style={styles.deleteAllBtn}>🧼 Clear All Plans</button>
      <button onClick={goBack} style={styles.backBtn}>🔙 Back to Dashboard</button>

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

            <button onClick={() => markAsPaid(index)} style={styles.markBtn}>✅ Mark as Paid</button>
            <button onClick={() => deletePlan(plan.id)} style={styles.deleteBtn}>🗑 Delete Plan</button>
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
  btn: {
    marginRight: "10px",
    padding: "8px 12px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
  },
  deleteAllBtn: {
    marginRight: "10px",
    padding: "8px 12px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "5px",
  },
  backBtn: {
    padding: "8px 12px",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "5px",
    float: "right",
  },
  markBtn: {
    marginRight: "10px",
    padding: "6px 10px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "4px",
  },
  deleteBtn: {
    padding: "6px 10px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
  },
};
