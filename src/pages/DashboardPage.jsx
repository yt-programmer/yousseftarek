import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import ShowWorks from "../components/Dashboard/ShowWorks";
import Loading from "../components/Loading";
import ShowAlert from "../components/ShowAlert";
import { useGetProjects } from "../hooks/useGetProjects";
import AddWorks from "../components/Dashboard/AddWorks";

const DashboardPage = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useGetProjects(10, page);
  const [worksData, setWorksData] = useState([]);
  const onClickHandle = (type) => {
    if (type === "next") {
      setPage((prev) => prev + 1);
    } else if (type === "prev") {
      setPage((prev) => (prev === 1 ? 1 : prev - 1));
    }
  };
  useEffect(() => {
    if (data) {
      setWorksData(data);
    }
  }, [data]);
  return (
    <section className="pt-50 min-h-screen">
      <div className="container mx-auto px-[20px]">
        <div>
          <h2 className="text-3xl font-semibold">
            <span className="text-[var(--color-primary)]">/</span>dashboard
          </h2>
          <motion.p
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-sm mt-5  font-semibold text-gray-400"
          >
            Add work and delete and edit
          </motion.p>
        </div>
        <div>
          <div className="flex justify-between mt-30 items-center">
            <h2 className="text-3xl font-semibold">
              <span className="text-[var(--color-primary)]">#</span>Works
            </h2>

            <AddWorks setWorksData={setWorksData} />
          </div>
          {isLoading && <Loading />}
          {error && <ShowAlert type="error" message={`404, ${error}`} />}
          {data && data.length !== 0 ? (
            <ShowWorks setWorksData={setWorksData} works={worksData} />
          ) : (
            !isLoading &&
            !error && <ShowAlert type="warning" message={` No works found`} />
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
              disabled={worksData.length === 0}
              className="text-2xl disabled:text-gray-400 hover:text-[var(--color-primary)] transition-all duration-300"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
