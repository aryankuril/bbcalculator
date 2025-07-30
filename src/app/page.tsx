
"use client";
import { useEffect, useState } from "react";

import React from 'react'
import Calculator from './components/Calculator';
import Navbar from './components/Navbar';

export default function Home() {
    const [role, setRole] = useState("");


  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    setRole(savedRole || "");
  }, []);

  return (
    <div >
  <Navbar role={role} />

      <Calculator />
    </div>
  );
}
