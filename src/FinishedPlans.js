import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { jsPDF } from "jspdf";

const FinishedPlans = ({ goBack }) => {
  const [plans,setPlans]=useState([]);

  useEffect(()=>{
    const uid=auth.currentUser.uid;
    return onSnapshot(collection(db,"users",uid,"plans"),snap=>{
      const all=snap.docs.map(d=>({id:d.id,...d.data()}));
      setPlans(all.filter(p=>(p.payments?.reduce((s,x)=>s+x.amount,0)||0)>=p.totalAmount));
    });
  },[]);

  const pdf=(p)=>{
    const doc=new jsPDF();
    doc.text(`EMI Plan: ${p.title}`,10,15);
    doc.text(`Total Amount: ₹${p.totalAmount}`,10,25);
    let y=40, run=0;
    p.payments.forEach((m,i)=>{
      run+=m.amount;
      doc.text(`${i+1}. ${m.date}  ₹${m.amount}  ${m.type}  (total ₹${run})`,10,y);
      y+=7;
    });
    doc.save(`${p.title}.pdf`);
  };

  return(
    <div style={{padding:"1rem"}}>
      <h2>Finished Plans</h2>
      <button onClick={goBack}>Back</button>

      {plans.length===0? <p>No finished plans.</p>:
        plans.map(p=>(
          <div key={p.id} style={{border:"1px solid #ccc",padding:"1rem",borderRadius:8,margin:"1rem 0"}}>
            <h4>{p.title}</h4>
            <p>Paid: ₹{p.payments.reduce((s,x)=>s+x.amount,0)}</p>
            <button onClick={()=>pdf(p)}>Download PDF</button>
          </div>
        ))}
    </div>
  );
};
export default FinishedPlans;
