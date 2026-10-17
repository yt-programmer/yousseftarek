import React, { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";
import { useSiteContent } from "../context/SiteContentContext";
const BtnWhatsapp = () => {
  const [toTop, setToTop] = useState(false);
  const { content } = useSiteContent();
  const item = (content.socials || []).find((social) => social?.url && (/whatsapp/i.test(`${social.platform || ""} ${social.label || ""}`) || /wa\.me|whatsapp\.com/i.test(social.url)));
  const raw = item?.url?.match(/(?:wa\.me\/|phone=)([^?&#]+)/i)?.[1] || (item?.url && !/^https?:\/\//i.test(item.url) ? item.url : "");
  const phone = raw.replace(/\D/g, "");
  const href = phone ? `https://wa.me/${phone}` : (/^https?:\/\/(?:api\.)?whatsapp\.com\//i.test(item?.url || "") ? item.url : "");
  useEffect(() => {
    const handleScroll = () => setToTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  if (!href) return null;
  return <motion.a initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} href={href} target="_blank" rel="noopener noreferrer" aria-label="Contact on WhatsApp" className={`fixed bottom-5 ${toTop ? "bottom-20" : ""} animate-pulse hover:animate-none border-2 rounded-full bg-[#fff] flex items-center justify-center border-[var(--color-primary)] transition-all duration-300 right-5 h-12 w-12 z-[9999] cursor-pointer`}><FaWhatsapp className="h-8 w-8 text-[var(--color-primary)]" /></motion.a>;
};
export default BtnWhatsapp;
