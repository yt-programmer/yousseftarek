import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaChevronDown, FaSearch } from "react-icons/fa";
import { getCountries, isPossiblePhoneNumber, parsePhoneNumberFromString } from "libphonenumber-js/max";
import Flag from "./Flag";
import { callingCode, detectCountry, splitInternational } from "../../utils/phone";

const POPULAR = ["EG", "SA", "AE", "KW", "QA", "BH", "OM", "JO", "LB", "IQ", "LY", "SD", "MA", "DZ", "TN", "US", "GB", "CA", "DE", "FR"];
const CODES = getCountries();

const makeNames = (locale) => { try { return new Intl.DisplayNames([locale, "en"], { type: "region" }); } catch { return null; } };
const english = makeNames("en");

// Value format: "+20 100 000 0000" (international) — empty string when no number was typed.
export default function PhoneInput({ name, label, required = false, defaultValue = "", value, onChange, onValueChange, placeholder = "Phone number", defaultCountry, id }) {
  const uid = useId();
  const inputId = id || `phone-${uid}`;
  const controlled = value !== undefined;
  const initial = useMemo(() => splitInternational(controlled ? value : defaultValue), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [country, setCountry] = useState(initial?.country || defaultCountry || detectCountry());
  const [national, setNational] = useState(initial?.national || "");
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  const [box, setBox] = useState(null);
  const buttonRef = useRef(null);
  const panelRef = useRef(null);
  const inputRef = useRef(null);
  const lastEmitted = useRef(controlled ? String(value || "") : "");

  const locale = typeof navigator !== "undefined" ? navigator.language || "en" : "en";
  const localNames = useMemo(() => makeNames(locale), [locale]);
  const nameOf = useCallback((code) => localNames?.of(code) || english?.of(code) || code, [localNames]);

  const countries = useMemo(() => {
    const all = CODES.map((code) => ({ code, name: nameOf(code), en: english?.of(code) || code, dial: callingCode(code) }));
    const rank = (code) => { const i = POPULAR.indexOf(code); return i === -1 ? 999 : i; };
    return all.sort((a, b) => rank(a.code) - rank(b.code) || a.name.localeCompare(b.name));
  }, [nameOf]);
  const selected = countries.find((item) => item.code === country) || countries[0];
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^\+/, "");
    if (!q) return countries;
    return countries.filter((item) => item.name.toLowerCase().includes(q) || item.en.toLowerCase().includes(q) || item.code.toLowerCase() === q || item.dial.slice(1).startsWith(q));
  }, [countries, query]);

  const digits = national.replace(/\D/g, "");
  const parsed = digits ? parsePhoneNumberFromString(national, country) : null;
  const output = !digits ? "" : parsed?.isPossible() ? parsed.formatInternational() : `${selected.dial} ${national.trim()}`;
  const invalid = Boolean(digits) && !isPossiblePhoneNumber(national, country);

  // Report the value upward (and remember it, so a controlled parent echoing it back does not reset the field).
  useEffect(() => {
    if (output === lastEmitted.current) return;
    lastEmitted.current = output;
    onChange?.(output);
    onValueChange?.(output);
  }, [output, onChange, onValueChange]);

  // Controlled mode: the parent changed the value (e.g. cleared the form after submit).
  useEffect(() => {
    if (!controlled) return;
    const next = String(value || "");
    if (next === lastEmitted.current) return;
    lastEmitted.current = next;
    const split = splitInternational(next);
    /* eslint-disable react-hooks/set-state-in-effect */
    if (split) { setCountry(split.country); setNational(split.national); } else if (!next) { setNational(""); setTouched(false); }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [controlled, value]);

  useEffect(() => {
    inputRef.current?.setCustomValidity(invalid ? `Enter a valid phone number for ${selected.name}` : "");
  }, [invalid, selected.name]);

  const place = useCallback(() => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    const width = Math.min(340, window.innerWidth - 16);
    const left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8));
    const spaceBelow = window.innerHeight - rect.bottom;
    const up = spaceBelow < 300 && rect.top > spaceBelow;
    setBox({ left, width, ...(up ? { bottom: window.innerHeight - rect.top + 6 } : { top: rect.bottom + 6 }), maxH: Math.max(180, Math.min(320, (up ? rect.top : spaceBelow) - 20)) });
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const close = (event) => { if (!panelRef.current?.contains(event.target) && !buttonRef.current?.contains(event.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    document.addEventListener("touchstart", close);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("touchstart", close); window.removeEventListener("resize", place); window.removeEventListener("scroll", place, true); };
  }, [open, place]);

  const choose = (code) => { setCountry(code); setOpen(false); setQuery(""); requestAnimationFrame(() => inputRef.current?.focus()); };
  const openList = () => { setQuery(""); setActive(Math.max(0, countries.findIndex((item) => item.code === country))); place(); setOpen(true); };
  const onSearchKey = (event) => {
    if (event.key === "ArrowDown") { event.preventDefault(); setActive((i) => Math.min(filtered.length - 1, i + 1)); }
    else if (event.key === "ArrowUp") { event.preventDefault(); setActive((i) => Math.max(0, i - 1)); }
    else if (event.key === "Enter") { event.preventDefault(); if (filtered[active]) choose(filtered[active].code); }
    else if (event.key === "Escape") { event.preventDefault(); setOpen(false); buttonRef.current?.focus(); }
    else if (event.key === "Tab") setOpen(false);
  };
  useEffect(() => { // keep the highlighted option visible
    if (open) panelRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView?.({ block: "nearest" });
  }, [active, open]);

  const typed = (event) => {
    let text = event.target.value.replace(/^00/, "+");
    if (text.startsWith("+")) { // pasted an international number: pick the country automatically
      const split = splitInternational(text);
      if (split) { setCountry(split.country); setNational(split.national); return; }
    }
    setNational(text.replace(/[^\d+\s().-]/g, ""));
  };
  const tidy = () => { setTouched(true); if (parsed?.isPossible()) setNational(parsed.formatNational()); };

  return <div className="grid gap-2 text-sm text-gray-300">
    {label && <label htmlFor={inputId}>{label}{required ? " *" : ""}</label>}
    <div dir="ltr" className={`flex min-w-0 rounded-lg border bg-black/30 transition focus-within:border-[var(--color-primary)] ${touched && invalid ? "border-red-500/70" : "border-[var(--color-primary)]/50"}`}>
      <button ref={buttonRef} type="button" aria-haspopup="listbox" aria-expanded={open} aria-label={`Country: ${selected.name} ${selected.dial}. Change country`} onClick={() => (open ? setOpen(false) : openList())} className="flex shrink-0 items-center gap-2 rounded-l-lg border-r border-[var(--color-primary)]/25 bg-[#101210] px-3 text-xs text-gray-200 outline-none transition hover:bg-white/5 focus-visible:bg-white/10">
        <Flag code={selected.code} /><span className="tabular-nums">{selected.dial}</span><FaChevronDown className={`text-[9px] text-gray-500 transition ${open ? "rotate-180" : ""}`} />
      </button>
      <input ref={inputRef} id={inputId} className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-gray-500" type="tel" inputMode="tel" autoComplete="tel-national" value={national} onChange={typed} onBlur={tidy} placeholder={placeholder} required={required} aria-invalid={touched && invalid ? "true" : undefined} aria-describedby={touched && invalid ? `${inputId}-err` : undefined} />
      {name && <input type="hidden" name={name} value={output} />}
    </div>
    {touched && invalid && <p id={`${inputId}-err`} role="alert" className="text-xs text-red-400">Check the number — it doesn’t look valid for {selected.name}.</p>}
    {open && box && createPortal(
      <div ref={panelRef} dir="ltr" style={{ position: "fixed", left: box.left, width: box.width, top: box.top, bottom: box.bottom, zIndex: 100000 }} className="overflow-hidden rounded-xl border border-[var(--color-primary)]/40 bg-[#0f120f] text-gray-200 shadow-2xl shadow-black/60">
        <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2.5"><FaSearch className="shrink-0 text-xs text-gray-500" /><input autoFocus value={query} onChange={(event) => { setQuery(event.target.value); setActive(0); }} onKeyDown={onSearchKey} placeholder="Search country or code" aria-label="Search country" className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-500" /></div>
        <ul role="listbox" aria-label="Countries" style={{ maxHeight: box.maxH }} className="overflow-y-auto overscroll-contain py-1">
          {filtered.length === 0 && <li className="px-4 py-6 text-center text-sm text-gray-500">No country found</li>}
          {filtered.map((item, index) => <li key={item.code} role="option" aria-selected={item.code === country} data-index={index} onMouseEnter={() => setActive(index)} onMouseDown={(event) => event.preventDefault()} onClick={() => choose(item.code)} className={`flex cursor-pointer items-center gap-3 px-3 py-2 text-sm ${index === active ? "bg-white/10" : ""} ${item.code === country ? "text-[var(--color-primary)]" : ""}`}>
            <Flag code={item.code} /><span className="min-w-0 flex-1 truncate">{item.name}</span><span className="shrink-0 text-xs tabular-nums text-gray-400">{item.dial}</span>
          </li>)}
        </ul>
      </div>, document.body)}
  </div>;
}
