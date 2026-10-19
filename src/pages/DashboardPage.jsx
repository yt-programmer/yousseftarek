import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FaBars,
  FaChartLine,
  FaChevronDown,
  FaChevronRight,
  FaExternalLinkAlt,
  FaHome,
  FaLayerGroup,
  FaSignOutAlt,
  FaTimes,
  FaTools,
} from "react-icons/fa";
import WorksDash from "../components/Dashboard/WorksDash";
import TestimonialsDash from "../components/Dashboard/TestimonialsDash";
import MessagesInbox from "../components/Dashboard/MessagesInbox";
import DashboardOverview from "../components/Dashboard/DashboardOverview";
import {
  defaultSiteContent,
  useSiteContent,
} from "../context/SiteContentContext";

const API = `${import.meta.env.VITE_API}/api/site-content`;
const SECTIONS = [
  ["hero", "Hero"],
  ["homeAbout", "Home — About"],
  ["aboutPage", "About page"],
  ["projects", "Works & Read All"],
  ["testimonials", "Testimonials labels"],
  ["skills", "Skills"],
  ["contactSection", "Home — Contact"],
  ["contactPage", "Contact page"],
  ["socials", "Social links"],
  ["site", "Header & Footer"],
  ["navigation", "Navigation labels"],
  ["seo", "SEO"],
];
const titleFor = (path) => {
  if (path === "/dashboard/overview" || path === "/dashboard")
    return "Overview";
  if (path === "/dashboard/works") return "Projects";
  if (path === "/dashboard/testimonials") return "Testimonials";
  if (path === "/dashboard/messages") return "Messages inbox";
  if (path === "/dashboard/analytics") return "Analytics";
  const match = path.match(/^\/dashboard\/content\/([^/]+)/);
  return SECTIONS.find(([key]) => key === match?.[1])?.[1] || "Content editor";
};
const isObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);
const labelize = (key) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/^./, (char) => char.toUpperCase());
const updateAtPath = (source, path, value) => {
  if (!path.length) return value;
  const [head, ...tail] = path;
  if (Array.isArray(source))
    return source.map((item, index) =>
      index === head ? updateAtPath(item, tail, value) : item,
    );
  return { ...source, [head]: updateAtPath(source?.[head], tail, value) };
};

function ContentEditor({ sectionKey }) {
  const { content, setContent, refresh } = useSiteContent();
  const [draft, setDraft] = useState(
    content[sectionKey] ?? defaultSiteContent[sectionKey],
  );
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const section = content[sectionKey] ?? defaultSiteContent[sectionKey];
  useEffect(() => setDraft(section), [sectionKey, section]);

  const update = (path, value) =>
    setDraft((current) => updateAtPath(current, path, value));
  const uploadImageForField = async (path, file) => {
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 8 * 1024 * 1024) {
      toast.error("Choose an image smaller than 8 MB");
      return;
    }
    setUploadingImage(true);
    try {
      const data = new FormData();
      data.append("file", file);
      data.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "portfolio",
      );
      const cloud = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dpzhlzcut";
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloud}/image/upload`,
        data,
      );
      update(path, response.data.secure_url);
      toast.success("Image uploaded. Save changes to publish it.");
    } catch (error) {
      toast.error(
        error.response?.data?.error?.message ||
          "Image upload failed. Check Cloudinary settings.",
      );
    } finally {
      setUploadingImage(false);
    }
  };
  const moveItem = (path, array, index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= array.length) return;
    const next = [...array];
    [next[index], next[target]] = [next[target], next[index]];
    update(
      path,
      next.map((item, i) =>
        item && typeof item === "object" && "order" in item
          ? { ...item, order: i + 1 }
          : item,
      ),
    );
  };
  const addItem = (path, array) => {
    const defaultArray = path.reduce(
      (value, key) => value?.[key],
      defaultSiteContent[sectionKey],
    );
    const template = array.length
      ? array[array.length - 1]
      : Array.isArray(defaultArray)
        ? defaultArray[0]
        : "";
    const copy =
      template && typeof template === "object"
        ? JSON.parse(JSON.stringify(template))
        : template;
    update(path, [...array, copy]);
  };
  const save = async (event) => {
    event.preventDefault();
    if (
      (isObject(section) && !isObject(draft)) ||
      (Array.isArray(section) && !Array.isArray(draft)) ||
      (typeof section === "string" && typeof draft !== "string")
    ) {
      toast.error("The content structure does not match this section.");
      return;
    }
    const next = { ...content, [sectionKey]: draft };
    setSaving(true);
    try {
      const response = await axios.put(
        API,
        { content: next },
        { withCredentials: true },
      );
      const saved = response.data?.data?.content || next;
      setContent(saved);
      setDraft(saved[sectionKey]);
      toast.success("Changes saved successfully");
      await refresh();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Could not save content. Check API connection and login session.",
      );
    } finally {
      setSaving(false);
    }
  };

  const renderFields = (value, path = [], keyName = sectionKey) => {
    if (Array.isArray(value)) {
      return (
        <div className="space-y-3">
          {value.map((item, index) => (
            <div
              key={`${path.join(".")}-${index}`}
              className="rounded-lg border border-white/10 bg-black/20 p-4"
            >
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                  {labelize(keyName)} #{index + 1}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveItem(path, value, index, -1)}
                    className="rounded-md border border-white/10 px-2.5 py-1.5 text-xs text-gray-300 disabled:opacity-30"
                  >
                    ↑ Move up
                  </button>
                  <button
                    type="button"
                    disabled={index === value.length - 1}
                    onClick={() => moveItem(path, value, index, 1)}
                    className="rounded-md border border-white/10 px-2.5 py-1.5 text-xs text-gray-300 disabled:opacity-30"
                  >
                    ↓ Move down
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      update(
                        path,
                        value
                          .filter((_, itemIndex) => itemIndex !== index)
                          .map((entry, i) =>
                            entry &&
                            typeof entry === "object" &&
                            "order" in entry
                              ? { ...entry, order: i + 1 }
                              : entry,
                          ),
                      )
                    }
                    className="rounded-md border border-red-500/20 px-2.5 py-1.5 text-xs text-red-300 hover:bg-red-500/10"
                  >
                    Remove
                  </button>
                </div>
              </div>
              {isObject(item) || Array.isArray(item) ? (
                renderFields(item, [...path, index], keyName)
              ) : (
                <input
                  value={item ?? ""}
                  onChange={(event) =>
                    update([...path, index], event.target.value)
                  }
                  className="w-full rounded-lg border border-white/10 bg-[#090a0d] px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500"
                />
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              if (
                sectionKey === "contactPage" &&
                path[path.length - 1] === "formFields"
              ) {
                const nextOrder = value.length + 1;
                update(path, [
                  ...value,
                  {
                    key: `field${nextOrder}`,
                    label: `New field ${nextOrder}`,
                    type: "text",
                    required: false,
                    order: nextOrder,
                  },
                ]);
              } else addItem(path, value);
            }}
            className="rounded-lg border border-dashed border-white/20 px-3 py-2 text-sm text-gray-300 hover:border-emerald-500/50 hover:text-emerald-300"
          >
            + Add {labelize(keyName)}
          </button>
        </div>
      );
    }
    if (isObject(value)) {
      return (
        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(value).map(([key, child]) => (
            <div
              key={[...path, key].join(".")}
              className={
                typeof child === "string" &&
                (child.length > 140 || /description|skills|keywords/i.test(key))
                  ? "md:col-span-2"
                  : ""
              }
            >
              <label className="mb-1.5 block text-xs font-medium text-gray-400">
                {labelize(key)}
                {/url|photo|image/i.test(key) ? (
                  <span className="ml-2 text-[10px] text-gray-600">
                    HTTPS URL or local path
                  </span>
                ) : null}
              </label>
              {isObject(child) || Array.isArray(child) ? (
                renderFields(child, [...path, key], key)
              ) : typeof child === "boolean" ? (
                <label className="flex items-center gap-3 rounded-lg border border-white/10 bg-[#090a0d] px-3 py-3 text-sm text-gray-200">
                  <input
                    type="checkbox"
                    checked={child}
                    onChange={(event) =>
                      update([...path, key], event.target.checked)
                    }
                    className="accent-emerald-500"
                  />
                  {child ? "Required" : "Optional"}
                </label>
              ) : key === "type" && sectionKey === "contactPage" ? (
                <select
                  value={child || "text"}
                  onChange={(event) =>
                    update([...path, key], event.target.value)
                  }
                  className="w-full rounded-lg border border-white/10 bg-[#090a0d] px-3 py-2.5 text-sm text-white"
                >
                  <option value="text">Text</option>
                  <option value="email">Email</option>
                  <option value="tel">Phone</option>
                  <option value="url">Website URL</option>
                  <option value="textarea">Long text</option>
                </select>
              ) : typeof child === "number" ? (
                <input
                  type="number"
                  value={child}
                  onChange={(event) =>
                    update([...path, key], Number(event.target.value))
                  }
                  className="w-full rounded-lg border border-white/10 bg-[#090a0d] px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500"
                />
              ) : typeof child === "string" &&
                (child.length > 140 ||
                  /description|skills|keywords/i.test(key)) ? (
                <textarea
                  rows={Math.min(8, Math.max(3, Math.ceil(child.length / 100)))}
                  value={child}
                  onChange={(event) =>
                    update([...path, key], event.target.value)
                  }
                  className="w-full resize-y rounded-lg border border-white/10 bg-[#090a0d] px-3 py-2.5 text-sm leading-6 text-white outline-none focus:border-emerald-500"
                />
              ) : (
                <>
                  <input
                    value={child ?? ""}
                    onChange={(event) =>
                      update([...path, key], event.target.value)
                    }
                    className="w-full rounded-lg border border-white/10 bg-[#090a0d] px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500"
                  />
                  {/(image|photo|favicon)/i.test(key) && (
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <label className="cursor-pointer rounded-lg border border-emerald-500/30 px-3 py-2 text-xs text-emerald-300 hover:bg-emerald-500/10">
                        {uploadingImage ? "Uploading…" : "Upload image"}
                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploadingImage}
                          className="hidden"
                          onChange={(event) =>
                            uploadImageForField(
                              [...path, key],
                              event.target.files?.[0],
                            )
                          }
                        />
                      </label>
                      {/^https:\/\//i.test(child || "") && (
                        <img
                          src={child}
                          alt="Preview"
                          className="h-10 w-10 rounded object-cover"
                        />
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      );
    }
    return (
      <input
        value={value ?? ""}
        onChange={(event) => update(path, event.target.value)}
        className="w-full rounded-lg border border-white/10 bg-[#090a0d] px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500"
      />
    );
  };

  return (
    <div className="rounded-xl border border-white/10 bg-[#111318] p-5 shadow-xl md:p-7">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[.2em] text-emerald-400">
            Content management
          </p>
          <h2 className="mt-2 text-2xl font-semibold">
            {titleFor(`/dashboard/content/${sectionKey}`)}
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Edit this section’s content. The public website layout and styling
            remain unchanged.
          </p>
        </div>
        <span className="w-fit rounded-full border border-white/10 px-3 py-1 text-xs text-gray-400">
          Editable fields
        </span>
      </div>
      <form onSubmit={save} className="space-y-6">
        {renderFields(draft)}
        <div className="flex flex-wrap gap-3 border-t border-white/10 pt-5">
          <button
            disabled={saving}
            type="submit"
            className="rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-wait disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
          <button
            type="button"
            onClick={() => setDraft(defaultSiteContent[sectionKey])}
            className="rounded-lg border border-white/15 px-5 py-3 text-sm text-gray-300 hover:bg-white/5"
          >
            Restore default draft
          </button>
        </div>
        {sectionKey === "socials" && (
          <p className="text-xs leading-5 text-gray-500">
            Use platform keys facebook, whatsapp, tiktok, telegram, or linkedin
            to display the matching icon. Social URLs must use HTTPS.
          </p>
        )}
      </form>
    </div>
  );
}

function AnalyticsPanel() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReport = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/api/dashboard/overview`,
        { withCredentials: true },
      );
      setReport(response.data?.data || null);
    } catch (err) {
      const status = err.response?.status;
      setError(
        status === 503
          ? "Google Analytics is not configured on the backend. Add GA4_PROPERTY_ID and GA4_SERVICE_ACCOUNT_KEY to the backend environment, then restart the server."
          : status === 401
            ? "Your session has expired. Sign in again to view analytics."
            : err.response?.data?.message ||
              "Could not load Google Analytics data. Check the backend configuration and permissions.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  const cards = report
    ? [
        { label: "Active users", value: report.activeUsers },
        { label: "Sessions", value: report.sessions },
        { label: "Page views", value: report.pageViews },
      ]
    : [];
  const maxViews = Math.max(
    1,
    ...(report?.daily || []).map((item) => item.pageViews),
  );

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Analytics</h2>
          <p className="mt-1 text-sm text-gray-400">
            Google Analytics 4 · Last 28 days
          </p>
        </div>
        <button
          onClick={loadReport}
          disabled={loading}
          className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 transition hover:bg-white/5 disabled:opacity-50"
        >
          {loading ? "Refreshing…" : "Refresh data"}
        </button>
      </div>
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm leading-6 text-amber-200"
        >
          {error}
        </div>
      )}
      {loading && !report ? (
        <div className="rounded-xl border border-white/10 bg-[#111318] p-6 text-sm text-gray-400">
          Loading Google Analytics data…
        </div>
      ) : null}
      {report && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            {cards.map((card) => (
              <div
                key={card.label}
                className="rounded-xl border border-white/10 bg-[#111318] p-5"
              >
                <p className="text-sm text-gray-400">{card.label}</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight">
                  {Number(card.value || 0).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-white/10 bg-[#111318] p-5 sm:p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold">Daily traffic</h3>
              <span className="text-xs text-gray-500">
                Page views · Last 28 days
              </span>
            </div>
            {report.daily?.length ? (
              <div className="space-y-3">
                {report.daily.map((day) => (
                  <div
                    key={day.date}
                    className="grid grid-cols-[76px_minmax(0,1fr)_48px] items-center gap-3 text-xs"
                  >
                    <span className="text-gray-500">{day.date.slice(5)}</span>
                    <div className="h-2 overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full bg-emerald-400"
                        style={{
                          width: `${Math.max(day.pageViews > 0 ? 2 : 0, (day.pageViews / maxViews) * 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-right tabular-nums text-gray-300">
                      {day.pageViews.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">
                No traffic data has been recorded for this period yet.
              </p>
            )}
          </div>
          <p className="text-xs text-gray-600">
            {report.fetchedAt
              ? `Last updated ${new Date(report.fetchedAt).toLocaleString()}`
              : ""}
            . Data is provided by Google Analytics 4.
          </p>
        </>
      )}
    </div>
  );
}

const DashboardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [contentOpen, setContentOpen] = useState(true);
  const { content } = useSiteContent();
  const path = location.pathname;
  const activeSection = path.match(/^\/dashboard\/content\/([^/]+)/)?.[1];
  useEffect(() => {
    setSidebarOpen(false);
  }, [path]);
  if (path === "/dashboard")
    return <Navigate to="/dashboard/overview" replace />;
  if (path === "/dashboard/security")
    return <Navigate to="/dashboard/overview" replace />;
  const logout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API}/api/auth/logout`,
        {},
        { withCredentials: true },
      );
    } catch {}
    navigate("/auth/login", { replace: true });
  };
  const navItem = (href, label, Icon) => (
    <Link
      key={href}
      to={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${path === href ? "bg-emerald-500/15 text-emerald-300" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
    >
      <Icon className="shrink-0" />
      <span>{label}</span>
    </Link>
  );
  return (
    <div
      className="min-h-screen bg-[#090a0d] text-white"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {sidebarOpen && (
        <button
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col border-r border-white/10 bg-[#0e1014] transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex h-[72px] items-center justify-between border-b border-white/10 px-5">
          <Link to="/dashboard/overview" className="font-bold tracking-wide">
            YT <span className="text-emerald-400">/ CMS</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-400 lg:hidden"
            aria-label="Close menu"
          >
            <FaTimes />
          </button>
        </div>
        <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.22em] text-gray-600">
            Workspace
          </p>
          <div className="space-y-1">
            {navItem("/dashboard/overview", "Overview", FaHome)}
            {navItem("/dashboard/works", "Projects", FaLayerGroup)}
            {navItem("/dashboard/testimonials", "Testimonials", FaTools)}
            {navItem("/dashboard/messages", "Messages inbox", FaTools)}
            {navItem("/dashboard/analytics", "Analytics", FaChartLine)}
          </div>
          <div className="mt-5">
            <div className="flex items-center rounded-lg text-sm text-gray-300 hover:bg-white/5">
              <Link
                to="/dashboard/content/hero"
                onClick={() => setContentOpen(true)}
                className={`flex min-w-0 flex-1 items-center gap-3 rounded-l-lg px-3 py-2.5 ${activeSection ? "text-emerald-300" : "hover:text-white"}`}
              >
                <FaLayerGroup className="shrink-0 text-emerald-400" />
                <span>Page content</span>
              </Link>
              <button
                aria-label="Toggle content sections"
                onClick={() => setContentOpen((open) => !open)}
                className="rounded-r-lg px-3 py-2.5 text-gray-500 hover:text-white"
              >
                {contentOpen ? (
                  <FaChevronDown size={12} />
                ) : (
                  <FaChevronRight size={12} />
                )}
              </button>
            </div>
            {contentOpen && (
              <div className="ml-3 mt-1 space-y-1 border-l border-white/10 pl-3">
                {SECTIONS.map(([key, label]) => (
                  <Link
                    key={key}
                    to={`/dashboard/content/${key}`}
                    className={`block rounded-md px-3 py-2 text-xs transition ${activeSection === key ? "bg-emerald-500/15 text-emerald-300" : "text-gray-500 hover:bg-white/5 hover:text-white"}`}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>
        <div className="border-t border-white/10 p-4">
          <Link
            to="/"
            target="_blank"
            className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-400 hover:bg-white/5 hover:text-white"
          >
            <FaExternalLinkAlt />
            View portfolio
          </Link>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-300 hover:bg-red-500/10"
          >
            <FaSignOutAlt />
            Log out
          </button>
        </div>
      </aside>
      <div className="min-h-screen lg:pl-[270px]">
        <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-white/10 bg-[#090a0d]/95 px-4 backdrop-blur md:px-7">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg border border-white/10 p-2 text-gray-300 lg:hidden"
              aria-label="Open menu"
            >
              <FaBars />
            </button>
            <div className="min-w-0">
              <p className="truncate text-xs text-gray-500">
                Dashboard / {titleFor(path)}
              </p>
              <h1 className="truncate text-lg font-semibold">
                {titleFor(path)}
              </h1>
            </div>
          </div>
          <div className="hidden max-w-[45%] truncate text-xs text-gray-500 sm:block">
            {content.site.name} · Content workspace
          </div>
        </header>
        <main className="min-h-[calc(100vh-72px)] overflow-x-hidden p-4 md:p-7 xl:p-9">
          {path === "/dashboard/overview" && (
            <div className="mx-auto max-w-6xl">
              <DashboardOverview />
            </div>
          )}
          {activeSection && SECTIONS.some(([key]) => key === activeSection) && (
            <div className="mx-auto max-w-5xl">
              <ContentEditor key={activeSection} sectionKey={activeSection} />
            </div>
          )}
          {path === "/dashboard/works" && (
            <div className="mx-auto max-w-6xl">
              <WorksDash />
            </div>
          )}
          {path === "/dashboard/testimonials" && (
            <div className="mx-auto max-w-6xl">
              <TestimonialsDash />
            </div>
          )}
          {path === "/dashboard/messages" && (
            <div className="mx-auto max-w-6xl">
              <MessagesInbox />
            </div>
          )}
          {path === "/dashboard/analytics" && <AnalyticsPanel />}
          {!activeSection &&
            ![
              "/dashboard/overview",
              "/dashboard/works",
              "/dashboard/testimonials",
              "/dashboard/messages",
              "/dashboard/analytics",
            ].includes(path) && (
              <div className="rounded-xl border border-white/10 bg-[#111318] p-6">
                <p className="text-gray-300">
                  Choose a section from the sidebar.
                </p>
              </div>
            )}
        </main>
      </div>
    </div>
  );
};
export default DashboardPage;
