import React, { useState } from "react";
import { auth, db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const AddPlan = ({ goBack }) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [monthly, setMonthly] = useState("");
  const [months, setMonths] = useState("");
  const [date, setDate] = useState("");

  const clear = () => {
    setTitle("");
     setAmount(""); 
      setMonthly(""); 
      setMonths(""); 
       setDate("");
  };

  const handleAdd = async () => {
    if (!title || !amount || !monthly || !months || !date) {
      alert("Please fill in all fields."); return;
    }
    const uid = auth.currentUser.uid;
    await addDoc(collection(db, "users", uid, "plans"), {
      title,
      totalAmount: +amount,
      monthlyEmi : +monthly,
      months     : +months,
      startDate  : date,
      payments   : [],
      createdAt  : serverTimestamp()
    });
    alert("Plan added 🎉");
    clear();
  };

  return (
    <div style={s.ct}>
      <h3>Add New EMI Plan</h3>

      <input style={s.in} placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)}/>
      <input style={s.in} placeholder="Total Amount" type="number" value={amount} onChange={e=>setAmount(e.target.value)}/>
      <input style={s.in} placeholder="Monthly EMI" type="number" value={monthly} onChange={e=>setMonthly(e.target.value)}/>
      <input style={s.in} placeholder="Total Months" type="number" value={months} onChange={e=>setMonths(e.target.value)}/>
      <input style={s.in} placeholder="Start Date (dd/mm/yyyy)" value={date} onChange={e=>setDate(e.target.value)}/>

      <button style={s.add} onClick={handleAdd}>Add Plan ✅</button>
      <button style={s.back} onClick={goBack}>Back</button>
    </div>
  );
};

const s={
  ct:{padding:"1.5rem",fontFamily:"Arial"},
  in:{display:"block",margin:"8px 0",padding:"10px",width:"260px"},
  add:{padding:"8px 16px",background:"#28a745",color:"#fff",border:"none",borderRadius:6,cursor:"pointer"},
  back:{padding:"8px 16px",background:"#007bff",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",marginLeft:8}
};
export default AddPlan;

