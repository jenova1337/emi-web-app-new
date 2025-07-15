import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import {
  collection, onSnapshot, doc, updateDoc, deleteDoc, arrayUnion
} from "firebase/firestore";

const ExistingPlans = ({ goBack }) => {
  const [plans, setPlans] = useState([]);

  // live listener
  useEffect(()=>{
    const uid = auth.currentUser.uid;
    return onSnapshot(collection(db,"users",uid,"plans"), snap=>{
      setPlans(snap.docs.map(d=>({id:d.id,...d.data()})));
    });
  },[]);

  const sum = arr => arr.reduce((s,x)=>s + x.amount,0);

  const addPayment = async (plan, amt, type, date) => {
    const uid = auth.currentUser.uid;
    await updateDoc(doc(db,"users",uid,"plans",plan.id),{
      payments: arrayUnion({amount:+amt, type, date})
    });
  };

  const handleFixed = (plan) => {
    const paidFixedThisMonth = plan.payments?.some(p=>{
      const [ ,m,y]=p.date.split("/").map(Number);
      const [ ,cm,cy]=new Date().toLocaleDateString("en-GB").split("/").map(Number);
      return p.type==="Fixed" && m===cm && y===cy;
    });
    const totalPaid = sum(plan.payments||[]);
    const remaining = plan.totalAmount - totalPaid;
    if (remaining<=0) return alert("Fully paid ✅");

    if (paidFixedThisMonth) return alert("Fixed EMI already paid this month");

    const when = prompt("Date (dd/mm/yyyy) ?", new Date().toLocaleDateString("en-GB"));
    if (when) addPayment(plan, Math.min(plan.monthlyEmi, remaining), "Fixed", when);
  };

  const handleExcess = (plan) => {
    const totalPaid = sum(plan.payments||[]);
    const remaining = plan.totalAmount - totalPaid;
    if (remaining<=0) return alert("Fully paid ✅");

    const amt = +prompt("Excess amount?");
    if (!amt || amt<=0 || amt>remaining) return;
    const when = prompt("Date (dd/mm/yyyy) ?", new Date().toLocaleDateString("en-GB"));
    if (when) addPayment(plan, amt, "Excess", when);
  };

  const delPlan = async id=>{
    if(window.confirm("Delete plan?")){
      await deleteDoc(doc(db,"users",auth.currentUser.uid,"plans",id));
    }
  };

  return (
    <div style={{padding:"1rem"}}>
      <h2>Existing EMI Plans</h2>
      <button style={st.back} onClick={goBack}>Back</button>

      {plans.length===0 ? <p>No plans yet.</p> :
        plans.map(p=>{
          const paid=sum(p.payments||[]);
          const remain=Math.max(0,p.totalAmount-paid);
          return(
            <div key={p.id} style={st.card}>
              <h3>{p.title}</h3>
              <p>Total: ₹{p.totalAmount}</p>
              <p>Paid: ₹{paid}</p>
              <p>Remaining: ₹{remain}</p>

              <button style={st.fixed}  onClick={()=>handleFixed(p)}>Pay EMI</button>
              <button style={st.excess} onClick={()=>handleExcess(p)}>Excess</button>

              <h4>History</h4>
              <table border="1" cellPadding="5">
                <thead><tr><th>#</th><th>Date</th><th>Amt</th><th>Type</th></tr></thead>
                <tbody>
                  {(p.payments||[]).map((x,i)=>(
                    <tr key={i}><td>{i+1}</td><td>{x.date}</td><td>₹{x.amount}</td><td>{x.type}</td></tr>
                  ))}
                </tbody>
              </table>

              <button style={st.del} onClick={()=>delPlan(p.id)}>Delete</button>
            </div>
        )})}
    </div>
  );
};

const st={
  back:{marginBottom:8,padding:"6px 12px"},
  card:{border:"1px solid #ccc",padding:"1rem",borderRadius:8,marginBottom:16},
  fixed:{background:"#28a745",color:"#fff",padding:"6px 12px",marginRight:6,border:"none",borderRadius:5},
  excess:{background:"#ffc107",padding:"6px 12px",border:"none",borderRadius:5},
  del:{marginTop:8,background:"#dc3545",color:"#fff",padding:"6px 12px",border:"none",borderRadius:5}
};
export default ExistingPlans;
