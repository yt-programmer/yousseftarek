import { motion } from "framer-motion";
import React, { useEffect } from "react";
import AllMedia from "../components/contacts/AllMedia";
import Form from "../components/contacts/Form";
import { useSiteContent } from "../context/SiteContentContext";

const ContactsPage = () => {
  useEffect(() => {
    document.title = "Contacts | Youssef Tarek"; // الاسم الجديد للتاب
  }, []);
  const { content } = useSiteContent();
  return (
    <section className="pt-50 min-h-screen">
      <div className="container mx-auto px-[20px]">
        <div>
          <h2 className="text-3xl font-semibold">
            <span className="text-[var(--color-primary)]">/</span>
            {content.contactPage.title}
          </h2>
          <p className="text-gray-400 mt-5">{content.contactPage.subtitle}</p>
          <motion.p
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 3 }}
            className="text-sm mt-5  font-semibold text-gray-400"
          >
            {content.contactPage.description}
          </motion.p>
        </div>
        <div>
          <h2 className="text-3xl font-semibold mt-30">
            <span className="text-[var(--color-primary)]">#</span>
            {content.contactPage.allMediaTitle}
          </h2>
          <AllMedia />
        </div>
        <div className="mt-10">
          <Form />
        </div>
      </div>
    </section>
  );
};

export default ContactsPage;
