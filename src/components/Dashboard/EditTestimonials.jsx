import React from "react";

import { Button, TextField } from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useState } from "react";

const EditTestimonials = ({ testimonial, refetch }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: testimonial.name,
    rating: testimonial.rating,
    description: testimonial.description,
    position: testimonial.position,
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
          `${import.meta.env.VITE_API}/api/testimonials/${testimonial._id}`,
          form,
          { withCredentials: true },
        ),
        {
          loading: "Updating testimonial ...",
          success: "Testimonial updated successfully",
          error: "Error updating testimonial",
        },
      );
      await refetch();
      setOpen(false);
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  const fields = ["name", "rating", "description", "position"];
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
            <h1 className="text-2xl font-bold mb-5">Edit Testimonials</h1>
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

export default EditTestimonials;
