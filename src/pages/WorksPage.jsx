import { motion } from "framer-motion";
import React from "react";
import Works from "../components/Works/Works";
import { useSiteContent } from "../context/SiteContentContext";

const WorksPage = () => {
  const { content } = useSiteContent();
  return (
    <section className="pt-50 min-h-screen">
      <div className="container mx-auto px-[20px]">
        <div>
          <h2 className="text-3xl font-semibold">
            <span className="text-[var(--color-primary)]">/</span>{content.projects.pageTitle}
          </h2>
          <p className="text-gray-400 mt-5">{content.projects.pageSubtitle}</p>
        </div>
        <Works />
      </div>
    </section>
  );
};

export default WorksPage;
