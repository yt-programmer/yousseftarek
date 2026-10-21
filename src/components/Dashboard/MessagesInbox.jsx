import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { toWhatsAppDigits } from "../../utils/phone";
import { useConfirm } from "./ConfirmDialog";
import { Skeleton, StateCard, errorText } from "./ui";
import { FaEnvelope, FaEnvelopeOpen, FaTrash, FaWhatsapp } from "react-icons/fa";

const API = `${import.meta.env.VITE_API}/api/messages`;
const getMessagePhone = (message) => {
  const entry = Object.entries(message.fields || {}).find(([key, value]) => value != null && String(value).trim() && /phone|mobile|whatsapp|telephone|tel/i.test(`${key} ${message.fieldLabels?.[key] || ""}`));
  return toWhatsAppDigits(entry?.[1]);
};
export default function MessagesInbox({ onChanged }) {
  const confirm = useConfirm();
  const [loadError, setLoadError] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [busy, setBusy] = useState("");
  const load = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try { const response = await axios.get(API, { withCredentials: true }); setMessages(response.data?.data?.messages || []); }
    catch (error) { setLoadError(errorText(error, "Could not load messages")); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);
  const toggleReplied = async (message) => {
    setBusy(message._id);
    try { const replied = !message.replied; await axios.patch(`${API}/${message._id}/replied`, { replied }, { withCredentials: true }); setMessages((current) => current.map((item) => item._id === message._id ? { ...item, replied } : item)); toast.success(replied ? "Marked as replied" : "Reply status cleared"); }
    catch (error) { toast.error(error.response?.data?.message || "Could not update reply status"); } finally { setBusy(""); }
  };
  const toggleRead = async (message) => {
    setBusy(message._id);
    try {
      const read = !message.read;
      await axios.patch(`${API}/${message._id}/read`, { read }, { withCredentials: true });
      setMessages((current) => current.map((item) => item._id === message._id ? { ...item, read } : item));
      onChanged?.();
    } catch (error) { toast.error(error.response?.data?.message || "Could not update message"); }
    finally { setBusy(""); }
  };
  const remove = async (message) => {
    if (!(await confirm({ title: "Delete this message?", message: `The message from ${message.name || "this visitor"} will be deleted permanently.`, confirmText: "Delete message" }))) return;
    setBusy(message._id);
    try { await axios.delete(`${API}/${message._id}`, { withCredentials: true }); setMessages((current) => current.filter((item) => item._id !== message._id)); onChanged?.(); toast.success("Message deleted"); }
    catch (error) { toast.error(error.response?.data?.message || "Could not delete message"); }
    finally { setBusy(""); }
  };
  const unread = messages.filter((message) => !message.read).length;
  const filtered = filter === "unread" ? messages.filter((message) => !message.read) : filter === "read" ? messages.filter((message) => message.read) : messages;
  return <div className="space-y-6">
    <div><p className="text-xs font-semibold uppercase tracking-[.2em] text-emerald-400">Contact form</p><h2 className="mt-2 text-2xl font-semibold">Messages inbox</h2><p className="mt-2 text-sm leading-6 text-gray-400">Messages sent from the portfolio are stored here. You can reply by email, mark them as read, or delete them.</p></div>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{[["All messages", messages.length, "all"], ["Unread", unread, "unread"], ["Read", messages.length - unread, "read"]].map(([label, count, key]) => <button key={key} onClick={() => setFilter(key)} className={`rounded-xl border p-4 text-left transition ${filter === key ? "border-emerald-400/50 bg-emerald-400/10" : "border-white/10 bg-[#111318] hover:border-white/20"}`}><p className="text-xs text-gray-400">{label}</p><p className="mt-2 text-2xl font-semibold">{count}</p></button>)}</div>
    {loading ? <Skeleton rows={3} /> : loadError ? <StateCard kind="error" title="Could not load messages" text={loadError} onRetry={load} /> : filtered.length === 0 ? <div className="rounded-xl border border-white/10 bg-[#111318] p-8 text-center text-gray-400">No messages in this view yet.</div> : <div className="space-y-4">{filtered.map((message) => <article key={message._id} className={`rounded-xl border bg-[#111318] p-5 md:p-6 ${message.read ? "border-white/10" : "border-emerald-500/30"}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="break-words text-lg font-semibold">{message.name}</h3>{!message.read && <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] text-emerald-300">NEW</span>}{message.replied && <span className="rounded-full bg-sky-500/15 px-2.5 py-1 text-[10px] text-sky-300">REPLIED</span>}</div>{message.email && <a className="mt-1 block break-all text-sm text-emerald-300 hover:underline" href={`mailto:${message.email}`}>{message.email}</a>}</div><p className="text-xs text-gray-500">{message.createdAt ? new Date(message.createdAt).toLocaleString() : ""}</p></div>
      <div className="mt-5 space-y-3">{Object.entries(message.fields || {}).filter(([key,value]) => value !== "" && value != null && !["name","email","message"].includes(key)).map(([key,value]) => <div key={key} className="rounded-lg border border-white/10 bg-black/20 p-3"><p className="text-[11px] uppercase tracking-wide text-emerald-300">{message.fieldLabels?.[key] || key.replace(/[-_]/g," ")}</p><p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-gray-300">{String(value)}</p></div>)}{message.message && <div className="rounded-lg border border-white/10 bg-black/20 p-3"><p className="text-[11px] uppercase tracking-wide text-emerald-300">Message</p><p className="mt-1 whitespace-pre-wrap break-words text-sm leading-7 text-gray-300">{message.message}</p></div>}</div>
      <div className="mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-4">{getMessagePhone(message) && <a href={`https://wa.me/${getMessagePhone(message)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 px-3 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/10"><FaWhatsapp /> Reply on WhatsApp</a>}{message.email && <a href={`mailto:${message.email}?subject=${encodeURIComponent("Re: Your message")}`} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold hover:bg-emerald-500">Reply by email</a>}<button disabled={busy === message._id} onClick={() => toggleRead(message)} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-gray-300 hover:bg-white/5 disabled:opacity-50">{message.read ? <FaEnvelope /> : <FaEnvelopeOpen />}{message.read ? "Mark unread" : "Mark as read"}</button><button disabled={busy === message._id} onClick={() => toggleReplied(message)} className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs disabled:opacity-50 ${message.replied ? "border-sky-500/30 text-sky-300" : "border-white/10 text-gray-300 hover:bg-white/5"}`}>{message.replied ? "Clear replied status" : "Mark as replied"}</button><button disabled={busy === message._id} onClick={() => remove(message)} className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 px-3 py-2 text-xs text-red-300 hover:bg-red-500/10 disabled:opacity-50"><FaTrash /> Delete</button></div>
    </article>)}</div>}
  </div>;
}
