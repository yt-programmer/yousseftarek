import Button from "@mui/material/Button";
import { motion } from "framer-motion";
import React from "react";
import DeleteWorks from "./DeleteWorks";
import EditWorks from "./EditWorks";

const ShowWorks = ({ works, setWorksData }) => {
  return (
    <div className="flex my-10 flex-col gap-5">
      {works.map((work, i) => (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="w-full flex-col md:flex-row shadow-lg shadow-green-900 border   border-[var(--color-primary)] md:h-15 py-3 md:py-0 px-10 rounded-md flex items-center justify-between"
          key={work._id}
        >
          <div className="flex items-center gap-5">
            <span className="text-[var(--color-primary)] hidden md:block">
              {i + 1}
            </span>

            <img
              src={work.image}
              alt="error img"
              className="w-10 h-10 object-cover"
              loading="lazy"
            />
            <h4 className="capitalize font-bold hover:text-[var(--color-primary)]  transition-all duration-500">
              {work.title}
            </h4>
          </div>
          <div className="flex items-center gap-3">
            <EditWorks work={work} setWorksData={setWorksData} id={work._id} />
            <DeleteWorks setWorksData={setWorksData} id={work._id} />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ShowWorks;
