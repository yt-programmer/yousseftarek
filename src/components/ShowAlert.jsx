import Alert from "@mui/material/Alert";
import React from "react";

const ShowAlert = ({ message, type }) => {
  return (
    <p
      className={`${type === "error" ? "text-red-500" : "text-[var(--color-primary)]"}  flex justify-center items-center  text-2xl font-bold `}
    >
      {message}
    </p>
  );
};

export default ShowAlert;
