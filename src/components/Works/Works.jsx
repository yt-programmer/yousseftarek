import React, { useState } from "react";
import Loading from "../Loading";
import ShowAlert from "../ShowAlert";
import { useGetProjects } from "../../hooks/useGetProjects";
import ProjectCard from "../common/ProjectCard";

const Works = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useGetProjects(5, page);

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
      {isLoading && <Loading />}
      {error && <ShowAlert type="error" message={`404, ${error}`} />}
      {data && data.length !== 0 ? (
        <>
          <div className="flex mt-20 flex-wrap gap-10 justify-center items-center">
            {data.map((project) => (
              <ProjectCard
                key={Date.now() + project._id}
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
          disabled={data.length === 0}
          className="text-2xl disabled:text-gray-400 hover:text-[var(--color-primary)] transition-all duration-300"
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default Works;
