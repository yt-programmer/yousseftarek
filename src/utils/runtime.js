// Maintenance mode is a PRODUCTION feature: it must never lock you out while developing.
// - never on localhost / 127.0.0.1 / *.local / private LAN addresses
// - if VITE_PRODUCTION_URL is set (comma separated, e.g. https://yourdomain.com,https://www.yourdomain.com),
//   it only runs on those addresses (so preview deployments and staging are never put in maintenance either)
const LOCAL =
  /^(localhost|127\.\d+\.\d+\.\d+|0\.0\.0\.0|\[::1\]|::1|.*\.local|.*\.localhost|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)$/i;

export const isLocalHost = (hostname) => LOCAL.test(String(hostname || ""));

const normalize = (value) =>
  String(value || "")
    .trim()
    .replace(/\/+$/, "")
    .toLowerCase();

export const maintenanceAppliesHere = (
  location = window.location,
  configured = import.meta.env.VITE_PRODUCTION_URL,
) => {
  if (isLocalHost(location.hostname)) return false;
  const allowed = String(configured || "")
    .split(",")
    .map(normalize)
    .filter(Boolean);
  if (!allowed.length) return true;
  const origin = normalize(location.origin);
  return allowed.some(
    (entry) => entry === origin || entry === normalize(location.hostname),
  );
};
