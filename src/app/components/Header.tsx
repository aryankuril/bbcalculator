"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence, easeOut } from "framer-motion";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const menuItems = [
    { name: "Services", href: "https://bombayblokes.com/services/" },
    { name: "BB Studios", href: "https://bbstudios.bombayblokes.com/" },
    { name: "Calculator", href: "https://bombayblokes.com/estimates-calculator/" },
    { name: "Clients", href: "https://bombayblokes.com/our-clients/" },
    { name: "Careers", href: "https://bombayblokes.com/career/" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const menuVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
  const itemVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { ease: easeOut, duration: 0.5 } },
  };

  return (
    <header
      className={`fixed w-full z-[60] transition-colors duration-300 ${
        scrolled ? "bg-[#F9B31B]" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
        <Link href="https://bombayblokes.com/">
          <Image
            src={scrolled ? "/images/bblogo2.svg" : "/images/bblogo.webp"}
            alt="Bombay Blokes Logo"
            width={160}
            height={50}
            className="object-contain transition-opacity duration-300"
          />
        </Link>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-6 font-medium text-black">
          {menuItems.map((item) => (
            <Link key={item.name} href={item.href} className="px-3 py-2 rounded-md hover:bg-black hover:text-[#F9B31B] transition">
              {item.name}
            </Link>
          ))}
          <Link href="https://bombayblokes.com/contact/" className="ml-4 px-5 py-2 rounded-[10px] bg-black text-[#F9B31B] shadow-md hover:bg-white hover:text-black transition-colors duration-300">
            Contact Us
          </Link>
        </nav>

        {/* Mobile toggle — hamburger ↔ close */}
        <button
          className="md:hidden text-black relative z-[70]"
          onClick={() => setIsOpen((v) => !v)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Sidebar (below header so the X is clickable) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed left-0 top-[60px] w-full h-[400px] bg-white z-40 flex flex-col"
            initial={{ y: -500 }}
            animate={{ y: 0 }}
            exit={{ y: -500 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <motion.ul
              className="flex flex-col space-y-6 mt-6 px-6"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
            >
              {menuItems.map((item) => (
                <motion.li key={item.name} variants={itemVariants}>
                  <Link
                    href={item.href}
                    className="text-xl font-bold text-black hover:text-[#F9B31B] transition"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                </motion.li>
              ))}
              <motion.li variants={itemVariants}>
                <Link
                  href="https://bombayblokes.com/contact/"
                  className="block text-center px-5 py-3 rounded-[10px] bg-black text-[#F9B31B] shadow-md hover:bg-white hover:text-black transition-colors duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  Contact Us
                </Link>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
