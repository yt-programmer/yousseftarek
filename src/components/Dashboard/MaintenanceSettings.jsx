import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

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
  const uploadImage = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 8 * 1024 * 1024) { toast.error("Choose an image smaller than 8 MB"); return; }
    const cloud = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim();
    const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET?.trim();
    if (!cloud || !preset) { toast.error("Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in frontend/.env and Vercel environment variables."); return; }
    setUploadingImage(true);
    try { const body = new FormData(); body.append("file", file); body.append("upload_preset", preset); const result = await axios.post(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, body); setImageUrl(result.data.secure_url); toast.success("Maintenance image uploaded. Save settings to publish it."); }
    catch (error) { toast.error(error.response?.data?.error?.message || "Image upload failed. Check Cloudinary settings."); }
    finally { setUploadingImage(false); }
  };
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
    <p className="mt-2 text-sm text-gray-400">When enabled, visitors see a maintenance page with a countdown. The site automatically becomes available when the timer ends. The dashboard remains accessible.</p>
    {loading ? <p className="mt-6 text-sm text-gray-400">Loading settings…</p> : <form onSubmit={save} className="mt-6 space-y-5">
      <label className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/20 p-4"><input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} className="h-4 w-4 accent-emerald-500"/><span><span className="block text-sm font-medium">Enable maintenance mode</span><span className="mt-1 block text-xs text-gray-500">Visitors will not see the public website while maintenance is active.</span></span></label>
      <label className="block"><span className="mb-2 block text-sm text-gray-300">Website reopening date and time</span><input type="datetime-local" required={enabled} min={localDateTime(new Date(Date.now() + 60000))} value={until} onChange={(e) => setUntil(e.target.value)} className="w-full rounded-lg border border-white/10 bg-[#090a0d] px-3 py-3 text-sm text-white"/><span className="mt-1 block text-xs text-gray-500">Uses your browser's local time zone.</span></label>
      <div className="block"><span className="mb-2 block text-sm text-gray-300">Maintenance page image (optional)</span>{imageUrl && <img src={imageUrl} alt="Maintenance page preview" className="mb-3 max-h-56 rounded-lg border border-white/10 object-contain"/>}<label className="inline-flex cursor-pointer items-center rounded-lg border border-emerald-500/30 px-4 py-3 text-sm text-emerald-300 hover:bg-emerald-500/10">{uploadingImage ? "Uploading image…" : imageUrl ? "Replace image" : "Upload maintenance image"}<input type="file" accept="image/*" disabled={uploadingImage} className="hidden" onChange={(event) => uploadImage(event.target.files?.[0])}/></label>{imageUrl && <button type="button" onClick={() => setImageUrl("")} className="ml-3 rounded-lg border border-white/10 px-3 py-3 text-sm text-gray-300 hover:bg-white/5">Remove image</button>}<p className="mt-2 text-xs text-gray-500">No image is displayed unless you upload one. Maximum 8 MB.</p></div>
      <label className="block"><span className="mb-2 block text-sm text-gray-300">Maintenance message</span><textarea rows={3} maxLength={500} value={message} onChange={(e) => setMessage(e.target.value)} className="w-full rounded-lg border border-white/10 bg-[#090a0d] px-3 py-3 text-sm text-white"/></label>
      <button disabled={saving || uploadingImage} className="rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Saving…" : "Save settings"}</button>
    </form>}
  </div>;
}
