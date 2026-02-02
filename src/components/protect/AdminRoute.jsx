import axios from "axios";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router";

const AdminRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const me = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API}/api/auth/me`,
          { withCredentials: true },
        );

        setIsAuth(true);
      } catch (err) {
        setIsAuth(false);
      }
    };

    me();
  }, []);
  if (isAuth === false) return <Navigate to="/auth/login" replace />;
  if (isAuth === true) return children;
};

export default AdminRoute;
