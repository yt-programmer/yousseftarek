import { useEffect, useState } from "react";

const API = `${import.meta.env.VITE_API}/api/dashboard/maintenance`;
const format = (value) => String(value).padStart(2, "0");
export default function MaintenancePage() {
  const [data, setData] = useState(null);
  const [remaining, setRemaining] = useState(0);
  useEffect(() => {
    let active = true;
    fetch(API).then((response) => { if (!response.ok) throw new Error("Request failed"); return response.json(); }).then((result) => {
      if (!active) return;
      const value = result.data || {};
      setData(value);
      setRemaining(value.until ? Math.max(0, new Date(value.until).getTime() - Date.now()) : 0);
    }).catch(() => setData({ enabled: false })).finally(() => {});
    return () => { active = false; };
  }, []);
  useEffect(() => {
    if (!data?.enabled || !data.until) return;
    const timer = window.setInterval(() => {
      const next = Math.max(0, new Date(data.until).getTime() - Date.now());
      setRemaining(next);
      if (next <= 0) window.location.reload();
    }, 1000);
    return () => window.clearInterval(timer);
  }, [data]);
  if (!data?.enabled) return null;
  const seconds = Math.floor(remaining / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#090a0d] px-5 py-12 text-center text-white">
      <div className="pointer-events-none absolute inset-0 opacity-30" style={{ background: "radial-gradient(circle at 50% 35%, rgba(0,130,54,.22), transparent 42%)" }} />
      <section className="relative w-full max-w-xl">
        <a href="/" className="mx-auto mb-10 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[.04] px-4 py-2 transition hover:bg-white/[.08]" aria-label="Youssef Tarek portfolio">
          <img src="/joo.webp" alt="" className="h-10 w-10 rounded-full border border-emerald-500/50 object-cover" />
          <span className="text-left"><span className="block text-sm font-bold tracking-wide">YOUSSEF TAREK</span><span className="mt-0.5 block text-xs text-gray-400">MERN Stack Developer</span></span>
        </a>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-3xl">⚙</div>
        <p className="mt-7 text-xs font-semibold uppercase tracking-[.25em] text-emerald-400">Portfolio maintenance</p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">We’ll be back soon</h1>
        <p className="mx-auto mt-4 max-w-lg leading-7 text-gray-400">{data.message || "Youssef Tarek’s portfolio is getting a few improvements. Please check back soon."}</p>
        <div className="mt-8 grid grid-cols-4 gap-3">{[["Days", days],["Hours", hours],["Minutes", minutes],["Seconds", secs]].map(([label, value]) => <div key={label} className="rounded-xl border border-white/10 bg-white/[.03] p-3 sm:p-5"><div className="text-2xl font-semibold tabular-nums sm:text-3xl">{format(value)}</div><div className="mt-2 text-xs text-gray-500">{label}</div></div>)}</div>
        <p className="mt-6 text-xs text-gray-500">Thank you for your patience.</p>
        <p className="mt-2 text-xs text-gray-700">© {new Date().getFullYear()} Youssef Tarek · Personal Portfolio</p>
      </section>
    </main>
  );
}
