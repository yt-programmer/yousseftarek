import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import ProjectCard from "../common/ProjectCard";

import { motion } from "framer-motion";
import { useGetProjects } from "../../hooks/useGetProjects";
import Loading from "../Loading";

import ShowAlert from "../ShowAlert";
import Button from "@mui/material/Button";

const Projects = () => {
  const { data, isLoading, error } = useGetProjects(3, 1);

  return (
    <section className="relative mt-50">
      <div className="container px-[20px] mx-auto">
        <div className="flex items-center gap-5">
          <h2 className="capitalize text-2xl font-bold">
            <span className="text-[var(--color-primary)]"># </span>Works
          </h2>

          <div className="flex-1 bg-[var(--color-primary)] h-[1px]"></div>

          <Link
            to="/works"
            className="md:ml-[300px] ml-[20px] hover:text-[var(--color-primary)]   font-semibold text-sm transition-all duration-500"
          >
            View All ~~)
          </Link>
        </div>

        <div className="flex flex-col gap-5">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 3 }}
            className="my-20 flex flex-wrap gap-15  justify-center items-center"
          >
            {isLoading && <Loading />}
            {error && <ShowAlert type="error" message={`404, ${error}`} />}
            {data && data.length !== 0
              ? data.map((project) => (
                  <>
                    <ProjectCard
                      key={project._id}
                      title={project.title}
                      description={project.description}
                      skills={project.skils}
                      image={project.image}
                      link={project.link}
                    />
                  </>
                ))
              : !isLoading &&
                !error && <ShowAlert type="normal" message="No Works" />}
          </motion.div>
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to="/works"
              className="  flex items-center justify-center  text-shadow-md text-green-900 "
            >
              <Button
                variant="outlined"
                className=" !border-[var(--color-primary)] !text-[var(--color-gray)] !duration-500 !transition-all hover:!text-[var(--color-primary)]"
              >
                View All ~~)
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
