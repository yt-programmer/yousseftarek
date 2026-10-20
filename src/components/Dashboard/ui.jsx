/* eslint-disable react-refresh/only-export-components */
import { FaExclamationTriangle, FaInbox, FaRedo } from "react-icons/fa";

// One set of building blocks so every dashboard screen looks and behaves the same.
export const btn = {
  primary: "inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50",
  ghost: "inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-sm text-gray-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50",
  danger: "inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/30 px-4 py-2.5 text-sm text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50",
  dangerSolid: "inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50",
  small: "!px-3 !py-2 !text-xs",
};
export const inputCls = "w-full rounded-lg border border-white/10 bg-[#090a0d] px-3 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-emerald-500 disabled:opacity-60";
export const cardCls = "rounded-xl border border-white/10 bg-[#111318]";

export function PageHeader({ eyebrow, title, description, actions }) {
  return <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-[.2em] text-emerald-400">{eyebrow}</p><h2 className="mt-2 text-2xl font-semibold">{title}</h2>{description && <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">{description}</p>}</div>
    {actions}
  </div>;
}

export function Skeleton({ rows = 3 }) {
  return <div className="space-y-3" role="status" aria-label="Loading">{Array.from({ length: rows }, (_, i) => <div key={i} className="h-24 animate-pulse rounded-xl border border-white/5 bg-white/[.03]" />)}</div>;
}

// loading / empty / error states look identical everywhere (and errors always offer a retry).
export function StateCard({ kind = "empty", title, text, onRetry, icon: Icon }) {
  const Fallback = kind === "error" ? FaExclamationTriangle : FaInbox;
  const Glyph = Icon || Fallback;
  return <div role={kind === "error" ? "alert" : undefined} className={`${cardCls} px-5 py-12 text-center ${kind === "error" ? "border-red-500/25" : "border-dashed"}`}>
    <span className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl text-xl ${kind === "error" ? "bg-red-500/10 text-red-300" : "bg-emerald-500/10 text-emerald-300"}`}><Glyph /></span>
    <h3 className="mt-4 font-semibold">{title}</h3>
    {text && <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">{text}</p>}
    {onRetry && <button type="button" onClick={onRetry} className={`${btn.ghost} mt-5`}><FaRedo className="text-xs" /> Try again</button>}
  </div>;
}

export const errorText = (error, fallback) => error?.response?.data?.message || (error?.code === "ERR_NETWORK" ? "Could not reach the server. Check your connection and that the backend is running." : error?.message) || fallback;
