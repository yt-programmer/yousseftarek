import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import ShowWorks from "./ShowWorks";
import Loading from "../Loading";
import ShowAlert from "../ShowAlert";
import { useGetProjects } from "../../hooks/useGetProjects";
import AddWorks from "./AddWorks";

const WorksDash = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error, refetch } = useGetProjects(10, page);
  const onClickHandle = (type) => {
    if (type === "next") {
      setPage((prev) => prev + 1);
    } else if (type === "prev") {
      setPage((prev) => (prev === 1 ? 1 : prev - 1));
    }
  };

  return (
    <div>
      <div className="flex justify-between gap-5 mt-30 items-center">
        <h2 className="text-2xl md:text-3xl font-semibold">
          <span className="text-[var(--color-primary)]">#</span>Works
        </h2>

        <AddWorks refetch={refetch} />
      </div>
      {isLoading && (
        <div className="mt-20">
          {" "}
          <Loading />
        </div>
      )}
      {error && (
        <div className="mt-20">
          {" "}
          <ShowAlert type="error" message={error.message} />
        </div>
      )}
      {data && data.length !== 0 ? (
        <ShowWorks refetch={refetch} works={data} />
      ) : (
        !isLoading &&
        !error && (
          <div className="mt-20">
            {" "}
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
            disabled={data.length === 0 || data.length < 10}
            className="text-2xl disabled:text-gray-400 hover:text-[var(--color-primary)] transition-all duration-300"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
};

export default WorksDash;
