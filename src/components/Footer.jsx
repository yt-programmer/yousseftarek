import React from "react";

const Footer = () => {
  return (
    <footer className="py-8 backdrop-blur-md">
      <div className="container mx-auto px-5">
        <p className="text-center text-gray-400 text-sm md:text-base">
          &copy; {new Date().getFullYear()}{" "}
          <span className="text-white font-semibold hover:text-[var(--color-primary)] duration-700 transition-colors">
            Youssef Tarek
          </span>
          . All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
