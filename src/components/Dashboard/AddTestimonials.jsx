import React from "react";

import { Button, TextField } from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useGetTestimonials } from "../../hooks/useGetTestimonials";

const AddTestimonials = ({ refetch }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    rating: "",
    description: "",
    position: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await toast.promise(
        axios.post(
          `${import.meta.env.VITE_API}/api/testimonials`,
          {
            name: form.name,
            rating: form.rating,
            description: form.description,
            position: form.position,
          },
          { withCredentials: true },
        ),
        {
          loading: "Adding  testimonial ...",
          success: "Testimonial added successfully",
          error: "Error adding testimonial",
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
      <Button
        sx={{
          borderColor: "var(--color-primary)",
          color: "white",

          "&:hover": {
            borderColor: "var(--color-primary)",
            backgroundColor: "oklch(52.7% 0.154 150.069 / 0.1)",
          },
        }}
        variant="text"
        onClick={() => setOpen(true)}
      >
        Add Testimonial
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
            <h1 className="text-2xl font-bold mb-5">Add Testimonial</h1>

            <div className="flex gap-3 flex-col">
              {fields.map((field) => (
                <TextField
                  key={field}
                  className="w-full mb-5"
                  label={field}
                  variant="outlined"
                  type={"text"}
                  name={field}
                  onChange={handleChange}
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

export default AddTestimonials;
