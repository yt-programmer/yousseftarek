import Button from "@mui/material/Button";
import { motion } from "framer-motion";
import React from "react";
import { Link } from "react-router";
import aboutMe from "../../assets/about-me.webp";
import { useSiteContent } from "../../context/SiteContentContext";
const AboutMe = () => {
  const { content } = useSiteContent();
  const about = content.homeAbout;
  return (
    <section className="mt-50 overflow-hidden">
      <div className="container w-full mx-auto px-[20px]">
        <div className="w-full flex flex-col gap-25   md:flex-row s">
          <div className="">
            <div className=" flex items-center gap-5">
              <h2 className="capitalize text-2xl font-bold">
                <span className="text-[var(--color-primary)]"># </span>{about.title}
              </h2>
              <div className="bg-[var(--color-primary)] h-[1px] flex-1"></div>
            </div>
            <motion.p
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 3 }}
              className="text-sm mt-10 font-semibold text-gray-400"
            >
              {about.description}
            </motion.p>
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Link
                to="/about-me"
                className="mt-20  flex items-center justify-center  text-shadow-md text-green-900 "
              >
                <Button
                  variant="outlined"
                  className=" !border-[var(--color-primary)] !text-[var(--color-gray)] !duration-500 !transition-all hover:!text-[var(--color-primary)]"
                >
                  {about.readMoreText}
                </Button>
              </Link>
            </motion.div>
          </div>
          <div className="">
            <motion.img
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 3 }}
              src={about.imageUrl || aboutMe}
              loading="lazy"
              className="max-w-[300px] ml-15 md:ml-0"
              alt={about.imageAlt || "About Youssef Tarek"}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
