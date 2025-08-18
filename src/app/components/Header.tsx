"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react"; // hamburger icons

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6 z-51">

        
        {/* Logo */}
        <Link href="https://bombayblokes.com/">
          <Image
            src="/images/bblogo.webp"
            alt="Bombay Blokes Logo"
            width={180}
            height={60}
            className="object-contain z-1000"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-black font-medium">
          <Link
            href="https://bombayblokes.com/services/"
            className="px-3 py-2 rounded-md hover:bg-black hover:text-[#F9B31B] transition"
          >
            Services
          </Link>
          <Link
            href="https://bbstudios.bombayblokes.com/?_gl=1*1k457ct*_ga*MTA3MDMyNjU4MC4xNzUyODMyMjM4*_ga_E86THEZTKX*czE3NTU1MTk5ODIkbzE1JGcxJHQxNzU1NTIwMDI1JGoxNyRsMCRoMA.."
            className="px-3 py-2 rounded-md hover:bg-black hover:text-[#F9B31B] transition"
          >
            BB Studios
          </Link>
          <Link
            href="https://bombayblokes.com/estimates-calculator/"
            className="px-3 py-2 rounded-md hover:bg-black hover:text-[#F9B31B] transition"
          >
            Calculator
          </Link>
          <Link
            href="https://bombayblokes.com/our-clients/"
            className="px-3 py-2 rounded-md hover:bg-black hover:text-[#F9B31B] transition"
          >
            Clients
          </Link>
          <Link
            href="https://bombayblokes.com/career/"
            className="px-3 py-2 rounded-md hover:bg-black hover:text-[#F9B31B] transition"
          >
            Careers
          </Link>

          {/* Contact Button */}
          <Link
            href="https://bombayblokes.com/contact/"
            className="ml-4 px-5 py-2 rounded-[10px] bg-black text-[#F9B31B] shadow-md"
          >
            Contact Us
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-black z-60 "
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      {isOpen && (
 <div className="fixed inset-0 bg-white flex flex-col justify-start pt-24 px-6 space-y-6 shadow-md z-40">
          <Link
            href="https://bombayblokes.com/services/"
            className="block px-3 py-2 rounded-md hover:bg-black hover:text-[#F9B31B] transition"
          >
            Services
          </Link>
          <Link
            href="https://bbstudios.bombayblokes.com/?_gl=1*1k457ct*_ga*MTA3MDMyNjU4MC4xNzUyODMyMjM4*_ga_E86THEZTKX*czE3NTU1MTk5ODIkbzE1JGcxJHQxNzU1NTIwMDI1JGoxNyRsMCRoMA.."
            className="block px-3 py-2 rounded-md hover:bg-black hover:text-[#F9B31B] transition"
          >
            BB Studios
          </Link>
          <Link
            href="https://bombayblokes.com/estimates-calculator/"
            className="block px-3 py-2 rounded-md hover:bg-black hover:text-[#F9B31B] transition"
          >
            Calculator
          </Link>
          <Link
            href="https://bombayblokes.com/our-clients/"
            className="block px-3 py-2 rounded-md hover:bg-black hover:text-[#F9B31B] transition"
          >
            Clients
          </Link>
          <Link
            href="https://bombayblokes.com/career/"
            className="block px-3 py-2 rounded-md hover:bg-black hover:text-[#F9B31B] transition"
          >
            Careers
          </Link>
 <Link
            href="https://bombayblokes.com/contact/"
            className="block w-full text-center px-5 py-2 rounded-[10px] bg-black text-[#F9B31B] shadow-md 
             hover:bg-white hover:text-black transition-colors duration-300"
          >
            Contact Us
          </Link>
   

        </div>
      )}
    </header>
  );
}
