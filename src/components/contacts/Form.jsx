import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { motion } from "framer-motion";
import { i } from "framer-motion/client";
import React from "react";
import { toast } from "react-hot-toast";
const fields = ["Name", "Email", "Message"];
const Form = () => {
  const arr = [0.3, 0.6, 0.9];
  const [loading, setLoading] = React.useState(false);

  const onSubmitHandle = async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value;
    const message = e.target.message.value;

    try {
      await toast.promise(
        axios.post(`${import.meta.env.VITE_API}/api/sendmail`, {
          name,
          email,
          message,
        }),
        {
          loading: "Sending message...",
          success: "Message sent successfully!",
          error: "Could not send message.",
        },
      );

      e.target.reset();
    } catch (err) {
      toast.error(
        err.response.data.message || err.message || "Something went wrong",
      );
    }
  };

  return (
    <form
      onSubmit={(e) => onSubmitHandle(e)}
      className="flex mt-10 !text-white flex-col gap-5"
    >
      {fields.map((field, index) => {
        const randomValue = arr[Math.floor(Math.random() * arr.length)];
        return (
          <motion.div
            key={field}
            initial={{ y: -100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: randomValue }}
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
              label={field}
              type={index === 1 ? "email" : "text"}
              variant="outlined"
              name={field.toLowerCase()}
              multiline={index === 2 ? true : false}
              rows={index === 2 ? 11 : 1}
            />
          </motion.div>
        );
      })}

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
  );
};

export default Form;
