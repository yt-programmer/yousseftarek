import Button from "@mui/material/Button";
import axios from "axios";
import { tr } from "framer-motion/client";
import React from "react";
import toast from "react-hot-toast";

const DeleteWorks = ({ id, setWorksData }) => {
  const deleteWork = async () => {
    try {
      const { data } = await toast.promise(
        axios.delete(`${import.meta.env.VITE_API}/api/projects/${id}`, {
          withCredentials: true,
        }),
        {
          loading: "Deleting work ...",
          success: "Work deleted successfully",
          error: "Error deleting work",
        },
      );

      setWorksData(data.data.projects);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    }
  };
  return (
    <Button onClick={deleteWork} variant="text" color="error">
      Delete
    </Button>
  );
};

export default DeleteWorks;
