import { motion } from "framer-motion";
import React from "react";
import aboutMe from "../../assets/about-me.webp";
import { useSiteContent } from "../../context/SiteContentContext";
const AboutMeInPage = () => {
  const { content } = useSiteContent();
  return (
    <div className=" overflow-hidden">
      <div>
        <h2 className="text-3xl font-semibold">
          <span className="text-[var(--color-primary)]">/</span>{content.aboutPage.title}
        </h2>
        <p className="text-gray-400 mt-5">{content.aboutPage.subtitle}</p>
        <div className="flex flex-col gap-25   md:flex-row ">
          <div className="">
            <motion.p
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 3 }}
              className="text-sm mt-10 font-semibold text-gray-400"
            >
              {content.aboutPage.description}
            </motion.p>
          </div>
          <div className="">
            <motion.img
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 3 }}
              src={content.aboutPage.imageUrl || aboutMe}
              loading="lazy"
              className="max-w-[300px] ml-15 md:ml-0"
              alt={content.aboutPage.imageAlt || "Youssef Tarek about me"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMeInPage;
