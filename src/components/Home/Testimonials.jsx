import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { FaChevronLeft, FaChevronRight, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";
import { useGetTestimonials } from "../../hooks/useGetTestimonials";
import Loading from "../Loading";
import ShowAlert from "../ShowAlert";

export default function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);
  const { testimonials, isLoading, error } = useGetTestimonials();

  useEffect(() => {
    if (!emblaApi || !testimonials?.length) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.reInit();
    setScrollSnaps(emblaApi.scrollSnapList());

    onSelect();

    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <section
      id="testimonials"
      className="relative   overflow-hidden  max-w-7xl mx-auto px-4 mt-50 "
    >
      <div className="container flex flex-col px-[20px] mx-auto">
        <div className="relative flex items-center md:w-[60%] gap-5">
          <h2 className="capitalize text-2xl font-bold">
            <span className="text-[var(--color-primary)]"># </span>Testimonials
          </h2>
          <div className="bg-[var(--color-primary)] h-[1px] flex-1"></div>
        </div>

        {isLoading && <Loading />}
        {error && (
          <div className="mt-20">
            <ShowAlert type="error" message={` ${error}`} />
          </div>
        )}
        {!error && !isLoading && testimonials && testimonials.length !== 0 ? (
          <div className="mt-20   relative">
            <>
              <motion.button
                onClick={() => emblaApi?.scrollPrev()}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-50 h-12 w-12 rounded-full pr-1 bg-[var(--color-primary)] shadow-lg flex items-center justify-center"
              >
                <FaChevronLeft className="text-white" />
              </motion.button>

              <motion.button
                onClick={() => emblaApi?.scrollNext()}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-50 h-12 w-12 rounded-full pl-1 bg-[var(--color-primary)] shadow-lg flex items-center justify-center"
              >
                <FaChevronRight className="text-white" />
              </motion.button>
            </>

            <div className="overflow-hidden  mt-5" ref={emblaRef}>
              <div className="flex ">
                {testimonials.map((item, index) => (
                  <motion.div key={item._id} className="flex-[0_0_70%] px-4 ">
                    <div className="shadow-lg  min-h-[230px] shadow-green-900 p-4  rounded-md border   border-[var(--color-primary)]">
                      <div className=" mb-4">
                        <div className="flex items-center gap-5 justify-between">
                          <h3 className="text-[var(--color-primary)] font-bold  text-lg">
                            {item.name}
                          </h3>
                          <div className="flex items-center gap-1 ">
                            {Array(5)
                              .fill(0)
                              .map((_, starIndex) => (
                                <span
                                  key={starIndex}
                                  className={`  ${
                                    starIndex < item.rating
                                      ? "text-yellow-500"
                                      : "text-gray-400"
                                  }`}
                                >
                                  <FaStar />
                                </span>
                              ))}
                          </div>
                        </div>
                        <span className="text-gray-400 text-xs ">
                          {item.position}
                        </span>
                      </div>
                      <p className="text-gray-400 line-clamp-7 font-semibold text-sm mb-4">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className={`mt-8 justify-center gap-3 flex `}>
              {scrollSnaps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => emblaApi?.scrollTo(index)}
                  className={`h-3 w-3 rounded-full transition-all ${
                    index === selectedIndex
                      ? "bg-[var(--color-primary)]"
                      : "border border-[var(--color-primary)] bg-transparent"
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          !isLoading &&
          !error && (
            <div className="mt-20">
              <ShowAlert type="normal" message="No Testimonials" />
            </div>
          )
        )}
      </div>
    </section>
  );
}
