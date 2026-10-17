import React, { useState } from "react";
import { NavLink } from "react-router";
import { Link } from "react-router";
import { HiMiniBars3BottomRight } from "react-icons/hi2";
import { MdClose } from "react-icons/md";
import { motion } from "framer-motion";
import { span } from "framer-motion/client";
import { HashLink } from "react-router-hash-link";
import { useSiteContent } from "../context/SiteContentContext";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { content } = useSiteContent();
  const LINKS = [
    { key: "home", label: content.navigation.home, to: "/" },
    { key: "about-me", label: content.navigation.about, to: "/about-me" },
    { key: "works", label: content.navigation.works, to: "/works" },
    { key: "testimonials-page", label: content.navigation.testimonials, to: "/testimonials" },
    { key: "contacts", label: content.navigation.contacts, to: "/contacts" },
  ];

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
            {content.site.name}
          </motion.h1>
        </Link>
        <ul className=" gap-8 hidden md:flex">
          {LINKS.map((link) =>
            link.key === "testimonials" ? (
              <HashLink
                smooth
                key={link.key}
                to="/#testimonials"
                className="capitalize text-gray-300 hover:text-[var(--color-primary)]"
              >
                <motion.span
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                >
                  <span className="text-[var(--color-primary)]">#</span>
                  {link.label}
                </motion.span>
              </HashLink>
            ) : (
              <NavLink
                replace
                key={link.key}
                to={link.to}
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
                  {link.label}
                </motion.span>
              </NavLink>
            ),
          )}
        </ul>
        <button
          className={`relative z-[66655666] md:z-10 md:hidden text-[24px] `}
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
            className="md:hidden bg-black/90 fixed z-[666666] flex justify-center pl-6 flex-col gap-20 inset-0 h-screen w-full"
          >
            {LINKS.map((link) =>
              link.key === "testimonials" ? (
                <HashLink
                  smooth
                  onClick={() => setTimeout(() => setIsOpen(false), 500)}
                  key={link.key}
                  to="/#testimonials"
                  className={`capitalize text-gray-300 font-bold text-3xl hover:text-[var(--color-primary)]  duration-500 transition-all`}
                >
                  <span className="text-[var(--color-primary)]">#</span>
                  {link.label}
                </HashLink>
              ) : (
                <NavLink
                  replace
                  onClick={() => setTimeout(() => setIsOpen(false), 500)}
                  key={link.key}
                  to={link.to}
                  className={({ isActive }) =>
                    `${isActive ? " !text-[var(--color-primary)] " : ""}capitalize text-gray-300 font-bold text-3xl hover:text-[var(--color-primary)]  duration-500 transition-all`
                  }
                >
                  <span className="text-[var(--color-primary)]"># </span>
                  {link.label}
                </NavLink>
              ),
            )}
          </motion.ul>
        )}
      </div>
    </header>
  );
};

export default Header;
