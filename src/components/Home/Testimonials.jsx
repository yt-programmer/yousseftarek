import { useEffect, useState } from "react";
import { Link } from "react-router";
import useEmblaCarousel from "embla-carousel-react";
import { FaChevronLeft, FaChevronRight, FaStar, FaExternalLinkAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { useGetTestimonials } from "../../hooks/useGetTestimonials";
import Loading from "../Loading";
import ShowAlert from "../ShowAlert";
import { useSiteContent } from "../../context/SiteContentContext";

export default function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);
  const { testimonials, isLoading, error } = useGetTestimonials();
  const { content } = useSiteContent();

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit();
    const syncCarousel = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setScrollSnaps(emblaApi.scrollSnapList());
    };
    syncCarousel();
    emblaApi.on("select", syncCarousel);
    emblaApi.on("reInit", syncCarousel);
    return () => {
      emblaApi.off("select", syncCarousel);
      emblaApi.off("reInit", syncCarousel);
    };
  }, [emblaApi, testimonials?.length]);

  return (
    <section
      id="testimonials"
      className="relative   overflow-hidden  max-w-7xl mx-auto px-4 mt-50 "
    >
      <div className="container flex flex-col px-[20px] mx-auto">
        <div className="relative flex items-center md:w-[60%] gap-5">
          <h2 className="capitalize text-2xl font-bold">
            <span className="text-[var(--color-primary)]"># </span>{content.testimonials.title}
          </h2>
          <div className="bg-[var(--color-primary)] h-[1px] flex-1"></div>
          <Link to="/testimonials" className="shrink-0 text-xs font-semibold text-[var(--color-primary)] transition hover:underline">{content.testimonials.viewAllText || "View all testimonials"} ↗</Link>
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
                type="button"
                aria-label="Previous testimonial"
                onClick={() => emblaApi?.scrollPrev()}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-50 h-12 w-12 rounded-full pr-1 bg-[var(--color-primary)] shadow-lg flex items-center justify-center"
              >
                <FaChevronLeft className="text-white" />
              </motion.button>

              <motion.button
                type="button"
                aria-label="Next testimonial"
                onClick={() => emblaApi?.scrollNext()}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-50 h-12 w-12 rounded-full pl-1 bg-[var(--color-primary)] shadow-lg flex items-center justify-center"
              >
                <FaChevronRight className="text-white" />
              </motion.button>
            </>

            <div className="overflow-hidden  mt-5" ref={emblaRef}>
              <div className="flex ">
                {testimonials.map((item, index) => (
                  <motion.div key={item._id} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.45, delay: Math.min(index * 0.08, 0.3) }} whileHover={{ y: -4 }} className="min-w-0 flex-[0_0_90%] px-3 sm:flex-[0_0_70%] lg:flex-[0_0_50%]">
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
                      {item.website && <a href={item.website} target="_blank" rel="noopener noreferrer" className="inline-flex max-w-full items-center gap-2 rounded-full border border-[var(--color-primary)]/40 px-3 py-2 text-xs text-[var(--color-primary)] transition hover:bg-[var(--color-primary)]/10"><FaExternalLinkAlt className="shrink-0" /><span className="truncate">{content.testimonials.websiteLinkText || "Visit website"}</span></a>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className={`mt-8 justify-center gap-3 flex `}>
              {scrollSnaps.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`Go to testimonial ${index + 1}`}
                  aria-current={index === selectedIndex ? "true" : undefined}
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
              <ShowAlert type="normal" message={content.testimonials.emptyText} />
            </div>
          )
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/testimonials" className="rounded-lg border border-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-primary)]/10">{content.testimonials.viewAllText || "View all testimonials"}</Link>
          <Link to="/testimonials#leave-review" className="rounded-lg bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90">{content.testimonials.addReviewText || "Leave a review"}</Link>
        </div>
      </div>
    </section>
  );
}
