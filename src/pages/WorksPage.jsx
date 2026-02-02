import { motion } from "framer-motion";
import React from "react";
import Works from "../components/Works/Works";

const WorksPage = () => {
  return (
    <section className="pt-50 min-h-screen">
      <div className="container mx-auto px-[20px]">
        <div>
          <h2 className="text-3xl font-semibold">
            <span className="text-[var(--color-primary)]">/</span>works
          </h2>
          <p className="text-gray-400 mt-5">List of my works</p>
        </div>
        <Works />
      </div>
    </section>
  );
};

export default WorksPage;
