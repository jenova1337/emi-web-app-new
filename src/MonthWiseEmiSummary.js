// src/MonthWiseEmiSummary.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from './firebase';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { format, parse } from 'date-fns';

const MonthWiseEmiSummary = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const groupByMonth = (entries) => {
    const map = {};

    entries.forEach((entry) => {
      if (!entry.date || isNaN(Date.parse(entry.date))) return;

      const date = new Date(entry.date);
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

    // Sort by date
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

        const plansSnapshot = await getDocs(query(collection(db, 'plans'), where('userId', '==', uid)));
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

  if (loading) return <div className="p-4 text-lg">Loading Month-wise Summary...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">📅 Monthly EMI Summary</h2>

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

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">📊 Detailed Breakdown</h3>
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">Month</th>
                  <th className="border px-4 py-2">Total EMI Paid</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((item, idx) => (
                  <tr key={idx}>
                    <td className="border px-4 py-2">{item.month}</td>
                    <td className="border px-4 py-2">₹{item.totalPaid.toFixed(2)}</td>
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

export default MonthWiseEmiSummary;
