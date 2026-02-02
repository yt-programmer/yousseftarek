import React from "react";
import SkillCard from "../common/SkillCard";

const skills = [
  {
    title: "frontend",
    skills: "html , css , javascript , react , tailwind , bootstrap",
  },
  {
    title: "backend",
    skills: "nodejs , express , mongodb , mongoose  ",
  },

  {
    title: "tools",
    skills:
      "vscode , postman, figma , vercel, git , github , framer-motion, react-router , redux , axios, mui , react-icons, emailJs  , npm, wireframe.cc, jsonwebtoken , bcryptjs, dotenv, nodemailer, cloudinary, paymob , cookie-parser , cors,  cloudinary , supabase ",
  },
  {
    title: "languages",
    skills: "english , Arabic",
  },
  {
    title: "others",
    skills:
      "communication , teamwork , problem solving, time management, learning new things , content creation , ",
  },
];

const SkillsInPage = () => {
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
