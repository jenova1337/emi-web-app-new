import React, { useEffect, useState } from "react";

export default function ExistingPlans({ goBack }) {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("emiPlans")) || [];
    setPlans(saved);
  }, []);

  const savePlans = (updated) => {
    localStorage.setItem("emiPlans", JSON.stringify(updated));
    setPlans(updated);
  };

  const addPayment = (planIndex, amount, type, customDate) => {
    const updatedPlans = [...plans];
    const plan = updatedPlans[planIndex];
    const payment = {
      date: customDate || new Date().toLocaleDateString("en-GB"),
      amount: parseFloat(amount),
      type: type,
    };
    plan.payments.push(payment);
    savePlans(updatedPlans);
  };

  const handleFixedPayment = (index) => {
    const monthly = plans[index].monthlyEmi;
    const date = prompt("Enter date (dd/mm/yyyy) or leave blank for today:");
    addPayment(index, monthly, "Fixed", date);
  };

  const handleExcessPayment = (index) => {
    const amount = prompt("Enter excess amount:");
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      alert("Invalid excess amount.");
      return;
    }
    const date = prompt("Enter date (dd/mm/yyyy) or leave blank for today:");
    addPayment(index, amount, "Excess", date);
  };

  const getTotalPaid = (payments) =>
    payments.reduce((sum, p) => sum + p.amount, 0);

  const getBalance = (plan) =>
    plan.totalAmount - getTotalPaid(plan.payments);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>📂 Existing EMI Plans</h2>
      <button onClick={goBack} style={styles.backBtn}>🔙 Back to Dashboard</button>

      {plans.map((plan, index) => (
        <div key={plan.id} style={styles.card}>
          <h3>{plan.title}</h3>
          <p>💰 Total Amount: ₹{plan.totalAmount}</p>
          <p>📅 Monthly EMI: ₹{plan.monthlyEmi}</p>
          <p>📆 Start Date: {plan.startDate}</p>
          <p>✅ Total Paid: ₹{getTotalPaid(plan.payments)}</p>
          <p>📉 Remaining: ₹{getBalance(plan)}</p>

          <button onClick={() => handleFixedPayment(index)} style={styles.payBtn}>
            ✅ Pay EMI
          </button>
          <button onClick={() => handleExcessPayment(index)} style={styles.excessBtn}>
            ➕ Add Excess Payment
          </button>

          <h4>📋 Payment History</h4>
          <table border="1" cellPadding="5">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Total Paid</th>
                <th>To Be Paid</th>
              </tr>
            </thead>
            <tbody>
              {plan.payments.map((pay, idx) => {
                const runningTotal = plan.payments
                  .slice(0, idx + 1)
                  .reduce((sum, p) => sum + p.amount, 0);
                const balance = plan.totalAmount - runningTotal;

                return (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{pay.date}</td>
                    <td>₹{pay.amount}</td>
                    <td>
                      <span style={pay.type === "Fixed" ? styles.fixedBadge : styles.excessBadge}>
                        {pay.type}
                      </span>
                    </td>
                    <td>₹{runningTotal}</td>
                    <td>₹{balance}</td>
                  </tr>
                );
              })}
              {plan.payments.length === 0 && (
                <tr>
                  <td colSpan="6" align="center">No payments yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "1rem",
    marginBottom: "2rem",
    backgroundColor: "#f9f9f9",
  },
  backBtn: {
    padding: "8px 16px",
    marginBottom: "1rem",
    backgroundColor: "#333",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  payBtn: {
    backgroundColor: "#28a745",
    color: "white",
    padding: "6px 12px",
    marginRight: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  excessBtn: {
    backgroundColor: "#ffc107",
    color: "black",
    padding: "6px 12px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  fixedBadge: {
    padding: "4px 8px",
    backgroundColor: "#28a745",
    color: "white",
    borderRadius: "5px",
    fontSize: "0.9rem",
  },
  excessBadge: {
    padding: "4px 8px",
    backgroundColor: "#fd7e14",
    color: "white",
    borderRadius: "5px",
    fontSize: "0.9rem",
  },
};
