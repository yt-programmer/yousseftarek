import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaCheck, FaClock, FaExternalLinkAlt, FaGlobe, FaPhoneAlt, FaStar, FaTimes, FaTrash } from "react-icons/fa";

const API = `${import.meta.env.VITE_API}/api/testimonials`;
const waLink = (phone) => {
  let digits = String(phone || "").replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("0")) digits = `20${digits.slice(1)}`;
  return digits.length >= 7 ? `https://wa.me/${digits}` : "";
};
const statusStyle = { pending: "border-amber-400/30 bg-amber-400/10 text-amber-300", approved: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300", rejected: "border-red-400/30 bg-red-400/10 text-red-300" };

export default function TestimonialsDash() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [busyId, setBusyId] = useState("");
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/manage`, { withCredentials: true });
      setItems(response.data?.data?.testimonials || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load review submissions");
    } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);
  const counts = useMemo(() => ({ all: items.length, pending: items.filter((item) => item.status === "pending").length, approved: items.filter((item) => item.status === "approved").length, rejected: items.filter((item) => item.status === "rejected").length }), [items]);
  const filtered = filter === "all" ? items : items.filter((item) => item.status === filter);
  const setStatus = async (item, status) => {
    setBusyId(item._id);
    try {
      await axios.patch(`${API}/${item._id}/editStatus`, { status }, { withCredentials: true });
      setItems((current) => current.map((review) => review._id === item._id ? { ...review, status } : review));
      toast.success(status === "approved" ? "Review approved and published" : status === "rejected" ? "Review rejected" : "Review returned to pending");
    } catch (error) { toast.error(error.response?.data?.message || "Could not update review status"); }
    finally { setBusyId(""); }
  };
  const remove = async (item) => {
    if (!window.confirm(`Delete the review from ${item.name}? This cannot be undone.`)) return;
    setBusyId(item._id);
    try {
      await axios.delete(`${API}/${item._id}`, { withCredentials: true });
      setItems((current) => current.filter((review) => review._id !== item._id));
      toast.success("Review deleted");
    } catch (error) { toast.error(error.response?.data?.message || "Could not delete review"); }
    finally { setBusyId(""); }
  };
  return <div className="space-y-6">
    <div><p className="text-xs font-semibold uppercase tracking-[.2em] text-emerald-400">Community feedback</p><h2 className="mt-2 text-2xl font-semibold">Testimonials inbox</h2><p className="mt-2 text-sm leading-6 text-gray-400">New reviews stay private until you approve them. Phone numbers are only visible here.</p></div>
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">{[["Pending", counts.pending, "pending"], ["Published", counts.approved, "approved"], ["Rejected", counts.rejected, "rejected"], ["All reviews", counts.all, "all"]].map(([label, count, key]) => <button key={key} onClick={() => setFilter(key)} className={`rounded-xl border p-4 text-left transition ${filter === key ? "border-emerald-400/50 bg-emerald-400/10" : "border-white/10 bg-[#111318] hover:border-white/20"}`}><p className="text-xs text-gray-400">{label}</p><p className="mt-2 text-2xl font-semibold">{count}</p></button>)}</div>
    {loading ? <div className="rounded-xl border border-white/10 bg-[#111318] p-8 text-center text-sm text-gray-400">Loading reviews…</div> : filtered.length === 0 ? <div className="rounded-xl border border-white/10 bg-[#111318] p-8 text-center"><p className="font-semibold">No {filter === "all" ? "reviews" : `${filter} reviews`} yet</p><p className="mt-2 text-sm text-gray-500">Public submissions will appear here automatically.</p></div> : <div className="space-y-4">{filtered.map((item) => <article key={item._id} className="rounded-xl border border-white/10 bg-[#111318] p-5 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-3"><h3 className="break-words text-lg font-semibold">{item.name}</h3><span className={`rounded-full border px-2.5 py-1 text-[11px] capitalize ${statusStyle[item.status] || statusStyle.pending}`}>{item.status}</span></div><p className="mt-1 text-sm text-gray-400">{item.position}</p><div className="mt-3 flex gap-1" aria-label={`${item.rating} out of 5 stars`}>{Array.from({ length: 5 }, (_, index) => <FaStar key={index} className={index < item.rating ? "text-yellow-400" : "text-gray-700"} />)}</div></div><p className="shrink-0 text-xs text-gray-500">{item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}</p></div>
      <p className="mt-5 whitespace-pre-wrap break-words text-sm leading-6 text-gray-300">{item.description}</p>
      <div className="mt-5 flex flex-wrap gap-2">{item.phone && waLink(item.phone) && <a href={waLink(item.phone)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 px-3 py-2 text-xs text-emerald-300 hover:bg-emerald-500/10"><FaPhoneAlt /> Message on WhatsApp</a>}{item.website && <a href={item.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-gray-300 hover:bg-white/5"><FaGlobe /> Visit website <FaExternalLinkAlt /></a>}</div>
      <div className="mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-4">{item.status !== "approved" && <button disabled={busyId === item._id} onClick={() => setStatus(item, "approved")} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold hover:bg-emerald-500 disabled:opacity-50"><FaCheck /> Approve & publish</button>}{item.status !== "rejected" && <button disabled={busyId === item._id} onClick={() => setStatus(item, "rejected")} className="inline-flex items-center gap-2 rounded-lg border border-amber-500/30 px-3 py-2 text-xs text-amber-300 hover:bg-amber-500/10 disabled:opacity-50"><FaTimes /> Reject</button>}{item.status !== "pending" && <button disabled={busyId === item._id} onClick={() => setStatus(item, "pending")} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-gray-300 hover:bg-white/5 disabled:opacity-50"><FaClock /> Return to pending</button>}<button disabled={busyId === item._id} onClick={() => remove(item)} className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 px-3 py-2 text-xs text-red-300 hover:bg-red-500/10 disabled:opacity-50"><FaTrash /> Delete</button></div>
    </article>)}</div>}
  </div>;
}
