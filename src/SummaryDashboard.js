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
    let earliest = null;
    plans.forEach((plan) => {
      const base = new Date(plan.emiDueDate.split("/").reverse().join("-"));
      const paidCount = plan.payments?.filter((p) => p.type === "Fixed").length || 0;
      const nextDate = new Date(base);
      nextDate.setMonth(nextDate.getMonth() + paidCount);
      const isOver = getPlanPaid(plan) >= plan.totalAmount;
      if (!isOver && (!earliest || nextDate < earliest)) {
        earliest = nextDate;
      }
    });
    return earliest ? earliest.toLocaleDateString("en-GB") : "✅ All EMIs Over";
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

      <h4>📈 Overall EMI Status</h4>
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
          const isOver = getPlanPaid(plan) >= plan.totalAmount;

// 🆕 Calculate last paid date if EMI is over
let lastPaidDate = "";
if (isOver && plan.payments?.length > 0) {
  const sorted = [...plan.payments].sort((a, b) => {
    const [da, ma, ya] = a.date.split("/").map(Number);
    const [db, mb, yb] = b.date.split("/").map(Number);
    const d1 = new Date(ya, ma - 1, da);
    const d2 = new Date(yb, mb - 1, db);
    return d2 - d1; // descending
  });
  lastPaidDate = sorted[0]?.date || "";
}

const planPieData = [
  { name: "Paid", value: getPlanPaid(plan) },
  { name: "Remaining", value: plan.totalAmount - getPlanPaid(plan) }
];

return (
  <li key={plan.id}>
    <strong>{plan.title}</strong>: {isOver
      ? `✅ EMI Over on ${lastPaidDate}`
      : `Next Due: ${nextDate.toLocaleDateString("en-GB")}`}

              <div style={{ width: "100%", height: 250 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={planPieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {planPieData.map((entry, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
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
