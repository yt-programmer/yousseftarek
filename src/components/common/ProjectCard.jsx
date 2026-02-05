import React from "react";

import Button from "@mui/material/Button";
import { motion } from "framer-motion";
const ProjectCard = ({ title, skills, key, description, image, link }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      initial={{ opacity: 0, x: -100 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      key={key}
      className="w-[400px] flex flex-col  min-h-[450px] relative shadow-lg shadow-green-900  rounded-2xl border   border-[var(--color-primary)]"
    >
      <motion.img
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        loading="lazy"
        src={image}
        alt="error img"
        className="rounded-t-2xl w-full ]  object-cover"
      />
      <div className="p-5 flex flex-col flex-1">
        <motion.h3
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="capitalize border-b pb-2 mb-4 text-gray-400  border-[var(--color-primary)]"
        >
          {skills ? skills : "No skills"}
        </motion.h3>
        <motion.h2
          initial={{ y: -100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="font-bold text-2xl mb-2 capitalize"
        >
          {title ? title : "No Title"}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="font-semibold  mb-3 capitalize text-sm text-gray-400"
        >
          {description ? description : "No description"}
        </motion.p>
        <motion.a
          initial={{ y: -100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          href={link}
          className=" mt-auto text-shadow-md text-green-900 "
        >
          <Button
            variant="outlined"
            className=" !border-[var(--color-primary)] !text-[var(--color-gray)] !duration-500 !transition-all hover:!text-[var(--color-primary)]"
          >
            Live (~)
          </Button>
        </motion.a>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
