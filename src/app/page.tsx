
"use client";
// import { useEffect, useState } from "react";

import React from 'react'
import Landing from './components/Landing';
import Navbar from './components/Navbar';
import Footer from './components/Footer'
// import Navbar from './components/Navbar';

export default function Home() {
  //   const [role, setRole] = useState("");


  // useEffect(() => {
  //   const savedRole = localStorage.getItem("role");
  //   setRole(savedRole || "");
  // }, []);

  return (
    <div >
  {/* <Navbar role={role} /> */}
      <Navbar/>
      <Landing/>
      <Footer/>
    </div>
  );
}
