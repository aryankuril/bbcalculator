
"use client";
// import { useEffect, useState } from "react";

import React from 'react'
import Landing from './components/Landing';
import Header from './components/Header'
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
      <Header/>
      <Landing/>
      <Footer/>
    </div>
  );
}
