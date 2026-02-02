import Button from "@mui/material/Button";
import { motion } from "framer-motion";
import React from "react";
import { Link } from "react-router";
import aboutMe from "../../assets/about-me.webp";
const AboutMe = () => {
  return (
    <section className="mt-50 overflow-hidden">
      <div className="container w-full mx-auto px-[20px]">
        <div className="w-full flex flex-col gap-25   md:flex-row s">
          <div className="">
            <div className=" flex items-center gap-5">
              <h2 className="capitalize text-2xl font-bold">
                <span className="text-[var(--color-primary)]"># </span>about me
              </h2>
              <div className="bg-[var(--color-primary)] h-[1px] flex-1"></div>
            </div>
            <motion.p
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 3 }}
              className="text-sm mt-10 font-semibold text-gray-400"
            >
              Welcome to my portfolio! I’m{" "}
              <span className="text-[var(--color-primary)] font-bold">
                Youssef Tarek
              </span>
              <br />
              <br />A passionate and creative web developer based in Cairo,
              Egypt. I focus on building modern, responsive, and user-friendly
              websites. I believe in turning ideas into powerful digital
              experiences using the latest technologies. My goal is to deliver
              smart and efficient web solutions that help businesses and
              individuals grow online. Through continuous learning and hands-on
              projects, I’m always improving and committed to providing
              high-quality results.
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
                  Read More ~~)
                </Button>
              </Link>
            </motion.div>
          </div>
          <div className="">
            <motion.img
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 3 }}
              src={aboutMe}
              loading="lazy"
              className="max-w-[300px] ml-15 md:ml-0"
              alt="error photo"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
