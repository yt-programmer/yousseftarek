import Button from "@mui/material/Button";
import { motion } from "framer-motion";
import React from "react";
import { Link } from "react-router";
import { useSiteContent } from "../../context/SiteContentContext";

const Contacts = () => {
  const { content } = useSiteContent();
  return (
    <section className="mt-50 mb-20">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-[20px] ">
        <div className="md:w-[50%]">
          <div className=" flex items-center gap-5">
            <h2 className="capitalize text-2xl font-bold">
              <span className="text-[var(--color-primary)]"># </span>{content.contactSection.title}
            </h2>
            <div className="bg-[var(--color-primary)] h-[1px] flex-1"></div>
          </div>
          <motion.p
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 3 }}
            className="text-sm mt-3 font-semibold text-gray-400"
          >
            {content.contactSection.description}
          </motion.p>
        </div>

        <motion.div
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="mt-10"
        >
          <Link to="/contacts" className="  text-shadow-md text-green-900 ">
            <Button
              variant="outlined"
              className=" !border-[var(--color-primary)] !text-[var(--color-gray)] !duration-500 !transition-all hover:!text-[var(--color-primary)]"
            >
               {content.contactSection.buttonText}
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Contacts;
