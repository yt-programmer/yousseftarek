import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { Navigate } from "react-router";
import Loading from "../Loading";

// null = checking, true = signed in, false = not signed in (401), "error" = server/network problem
const AdminRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);

  const check = useCallback(async () => {
    setIsAuth(null);
    try {
      await axios.get(`${import.meta.env.VITE_API}/api/auth/me`, { withCredentials: true });
      setIsAuth(true);
    } catch (err) {
      // Only a real 401 means "log in again"; a server hiccup must not look like a logout.
      setIsAuth(err.response?.status === 401 || err.response?.status === 403 ? false : "error");
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    check();
  }, [check]);

  if (isAuth === false) return <Navigate to="/auth/login" replace />;
  if (isAuth === true) return children;
  if (isAuth === "error") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#090a0d] p-6 text-center text-white">
        <p className="text-sm text-gray-300">Could not reach the server. Check your connection and try again.</p>
        <button onClick={check} className="rounded-lg border border-emerald-500/40 px-4 py-2 text-sm text-emerald-300 hover:bg-emerald-500/10">Retry</button>
      </div>
    );
  }
  return <div className="flex min-h-screen items-center justify-center bg-[#090a0d]" role="status" aria-label="Checking session"><Loading /></div>;
};

export default AdminRoute;
