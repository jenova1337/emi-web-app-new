import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const Profile = ({ goBack }) => {
  const [data,setData]=useState(null);
  const [edit,setEdit]=useState(false);
  const [form,setForm]=useState({});

  useEffect(()=>{
    const fetch=async()=>{
      const cur=auth.currentUser;
      if(!cur) return;
      const snap=await getDoc(doc(db,"users",cur.uid));
      if(snap.exists()){
        setData(snap.data());
        setForm(snap.data());
      }
    };
    fetch();
  },[]);

  const change=(k,v)=>setForm({...form,[k]:v});

  const save=async()=>{
    await setDoc(doc(db,"users",auth.currentUser.uid),form);
    setData(form); setEdit(false); alert("Saved!");
  };

  if(!data) return <p>Loading…</p>;

  const Row=({field,label,type})=>(
    <div><label>{label}: </label>
      {edit && field!=="email" ? (
        type==="select"
          ? <select value={form.gender} onChange={e=>change("gender",e.target.value)}>
              <option value="">--</option><option>Male</option><option>Female</option><option>Other</option>
            </select>
          : <input type={type} value={form[field]||""} onChange={e=>change(field,e.target.value)}/>
      ):<span>{data[field]}</span>}
    </div>
  );

  return(
    <div style={sty.ct}>
      <h2>Profile</h2>
      <button style={sty.bk} onClick={goBack}>Back</button>

      <div style={sty.box}>
        <Row field="name"  label="Name"   type="text"/>
        <Row field="age"   label="Age"    type="number"/>
        <Row field="gender"label="Gender" type="select"/>
        <Row field="income"label="Income" type="number"/>
        <Row field="familyIncome"label="Family Income" type="number"/>
        <Row field="mobile"label="Mobile" type="text"/>
        <Row field="email" label="Email"  type="text"/>

        {edit
          ? <button style={sty.save} onClick={save}>Save</button>
          : <button style={sty.edit} onClick={()=>setEdit(true)}>Edit</button>}
      </div>
    </div>
  );
};

const sty={
  ct:{padding:"1rem"},
  bk:{marginBottom:"1rem"},
  box:{background:"#f1f1f1",padding:"1rem",borderRadius:8,maxWidth:400,lineHeight:"2rem"},
  edit:{marginTop:10,background:"#007bff",color:"#fff",padding:"6px 12px",border:"none",borderRadius:5},
  save:{marginTop:10,background:"#28a745",color:"#fff",padding:"6px 12px",border:"none",borderRadius:5}
};
export default Profile;
