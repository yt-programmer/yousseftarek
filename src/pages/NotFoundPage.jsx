import Button from "@mui/material/Button";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import InteractiveLinesBg from "../components/InteractiveLinesBg";

const NotFoundPage = () => {
  const [timer, setTimer] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    if (timer === 0) {
      navigate("/");
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, navigate]);

  return (
    <>
      <InteractiveLinesBg />
      <section className="text-white h-screen flex-col  flex items-center justify-center">
        <h1 className="text-[50px] font-extrabold mb-2">404</h1>
        <p className="text-3xl font-semibold mb-2">Page not found</p>
        <p className="text-gray-600">
          Redirecting to home in{" "}
          <span className="font-bold text-[var(--color-primary)]">{timer}</span>{" "}
          seconds
        </p>
        <Link replace to="/" className="mt-5">
          <Button
            onClick={() => navigate("/")}
            variant="outlined"
            className="  !border-[var(--color-primary)] !duration-500 !transition-all !text-[var(--color-primary)]"
          >
            Go Home Now
          </Button>
        </Link>
      </section>
    </>
  );
};

export default NotFoundPage;
