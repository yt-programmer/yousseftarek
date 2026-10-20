import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "../common/Modal";
import ImageUploader from "../common/ImageUploader";
import { btn, errorText, inputCls } from "./ui";

const emptyProject = { image: "", title: "", skils: "", description: "", link: "", filter: "" };
const API = (import.meta.env.VITE_API || "").replace(/\/$/, "");

// The one project form used by both "Add project" and "Edit project".
export default function ProjectForm({ open, onClose, title, subtitle, initial = emptyProject, submitLabel = "Save project", onSubmit }) {
  const [form, setForm] = useState(initial);
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { // every time the dialog opens it starts from the saved values (cancelled edits are discarded)
    if (!open) return undefined;
    setForm(initial); setError("");
    let active = true;
    axios.get(`${API}/api/projects?limit=100&page=1&filter=All`).then(({ data }) => { if (active) setCategories((data.data?.filters || []).filter(Boolean)); }).catch(() => {});
    return () => { active = false; };
  }, [open, initial]);

  const change = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault();
    if (!form.image) { setError("Add a cover image for the project."); return; }
    setSaving(true); setError("");
    try { await onSubmit({ ...form, title: form.title.trim(), skils: form.skils.trim(), filter: form.filter.trim(), link: form.link.trim(), description: form.description.trim() }); }
    catch (err) { setError(errorText(err, "Could not save the project.")); }
    finally { setSaving(false); }
  };
  const busy = saving || uploading;
  const field = (key, label, props = {}) => <label className="block"><span className="mb-1.5 block text-xs text-gray-400">{label}</span><input required name={key} value={form[key]} onChange={change} maxLength={key === "title" ? 120 : key === "skils" ? 300 : 2048} className={inputCls} {...props} /></label>;

  return <Modal open={open} onClose={onClose} busy={busy} eyebrow="Portfolio content" title={title} subtitle={subtitle}>
    <form onSubmit={submit} noValidate={false}>
      <div className="mb-5"><ImageUploader label="Project cover" value={form.image} onChange={(image) => { setForm((current) => ({ ...current, image })); setError(""); }} onBusyChange={setUploading} /></div>
      <div className="grid gap-4 md:grid-cols-2">
        {field("title", "Project name", { placeholder: "Project title", autoComplete: "off" })}
        {field("skils", "Technologies", { placeholder: "React, Node.js, MongoDB", autoComplete: "off" })}
        {field("link", "Project URL", { type: "url", placeholder: "https://…", autoComplete: "off" })}
        <label className="block"><span className="mb-1.5 block text-xs text-gray-400">Category</span><input required name="filter" list="project-category-options" value={form.filter} onChange={change} maxLength={40} placeholder="Choose existing or type a new category" autoComplete="off" className={inputCls} /><datalist id="project-category-options">{categories.map((category) => <option key={category} value={category} />)}</datalist></label>
      </div>
      <label className="mt-4 block"><span className="mb-1.5 block text-xs text-gray-400">Description</span><textarea required rows={4} name="description" value={form.description} onChange={change} maxLength={2000} placeholder="What does this project do?" className={`${inputCls} resize-y leading-6`} /></label>
      {error && <p role="alert" className="mt-4 rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p>}
      <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-white/10 pt-5">
        <button type="button" onClick={onClose} disabled={busy} className={btn.ghost}>Cancel</button>
        <button type="submit" disabled={busy} className={btn.primary}>{saving ? "Saving…" : uploading ? "Uploading image…" : submitLabel}</button>
      </div>
    </form>
  </Modal>;
}
