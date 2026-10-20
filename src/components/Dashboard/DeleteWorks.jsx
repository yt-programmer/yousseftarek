import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { useConfirm } from "./ConfirmDialog";
import { btn, errorText } from "./ui";

const DeleteWorks = ({ id, work, refetch }) => {
  const confirm = useConfirm();
  const [busy, setBusy] = useState(false);
  const deleteWork = async () => {
    // Deleting is permanent – always ask first.
    const title = work?.title;
    if (!(await confirm({ title: "Delete this project?", message: `${title ? `“${title}”` : "This project"} will be removed from your portfolio. This cannot be undone.`, confirmText: "Delete project" }))) return;
    setBusy(true);
    try {
      await axios.delete(`${(import.meta.env.VITE_API || "").replace(/\/$/, "")}/api/projects/${id}`, { withCredentials: true });
      toast.success("Project deleted");
      await refetch();
    } catch (error) {
      toast.error(errorText(error, "Could not delete the project"));
    } finally { setBusy(false); }
  };
  return <button type="button" onClick={deleteWork} disabled={busy} className={`${btn.danger} ${btn.small}`}><FaTrash /> {busy ? "Deleting…" : "Delete"}</button>;
};

export default DeleteWorks;
