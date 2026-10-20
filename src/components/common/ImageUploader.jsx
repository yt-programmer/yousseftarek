import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaCloudUploadAlt, FaLink, FaTrash } from "react-icons/fa";
import { UploadError, uploadImage, uploadSettings } from "../../lib/uploadImage";
import { safeHref } from "../../utils/safeUrl";

const isImageUrl = (value) => /^https:\/\//i.test(value) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//i.test(value) || /^\/(?!\/)/.test(value);

// One uploader for every image in the dashboard: drag & drop or click, progress, big preview, clear errors,
// and a "paste a URL instead" fallback.
export default function ImageUploader({ value, onChange, onBusyChange, label, hint = "PNG, JPG, WEBP or GIF · large photos are resized automatically", allowUrl = true, previewClass = "max-h-56" }) {
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [showUrl, setShowUrl] = useState(false);
  const [broken, setBroken] = useState(false);
  const fileRef = useRef(null);
  const settings = uploadSettings();

  const busyCallback = useRef(onBusyChange);
  useEffect(() => { busyCallback.current = onBusyChange; });
  useEffect(() => { busyCallback.current?.(busy); }, [busy]);
  useEffect(() => { setBroken(false); }, [value]);

  const handleFile = async (file) => {
    if (!file || busy) return;
    setError(""); setBusy(true); setProgress(0);
    try {
      const url = await uploadImage(file, { onProgress: setProgress });
      onChange(url);
      toast.success("Image uploaded");
    } catch (err) {
      const message = err instanceof UploadError ? err.message : "Image upload failed.";
      setError(message); toast.error(message);
    } finally { setBusy(false); if (fileRef.current) fileRef.current.value = ""; }
  };
  const drop = (event) => { event.preventDefault(); setDragging(false); handleFile(event.dataTransfer.files?.[0]); };

  return <div>
    {label && <p className="mb-2 text-sm font-medium text-gray-300">{label}</p>}
    <div onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={drop}
      className={`rounded-xl border border-dashed p-3 transition ${dragging ? "border-emerald-400 bg-emerald-500/10" : "border-emerald-500/30 bg-black/20"}`}>
      {value && !broken ? <img src={safeHref(value) || value} alt="Selected" onError={() => setBroken(true)} className={`mx-auto mb-3 w-full rounded-lg object-contain ${previewClass}`} />
        : value && broken ? <p className="mb-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">The image at this address could not be loaded. Upload a new one or check the URL.</p> : null}
      {!value && <button type="button" disabled={busy} onClick={() => fileRef.current?.click()} className="flex min-h-32 w-full flex-col items-center justify-center rounded-lg text-center transition hover:bg-emerald-500/5 disabled:cursor-wait">
        <FaCloudUploadAlt className="text-3xl text-emerald-400" />
        <span className="mt-3 text-sm text-gray-300">{busy ? `Uploading… ${progress}%` : "Click to choose an image, or drop it here"}</span>
        <span className="mt-1 text-xs text-gray-500">{hint}</span>
      </button>}
      {busy && <div className="mb-1 mt-2 h-1.5 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}><div className="h-full bg-emerald-500 transition-all" style={{ width: `${Math.max(6, progress)}%` }} /></div>}
      {value && <div className="flex flex-wrap justify-center gap-2">
        <button type="button" disabled={busy} onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-gray-300 transition hover:bg-white/5 disabled:opacity-50"><FaCloudUploadAlt className="text-emerald-300" />{busy ? `Uploading… ${progress}%` : "Replace image"}</button>
        <button type="button" disabled={busy} onClick={() => onChange("")} className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 px-3 py-2 text-xs text-red-300 transition hover:bg-red-500/10 disabled:opacity-50"><FaTrash />Remove</button>
      </div>}
      <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="hidden" disabled={busy} onChange={(event) => handleFile(event.target.files?.[0])} data-testid="image-file-input" />
    </div>
    {error && <p role="alert" className="mt-2 rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-2 text-xs leading-5 text-red-200">{error}</p>}
    <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-500">
      <span>Uploads go to {settings.label}.</span>
      {allowUrl && <button type="button" onClick={() => setShowUrl((v) => !v)} className="inline-flex items-center gap-1 text-gray-400 underline-offset-2 hover:text-emerald-300 hover:underline"><FaLink />{showUrl ? "Hide URL field" : "Use an image URL instead"}</button>}
    </div>
    {showUrl && <input type="url" value={value || ""} onChange={(event) => onChange(event.target.value.trim())} placeholder="https://…" aria-label="Image URL" aria-invalid={value && !isImageUrl(value) ? "true" : undefined} className="mt-2 w-full rounded-lg border border-white/10 bg-[#090a0d] px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500" />}
  </div>;
}
