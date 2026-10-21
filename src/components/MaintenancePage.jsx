import { useEffect, useState } from "react";

const SITE_URL =
  import.meta.env.VITE_SITE_URL?.trim() || window.location.origin;
const format = (value) => String(value).padStart(2, "0");

export default function MaintenancePage({ data, onExpired }) {
  const offset = data?.serverOffset || 0;
  const untilMs = data?.until ? new Date(data.until).getTime() : 0;
  const left = () =>
    untilMs ? Math.max(0, untilMs - (Date.now() + offset)) : 0;
  const [remaining, setRemaining] = useState(left);

  useEffect(() => {
    if (!data?.enabled || !untilMs) return;
    let lastCheck = 0;
    const timer = window.setInterval(() => {
      const next = Math.max(0, untilMs - (Date.now() + offset));
      setRemaining(next);
      // Countdown finished: ask the server again (at most every 5 s) instead of hard-reloading in a loop.
      if (next <= 0 && Date.now() - lastCheck > 5000) {
        lastCheck = Date.now();
        onExpired?.();
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [data, untilMs, offset, onExpired]);

  if (!data?.enabled) return null;

  const seconds = Math.floor(remaining / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#090a0d] px-5 py-12 text-center text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(circle at 50% 35%, rgba(0,130,54,.22), transparent 42%)",
        }}
      />
      <section className="relative w-full max-w-xl">
        {/* الزر اللي فوق: تم إضافة صورة الـ data.imageUrl بجانب الاسم */}
        <a
          href={SITE_URL}
          className="mx-auto mb-10 inline-flex items-center gap-3.5 rounded-full border border-white/10 bg-white/[.04] p-1.5 pr-5 transition hover:bg-white/[.08]"
          aria-label="Youssef Tarek portfolio"
        >
          {data?.imageUrl && (
            <img
              src={data.imageUrl}
              alt="Youssef Tarek"
              className="h-10 w-10 rounded-full border border-white/10 object-cover"
            />
          )}
          <span className="text-left">
            <span className="block text-sm font-bold tracking-wide">
              YOUSSEF TAREK
            </span>
            <span className="mt-0.5 block text-xs text-gray-400">
              MERN Stack Developer
            </span>
          </span>
        </a>

        {/* مكان الصورة الأصلية في النص أصبح علامة الترس دائماً */}
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl border border-emerald-500/30 bg-emerald-500/10 text-5xl text-emerald-500 shadow-lg shadow-emerald-500/10">
          ⚙
        </div>

        <p className="mt-7 text-xs font-semibold uppercase tracking-[.25em] text-emerald-400">
          Portfolio maintenance
        </p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
          We’ll be back soon
        </h1>
        <p className="mx-auto mt-4 max-w-lg leading-7 text-gray-400">
          {data.message ||
            "Youssef Tarek’s portfolio is getting a few improvements. Please check back soon."}
        </p>
        <div className="mt-8 grid grid-cols-4 gap-3">
          {[
            ["Days", days],
            ["Hours", hours],
            ["Minutes", minutes],
            ["Seconds", secs],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-xl border border-white/10 bg-white/[.03] p-3 sm:p-5"
            >
              <div className="text-2xl font-semibold tabular-nums sm:text-3xl">
                {format(value)}
              </div>
              <div className="mt-2 text-xs text-gray-500">{label}</div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs text-gray-500">
          Thank you for your patience.
        </p>
        <p className="mt-2 text-xs text-gray-700">
          © {new Date().getFullYear()} Youssef Tarek · Personal Portfolio
        </p>
      </section>
    </main>
  );
}
