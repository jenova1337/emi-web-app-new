// ✅ SummaryDashboard.js
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const SummaryDashboard = ({ goBack }) => {
  const [plans, setPlans] = useState([]);
  const [summary, setSummary] = useState({});

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("emiPlans")) || [];
    setPlans(data);
    calculateSummary(data);
  }, []);

  const calculateSummary = (data) => {
    const totalPlans = data.length;
    const totalAmount = data.reduce((sum, plan) => sum + plan.totalAmount, 0);

    let totalPaid = 0;
    let paidThisMonth = 0;
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    let nextDueDates = [];

    data.forEach((plan) => {
      plan.payments.forEach((p) => {
        totalPaid += p.amount;

        const [day, month, year] = p.date.split("/").map(Number);
        if (month - 1 === currentMonth && year === currentYear) {
          paidThisMonth += p.amount;
        }
      });

      // Calculate next due date
      const start = new Date(plan.startDate.split("/").reverse().join("-"));
      const nextDue = new Date(start);
      nextDue.setMonth(start.getMonth() + plan.payments.length);
      nextDueDates.push(nextDue);
    });

    const remaining = totalAmount - totalPaid;

    const nextEMI = nextDueDates.sort((a, b) => a - b)[0];
    const nextEMIDate = nextEMI?.toLocaleDateString("en-GB");

    setSummary({
      totalPlans,
      totalAmount,
      totalPaid,
      remaining,
      nextEMIDate,
      paidThisMonth,
    });
  };

  const chartData = [
    { name: "Paid", value: summary.totalPaid || 0 },
    { name: "Remaining", value: summary.remaining || 0 },
  ];

  const COLORS = ["#00C49F", "#FF8042"];

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>📊 EMI Summary Dashboard</h2>
      <button onClick={goBack} style={styles.backBtn}>🔙 Back</button>
      <div style={{ marginTop: "1rem", textAlign: "left", maxWidth: 500, margin: "1rem auto" }}>
        <p>💼 Total Plans: {summary.totalPlans}</p>
        <p>💰 Total Amount: ₹{summary.totalAmount}</p>
        <p>💸 Total Paid: ₹{summary.totalPaid}</p>
        <p>💳 Remaining: ₹{summary.remaining}</p>
        <p>📅 Next EMI Due: {summary.nextEMIDate || "-"}</p>
        <p>🔄 Paid This Month: ₹{summary.paidThisMonth}</p>
      </div>

      <PieChart width={300} height={250}>
        <Pie
          data={chartData}
          dataKey="value"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

const styles = {
  backBtn: {
    padding: "8px 16px",
    backgroundColor: "#333",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default SummaryDashboard;
