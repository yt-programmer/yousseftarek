import React from "react";
import Hero from "../components/Home/Hero";
import Projects from "../components/Home/Projects";
import Skills from "../components/Home/Skills";
import AboutMe from "../components/Home/AboutMe";
import Contacts from "../components/Home/Contacts";

const Home = () => {
  return (
    <section className="relative">
      <Hero />
      <Projects />
      <Skills />

      <AboutMe />
      <Contacts />
    </section>
  );
};

export default Home;
