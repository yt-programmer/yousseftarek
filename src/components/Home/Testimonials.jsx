import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import useEmblaCarousel from "embla-carousel-react";
import { FaChevronLeft, FaChevronRight, FaStar, FaExternalLinkAlt } from "react-icons/fa";
import { useGetTestimonials } from "../../hooks/useGetTestimonials";
import Loading from "../Loading";
import ShowAlert from "../ShowAlert";
import Modal from "../common/Modal";
import { useSiteContent } from "../../context/SiteContentContext";
import { safeHref } from "../../utils/safeUrl";

const LONG_REVIEW = 260; // characters before a review gets a "Read more" button

function Stars({ rating }) {
  return <div className="flex shrink-0 items-center gap-1" role="img" aria-label={`${rating} out of 5 stars`}>
    {Array.from({ length: 5 }, (_, i) => <FaStar key={i} className={i < rating ? "text-yellow-500" : "text-gray-500"} />)}
  </div>;
}

export default function Testimonials() {
  const { testimonials, isLoading, error } = useGetTestimonials(12, 1);
  const { content } = useSiteContent();
  const copy = content.testimonials;
  // No loop: looping with only a few slides repeats cards and cuts them at the edges. Slides stop cleanly at both ends.
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps" });
  const [state, setState] = useState({ index: 0, snaps: 0, canPrev: false, canNext: false });
  const [reading, setReading] = useState(null);

  const sync = useCallback((api) => setState({ index: api.selectedScrollSnap(), snaps: api.scrollSnapList().length, canPrev: api.canScrollPrev(), canNext: api.canScrollNext() }), []);
  useEffect(() => {
    if (!emblaApi) return undefined;
    const onChange = () => sync(emblaApi);
    emblaApi.reInit();
    onChange();
    emblaApi.on("select", onChange).on("reInit", onChange).on("resize", onChange);
    return () => { emblaApi.off("select", onChange).off("reInit", onChange).off("resize", onChange); };
  }, [emblaApi, sync, testimonials.length]);

  const onKeyDown = (event) => {
    if (event.key === "ArrowLeft") { event.preventDefault(); emblaApi?.scrollPrev(); }
    if (event.key === "ArrowRight") { event.preventDefault(); emblaApi?.scrollNext(); }
  };
  const hasItems = !error && !isLoading && testimonials.length > 0;
  const arrow = "flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30";

  return (
    <section id="testimonials" className="relative mx-auto mt-50 max-w-7xl px-4">
      <div className="container mx-auto flex flex-col px-[20px]">
        <div className="relative flex items-center gap-5 md:w-[60%]">
          <h2 className="text-2xl font-bold capitalize"><span className="text-[var(--color-primary)]"># </span>{copy.title}</h2>
          <div className="h-[1px] flex-1 bg-[var(--color-primary)]" />
          <Link to="/testimonials" className="shrink-0 text-xs font-semibold text-[var(--color-primary)] transition hover:underline">{copy.viewAllText || "View all testimonials"} ↗</Link>
        </div>

        {isLoading && <div className="mt-20"><Loading /></div>}
        {error && <div className="mt-20"><ShowAlert type="error" message={` ${error}`} /></div>}
        {!isLoading && !error && testimonials.length === 0 && <div className="mt-20"><ShowAlert type="normal" message={copy.emptyText} /></div>}

        {hasItems && <div className="mt-12">
          {/* vertical padding gives the card shadows room, so nothing is clipped by the carousel viewport */}
          <div className="overflow-hidden px-1 py-6 outline-none" ref={emblaRef} role="region" aria-roledescription="carousel" aria-label={copy.title} tabIndex={0} onKeyDown={onKeyDown}>
            <div className="-ml-3 flex">
              {testimonials.map((item) => {
                const long = String(item.description || "").length > LONG_REVIEW;
                return <div key={item._id} role="group" aria-roledescription="slide" className="min-w-0 flex-[0_0_90%] pl-3 sm:flex-[0_0_70%] lg:flex-[0_0_50%]">
                  <article className="flex h-full min-h-[230px] flex-col rounded-md border border-[var(--color-primary)] p-4 shadow-lg shadow-green-900">
                    <div className="mb-4">
                      <div className="flex items-start justify-between gap-5">
                        <h3 dir="auto" className="min-w-0 break-words text-lg font-bold text-[var(--color-primary)]">{item.name}</h3>
                        <Stars rating={item.rating} />
                      </div>
                      <span dir="auto" className="mt-1 block break-words text-xs text-gray-400">{item.position}</span>
                    </div>
                    <p dir="auto" className="mb-3 line-clamp-6 whitespace-pre-line break-words text-sm font-semibold leading-6 text-gray-400">{item.description}</p>
                    <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
                      {long && <button type="button" onClick={() => setReading(item)} className="text-xs font-semibold text-[var(--color-primary)] underline-offset-2 hover:underline">Read full review</button>}
                      {safeHref(item.website) && <a href={safeHref(item.website)} target="_blank" rel="noopener noreferrer" className="inline-flex max-w-full items-center gap-2 rounded-full border border-[var(--color-primary)]/40 px-3 py-2 text-xs text-[var(--color-primary)] transition hover:bg-[var(--color-primary)]/10"><FaExternalLinkAlt className="shrink-0" /><span className="truncate">{copy.websiteLinkText || "Visit website"}</span></a>}
                    </div>
                  </article>
                </div>;
              })}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-4">
            <button type="button" aria-label="Previous testimonial" disabled={!state.canPrev} onClick={() => emblaApi?.scrollPrev()} className={arrow}><FaChevronLeft /></button>
            {state.snaps > 1 && (state.snaps <= 8
              ? <div className="flex items-center gap-3">{Array.from({ length: state.snaps }, (_, i) => <button key={i} type="button" aria-label={`Go to testimonial ${i + 1}`} aria-current={i === state.index ? "true" : undefined} onClick={() => emblaApi?.scrollTo(i)} className={`h-3 w-3 rounded-full transition-all ${i === state.index ? "bg-[var(--color-primary)]" : "border border-[var(--color-primary)] bg-transparent"}`} />)}</div>
              : <span className="min-w-14 text-center text-sm tabular-nums text-gray-400">{state.index + 1} / {state.snaps}</span>)}
            <button type="button" aria-label="Next testimonial" disabled={!state.canNext} onClick={() => emblaApi?.scrollNext()} className={arrow}><FaChevronRight /></button>
          </div>
        </div>}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/testimonials" className="rounded-lg border border-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-primary)]/10">{copy.viewAllText || "View all testimonials"}</Link>
          <Link to="/testimonials#leave-review" className="rounded-lg bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90">{copy.addReviewText || "Leave a review"}</Link>
        </div>
      </div>

      <Modal open={Boolean(reading)} onClose={() => setReading(null)} title={reading?.name || ""} subtitle={reading?.position} size="max-w-xl">
        {reading && <div><Stars rating={reading.rating} /><p dir="auto" className="mt-4 max-h-[60vh] overflow-y-auto whitespace-pre-line break-words text-sm leading-7 text-gray-300">{reading.description}</p></div>}
      </Modal>
    </section>
  );
}
