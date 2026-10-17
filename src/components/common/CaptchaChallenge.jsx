import React from "react";

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;
export default function CaptchaChallenge({ onToken, resetKey = 0 }) {
  const [token, setToken] = React.useState("");
  const [checked, setChecked] = React.useState(false);
  const [answer, setAnswer] = React.useState("");
  const [challenge] = React.useState(() => ({ a: 3 + Math.floor(Math.random() * 6), b: 2 + Math.floor(Math.random() * 7) }));
  const widgetId = React.useRef(null);
  const containerRef = React.useRef(null);
  React.useEffect(() => { setToken(""); setChecked(false); setAnswer(""); onToken?.(""); if (SITE_KEY && widgetId.current !== null && window.turnstile) window.turnstile.reset(widgetId.current); }, [resetKey]);
  React.useEffect(() => {
    if (!SITE_KEY || !containerRef.current) return;
    let cancelled = false;
    const render = () => {
      if (cancelled || !window.turnstile || !containerRef.current || widgetId.current !== null) return;
      widgetId.current = window.turnstile.render(containerRef.current, { sitekey: SITE_KEY, theme: "dark", callback: (value) => { setToken(value); onToken?.(value); }, "expired-callback": () => { setToken(""); onToken?.(""); }, "error-callback": () => { setToken(""); onToken?.(""); } });
    };
    if (window.turnstile) render();
    else {
      const existing = document.querySelector('script[data-turnstile="true"]');
      if (existing) existing.addEventListener("load", render, { once: true });
      else { const script = document.createElement("script"); script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"; script.async = true; script.defer = true; script.dataset.turnstile = "true"; script.addEventListener("load", render, { once: true }); document.head.appendChild(script); }
    }
    return () => { cancelled = true; if (widgetId.current !== null && window.turnstile) { window.turnstile.remove(widgetId.current); widgetId.current = null; } };
  }, []);
  if (SITE_KEY) return <div className="my-2 min-h-[65px]" ref={containerRef} aria-label="Security verification" />;
  return <div className="rounded-lg border border-white/10 bg-black/20 p-4">
    <label className="flex cursor-pointer items-center gap-3 text-sm text-gray-300"><input type="checkbox" checked={checked} onChange={(event) => { setChecked(event.target.checked); onToken?.(event.target.checked && Number(answer) === challenge.a + challenge.b ? "local-challenge-passed" : ""); }} className="h-4 w-4 accent-emerald-500" />I’m not a robot</label>
    {checked && <label className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-400">Security check: {challenge.a} + {challenge.b} = <input inputMode="numeric" value={answer} onChange={(event) => { const next = event.target.value; setAnswer(next); onToken?.(checked && Number(next) === challenge.a + challenge.b ? "local-challenge-passed" : ""); }} className="w-20 rounded-md border border-white/15 bg-[#090a0d] px-3 py-2 text-white outline-none focus:border-emerald-500" aria-label="Answer security question" />{answer !== "" && Number(answer) !== challenge.a + challenge.b && <span className="text-red-300">Try again</span>}</label>}
    <p className="mt-2 text-[11px] text-gray-500">For production, configure Cloudflare Turnstile keys to enable server-verified CAPTCHA.</p>
  </div>;
}
