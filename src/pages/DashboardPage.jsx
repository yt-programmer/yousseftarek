import { useCallback, useEffect, useState } from "react";
import {
  Link,
  Navigate,
  Route,
  Routes,
  useBlocker,
  useLocation,
  useNavigate,
  useParams,
} from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FaBars,
  FaChevronDown,
  FaChevronRight,
  FaCog,
  FaCommentDots,
  FaEnvelope,
  FaExternalLinkAlt,
  FaHome,
  FaLayerGroup,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";
import WorksDash from "../components/Dashboard/WorksDash";
import TestimonialsDash from "../components/Dashboard/TestimonialsDash";
import MessagesInbox from "../components/Dashboard/MessagesInbox";
import DashboardOverview from "../components/Dashboard/DashboardOverview";
import MaintenanceSettings from "../components/Dashboard/MaintenanceSettings";
import {
  defaultSiteContent,
  useSiteContent,
} from "../context/SiteContentContext";
import ImageUploader from "../components/common/ImageUploader";
import {
  ConfirmProvider,
  useConfirm,
} from "../components/Dashboard/ConfirmDialog";
import { btn } from "../components/Dashboard/ui";

const API = `${import.meta.env.VITE_API}/api/site-content`;
const SECTIONS = [
  ["hero", "Hero"],
  ["about", "About"],
  ["works", "Works"],
  ["skills", "Skills"],
  ["contact", "Contact"],
  ["testimonials", "Testimonials page"],
  ["aboutPage", "About page"],
  ["contactPage", "Contact page"],
  ["socials", "Social links"],
  ["navigation", "Navigation labels"],
  ["site", "Header & Footer"],
  ["seo", "SEO"],
];
const titleFor = (rawPath) => {
  const path = rawPath.replace(/\/+$/, "") || "/";
  if (path === "/dashboard/overview" || path === "/dashboard")
    return "Overview";
  if (path === "/dashboard/works") return "Projects";
  if (path === "/dashboard/testimonials") return "Testimonials";
  if (path === "/dashboard/messages") return "Messages inbox";
  if (path === "/dashboard/settings") return "Website settings";
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
  const [busyKeys, setBusyKeys] = useState([]);
  const confirm = useConfirm();
  const section = content[sectionKey] ?? defaultSiteContent[sectionKey];
  useEffect(() => setDraft(section), [sectionKey, section]);

  const update = (path, value) =>
    setDraft((current) => updateAtPath(current, path, value));
  const setFieldBusy = (key) => (busy) =>
    setBusyKeys((current) =>
      busy
        ? current.includes(key)
          ? current
          : [...current, key]
        : current.includes(key)
          ? current.filter((item) => item !== key)
          : current,
    );
  const uploading = busyKeys.length > 0;
  const dirty = JSON.stringify(draft) !== JSON.stringify(section);

  // Warn before losing unsaved edits (closing the tab, or switching to another dashboard page).
  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      dirty && currentLocation.pathname !== nextLocation.pathname,
  );
  useEffect(() => {
    if (blocker.state !== "blocked") return;
    confirm({
      title: "Discard unsaved changes?",
      message:
        "You edited this section but did not save. If you leave now, those edits are lost.",
      confirmText: "Discard changes",
      cancelText: "Keep editing",
    }).then((leave) => (leave ? blocker.proceed() : blocker.reset()));
  }, [blocker, confirm]);
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
              ) : /(image|photo|favicon)/i.test(key) ? (
                <ImageUploader
                  value={child || ""}
                  onChange={(url) => update([...path, key], url)}
                  onBusyChange={setFieldBusy([...path, key].join("."))}
                  previewClass="max-h-40"
                />
              ) : (
                <input
                  value={child ?? ""}
                  onChange={(event) =>
                    update([...path, key], event.target.value)
                  }
                  className="w-full rounded-lg border border-white/10 bg-[#090a0d] px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500"
                />
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
            disabled={saving || uploading || !dirty}
            type="submit"
            className={btn.primary}
          >
            {saving
              ? "Saving…"
              : uploading
                ? "Uploading image…"
                : "Save changes"}
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={async () => {
              if (
                await confirm({
                  title: "Restore the default text?",
                  message:
                    "This replaces what is in the form with the built-in defaults. Nothing is published until you press Save.",
                  confirmText: "Restore defaults",
                  tone: "neutral",
                })
              )
                setDraft(defaultSiteContent[sectionKey]);
            }}
            className={btn.ghost}
          >
            Restore default draft
          </button>
          {dirty && (
            <span className="self-center text-xs text-amber-300">
              Unsaved changes
            </span>
          )}
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

const normalize = (path) => path.replace(/\/+$/, "") || "/";

function ContentRoute() {
  const { section } = useParams();
  if (!SECTIONS.some(([key]) => key === section))
    return <Navigate to="/dashboard/content/hero" replace />;
  return (
    <div className="mx-auto max-w-5xl">
      <ContentEditor key={section} sectionKey={section} />
    </div>
  );
}

const Wide = ({ children }) => (
  <div className="mx-auto max-w-6xl">{children}</div>
);

// مكون يرجع الصفحة للأعلى عند تغيير أي مسار داخل الداشبورد
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const DashboardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openAtPath, setOpenAtPath] = useState(null);
  const [contentOpen, setContentOpen] = useState(true);
  const [badges, setBadges] = useState({ messages: 0, reviews: 0 });
  const { content } = useSiteContent();
  const path = normalize(location.pathname);
  // the mobile sidebar closes by itself whenever the page changes
  const sidebarOpen = openAtPath === path;
  const setSidebarOpen = (value) => setOpenAtPath(value ? path : null);
  const activeSection = path.match(/^\/dashboard\/content\/([^/]+)/)?.[1];

  useEffect(() => {
    document.title = `${titleFor(path)} · Dashboard`;
  }, [path]);

  // unread messages / pending reviews shown as badges in the sidebar
  const loadBadges = useCallback(
    () =>
      axios
        .get(`${import.meta.env.VITE_API}/api/dashboard/overview`, {
          withCredentials: true,
        })
        .then(({ data }) =>
          setBadges({
            messages: Number(data?.data?.stats?.unreadMessages) || 0,
            reviews: Number(data?.data?.stats?.pendingTestimonials) || 0,
          }),
        )
        .catch(() => {}),
    [],
  );
  useEffect(() => {
    loadBadges();
  }, [loadBadges, path]);

  const logout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API}/api/auth/logout`,
        {},
        { withCredentials: true },
      );
    } catch {
      /* logging out anyway */
    }
    navigate("/auth/login", { replace: true });
  };
  const badge = (count) =>
    count > 0 && (
      <span
        className="ml-auto rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-black"
        aria-label={`${count} new`}
      >
        {count > 99 ? "99+" : count}
      </span>
    );
  const navItem = (href, label, Icon, count = 0) => (
    <Link
      key={href}
      to={href}
      aria-current={path === href ? "page" : undefined}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${path === href ? "bg-emerald-500/15 text-emerald-300" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
    >
      <Icon className="shrink-0" />
      <span>{label}</span>
      {badge(count)}
    </Link>
  );

  return (
    <ConfirmProvider>
      <div
        className="min-h-screen bg-[#090a0d] text-white"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {/* تم إضافة مكون السكرول هنا ليعمل مع كل تنقلات الـ Dashboard */}
        <ScrollToTop />
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
              {navItem("/dashboard/works", "Works", FaLayerGroup)}
              {navItem(
                "/dashboard/testimonials",
                "Testimonials",
                FaCommentDots,
                badges.reviews,
              )}
              {navItem(
                "/dashboard/messages",
                "Messages inbox",
                FaEnvelope,
                badges.messages,
              )}
              {navItem("/dashboard/settings", "Website settings", FaCog)}
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
                  aria-expanded={contentOpen}
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
                      aria-current={activeSection === key ? "page" : undefined}
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
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-400 hover:bg-white/5 hover:text-white"
            >
              <FaExternalLinkAlt />
              View portfolio
            </a>
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
            {/* Every address opens a real page: /dashboard, /dashboard/, /dashboard/content and unknown paths all land on a screen, never on "choose a section". */}
            <Routes>
              <Route
                index
                element={<Navigate to="/dashboard/overview" replace />}
              />
              <Route
                path="overview"
                element={
                  <Wide>
                    <DashboardOverview />
                  </Wide>
                }
              />
              <Route
                path="works"
                element={
                  <Wide>
                    <WorksDash />
                  </Wide>
                }
              />
              <Route
                path="testimonials"
                element={
                  <Wide>
                    <TestimonialsDash onChanged={loadBadges} />
                  </Wide>
                }
              />
              <Route
                path="messages"
                element={
                  <Wide>
                    <MessagesInbox onChanged={loadBadges} />
                  </Wide>
                }
              />
              <Route path="settings" element={<MaintenanceSettings />} />
              <Route
                path="content"
                element={<Navigate to="/dashboard/content/hero" replace />}
              />
              <Route path="content/:section" element={<ContentRoute />} />
              <Route
                path="*"
                element={<Navigate to="/dashboard/overview" replace />}
              />
            </Routes>
          </main>
        </div>
      </div>
    </ConfirmProvider>
  );
};
export default DashboardPage;
