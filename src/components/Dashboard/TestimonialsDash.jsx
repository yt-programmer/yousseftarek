import React from "react";
import { useState } from "react";

import Loading from "../Loading";
import ShowAlert from "../ShowAlert";
import ShowTestimonials from "./ShowTestimonials";
import AddTestimonials from "./AddTestimonials";
import { useGetTestimonials } from "../../hooks/useGetTestimonials";
import { div } from "framer-motion/client";

const TestimonialsDash = () => {
  const [page, setPage] = useState(1);
  const {
    testimonials: data,
    isLoading,
    error,
    refetch,
  } = useGetTestimonials(10, page);

  const onClickHandle = (type) => {
    if (type === "next") {
      setPage((prev) => prev + 1);
    } else if (type === "prev") {
      setPage((prev) => (prev === 1 ? 1 : prev - 1));
    }
  };

  return (
    <div>
      <div className="flex gap-5 justify-between mt-30 items-center">
        <h2 className="md:text-3xl text-2xl font-semibold">
          <span className="text-[var(--color-primary)]">#</span>Testimonials
        </h2>

        <AddTestimonials refetch={refetch} />
      </div>
      {isLoading && (
        <div className="mt-20">
          <Loading />
        </div>
      )}
      {error && (
        <div className="mt-20">
          <ShowAlert type="error" message={`404, ${error}`} />
        </div>
      )}
      {data && data.length !== 0 ? (
        <ShowTestimonials refetch={refetch} testimonials={data} />
      ) : (
        !isLoading &&
        !error && (
          <div className="mt-20">
            <ShowAlert type="warning" message={` No testimonials found`} />
          </div>
        )
      )}
      {data && data.length !== 0 && (
        <div className="flex justify-center mt-20 gap-3">
          <button
            onClick={() => onClickHandle("prev")}
            disabled={page === 1}
            className="text-2xl disabled:text-gray-400 hover:text-[var(--color-primary)] transition-all duration-300"
          >
            ‹
          </button>
          <div className="text-[var(--color-primary)] bg-gray-900 flex justify-center items-center w-10 h-10 rounded-full">
            {page}
          </div>
          <button
            onClick={() => onClickHandle("next")}
            disabled={data.length === 0 || data.length < 10}
            className="text-2xl disabled:text-gray-400 hover:text-[var(--color-primary)] transition-all duration-300"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
};

export default TestimonialsDash;
