import { Outlet } from "react-router";
import Header from "../components/Header";
import InteractiveLinesBg from "../components/InteractiveLinesBg";
import FirstScreen from "../components/FirstScreen";
import { useEffect, useState } from "react";
import ToTop from "../components/ToTop";
import Footer from "../components/Footer";

const MainLayout = () => {
  const [loading, setLoading] = useState(true);
  const [showToTop, setShowToTop] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="font-display relative min-h-screen text-white">
      <InteractiveLinesBg />

      {showToTop && <ToTop />}

      <section className="relative z-10">
        {loading ? (
          <FirstScreen />
        ) : (
          <>
            <Header />
            <Outlet />
            <Footer />
          </>
        )}
      </section>
    </main>
  );
};

export default MainLayout;
