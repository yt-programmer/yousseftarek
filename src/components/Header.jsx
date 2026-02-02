import React, { useState } from "react";
import { NavLink } from "react-router";
import { Link } from "react-router";
import { HiMiniBars3BottomRight } from "react-icons/hi2";
import { MdClose } from "react-icons/md";
import { motion } from "framer-motion";
import { span } from "framer-motion/client";
const LINKS = ["home", "works", "about-me", "contacts"];
const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onClickHandle = () => {
    setIsOpen((prev) => !prev);
  };
  return (
    <header className="backdrop-blur-2xl fixed w-full z-40  py-5">
      <div className="container mx-auto w-full justify-between px-[20px] items-center flex">
        <Link to="/" replace className="relative z-40  text-2xl font-name">
          <motion.h1
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            YOUSSEF TAREK
          </motion.h1>
        </Link>
        <ul className=" gap-8 hidden md:flex">
          {LINKS.map((link) => (
            <NavLink
              replace
              key={link}
              to={link === "home" ? "/" : link}
              className={({ isActive }) =>
                `${isActive ? " !text-[var(--color-primary)] " : ""}capitalize text-gray-300 hover:text-[var(--color-primary)]  duration-500 transition-all`
              }
            >
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                <span className="text-[var(--color-primary)]">#</span>
                {link}
              </motion.span>
            </NavLink>
          ))}
        </ul>
        <button
          className={`relative z-40 md:z-10 md:hidden text-[24px] `}
          onClick={onClickHandle}
        >
          {isOpen ? (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <MdClose />
            </motion.span>
          ) : (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <HiMiniBars3BottomRight />
            </motion.span>
          )}
        </button>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="md:hidden bg-black/90 fixed flex justify-center pl-6 flex-col gap-32 inset-0 h-screen w-full"
          >
            {LINKS.map((link) => (
              <NavLink
                replace
                onClick={() => setTimeout(() => setIsOpen(false), 500)}
                key={link}
                to={link === "home" ? "/" : link}
                className={({ isActive }) =>
                  `${isActive ? " !text-[var(--color-primary)] " : ""}capitalize text-gray-300 font-bold text-3xl hover:text-[var(--color-primary)]  duration-500 transition-all`
                }
              >
                <span className="text-[var(--color-primary)]"># </span>
                {link}
              </NavLink>
            ))}
          </motion.ul>
        )}
      </div>
    </header>
  );
};

export default Header;
