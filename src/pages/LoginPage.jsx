import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { FaLock, FaUserShield } from "react-icons/fa";

const fieldSx = {
  "& label": { color: "#9ca3af" },
  "& label.Mui-focused": { color: "var(--color-primary)" },
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor: "rgba(0,0,0,.22)",
    color: "white",
    "& fieldset": {
      borderColor: "color-mix(in srgb, var(--color-primary) 45%, transparent)",
    },
    "&:hover fieldset": { borderColor: "var(--color-primary)" },
    "&.Mui-focused fieldset": { borderColor: "var(--color-primary)" },
  },
  "& input": { color: "white", padding: "14px 14px" },
};

const LoginPage = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    document.title = "Login | Youssef Tarek"; // الاسم الجديد للتاب
  }, []);

  useEffect(() => {
    let active = true;
    axios
      .get(`${import.meta.env.VITE_API}/api/auth/me`, { withCredentials: true })
      .then(() => {
        if (active) navigate("/dashboard", { replace: true });
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [navigate]);

  const onSubmitHandle = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const email = form.email.value.trim();
    const password = form.password.value;
    setSubmitting(true);
    try {
      await toast.promise(
        axios.post(
          `${import.meta.env.VITE_API}/api/auth/login`,
          { email, password },
          { withCredentials: true, timeout: 15000 },
        ),
        {
          loading: "Signing in…",
          success: "Login successful",
          error: (error) => {
            if (error.response?.status === 429) {
              return (
                error.response?.data?.message ||
                "Too many login attempts. Try again later."
              );
            }
            if (error.response?.status === 401)
              return "Email or password is incorrect";
            if (error.code === "ECONNABORTED")
              return "The request timed out. Please try again.";
            return "Unable to sign in. Please check the connection and try again.";
          },
        },
      );
      form.reset();
      navigate("/dashboard", { replace: true });
    } catch {
      // the error toast is shown by toast.promise above
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative flex w-full min-w-0 min-h-[calc(100vh-80px)] items-center justify-center px-4 py-10 sm:px-6 sm:py-16">
      <div className="w-full max-w-md min-w-0">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-6 text-center"
        >
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--color-primary)]/50 bg-[var(--color-primary)]/10 text-2xl text-[var(--color-primary)]">
            <FaUserShield />
          </span>
          <h2 className="text-2xl font-bold sm:text-3xl">
            <span className="text-[var(--color-primary)]">/</span> Login to
            dashboard
          </h2>
          <p className="mt-3 text-sm text-gray-400">
            Sign in to manage your portfolio content.
          </p>
        </motion.div>
        <motion.form
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.06 }}
          onSubmit={onSubmitHandle}
          className="flex w-full min-w-0 flex-col gap-5 rounded-2xl border border-[var(--color-primary)]/60 bg-black/25 p-5 shadow-xl shadow-green-950/30 sm:p-8"
        >
          <div>
            <h3 className="text-xl font-semibold text-[var(--color-primary)]">
              Welcome back
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Use your administrator credentials.
            </p>
          </div>
          <TextField
            required
            fullWidth
            name="email"
            label="Email address"
            type="email"
            autoComplete="username"
            inputProps={{
              maxLength: 254,
              autoCapitalize: "none",
              spellCheck: false,
            }}
            sx={fieldSx}
          />
          <TextField
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            inputProps={{ maxLength: 128 }}
            sx={fieldSx}
          />
          <Button
            type="submit"
            disabled={submitting}
            variant="outlined"
            startIcon={<FaLock />}
            sx={{
              mt: 1,
              py: 1.4,
              borderRadius: "12px",
              borderColor: "var(--color-primary)",
              color: "white",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                borderColor: "var(--color-primary)",
                backgroundColor:
                  "color-mix(in srgb, var(--color-primary) 12%, transparent)",
              },
              "&.Mui-disabled": { color: "#6b7280", borderColor: "#374151" },
            }}
          >
            {submitting ? "Signing in…" : "Sign in"}
          </Button>
        </motion.form>
      </div>
    </section>
  );
};
export default LoginPage;
