import React, { useEffect, useState } from "react";
import Loading from "../Loading";
import ShowAlert from "../ShowAlert";
import { useGetProjects } from "../../hooks/useGetProjects";
import ProjectCard from "../common/ProjectCard";
import { motion } from "framer-motion";

const Works = () => {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("All");
  const [limit] = useState(5);
  const { data, isLoading, error, filters, totalPages, total } = useGetProjects(limit, page, filter);
  const categories = [...new Set((filters || []).map((item) => String(item).trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));

  const handleFilter = (nextFilter) => {
    if (nextFilter === filter) return;
    setPage(1);
    setFilter(nextFilter);
  };
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [page, totalPages]);

  return <div>
    <h3 className="capitalize mt-30 text-3xl font-bold"><span className="text-[var(--color-primary)]">#</span>Completed Works</h3>
    <p className="text-gray-400 mt-3">• The works sort by latest</p>
    <div className="mt-10 flex justify-center">
      <div className="flex max-w-full flex-wrap justify-center gap-2 rounded-2xl border border-[var(--color-primary)]/40 bg-black/20 p-2 sm:gap-3 sm:rounded-full sm:px-5">
        {["All", ...categories].map((category, index) => <motion.button key={category} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .2, delay: Math.min(index * .025, .2) }} onClick={() => handleFilter(category)} aria-pressed={filter === category} className={`rounded-full border px-4 py-2 text-sm font-medium capitalize transition duration-200 ${filter === category ? "border-[var(--color-primary)] bg-green-900 text-white shadow-sm shadow-green-900" : "border-transparent text-gray-300 hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)]"}`}>{category}</motion.button>)}
      </div>
    </div>
    {!isLoading && !error && total > 0 && <p className="mt-5 text-center text-xs text-gray-500">{total} {total === 1 ? "project" : "projects"}{filter !== "All" ? ` · ${filter}` : ""}</p>}
    {isLoading && <div className="mt-20"><Loading /></div>}
    {error && <ShowAlert type="error" message={error} />}
    {!isLoading && !error && data.length > 0 && <motion.div key={`${filter}-${page}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex mt-12 flex-wrap gap-10 justify-center items-center">{data.map((project) => <ProjectCard key={project._id} title={project.title} skills={project.skils} description={project.description} image={project.image} link={project.link} />)}</motion.div>}
    {!isLoading && !error && data.length === 0 && <div className="mt-16 text-center"><ShowAlert type="normal" message={filter === "All" ? "No works found" : `No projects in “${filter}” category yet.`} /></div>}
    {!isLoading && !error && totalPages > 1 && <nav aria-label="Projects pagination" className="flex justify-center items-center mt-16 gap-4"><button onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page <= 1} className="rounded-full border border-[var(--color-primary)]/40 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-30 hover:text-[var(--color-primary)]">Previous</button><span className="flex h-9 min-w-9 items-center justify-center rounded-full bg-gray-900 px-3 text-sm text-[var(--color-primary)]">{page} / {totalPages}</span><button onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page >= totalPages} className="rounded-full border border-[var(--color-primary)]/40 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-30 hover:text-[var(--color-primary)]">Next</button></nav>}
  </div>;
};
export default Works;
