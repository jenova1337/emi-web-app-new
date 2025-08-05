import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { db, auth } from "./firebase";
import { collection, onSnapshot } from "firebase/firestore";

const COLORS = ["#28a745", "#dc3545"];

export default function SummaryDashboard({ goBack }) {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    return onSnapshot(collection(db, "users", uid, "plans"), (snap) => {
      setPlans(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, []);

  const getTotalAmount = () => plans.reduce((sum, plan) => sum + plan.totalAmount, 0);
  const getPlanPaid = (plan) => plan.payments?.reduce((s, p) => s + p.amount, 0) || 0;
  const getTotalPaid = () => plans.reduce((sum, plan) => sum + getPlanPaid(plan), 0);
  const getTotalRemaining = () => getTotalAmount() - getTotalPaid();

  const getPaidThisMonth = () => {
    const today = new Date();
    const m = today.getMonth() + 1;
    const y = today.getFullYear();
    return plans.reduce((sum, plan) => {
      return sum + (plan.payments?.filter((p) => {
        const [d, mo, yr] = p.date.split("/").map(Number);
        return mo === m && yr === y;
      }).reduce((s, p) => s + p.amount, 0) || 0);
    }, 0);
  };

  const getNextEmiDate = () => {
  const nextDates = [];

  plans.forEach((plan) => {
    const fixedPaidCount = plan.payments?.filter((p) => p.type === "Fixed").length || 0;
    const isOver = fixedPaidCount >= plan.months;
    if (isOver) return; // 🎯 skip plans that are finished

    const base = new Date(plan.emiDueDate.split("/").reverse().join("-"));
    const nextDate = new Date(base);
    nextDate.setMonth(nextDate.getMonth() + fixedPaidCount);
    nextDates.push(nextDate);
  });

  if (nextDates.length === 0) return "🎉 All EMIs Over";

  const earliest = nextDates.reduce((min, curr) => (curr < min ? curr : min), nextDates[0]);
  return earliest.toLocaleDateString("en-GB");
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

      <h4 style={{ marginTop: "2rem" }}>📌 Plan-wise EMI Status</h4>
      <ul style={styles.list}>
        {plans.map((plan) => {
          const base = new Date(plan.emiDueDate.split("/").reverse().join("-"));
          const paidCount = plan.payments?.filter((p) => p.type === "Fixed").length || 0;
          const nextDate = new Date(base);
          nextDate.setMonth(base.getMonth() + paidCount);
          const isOver = paidCount >= plan.months;
          const paid = getPlanPaid(plan);
          const remaining = plan.totalAmount - paid;

          const individualPie = [
            { name: "Paid", value: paid },
            { name: "Remaining", value: remaining },
          ];

          return (
            <li key={plan.id} style={{ marginBottom: "1rem" }}>
              <strong>{plan.title}</strong>: {isOver
                ? `🎉 EMI Over`
                : `📅 Next Due: ${nextDate.toLocaleDateString("en-GB")}`}

              <div style={{ width: "100%", height: 200 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={individualPie}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {individualPie.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </li>
          );
        })}
      </ul>
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
