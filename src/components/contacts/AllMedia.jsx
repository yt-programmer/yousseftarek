import React from "react";
import { FaWhatsapp, FaFacebookF, FaTiktok, FaTelegramPlane, FaLinkedinIn, FaEnvelope, FaGlobe } from "react-icons/fa";
import { motion } from "framer-motion";
import { useSiteContent } from "../../context/SiteContentContext";
import { safeHref } from "../../utils/safeUrl";
const icons = { facebook: FaFacebookF, whatsapp: FaWhatsapp, tiktok: FaTiktok, telegram: FaTelegramPlane, linkedin: FaLinkedinIn };
const normalizePhone = (value) => String(value || "").replace(/[^\d]/g, "");
const AllMedia = () => {
  const { content } = useSiteContent();
  const socials = (content.socials || []).filter((item) => item?.url && String(item.url).trim());
  const whatsapp = socials.find((item) => /whatsapp/i.test(`${item.platform || ""} ${item.label || ""}`) || /wa\.me|whatsapp\.com/i.test(item.url));
  const phone = normalizePhone(whatsapp?.url?.match(/(?:wa\.me\/|phone=)([^?&#]+)/i)?.[1] || "");
  const emailItem = socials.find((item) => /email|e-mail/i.test(`${item.platform || ""} ${item.label || ""}`) || /^mailto:/i.test(item.url));
  const email = emailItem?.url?.startsWith("mailto:") ? emailItem.url : (emailItem?.url && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailItem.url) ? `mailto:${emailItem.url}` : "");
  const regularSocials = socials.filter((item) => item !== emailItem && item !== whatsapp && safeHref(item.url));
  return <div className="mt-5 flex flex-wrap gap-3">
    {regularSocials.map((item) => {
      const Icon = icons[String(item.platform || "").toLowerCase()];
      const initials = String(item.label || item.platform || "?").trim().split(/[\s_-]+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join("").toUpperCase() || "?";
      return <motion.a whileHover={{ scale: 1.08, y: -2 }} whileTap={{ scale: .95 }} initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 260, damping: 20 }} className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-primary)]/50 text-lg text-white transition-colors duration-300 hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--color-primary)]" key={`${item.platform}-${item.url}`} href={safeHref(item.url)} target="_blank" rel="noopener noreferrer" aria-label={item.label || item.platform} title={item.label || item.platform}>{Icon ? <Icon /> : <span className="text-[11px] font-bold tracking-wide">{initials}</span>}<span aria-hidden="true" className="pointer-events-none absolute bottom-[calc(100%+9px)] left-1/2 z-30 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md border border-[var(--color-primary)]/30 bg-[#101210] px-2.5 py-1.5 text-[11px] font-medium text-white opacity-0 shadow-lg transition duration-150 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">{item.label || item.platform || "Social link"}</span></motion.a>;
    })}
    {whatsapp && phone && <a href={`https://wa.me/${phone}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/50 px-4 py-2 text-sm text-[var(--color-primary)] transition hover:bg-[var(--color-primary)]/10"><FaWhatsapp/> WhatsApp</a>}
    {email && <a href={email} className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/50 px-4 py-2 text-sm text-[var(--color-primary)] transition hover:bg-[var(--color-primary)]/10"><FaEnvelope/> Email</a>}
  </div>;
};
export default AllMedia;
