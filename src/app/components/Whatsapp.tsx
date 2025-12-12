"use client";
import React from "react";
import Image from "next/image";

const Whatsapp = () => {
  const whatsappNumber = "911234567890"; 
  const message = "Hello! I want to chat with you.";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="hidden sm:flex"  // 👈 Hides on mobile, shows on sm+ screens
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
        zIndex: 1000,
        cursor: "pointer",
      }}
    >
      <Image
        src="/images/Whatsapp.png"
        alt="WhatsApp"
        width={100}
        height={100}
        style={{
          width: "80%",
          height: "80%",
          objectFit: "contain",
        }}
      />
    </a>
  );
};

export default Whatsapp;
