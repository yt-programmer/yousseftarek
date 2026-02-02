import { motion } from "framer-motion";
import React from "react";
import aboutMe from "../../assets/about-me.webp";
const AboutMeInPage = () => {
  return (
    <div className=" overflow-hidden">
      <div>
        <h2 className="text-3xl font-semibold">
          <span className="text-[var(--color-primary)]">/</span>about Me
        </h2>
        <p className="text-gray-400 mt-5">Who am I ?</p>
        <div className="flex flex-col gap-25   md:flex-row ">
          <div className="">
            <motion.p
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 3 }}
              className="text-sm mt-10 font-semibold text-gray-400"
            >
              Welcome to my portfolio. My name is{" "}
              <span className="text-[var(--color-primary)]">Youssef Tarek</span>
              , a web developer based in Cairo, Egypt, with a strong focus on
              building modern, scalable, and high-quality web applications. I
              work primarily with the MERN Stack, developing responsive and
              interactive front-end interfaces using React and Tailwind CSS,
              while building reliable and efficient back-end systems with
              Node.js, Express, and MongoDB. I believe that web development is
              more than just writing code—it is about solving real problems and
              transforming ideas into functional, well-designed digital
              products. For this reason, I pay close attention to clean code,
              performance, user experience, and overall application structure in
              every project I build. Throughout my journey, I have worked on
              multiple hands-on projects that helped me strengthen my technical
              skills and gain a deeper understanding of full-stack development,
              from planning and development to deployment. I am constantly
              learning and exploring new technologies to improve my workflow and
              deliver better results. My goal is to continue building impactful
              digital solutions that provide real value to users and businesses,
              while consistently growing as a developer and maintaining a high
              standard of quality in everything I create.
            </motion.p>
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
    </div>
  );
};

export default AboutMeInPage;
