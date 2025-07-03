// ✅ SummaryDashboard.js - shows EMI statistics and pie chart
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#28a745", "#dc3545"];

export default function SummaryDashboard({ goBack }) {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("emiPlans")) || [];
    setPlans(saved);
  }, []);

  const getTotalAmount = () => plans.reduce((sum, plan) => sum + plan.totalAmount, 0);
  const getTotalPaid = () => plans.reduce((sum, plan) => sum + getPlanPaid(plan), 0);
  const getPlanPaid = (plan) => plan.payments?.reduce((s, p) => s + p.amount, 0) || 0;

  const getTotalRemaining = () => getTotalAmount() - getTotalPaid();
  const getPaidThisMonth = () => {
    const today = new Date();
    const m = today.getMonth() + 1;
    const y = today.getFullYear();
    return plans.reduce((sum, plan) => {
      return sum + (plan.payments?.filter(p => {
        const [d, mo, yr] = p.date.split("/").map(Number);
        return mo === m && yr === y;
      }).reduce((s, p) => s + p.amount, 0) || 0);
    }, 0);
  };

  const getNextEmiDate = () => {
    let earliest = null;
    plans.forEach(plan => {
      const start = new Date(plan.startDate.split("/").reverse().join("-"));
      const nextMonth = start.getMonth() + (plan.payments?.filter(p => p.type === "Fixed").length || 0);
      const next = new Date(start.setMonth(nextMonth));
      if (!earliest || next < earliest) earliest = next;
    });
    return earliest ? earliest.toLocaleDateString("en-GB") : "N/A";
  };

  const pieData = [
    { name: "Paid", value: getTotalPaid() },
    { name: "Remaining", value: getTotalRemaining() },
  ];

  return (
    <div style={styles.container}>
      <h2>📊 EMI Summary</h2>
      <button onClick={goBack} style={styles.backBtn}>🔙 Back to Dashboard</button>

      <ul style={styles.list}>
        <li><strong>💼 Total Plans:</strong> {plans.length}</li>
        <li><strong>💰 Total Amount:</strong> ₹{getTotalAmount()}</li>
        <li><strong>💸 Total Paid:</strong> ₹{getTotalPaid()}</li>
        <li><strong>📉 Remaining Balance:</strong> ₹{getTotalRemaining()}</li>
        <li><strong>📅 Next EMI Due:</strong> {getNextEmiDate()}</li>
        <li><strong>🔄 EMI Paid This Month:</strong> ₹{getPaidThisMonth()}</li>
      </ul>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "1rem",
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
  list: {
    listStyleType: "none",
    padding: 0,
    lineHeight: "2rem",
    fontSize: "1.1rem",
  },
};
