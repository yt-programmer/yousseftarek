import React from "react";
import Button from "@mui/material/Button";
import { motion } from "framer-motion";
import { FaExternalLinkAlt, FaCode } from "react-icons/fa";
import { safeHref } from "../../utils/safeUrl";

const ProjectCard = ({ title, skills, description, image, link }) => (
  <motion.article
    initial={{ opacity: 0, y: 18 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.12 }}
    whileHover={{ y: -5 }}
    transition={{ duration: 0.3 }}
    className="group flex w-full max-w-[400px] min-w-0 flex-col overflow-hidden rounded-2xl border border-[var(--color-primary)]/60 bg-black/25 shadow-lg shadow-green-950/30 transition-colors duration-300 hover:border-[var(--color-primary)]"
  >
    <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/30">
      {image ? <motion.img src={image} alt={title || "Project preview"} loading="lazy" whileHover={{ scale: 1.04 }} transition={{ duration: 0.45 }} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-4xl text-[var(--color-primary)]"><FaCode /></div>}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
    </div>
    <div className="flex flex-1 flex-col p-5 sm:p-6">
      <p className="mb-3 line-clamp-2 min-h-10 border-b border-[var(--color-primary)]/30 pb-3 text-xs leading-5 text-gray-400">{skills || "Technologies not specified"}</p>
      <h2 className="mb-2 line-clamp-2 text-xl font-bold capitalize text-white sm:text-2xl">{title || "Untitled project"}</h2>
      <p className="mb-5 line-clamp-4 flex-1 text-sm leading-6 text-gray-400">{description || "No description available."}</p>
      {safeHref(link) && <a href={safeHref(link)} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex w-fit" aria-label={`Open ${title || "project"}`}><Button variant="outlined" endIcon={<FaExternalLinkAlt className="!text-xs" />} className="!rounded-full !border-[var(--color-primary)] !px-5 !py-2 !text-[var(--color-gray)] !transition-all hover:!bg-[var(--color-primary)]/10 hover:!text-[var(--color-primary)]">Live demo</Button></a>}
    </div>
  </motion.article>
);

export default ProjectCard;
