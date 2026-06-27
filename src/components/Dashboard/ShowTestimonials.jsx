import React from "react";

import { motion } from "framer-motion";
import EditTestimonials from "./EditTestimonials";
import DeleteTestimonials from "./DeleteTestimonials";

const ShowTestimonials = ({ testimonials, refetch }) => {
  return (
    <div className="flex my-10 flex-col gap-5">
      {testimonials.map((testimonial, i) => (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="w-full flex-col md:flex-row shadow-lg shadow-green-900 border   border-[var(--color-primary)] md:h-15 py-3 md:py-0 px-10 rounded-md flex items-center justify-between"
          key={testimonial._id}
        >
          <div className="flex items-center gap-5">
            <span className="text-[var(--color-primary)] hidden md:block">
              {i + 1}
            </span>

            <h4 className="capitalize font-bold hover:text-[var(--color-primary)]  transition-all duration-500">
              {testimonial.name}
            </h4>
          </div>
          <div className="flex items-center gap-3">
            <EditTestimonials testimonial={testimonial} refetch={refetch} />
            <DeleteTestimonials refetch={refetch} id={testimonial._id} />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ShowTestimonials;
