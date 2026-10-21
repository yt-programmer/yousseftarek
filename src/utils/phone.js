import { getCountries, getCountryCallingCode, parsePhoneNumberFromString } from "libphonenumber-js/max";

export const DEFAULT_COUNTRY = "EG";
const SUPPORTED = new Set(getCountries());

// Default country: Egypt. Visitors whose browser is set to a regional Arabic language (ar-SA, ar-AE…) get their own country.
// (English locales such as en-US are NOT used – many Arab users have an English browser.)
export const detectCountry = () => {
  try {
    for (const lang of navigator.languages || [navigator.language]) {
      const [language, region] = String(lang || "").split("-");
      if (language.toLowerCase() === "ar" && region && SUPPORTED.has(region.toUpperCase())) return region.toUpperCase();
    }
  } catch {
    // no navigator (tests / SSR)
  }
  return DEFAULT_COUNTRY;
};

export const callingCode = (country) => `+${getCountryCallingCode(country)}`;

// Parses "+20 100 000 0000" (or a legacy "+20 0100…" value) into { country, national }.
export const splitInternational = (value) => {
  const parsed = parsePhoneNumberFromString(String(value || ""));
  if (parsed?.country) return { country: parsed.country, national: parsed.formatNational() };
  return null;
};

// Digits for https://wa.me/<digits> — works for both new values (+20 100 …) and old ones stored as "+20 0100…".
export const toWhatsAppDigits = (phone) => {
  const text = String(phone || "").trim();
  if (!text) return "";
  const parsed = parsePhoneNumberFromString(text);
  if (parsed?.number) return parsed.number.replace(/\D/g, "");
  let digits = text.replace(/\D/g, "");
  if (text.startsWith("00")) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) digits = `20${digits.slice(1)}`; // legacy Egyptian local number
  return digits.length >= 8 ? digits : "";
};
