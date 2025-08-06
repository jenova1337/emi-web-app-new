import React, { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
} from 'firebase/firestore';
import { db, auth } from './firebase';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';
import { format, parse } from 'date-fns';

const MonthWiseEmiSummary = ({ goBack }) => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const groupByMonth = (entries) => {
    const map = {};

    entries.forEach((entry) => {
      if (!entry.date || isNaN(Date.parse(entry.date))) return;

      const dateParts = entry.date.split('/');
      if (dateParts.length !== 3) return;
      const date = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
      const month = format(date, 'MMM yyyy');

      if (!map[month]) {
        map[month] = 0;
      }

      map[month] += parseFloat(entry.amount || 0);
    });

    const result = Object.keys(map).map((month) => ({
      month,
      totalPaid: map[month],
    }));

    result.sort((a, b) => {
      const aDate = parse(`01 ${a.month}`, 'dd MMM yyyy', new Date());
      const bDate = parse(`01 ${b.month}`, 'dd MMM yyyy', new Date());
      return aDate - bDate;
    });

    return result;
  };

  useEffect(() => {
    const fetchEMIData = async () => {
      try {
        const uid = auth.currentUser?.uid;
        if (!uid) return;

        const plansSnapshot = await getDocs(collection(db, 'users', uid, 'plans'));
        const allPayments = [];

        plansSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.payments && Array.isArray(data.payments)) {
            allPayments.push(...data.payments);
          }
        });

        const groupedData = groupByMonth(allPayments);
        setMonthlyData(groupedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching EMI data:', error);
        setLoading(false);
      }
    };

    fetchEMIData();
  }, []);

  if (loading) return <div style={{ padding: "1rem", fontSize: "18px" }}>Loading Month-wise Summary...</div>;

  return (
    <div style={{ padding: "1rem" }}>
      <button onClick={goBack} style={{
        marginBottom: "1rem",
        padding: "8px 16px",
        backgroundColor: "#333",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
      }}>
        🔙 Back to Dashboard
      </button>

      <h2 style={{ fontSize: "24px", marginBottom: "1rem" }}>📅 Monthly EMI Summary</h2>

      {monthlyData.length === 0 ? (
        <p>No EMI data available.</p>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalPaid" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>

          <div style={{ marginTop: "2rem" }}>
            <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>📊 Detailed Breakdown</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f0f0f0" }}>
                  <th style={thStyle}>Month</th>
                  <th style={thStyle}>Total EMI Paid</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((item, idx) => (
                  <tr key={idx}>
                    <td style={tdStyle}>{item.month}</td>
                    <td style={tdStyle}>₹{item.totalPaid.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

const thStyle = {
  border: "1px solid #ccc",
  padding: "10px",
  textAlign: "left",
  fontWeight: "bold"
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "10px"
};

export default MonthWiseEmiSummary;
