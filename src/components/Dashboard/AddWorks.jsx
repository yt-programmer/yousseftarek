import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import ProjectForm from "./ProjectForm";
import { btn } from "./ui";

const API = `${(import.meta.env.VITE_API || "").replace(/\/$/, "")}/api/projects`;

export default function AddWorks({ refetch }) {
  const [open, setOpen] = useState(false);
  const save = async (form) => {
    await axios.post(API, form, { withCredentials: true });
    toast.success("Project added");
    setOpen(false);
    await refetch();
  };
  return <>
    <button type="button" onClick={() => setOpen(true)} className={btn.primary}><FaPlus /> Add project</button>
    <ProjectForm open={open} onClose={() => setOpen(false)} title="Add new project" subtitle="Add the project details and upload its cover image." submitLabel="Save project" onSubmit={save} />
  </>;
}
