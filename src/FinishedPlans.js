import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";

const FinishedPlans = ({ goBack }) => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("emiPlans")) || [];
    const finished = saved.filter(
      (p) => (p.payments?.reduce((s, x) => s + x.amount, 0) || 0) >= p.totalAmount
    );
    setPlans(finished);
  }, []);

  // --- PDF maker ---
  const downloadPdf = (plan) => {
    const doc = new jsPDF();
    doc.setFontSize(16).text(`EMI Plan: ${plan.title}`, 10, 15);
    doc.setFontSize(12).text(`Total Amount: ₹${plan.totalAmount}`, 10, 25);
    doc.text(`Start Date: ${plan.startDate}`, 10, 33);
    doc.text(`Payments:`, 10, 43);

    // table header
    const startY = 50;
    doc.setFontSize(10);
    doc.text("S.No", 10, startY);
    doc.text("Date", 25, startY);
    doc.text("Amount", 60, startY);
    doc.text("Type", 95, startY);
    doc.text("Running Total", 125, startY);

    let y = startY + 7;
    let running = 0;
    plan.payments.forEach((p, i) => {
      running += p.amount;
      doc.text(String(i + 1), 10, y);
      doc.text(p.date, 25, y);
      doc.text("₹" + p.amount, 60, y);
      doc.text(p.type, 95, y);
      doc.text("₹" + running, 125, y);
      y += 7;
    });

    doc.save(`${plan.title}-log.pdf`);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Finished EMI Plans</h2>
      <button onClick={goBack} style={styles.back}>Back</button>

      {plans.length === 0 ? (
        <p>No finished plans yet.</p>
      ) : (
        plans.map((p) => (
          <div key={p.id} style={styles.card}>
            <h3>{p.title}</h3>
            <p>Total Amount: ₹{p.totalAmount}</p>
            <p>Total Paid: ₹{p.payments.reduce((s, x) => s + x.amount, 0)}</p>
            <button onClick={() => downloadPdf(p)} style={styles.pdf}>Download PDF</button>
          </div>
        ))
      )}
    </div>
  );
};

const styles = {
  back: { marginBottom: "1rem", padding: "6px 12px" },
  card: {
    border: "1px solid #ccc",
    padding: "1rem",
    borderRadius: "8px",
    marginBottom: "1rem",
    background: "#f9f9f9",
  },
  pdf: {
    marginTop: "0.5rem",
    backgroundColor: "#28a745",
    color: "#fff",
    padding: "6px 12px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default FinishedPlans;
