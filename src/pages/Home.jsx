import React from "react";
import Hero from "../components/Home/Hero";
import Projects from "../components/Home/Projects";
import Skills from "../components/Home/Skills";
import AboutMe from "../components/Home/AboutMe";
import Contacts from "../components/Home/Contacts";
import Testimonials from "../components/Home/Testimonials";
import { useSiteContent } from "../context/SiteContentContext";
import { useEffect } from "react";

const Home = () => {
  const { content } = useSiteContent();
  useEffect(() => {
    document.title = content.seo.title;
    const setMeta = (key, value, isProperty = false) => {
      if (!value) return;
      const attribute = isProperty ? "property" : "name";
      let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
      if (!element) { element = document.createElement("meta"); element.setAttribute(attribute, key); document.head.appendChild(element); }
      element.setAttribute("content", value);
    };
    setMeta("description", content.seo.description);
    setMeta("keywords", content.seo.keywords);
    setMeta("og:title", content.seo.title, true);
    setMeta("og:description", content.seo.description, true);
    setMeta("og:image", content.hero.photoUrl, true);
  }, [content.seo]);
  return (
    <section className="relative scroll-smooth">
      <Hero />
      <AboutMe />
      <Projects />
      <Testimonials />
      <Skills />
      <Contacts />
    </section>
  );
};

export default Home;
