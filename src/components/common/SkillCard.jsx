import { motion } from "framer-motion";
import React from "react";

const skillCard = ({ title, skills }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      initial={{ opacity: 0, y: -100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      key={title}
      className="w-[250px]  shadow-lg shadow-green-900 p-4  rounded-md border   border-[var(--color-primary)]"
    >
      <h3 className="capitalize border-b pb-2 mb-4 border-[var(--color-primary)]">
        {title ? title : "No Title"}
      </h3>
      <p className="capitalize leading-7 text-gray-400 font-semibold text-sm">
        {skills ? skills : "No skills"}
      </p>
    </motion.div>
  );
};

export default skillCard;
