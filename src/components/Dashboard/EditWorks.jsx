import { useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaEdit } from "react-icons/fa";
import ProjectForm from "./ProjectForm";
import { btn } from "./ui";

const API = `${(import.meta.env.VITE_API || "").replace(/\/$/, "")}/api/projects`;

export default function EditWorks({ work, refetch }) {
  const [open, setOpen] = useState(false);
  const initial = useMemo(() => ({ title: work.title || "", skils: work.skils || "", description: work.description || "", link: work.link || "", filter: work.filter || "", image: work.image || "" }), [work]);
  const save = async (form) => {
    await axios.patch(`${API}/${work._id}`, form, { withCredentials: true });
    toast.success("Project updated");
    setOpen(false);
    await refetch();
  };
  return <>
    <button type="button" onClick={() => setOpen(true)} className={`${btn.ghost} ${btn.small}`}><FaEdit /> Edit project</button>
    <ProjectForm open={open} onClose={() => setOpen(false)} title="Edit project" subtitle="Update project details and cover image." initial={initial} submitLabel="Save changes" onSubmit={save} />
  </>;
}
