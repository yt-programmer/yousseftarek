// Only http(s) links (and mailto:/tel: when allowed) may ever be rendered into an <a href>.
// Stops "javascript:" / "data:" URLs that might already be stored in the database from running on click.
export const safeHref = (value, { allowMailto = false } = {}) => {
  const text = String(value ?? "").trim();
  if (!text) return "";
  try {
    const url = new URL(text);
    if (url.protocol === "https:" || url.protocol === "http:") return text;
    if (allowMailto && (url.protocol === "mailto:" || url.protocol === "tel:")) return text;
  } catch {
    // not an absolute URL
  }
  return /^\/(?!\/)[^\\\s]*$/.test(text) ? text : "";
};
