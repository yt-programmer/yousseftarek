import { motion } from "framer-motion";
import { div } from "framer-motion/client";
import React from "react";

import { BiSolidArrowToTop } from "react-icons/bi";

const onClickHandle = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
};
const ToTop = () => {
  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 1 }}
      className="fixed bottom-5 z-[2222222222222222] right-5"
    >
      <button
        onClick={onClickHandle}
        className="w-12 h-12 cursor-pointer  bg-[var(--color-primary)] flex items-center justify-center text-2xl   rounded-full"
      >
        <BiSolidArrowToTop />
      </button>
    </motion.div>
  );
};

export default ToTop;
