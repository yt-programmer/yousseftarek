import React from "react";
import AboutMeInPage from "../components/AboutMe/AboutMeInPage";
import SkillsInPage from "../components/AboutMe/SkillsInPage";

const AboutMePage = () => {
  return (
    <section className="pt-50 min-h-screen">
      <div className="container mx-auto px-[20px]">
        <AboutMeInPage />
        <SkillsInPage />
      </div>
    </section>
  );
};

export default AboutMePage;
