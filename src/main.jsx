import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./App.jsx";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import { installAuthInterceptor } from "./lib/setupAxios";

installAuthInterceptor(axios, () => {
  if (window.location.pathname.startsWith("/dashboard")) window.location.assign("/auth/login");
});
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Toaster position="top-center" reverseOrder={false} />
    <App />
  </StrictMode>,
);
