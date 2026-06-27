import React, { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";

const BtnWhatsapp = () => {
  const [toTop, setToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.a
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 1 }}
      href="https://wa.me/201200722824"
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-5 ${toTop ? "bottom-20" : ""} animate-pulse hover:animate-none border-2 rounded-full bg-[#fff] flex items-center justify-center border-[var(--color-primary)] transition-all duration-800 right-5 h-12 w-12 z-[9999] cursor-pointer`}
    >
      <FaWhatsapp className="w-full h-full text-[var(--color-primary)]" />
    </motion.a>
  );
};

export default BtnWhatsapp;
