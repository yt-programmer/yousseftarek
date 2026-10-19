import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router";
import { FaEnvelope, FaStar, FaLayerGroup, FaCheckCircle, FaClock, FaArrowRight, FaReply, FaCalendarDay, FaCalendarWeek, FaCalendarAlt, FaTimesCircle, FaFolderOpen, FaEdit, FaChartLine } from "react-icons/fa";

const API = `${import.meta.env.VITE_API}/api/dashboard/overview`;
const cards = [
  { key: "messages", label: "Total messages", icon: FaEnvelope, href: "/dashboard/messages", note: "All contact form submissions" },
  { key: "unreadMessages", label: "Unread messages", icon: FaClock, href: "/dashboard/messages", note: "Need your attention" },
  { key: "repliedMessages", label: "Replied messages", icon: FaReply, href: "/dashboard/messages", note: "Marked as replied" },
  { key: "messagesToday", label: "Messages today", icon: FaCalendarDay, href: "/dashboard/messages", note: "Received since midnight" },
  { key: "messagesThisWeek", label: "Messages this week", icon: FaCalendarWeek, href: "/dashboard/messages", note: "Last 7 calendar days" },
  { key: "messagesThisMonth", label: "Messages this month", icon: FaCalendarAlt, href: "/dashboard/messages", note: "Current month" },
  { key: "testimonials", label: "Testimonials", icon: FaStar, href: "/dashboard/testimonials", note: "All submitted reviews" },
  { key: "pendingTestimonials", label: "Pending reviews", icon: FaClock, href: "/dashboard/testimonials", note: "Awaiting approval" },
  { key: "approvedTestimonials", label: "Published reviews", icon: FaCheckCircle, href: "/dashboard/testimonials", note: "Visible on the website" },
  { key: "rejectedTestimonials", label: "Rejected reviews", icon: FaTimesCircle, href: "/dashboard/testimonials", note: "Not published" },
  { key: "testimonialsThisMonth", label: "Reviews this month", icon: FaCalendarAlt, href: "/dashboard/testimonials", note: "Current month" },
  { key: "averageRating", label: "Average rating", icon: FaStar, href: "/dashboard/testimonials", note: "Approved reviews · out of 5", format: (value) => `${Number(value || 0).toFixed(1)} / 5` },
  { key: "responseRate", label: "Reply rate", icon: FaReply, href: "/dashboard/messages", note: "Messages marked replied", format: (value) => `${value || 0}%` },
  { key: "projects", label: "Projects", icon: FaLayerGroup, href: "/dashboard/works", note: "Portfolio projects" },
  { key: "projectCategories", label: "Project categories", icon: FaFolderOpen, href: "/dashboard/works", note: "Distinct project categories" },
  { key: "contentSections", label: "Content sections", icon: FaEdit, href: "/dashboard/content/hero", note: "Sections saved in CMS" },
];

export default function DashboardOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(API, { withCredentials: true });
      setData(response.data?.data || null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load dashboard overview");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { load(); }, [load]);
  const chart = data?.chart || [];
  const max = Math.max(1, ...chart.flatMap((month) => [month.messages, month.testimonials, month.projects]));
  const typeLabel = { message: "Message", testimonial: "Testimonial", project: "Project" };
  const updatedAt = data?.stats?.siteContentUpdatedAt;

  return <div className="space-y-6">
    <section className="rounded-xl border border-white/10 bg-gradient-to-br from-[#151b1a] to-[#111318] p-6 md:p-8">
      <p className="text-sm font-medium text-emerald-400">Dashboard overview</p>
      <h2 className="mt-2 text-3xl font-bold">Portfolio at a glance</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">A live summary of your projects, contact messages, testimonial moderation, response rate, and content updates.</p>
      <button type="button" onClick={load} disabled={loading} className="mt-5 rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 transition hover:border-emerald-500/40 hover:text-white disabled:opacity-50">{loading ? "Refreshing…" : "Refresh overview"}</button>
    </section>
    {loading && !data ? <div className="rounded-xl border border-white/10 bg-[#111318] p-8 text-center text-sm text-gray-400">Loading live statistics…</div> : data ? <>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{cards.map(({ key, label, icon: Icon, href, note, format }) => <Link key={key} to={href} className="group rounded-xl border border-white/10 bg-[#111318] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-emerald-500/40"><div className="flex items-center justify-between"><span className="text-sm text-gray-400">{label}</span><span className="rounded-lg bg-emerald-500/10 p-2.5 text-emerald-300"><Icon /></span></div><p className="mt-4 text-3xl font-semibold tabular-nums">{format ? format(data.stats?.[key]) : Number(data.stats?.[key] || 0).toLocaleString()}</p><div className="mt-3 flex items-center justify-between gap-2"><p className="text-xs text-gray-500">{note}</p><FaArrowRight className="shrink-0 text-xs text-gray-600 transition group-hover:translate-x-1 group-hover:text-emerald-300" /></div></Link>)}</section>
      <section className="rounded-xl border border-white/10 bg-[#111318] p-5 md:p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="text-lg font-semibold">Portfolio activity</h3><p className="mt-1 text-sm text-gray-500">Monthly messages, testimonials and projects for the last six months</p></div><div className="flex flex-wrap gap-4 text-xs"><span className="flex items-center gap-2 text-gray-300"><i className="h-2.5 w-2.5 rounded-sm bg-emerald-400" />Messages</span><span className="flex items-center gap-2 text-gray-300"><i className="h-2.5 w-2.5 rounded-sm bg-sky-400" />Testimonials</span><span className="flex items-center gap-2 text-gray-300"><i className="h-2.5 w-2.5 rounded-sm bg-violet-400" />Projects</span></div></div>
        <div className="mt-7 grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-6 sm:gap-5">{chart.map((month) => <div key={month.key} tabIndex={0} className="group relative flex min-w-0 flex-col items-center rounded-lg outline-none focus-visible:ring-1 focus-visible:ring-emerald-400"><div className="pointer-events-none absolute bottom-[calc(100%-1.5rem)] left-1/2 z-20 hidden w-44 -translate-x-1/2 rounded-lg border border-white/10 bg-[#090a0d] p-3 text-left shadow-xl group-hover:block group-focus:block"><p className="mb-2 text-xs font-semibold text-white">{month.label}</p>{[{ label: "Messages", value: month.messages, color: "bg-emerald-400" }, { label: "Testimonials", value: month.testimonials, color: "bg-sky-400" }, { label: "Projects", value: month.projects, color: "bg-violet-400" }].map((item) => <p key={item.label} className="mt-1 flex items-center justify-between gap-3 text-xs text-gray-300"><span><i className={`mr-1.5 inline-block h-2 w-2 rounded-sm ${item.color}`} />{item.label}</span><strong className="tabular-nums">{item.value || 0}</strong></p>)}<p className="mt-2 border-t border-white/10 pt-2 text-[10px] text-gray-500">Combined: {(month.messages || 0) + (month.testimonials || 0) + (month.projects || 0)}</p></div><div className="flex h-40 w-full items-end justify-center gap-1 border-b border-white/10 pb-0.5 sm:h-44 sm:gap-1.5">{[{ key: "messages", value: Number(month.messages) || 0, color: "bg-emerald-400" }, { key: "testimonials", value: Number(month.testimonials) || 0, color: "bg-sky-400" }, { key: "projects", value: Number(month.projects) || 0, color: "bg-violet-400" }].map((bar) => <div key={bar.key} aria-label={`${bar.key}: ${bar.value}`} className={`w-1/5 max-w-6 rounded-t-sm ${bar.color} transition-all duration-300 group-hover:opacity-80`} style={{ height: `${Math.max(bar.value ? 5 : 0, bar.value / max * 100)}%` }} />)}</div><p className="mt-2 text-center text-[10px] text-gray-500 sm:text-xs">{month.label}</p><p className="mt-1 text-[10px] text-gray-600">{month.messages}/{month.testimonials}/{month.projects}</p></div>)}</div><p className="mt-3 text-xs text-gray-600">Hover or focus a month to inspect its activity counts.</p></section>
      <section className="rounded-xl border border-white/10 bg-[#111318] p-5 md:p-6"><div className="flex items-center justify-between gap-3"><div><h3 className="text-lg font-semibold">Recent activity</h3><p className="mt-1 text-sm text-gray-500">Latest messages, reviews and project changes</p></div><Link to="/dashboard/messages" className="text-xs text-emerald-300 hover:text-emerald-200">Open inbox</Link></div>{!data.recent?.length ? <p className="py-8 text-center text-sm text-gray-500">No activity recorded yet.</p> : <div className="mt-4 divide-y divide-white/5">{data.recent.map((item, index) => <div key={`${item.type}-${item.createdAt}-${index}`} className="flex items-center gap-3 py-3"><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.type === "message" ? "bg-emerald-500/10 text-emerald-300" : item.type === "testimonial" ? "bg-sky-500/10 text-sky-300" : "bg-violet-500/10 text-violet-300"}`}>{item.type === "message" ? <FaEnvelope /> : item.type === "testimonial" ? <FaStar /> : <FaLayerGroup />}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-gray-200">{item.title}</p><p className="mt-1 text-xs capitalize text-gray-500">{typeLabel[item.type]} · {item.detail}</p></div><time className="shrink-0 text-[10px] text-gray-600 sm:text-xs">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}</time></div>)}</div>}</section>
      <section className="rounded-xl border border-white/10 bg-[#111318] p-5 md:p-6"><div className="flex items-center gap-3"><span className="rounded-lg bg-emerald-500/10 p-3 text-emerald-300"><FaChartLine /></span><div><h3 className="font-semibold">Content management</h3><p className="mt-1 text-sm text-gray-500">{updatedAt ? `Last saved ${new Date(updatedAt).toLocaleString()}` : "No saved CMS update timestamp is available yet."}</p></div></div><Link to="/dashboard/content/hero" className="mt-4 inline-flex items-center gap-2 text-sm text-emerald-300 hover:text-emerald-200">Manage site content <FaArrowRight className="text-xs" /></Link></section>
    </> : <div className="rounded-xl border border-white/10 bg-[#111318] p-8 text-center text-sm text-gray-400">Dashboard statistics are unavailable. Refresh to try again.</div>}
  </div>;
}
