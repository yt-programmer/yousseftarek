import { useCallback, useEffect, useState } from "react";
import PhoneInput from "../components/common/PhoneInput";
import axios from "axios";
import toast from "react-hot-toast";
import { FaStar, FaExternalLinkAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { useGetTestimonials } from "../hooks/useGetTestimonials";
import { useSiteContent } from "../context/SiteContentContext";
import Loading from "../components/Loading";
import { safeHref } from "../utils/safeUrl";

const API = `${(import.meta.env.VITE_API || "").replace(/\/$/, "")}/api/testimonials`;
const inputClass =
  "w-full rounded-lg border border-[var(--color-primary)]/50 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-[var(--color-primary)]";
const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export default function TestimonialsPage() {
  useEffect(() => {
    document.title = "Testimonials | Youssef Tarek"; // الاسم الجديد للتاب
  }, []);
  const { content } = useSiteContent();
  const copy = content.testimonials;
  const { testimonials, isLoading, error } = useGetTestimonials(100, 1);
  const [form, setForm] = useState({
    name: "",
    position: "",
    rating: 5,
    description: "",
    phone: "",
    website: "",
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const change = (event) =>
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  const updatePhone = useCallback(
    (phone) =>
      setForm((current) =>
        current.phone === phone ? current : { ...current, phone },
      ),
    [],
  );
  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(API, { ...form, rating: Number(form.rating) });
      toast.success(
        copy.pendingMessage || "Thanks! Your review was sent for approval.",
      );
      setForm({
        name: "",
        position: "",
        rating: 5,
        description: "",
        phone: "",
        website: "",
      });
      setHoveredRating(0);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.code === "ERR_NETWORK"
          ? "Network/CORS error: check the backend CORS origin and API URL."
          : "Could not submit your review. Please try again.");
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };
  const visibleRating = hoveredRating || Number(form.rating);

  return (
    <section className="min-h-screen overflow-hidden pt-40 pb-24">
      <div className="container mx-auto px-5">
        <motion.header
          className="mb-12 max-w-3xl"
          variants={reveal}
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-3xl font-semibold md:text-4xl">
            <span className="text-[var(--color-primary)]">/</span>
            {copy.pageTitle || copy.title}
          </h1>
          <p className="mt-5 leading-7 text-gray-400">
            {copy.pageSubtitle ||
              "Real feedback from people I have worked with."}
          </p>
        </motion.header>

        <section aria-label="Approved testimonials">
          <motion.h2
            className="mb-6 text-2xl font-bold"
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <span className="text-[var(--color-primary)]"># </span>
            {copy.title}
          </motion.h2>
          {isLoading && <Loading />}
          {error && (
            <p
              role="alert"
              className="rounded-lg border border-red-500/30 p-4 text-red-300"
            >
              {error}
            </p>
          )}
          {!isLoading && !error && testimonials?.length === 0 && (
            <p className="rounded-lg border border-white/10 p-5 text-gray-400">
              {copy.emptyText}
            </p>
          )}
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {testimonials?.map((item, index) => (
              <motion.article
                key={item._id}
                className="flex min-w-0 flex-col rounded-xl border border-[var(--color-primary)]/60 bg-black/20 p-5 shadow-lg shadow-green-950/40 transition hover:-translate-y-1 hover:shadow-green-900/40"
                variants={reveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.4,
                  delay: Math.min(index * 0.08, 0.32),
                }}
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3
                      dir="auto"
                      className="break-words text-lg font-bold text-[var(--color-primary)]"
                    >
                      {item.name}
                    </h3>
                    <p
                      dir="auto"
                      className="mt-1 break-words text-xs text-gray-400"
                    >
                      {item.position}
                    </p>
                  </div>
                  <div
                    className="flex shrink-0 gap-1"
                    aria-label={`${item.rating} out of 5 stars`}
                  >
                    {Array.from({ length: 5 }, (_, starIndex) => (
                      <FaStar
                        key={starIndex}
                        className={
                          starIndex < item.rating
                            ? "text-yellow-400"
                            : "text-gray-600"
                        }
                      />
                    ))}
                  </div>
                </div>
                <p
                  dir="auto"
                  className="flex-1 whitespace-pre-wrap break-words text-sm leading-6 text-gray-300"
                >
                  {item.description}
                </p>
                {safeHref(item.website) && (
                  <a
                    href={safeHref(item.website)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-[var(--color-primary)]/40 px-3 py-2 text-xs text-[var(--color-primary)] transition hover:bg-[var(--color-primary)]/10"
                  >
                    <FaExternalLinkAlt className="shrink-0" />
                    <span className="truncate">
                      {copy.websiteLinkText || "Visit website"}
                    </span>
                  </a>
                )}
              </motion.article>
            ))}
          </div>
        </section>

        <motion.section
          id="leave-review"
          className="mt-20 grid gap-8 rounded-2xl border border-white/10 bg-white/[0.025] p-5 md:p-8 lg:grid-cols-[.8fr_1.2fr]"
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
        >
          <div>
            <h2 className="text-2xl font-bold">
              <span className="text-[var(--color-primary)]"># </span>
              {copy.formTitle || "Leave a review"}
            </h2>
            <p className="mt-4 leading-7 text-gray-400">
              {copy.formDescription ||
                "Your review will appear publicly after approval."}
            </p>
            <p className="mt-5 text-xs leading-5 text-gray-500">
              Your phone number is optional and is only shown in the admin
              dashboard, never on the public site. Reviews appear after
              approval.
            </p>
          </div>
          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm text-gray-300">
              <span>{copy.nameLabel || "Your name"} *</span>
              <input
                className={inputClass}
                name="name"
                value={form.name}
                onChange={change}
                required
                minLength={2}
                maxLength={80}
                autoComplete="name"
              />
            </label>
            <label className="grid gap-2 text-sm text-gray-300">
              <span>{copy.positionLabel || "Role or company"} *</span>
              <input
                className={inputClass}
                name="position"
                value={form.position}
                onChange={change}
                required
                maxLength={120}
              />
            </label>
            <fieldset
              className="grid gap-2 sm:col-span-2"
              onMouseLeave={() => setHoveredRating(0)}
            >
              <legend className="mb-2 text-sm text-gray-300">
                {copy.ratingLabel || "Your rating"} *
              </legend>
              <div
                className="flex items-center gap-2"
                role="radiogroup"
                aria-label="Choose a rating from 1 to 5 stars"
              >
                {[1, 2, 3, 4, 5].map((rating) => (
                  <motion.button
                    key={rating}
                    type="button"
                    role="radio"
                    aria-checked={Number(form.rating) === rating}
                    aria-label={`${rating} ${rating === 1 ? "star" : "stars"}`}
                    onClick={() =>
                      setForm((current) => ({ ...current, rating }))
                    }
                    onMouseEnter={() => setHoveredRating(rating)}
                    onFocus={() => setHoveredRating(rating)}
                    onBlur={() => setHoveredRating(0)}
                    whileHover={{ scale: 1.2, rotate: -7 }}
                    whileTap={{ scale: 0.88 }}
                    className="rounded-md p-1 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                  >
                    <FaStar
                      size={30}
                      className={`transition-colors duration-150 ${rating <= visibleRating ? "text-yellow-400 drop-shadow-[0_0_7px_rgba(250,204,21,0.25)]" : "text-gray-600"}`}
                    />
                  </motion.button>
                ))}
                <span className="ml-2 text-sm text-gray-400">
                  {form.rating}/5
                </span>
              </div>
            </fieldset>
            <div className="sm:col-span-2">
              <PhoneInput
                name="phone"
                label={copy.phoneLabel || "WhatsApp number (optional)"}
                value={form.phone}
                onChange={updatePhone}
                placeholder="Phone number"
              />
            </div>
            <label className="grid gap-2 text-sm text-gray-300 sm:col-span-2">
              <span>{copy.websiteLabel || "Website URL (optional)"}</span>
              <input
                className={inputClass}
                name="website"
                value={form.website}
                onChange={change}
                type="url"
                maxLength={300}
                placeholder="https://example.com"
              />
            </label>
            <label className="grid gap-2 text-sm text-gray-300 sm:col-span-2">
              <span>{copy.descriptionLabel || "Your review"} *</span>
              <textarea
                className={`${inputClass} min-h-36 resize-y`}
                name="description"
                value={form.description}
                onChange={change}
                required
                minLength={5}
                maxLength={2000}
                rows={5}
              />
            </label>
            <div className="sm:col-span-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={submitting}
                type="submit"
                className="rounded-lg border border-[var(--color-primary)] bg-[var(--color-primary)]/10 px-6 py-3 font-semibold text-white transition hover:bg-[var(--color-primary)]/20 disabled:cursor-wait disabled:opacity-60"
              >
                {submitting
                  ? "Submitting…"
                  : copy.submitText || "Submit review"}
              </motion.button>
            </div>
          </form>
        </motion.section>
      </div>
    </section>
  );
}
