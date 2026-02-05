import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { motion } from "framer-motion";
import React, { useState } from "react";
import toast from "react-hot-toast";

const EditWorks = ({ work, setWorksData }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: work.title,
    skils: work.skils,
    description: work.description,
    link: work.link,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await toast.promise(
        axios.patch(
          `${import.meta.env.VITE_API}/api/projects/${work._id}`,
          form,
          { withCredentials: true },
        ),
        {
          loading: "Updating work ...",
          success: "Work updated successfully",
          error: "Error updating work",
        },
      );
      setWorksData(data.data.projects);
      setOpen(false);
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  const fields = ["title", "skils", "description", "link"];
  return (
    <>
      <Button variant="text" onClick={() => setOpen(true)}>
        Edit
      </Button>

      {open && (
        <div className="p-5 fixed z-40 flex justify-center items-center top-0 left-0 w-full h-screen bg-black/90">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="relative w-[500px] p-5 shadow-lg shadow-green-900 border border-[var(--color-primary)]"
          >
            <h1 className="text-2xl font-bold mb-5">Edit work</h1>
            <div className="flex flex-col gap-5">
              {fields.map((field) => (
                <TextField
                  key={field}
                  label={field}
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  className="w-full my-3"
                  variant="outlined"
                  sx={{
                    "& label": {
                      color: "white",
                    },
                    "& label.Mui-focused": {
                      color: "var(--color-primary)",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "var(--color-primary)",
                      },
                      "&:hover fieldset": {
                        borderColor: "var(--color-primary)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "var(--color-primary)",
                      },
                    },
                    "& input": {
                      color: "white",
                    },
                    "& textarea": {
                      color: "white",
                    },
                  }}
                />
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <Button
                name="cancel"
                sx={{
                  borderColor: "var(--color-primary)",
                  color: "white",
                  "&:hover": {
                    borderColor: "var(--color-primary)",
                    backgroundColor: "oklch(52.7% 0.154 150.069 / 0.1)",
                  },
                }}
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                name="save"
                sx={{
                  borderColor: "var(--color-primary)",
                  color: "white",
                  "&:hover": {
                    borderColor: "var(--color-primary)",
                    backgroundColor: "oklch(52.7% 0.154 150.069 / 0.1)",
                  },
                }}
                type="submit"
                disabled={loading}
              >
                Save
              </Button>
            </div>
          </motion.form>
        </div>
      )}
    </>
  );
};

export default EditWorks;
