import Button from "@mui/material/Button";
import { motion } from "framer-motion";
import { MdVerified } from "react-icons/md";
import { Link } from "react-router";
import Typewriter from "typewriter-effect";
const Hero = () => {
  return (
    <section className="relative h-screen pt-[250px] w-full">
      <div className="container mx-auto px-[20px] gap-3 w-full flex md:flex-row flex-col-reverse justify-between items-center">
        <div className="flex flex-col  items-center md:items-start">
          <motion.h2
            initial={{ y: -100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-4xl  md:text-start font-extrabold text-center"
          >
            Hi I'm Youssef Tarek{" "}
            <span className="text-[var(--color-primary)]">
              MERN Stack Developer
            </span>
          </motion.h2>
          <motion.p
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-start text-gray-400 mt-10 font-semibold text-sm"
          >
            Building modern web experiences and Turning ideas into interactive
            web apps
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
                View My Works
              </Button>
            </Link>
          </motion.div>
        </div>
        <div className="md:mb-0 mb-20 flex flex-col items-center">
          <motion.img
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            src="/joo.webp"
            className="max-w-[300px] md:max-w-[400px] rounded-full shadow-2xl"
            alt="error img"
            loading="lazy"
          />
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex mt-3 gap-3 items-center text-2xl text-blue-600"
          >
            <MdVerified />
            <span className="text-white text-lg font-bold">
              <Typewriter
                options={{
                  strings: ["Verified"],
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
