import { useEffect, useState } from "react";

// Real SVG flags (emoji flags do not render on Windows). Each file is loaded lazily, only when a country is shown.
const loaders = import.meta.glob("/node_modules/country-flag-icons/3x2/*.svg", { query: "?url", import: "default" });
const cache = new Map();

export default function Flag({ code, className = "h-4 w-6" }) {
  const [src, setSrc] = useState(() => cache.get(code) || "");
  useEffect(() => {
    let active = true;
    const cached = cache.get(code);
    if (cached) { setSrc(cached); return undefined; } // eslint-disable-line react-hooks/set-state-in-effect
    const load = loaders[`/node_modules/country-flag-icons/3x2/${code}.svg`];
    if (load) load().then((url) => { cache.set(code, url); if (active) setSrc(url); }).catch(() => {});
    return () => { active = false; };
  }, [code]);
  return src
    ? <img src={src} alt="" aria-hidden="true" draggable="false" className={`${className} shrink-0 rounded-[2px] object-cover shadow-[0_0_0_1px_rgba(255,255,255,.18)]`} />
    : <span aria-hidden="true" className={`${className} inline-block shrink-0 rounded-[2px] bg-white/10`} />;
}
