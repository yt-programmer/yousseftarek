import { useEffect, useMemo, useState } from "react";

const FALLBACK_COUNTRIES = [
  { name: "Egypt", code: "EG", dial: "+20", flag: "🇪🇬" },
  { name: "United States", code: "US", dial: "+1", flag: "🇺🇸" },
  { name: "United Kingdom", code: "GB", dial: "+44", flag: "🇬🇧" },
  { name: "Saudi Arabia", code: "SA", dial: "+966", flag: "🇸🇦" },
  { name: "United Arab Emirates", code: "AE", dial: "+971", flag: "🇦🇪" },
  { name: "Germany", code: "DE", dial: "+49", flag: "🇩🇪" },
  { name: "France", code: "FR", dial: "+33", flag: "🇫🇷" },
  { name: "India", code: "IN", dial: "+91", flag: "🇮🇳" },
  { name: "Canada", code: "CA", dial: "+1", flag: "🇨🇦" },
  { name: "Kuwait", code: "KW", dial: "+965", flag: "🇰🇼" },
  { name: "Qatar", code: "QA", dial: "+974", flag: "🇶🇦" },
  { name: "Jordan", code: "JO", dial: "+962", flag: "🇯🇴" },
];
const toCountry = (country) => {
  const root = country.idd?.root || "";
  const suffixes = country.idd?.suffixes || [];
  const suffix = suffixes.length === 1 ? suffixes[0] : "";
  const dial = `${root}${suffix}`;
  if (!country.cca2 || !dial || dial === "+") return null;
  return { name: country.name?.common || country.cca2, code: country.cca2, dial, flag: country.flag || "🌐" };
};

export default function PhoneInput({ name, label, required = false, defaultValue = "", placeholder = "Phone number", onValueChange }) {
  const [countries, setCountries] = useState(FALLBACK_COUNTRIES);
  const [countryCode, setCountryCode] = useState("EG");
  const [number, setNumber] = useState(String(defaultValue || ""));
  const selected = useMemo(() => countries.find((country) => country.code === countryCode) || countries[0], [countries, countryCode]);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    fetch("https://cdn.jsdelivr.net/npm/world-countries@5.1.0/countries.json", {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Country list request failed (${response.status})`);
        return response.json();
      })
      .then((items) => {
        if (!Array.isArray(items)) throw new Error("Country list response was invalid");
        const parsed = items.map((country) => {
          if (country.cca2 && Array.isArray(country.callingCodes) && country.callingCodes.length) {
            const dial = country.callingCodes[0];
            return dial ? { name: country.name?.common || country.cca2, code: country.cca2, dial, flag: country.flag || "🌐" } : null;
          }
          return toCountry(country);
        }).filter(Boolean).sort((a, b) => a.name.localeCompare(b.name));
        if (active && parsed.length) {
          const unique = [...new Map(parsed.map((country) => [country.code, country])).values()];
          setCountries(unique);
          setCountryCode((current) => unique.some((country) => country.code === current) ? current : (unique.some((country) => country.code === "EG") ? "EG" : unique[0].code));
        }
      })
      .catch(() => {})
      .finally(() => clearTimeout(timeout));
    return () => { active = false; clearTimeout(timeout); controller.abort(); };
  }, []);

  useEffect(() => {
    const digits = number.replace(/\D/g, "");
    onValueChange?.(digits ? `${selected.dial} ${number}` : "");
  }, [number, selected, onValueChange]);

  return <label className="grid gap-2 text-sm text-gray-300">
    {label && <span>{label}{required ? " *" : ""}</span>}
    <span dir="ltr" className="flex min-w-0 overflow-hidden rounded-lg border border-[var(--color-primary)]/50 bg-black/30 transition focus-within:border-[var(--color-primary)]">
      <select aria-label="Country calling code" value={countryCode} onChange={(event) => setCountryCode(event.target.value)} className="w-[112px] shrink-0 border-r border-[var(--color-primary)]/25 bg-[#101210] px-2 text-xs text-gray-200 outline-none sm:w-[136px]" >
        {countries.map((country) => <option key={`${country.code}-${country.dial}`} value={country.code}>{country.flag} {country.dial}</option>)}
      </select>
      <input className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-gray-500" type="tel" inputMode="tel" autoComplete="tel-national" aria-label="Phone number without country code" value={number} onChange={(event) => setNumber(event.target.value)} placeholder={placeholder} required={required} />
      <input type="hidden" name={name} value={number.replace(/\D/g, "") ? `${selected.dial} ${number}` : ""} />
    </span>
  </label>;
}
