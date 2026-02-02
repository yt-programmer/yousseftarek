import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa";
import { FaTelegramPlane } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { motion } from "framer-motion";
const social = [
  {
    icon: <FaFacebookF />,
    link: "https://www.facebook.com/Youssef10Tarek/",
  },
  {
    icon: <FaWhatsapp />,
    link: "https://wa.me/201200722824",
  },
  {
    icon: <FaTiktok />,
    link: "https://www.tiktok.com/@youssef_tarek.yt",
  },
  {
    icon: <FaTelegramPlane />,
    link: "https://t.me/yousseftarek_yt",
  },
  {
    icon: <FaLinkedinIn />,
    link: "https://www.linkedin.com/in/youssef-tarek-mohammed",
  },
];
const AllMedia = () => {
  return (
    <div className="flex gap-5 flex-wrap mt-5">
      {social.map((link) => (
        <motion.a
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          className="text-lg w-10 h-10 border rounded-full flex justify-center items-center text-white hover:text-[var(--color-primary)] duration-300"
          key={link.link}
          href={link.link}
          target="_blank"
        >
          {link.icon}
        </motion.a>
      ))}
    </div>
  );
};

export default AllMedia;
