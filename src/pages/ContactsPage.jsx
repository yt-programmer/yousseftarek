import { motion } from "framer-motion";
import React from "react";
import AllMedia from "../components/contacts/AllMedia";
import Form from "../components/contacts/Form";

const ContactsPage = () => {
  return (
    <section className="pt-50 min-h-screen">
      <div className="container mx-auto px-[20px]">
        <div>
          <h2 className="text-3xl font-semibold">
            <span className="text-[var(--color-primary)]">/</span>contacts
          </h2>
          <p className="text-gray-400 mt-5">Who am I ?</p>
          <motion.p
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 3 }}
            className="text-sm mt-5  font-semibold text-gray-400"
          >
            I’m interested in freelance opportunities. <br /> However, if you
            have other request or question, don’t <br /> hesitate to contact me.
          </motion.p>
        </div>
        <div>
          <h2 className="text-3xl font-semibold mt-30">
            <span className="text-[var(--color-primary)]">#</span>All Media
          </h2>
          <AllMedia />
        </div>
        <div>
          <h2 className="text-3xl font-semibold mt-30">
            <span className="text-[var(--color-primary)]">#</span>Send Message
          </h2>
          <Form />
        </div>
      </div>
    </section>
  );
};

export default ContactsPage;
