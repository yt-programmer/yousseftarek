import Button from "@mui/material/Button";
import { motion } from "framer-motion";
import { MdVerified } from "react-icons/md";
import { Link } from "react-router";
import Typewriter from "typewriter-effect";
import { useSiteContent } from "../../context/SiteContentContext";

const Hero = () => {
  const { content } = useSiteContent();
  const hero = content.hero;
  return (
    <section className="relative h-full pt-[250px]  w-full">
      <div className="container mx-auto px-[20px] gap-3 w-full flex md:flex-row flex-col-reverse justify-between items-center">
        <div className="flex flex-col  items-center md:items-start">
          <motion.h2
            initial={{ y: -100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-4xl  md:text-start font-extrabold text-center"
          >
            {hero.title}{" "}
            <span className="text-[var(--color-primary)]">
              {hero.role}
            </span>
          </motion.h2>
          <motion.p
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-start text-gray-400 mt-10 font-semibold text-sm"
          >
            {hero.description}
          </motion.p>
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/works" className="">
              <Button
                variant="outlined"
                className="!mt-5 !relative !border-[var(--color-primary)] !text-[var(--color-primary)]"
              >
                {hero.buttonText}
              </Button>
            </Link>
          </motion.div>
        </div>
        <div className="md:mb-0 mb-10 flex flex-col items-center">
          {hero.photoUrl && (
            <motion.div
              initial={{ background: "conic-gradient(#008236 0deg, transparent 0deg)" }}
              whileInView={{ background: "conic-gradient(#008236 360deg, transparent 360deg)" }}
              transition={{ duration: 3, repeat: Infinity }}
              className="p-1 rounded-full relative w-[300px] h-[300px] md:w-[400px] md:h-[400px]"
            >
              <img src={hero.photoUrl} className="w-full h-full rounded-full object-cover" alt="Youssef Tarek" loading="eager" fetchPriority="high" />
            </motion.div>
          )}

          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex mt-3 gap-3 items-center text-2xl text-blue-600"
          >
            <MdVerified className="text-[var(--color-primary)]" />
            <span className="text-white text-lg font-bold">
              <Typewriter
                options={{
                  strings: [hero.verifiedText || "Verified"],
                  autoStart: true,
                  loop: true,
                }}
              />
            </span>
          </motion.span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
