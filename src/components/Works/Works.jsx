import React, { useState } from "react";
import Loading from "../Loading";
import ShowAlert from "../ShowAlert";
import { useGetProjects } from "../../hooks/useGetProjects";
import ProjectCard from "../common/ProjectCard";
import { motion } from "framer-motion";

const Works = () => {
  const [page, setPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState("All");
  const [filter, setFilter] = useState("All");
  const [limit, setLimit] = useState(5);

  const filtersData = ["All", "Web", "Mobile", "Desktop"];

  const handleFilter = (filter) => {
    setActiveFilter(filter);
    setFilter(filter);
  };
  const { data, isLoading, error, filters } = useGetProjects(
    limit,
    page,
    filter,
  );
  const onClickHandle = (type) => {
    if (type === "next") {
      setPage((prev) => prev + 1);
    } else if (type === "prev") {
      setPage((prev) => (prev === 1 ? 1 : prev - 1));
    }
  };
  return (
    <div>
      <h3 className="capitalize mt-30 text-3xl font-bold">
        <span className="text-[var(--color-primary)]">#</span>Completed Works
      </h3>
      <p className="text-gray-400 mt-3">• The works sort by latest </p>

      {data && data.length !== 0 && (
        <div className="flex justify-center  mt-20 gap-3">
          <div className="flex flex-wrap justify-center gap-6 py-4 items-center  md:px-15 px-10  border-b border-[var(--color-primary)] rounded-full">
            <motion.button
              initial={{ opacity: 0, y: -100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + filters.length * 0.3 }}
              key={"All"}
              onClick={() => handleFilter("All")}
              className={` ${activeFilter === "All" && "bg-green-900 hover:bg-green-900 text-white"}" hover:bg-green-900  capitalize px-4 py-3  border rounded-full font-semibold shadow-sm  shadow-green-900 border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-300"`}
            >
              All
            </motion.button>
            {filters.map((filter, index) => (
              <>
                <motion.button
                  initial={{ opacity: 0, y: -100 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.3 }}
                  key={filter}
                  onClick={() => handleFilter(filter)}
                  className={` ${activeFilter === filter && "bg-green-900 hover:bg-green-900 text-white"}" hover:bg-green-900  capitalize px-4 py-3  border rounded-full font-semibold shadow-sm  shadow-green-900 border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-300"`}
                >
                  {filter}
                </motion.button>
              </>
            ))}
          </div>
        </div>
      )}
      {isLoading && (
        <div className="mt-20">
          {" "}
          <Loading />
        </div>
      )}
      {error && <ShowAlert type="error" message={`404, ${error}`} />}
      {data && data.length !== 0 ? (
        <>
          <div className="flex mt-20 flex-wrap gap-10 justify-center items-center">
            {data.map((project) => (
              <ProjectCard
                key={project._id}
                title={project.title}
                skills={project.skils}
                description={project.description}
                image={project.image}
                link={project.link}
              />
            ))}
          </div>
        </>
      ) : (
        !isLoading &&
        !error && (
          <div className="mt-20">
            <ShowAlert type="normal" message="No works found" />
          </div>
        )
      )}
      {data && data.length !== 0 && (
        <div className="flex justify-center mt-20 gap-3">
          <button
            onClick={() => onClickHandle("prev")}
            disabled={page === 1}
            className="text-2xl disabled:text-gray-400 hover:text-[var(--color-primary)] transition-all duration-300"
          >
            ‹
          </button>
          <div className="text-[var(--color-primary)] bg-gray-900 flex justify-center items-center w-10 h-10 rounded-full">
            {page}
          </div>
          <button
            onClick={() => onClickHandle("next")}
            disabled={data.length === 0 || data.length < limit}
            className="text-2xl disabled:text-gray-400 hover:text-[var(--color-primary)] transition-all duration-300"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
};

export default Works;
