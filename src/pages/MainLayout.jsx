import { Outlet, ScrollRestoration } from "react-router";
import Header from "../components/Header";
import InteractiveLinesBg from "../components/InteractiveLinesBg";
import FirstScreen from "../components/FirstScreen";
import { useEffect, useState } from "react";
import ToTop from "../components/ToTop";
import Footer from "../components/Footer";
import BtnWhatsapp from "../components/BtnWhatsapp";
import MaintenancePage from "../components/MaintenancePage";

const MainLayout = () => {
  const [loading, setLoading] = useState(true);
  const [showToTop, setShowToTop] = useState(false);
  const [maintenance, setMaintenance] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);


  useEffect(() => {
    let active = true;
    const check = () => fetch(`${import.meta.env.VITE_API}/api/dashboard/maintenance`)
      .then((response) => { if (!response.ok) throw new Error("Maintenance status unavailable"); return response.json(); })
      .then((result) => { if (active) setMaintenance(result.data || { enabled: false }); })
      .catch(() => { if (active) setMaintenance({ enabled: false }); });
    check();
    const interval = window.setInterval(check, 60000);
    return () => { active = false; window.clearInterval(interval); };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (maintenance?.enabled) return <MaintenancePage />;

  return (
    <main className="font-display  relative min-h-screen text-white">
      <InteractiveLinesBg />

      <section className="relative z-10">
        {loading ? (
          <FirstScreen />
        ) : (
          <>
            {showToTop && <ToTop />}
            <BtnWhatsapp />
            <ScrollRestoration />
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
