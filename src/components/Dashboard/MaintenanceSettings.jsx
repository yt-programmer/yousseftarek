import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ImageUploader from "../common/ImageUploader";
import { maintenanceAppliesHere } from "../../utils/runtime";
import { btn, inputCls } from "./ui";

const API = `${import.meta.env.VITE_API}/api/dashboard/maintenance`;
const localDateTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16);
};

export default function MaintenanceSettings() {
  const [enabled, setEnabled] = useState(false);
  const [until, setUntil] = useState("");
  const [message, setMessage] = useState("We are making a few improvements. Please check back soon.");
  const [imageUrl, setImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const appliesHere = maintenanceAppliesHere();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    let active = true;
    axios.get(API).then(({ data }) => {
      if (!active) return;
      setEnabled(Boolean(data.data?.enabled));
      setUntil(localDateTime(data.data?.until));
      setMessage(data.data?.message || "We are making a few improvements. Please check back soon.");
      setImageUrl(data.data?.imageUrl || "");
    }).catch(() => toast.error("Could not load maintenance settings")).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const { data } = await axios.put(API, { enabled, until: enabled ? new Date(until).toISOString() : null, message, imageUrl }, { withCredentials: true });
      setEnabled(Boolean(data.data.enabled));
      setUntil(localDateTime(data.data.until));
      setImageUrl(data.data.imageUrl || "");
      toast.success(enabled ? "Maintenance mode scheduled" : "Maintenance mode disabled");
    } catch (error) { toast.error(error.response?.data?.message || "Could not save maintenance settings"); }
    finally { setSaving(false); }
  };
  return <div className="mx-auto max-w-4xl rounded-xl border border-white/10 bg-[#111318] p-5 shadow-xl md:p-7">
    <p className="text-xs uppercase tracking-[.2em] text-emerald-400">Website settings</p>
    <h2 className="mt-2 text-2xl font-semibold">Maintenance mode</h2>
    <p className="mt-2 text-sm text-gray-400">When enabled, visitors see a maintenance page with a countdown. The site automatically becomes available when the timer ends. The dashboard and the login page always stay accessible, and maintenance never shows on localhost.</p>
    {!appliesHere && <p className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs leading-5 text-amber-200">You are on a development or non-production address, so the maintenance page is not shown here even when enabled. It appears on your live website{import.meta.env.VITE_PRODUCTION_URL ? ` (${import.meta.env.VITE_PRODUCTION_URL})` : ""}.</p>}
    {loading ? <p className="mt-6 text-sm text-gray-400">Loading settings…</p> : <form onSubmit={save} className="mt-6 space-y-5">
      <label className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/20 p-4"><input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} className="h-4 w-4 accent-emerald-500"/><span><span className="block text-sm font-medium">Enable maintenance mode</span><span className="mt-1 block text-xs text-gray-500">Visitors will not see the public website while maintenance is active.</span></span></label>
      <label className="block"><span className="mb-2 block text-sm text-gray-300">Website reopening date and time</span><input type="datetime-local" required={enabled} min={localDateTime(new Date(Date.now() + 60000))} value={until} onChange={(e) => setUntil(e.target.value)} className={inputCls}/><span className="mt-1 block text-xs text-gray-500">Uses your browser's local time zone.</span></label>
      <ImageUploader label="Maintenance page image (optional)" value={imageUrl} onChange={setImageUrl} onBusyChange={setUploadingImage} previewClass="max-h-48" />
      <label className="block"><span className="mb-2 block text-sm text-gray-300">Maintenance message</span><textarea rows={3} maxLength={500} value={message} onChange={(e) => setMessage(e.target.value)} className={inputCls}/></label>
      <button disabled={saving || uploadingImage} className={btn.primary}>{saving ? "Saving…" : uploadingImage ? "Uploading image…" : "Save settings"}</button>
    </form>}
  </div>;
}
