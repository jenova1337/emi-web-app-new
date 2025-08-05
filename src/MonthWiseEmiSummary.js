import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const MonthWiseEmiSummary = () => {
  const [monthWiseSummary, setMonthWiseSummary] = useState({});

  useEffect(() => {
    if (auth.currentUser) {
      fetchEmiPlans();
    }
  }, []);

  const fetchEmiPlans = async () => {
    const uid = auth.currentUser.uid;
    const querySnapshot = await getDocs(collection(db, "users", uid, "plans"));
    const plans = [];
    querySnapshot.forEach((doc) => plans.push(doc.data()));
    processMonthWiseData(plans);
  };

  const processMonthWiseData = (plans) => {
    const summary = {};

    plans.forEach((plan) => {
      if (Array.isArray(plan.payments)) {
        plan.payments.forEach((payment) => {
          const [d, m, y] = payment.date.split("/").map(Number);
          const monthKey = `${y}-${String(m).padStart(2, "0")}`;
          if (!summary[monthKey]) {
            summary[monthKey] = { total: 0 };
          }
          summary[monthKey].total += payment.amount || 0;
        });
      }
    });

    const sorted = Object.keys(summary)
      .sort((a, b) => (a < b ? 1 : -1))
      .reduce((acc, key) => {
        acc[key] = summary[key];
        return acc;
      }, {});

    setMonthWiseSummary(sorted);
  };

  const formatMonth = (key) => {
    const [year, month] = key.split("-");
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  const downloadMonthWisePDF = () => {
    if (Object.keys(monthWiseSummary).length === 0) {
      alert("No EMI data to download!");
      return;
    }

    const doc = new jsPDF();
    doc.text("Month-wise EMI Payment Summary", 14, 10);

    const rows = Object.entries(monthWiseSummary).map(([month, data], index) => [
      index + 1,
      formatMonth(month),
      `₹${data.total.toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: 20,
      head: [["S.No", "Month", "Total EMI Paid"]],
      body: rows,
      theme: "grid",
    });

    doc.save("EMI_MonthWise_Summary.pdf");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📅 Month-wise EMI Summary</h2>

      {Object.keys(monthWiseSummary).length === 0 && (
        <p>📭 No EMI data available.</p>
      )}

      {Object.keys(monthWiseSummary).length > 0 && (
        <>
          <table border="1" cellPadding="6">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Month</th>
                <th>Total EMI Paid</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(monthWiseSummary).map(([month, data], index) => (
                <tr key={month}>
                  <td>{index + 1}</td>
                  <td>{formatMonth(month)}</td>
                  <td>₹{data.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={downloadMonthWisePDF}
            style={{
              marginTop: "15px",
              padding: "10px 16px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            📄 Download PDF
          </button>
        </>
      )}
    </div>
  );
};

export default MonthWiseEmiSummary;
