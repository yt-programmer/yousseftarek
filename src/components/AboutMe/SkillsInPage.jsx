import React from "react";
import SkillCard from "../common/SkillCard";
import { useSiteContent } from "../../context/SiteContentContext";

const SkillsInPage = () => {
  const { content } = useSiteContent();
  const skills = content.skills.items || [];
  return (
    <div className="mt-50">
      <h3 className="capitalize text-3xl font-bold mb-10">
        <span className="text-[var(--color-primary)]">#</span>Skills
      </h3>
      <div className="flex flex-wrap gap-5 justify-center md:justify-start">
        {skills.map((skill) => (
          <SkillCard key={skill.title} {...skill} />
        ))}
      </div>
    </div>
  );
};

export default SkillsInPage;
