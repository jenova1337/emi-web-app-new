// ✅ ExistingPlans.js (Firebase version with same logic)
import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import {
  collection, onSnapshot, doc, updateDoc, deleteDoc, arrayUnion
} from "firebase/firestore";

const ExistingPlans = ({ goBack }) => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const uid = auth.currentUser.uid;
    return onSnapshot(collection(db, "users", uid, "plans"), snap => {
      setPlans(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, []);

  const sum = arr => arr.reduce((s, x) => s + x.amount, 0);

  const addPayment = async (plan, amt, type, date) => {
    const uid = auth.currentUser.uid;
    await updateDoc(doc(db, "users", uid, "plans", plan.id), {
      payments: arrayUnion({ amount: +amt, type, date })
    });
  };

  const handleFixed = (plan) => {
    const paidFixedThisMonth = plan.payments?.some(p => {
      const [, m, y] = p.date.split("/").map(Number);
      const [, cm, cy] = new Date().toLocaleDateString("en-GB").split("/").map(Number);
      return p.type === "Fixed" && m === cm && y === cy;
    });
    const totalPaid = sum(plan.payments || []);
    const remaining = plan.totalAmount - totalPaid;
    if (remaining <= 0) return alert("🎉 Fully paid ✅");
    if (paidFixedThisMonth) return alert("⚠️ Fixed EMI already paid this month");

    const when = prompt("Enter date (dd/mm/yyyy):", new Date().toLocaleDateString("en-GB"));
    if (when) addPayment(plan, Math.min(plan.monthlyEmi, remaining), "Fixed", when);
  };

  const handleExcess = (plan) => {
    const totalPaid = sum(plan.payments || []);
    const remaining = plan.totalAmount - totalPaid;
    if (remaining <= 0) return alert("🎉 Fully paid ✅");

    const amt = +prompt("Enter excess amount:");
    if (!amt || amt <= 0 || amt > remaining) return;
    const when = prompt("Enter date (dd/mm/yyyy):", new Date().toLocaleDateString("en-GB"));
    if (when) addPayment(plan, amt, "Excess", when);
  };

  const delPlan = async (id) => {
    if (window.confirm("Delete this plan?")) {
      await deleteDoc(doc(db, "users", auth.currentUser.uid, "plans", id));
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>📂 Existing EMI Plans</h2>
      <button style={styles.backBtn} onClick={goBack}>🔙 Back</button>
      {plans.length === 0 ? <p>No EMI plans found.</p> : plans.map((p, idx) => {
        const paid = sum(p.payments || []);
        const remain = Math.max(0, p.totalAmount - paid);
        return (
          <div key={p.id} style={styles.card}>
            <h3>{p.title}</h3>
            <p>💰 Total Amount: ₹{p.totalAmount}</p>
            <p>📅 Monthly EMI: ₹{p.monthlyEmi}</p>
            <p>✅ Total Paid: ₹{paid}</p>
            <p>📉 Remaining: ₹{remain}</p>
            {remain === 0 && <p style={{ color: "green" }}>🎉 EMI Over</p>}
            <button onClick={() => handleFixed(p)} style={styles.payBtn}>✅ Pay EMI</button>
            <button onClick={() => handleExcess(p)} style={styles.excessBtn}>➕ Add Excess</button>
            <h4>📋 Payment History</h4>
            <table border="1" cellPadding="5">
              <thead><tr><th>#</th><th>Date</th><th>Amount</th><th>Type</th></tr></thead>
              <tbody>
                {(p.payments || []).map((pay, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{pay.date}</td>
                    <td>₹{pay.amount}</td>
                    <td><span style={pay.type === "Fixed" ? styles.fixedBadge : styles.excessBadge}>{pay.type}</span></td>
                  </tr>
                ))}
                {(p.payments?.length || 0) === 0 && <tr><td colSpan="4">No payments yet</td></tr>}
              </tbody>
            </table>
            <button onClick={() => delPlan(p.id)} style={styles.deleteBtn}>🗑 Delete</button>
          </div>
        );
      })}
    </div>
  );
};

const styles = {
  card: { border: "1px solid #ccc", padding: "1rem", borderRadius: "10px", marginBottom: "2rem", backgroundColor: "#f9f9f9" },
  backBtn: { padding: "8px 16px", marginBottom: "1rem", backgroundColor: "#333", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" },
  payBtn: { backgroundColor: "#28a745", color: "white", padding: "6px 12px", marginRight: "10px", border: "none", borderRadius: "5px", cursor: "pointer" },
  excessBtn: { backgroundColor: "#ffc107", color: "black", padding: "6px 12px", border: "none", borderRadius: "5px", cursor: "pointer" },
  fixedBadge: { padding: "4px 8px", backgroundColor: "#28a745", color: "white", borderRadius: "5px", fontSize: "0.9rem" },
  excessBadge: { padding: "4px 8px", backgroundColor: "#fd7e14", color: "white", borderRadius: "5px", fontSize: "0.9rem" },
  deleteBtn: { marginTop: "1rem", backgroundColor: "#dc3545", color: "white", padding: "8px 12px", border: "none", borderRadius: "5px", cursor: "pointer" }
};

export default ExistingPlans;
