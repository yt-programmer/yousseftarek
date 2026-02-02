import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { motion } from "framer-motion";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const me = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API}/api/auth/me`,
          { withCredentials: true },
        );

        navigate("/dashboard", { replace: true });
      } catch (err) {}
    };

    me();
  }, []);

  const onSubmitHandle = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const { data } = await toast.promise(
        axios.post(
          `${import.meta.env.VITE_API}/api/auth/login`,
          { email, password },
          { withCredentials: true },
        ),
        {
          loading: "Loading...",
          success: "Login successfully!",
          error: "Login failed!",
        },
      );

      navigate("/dashboard", { replace: true });
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Something went wrong",
      );
    } finally {
      e.target.reset();
    }
  };
  return (
    <section className="pt-50 min-h-screen">
      <div className="container mx-auto px-[20px] ">
        <div>
          <h2 className="text-3xl font-semibold">
            <span className="text-[var(--color-primary)]">/</span>login to
            dashboard
          </h2>
          <p className="text-gray-400 mt-5">Login to your account</p>
        </div>
        <form
          onSubmit={(e) => onSubmitHandle(e)}
          className="mt-50 shadow-lg shadow-green-900  rounded-2xl border   border-[var(--color-primary)] p-10 md:w-[500px] mx-auto  flex flex-col gap-10"
        >
          <h3 className="text-2xl text-[var(--color-primary)] font-semibold">
            Login
          </h3>
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-5"
          >
            <TextField
              required
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
              label="Email"
              type="email"
              variant="outlined"
              name="email"
            />
          </motion.div>
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-5"
          >
            <TextField
              required
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
              label="Password"
              variant="outlined"
              type="password"
              name="password"
            />
          </motion.div>
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-5"
          >
            <Button
              type="submit"
              variant="outlined"
              sx={{
                borderColor: "var(--color-primary)",
                color: "white",
                "&:hover": {
                  borderColor: "var(--color-primary)",
                  backgroundColor: "oklch(52.7% 0.154 150.069 / 0.1)",
                },
              }}
            >
              Send
            </Button>
          </motion.div>
        </form>
      </div>
    </section>
  );
};

export default LoginPage;
