import { Outlet, ScrollRestoration, useLocation } from "react-router";
import { maintenanceAppliesHere } from "../utils/runtime";
import Header from "../components/Header";
import InteractiveLinesBg from "../components/InteractiveLinesBg";
import FirstScreen from "../components/FirstScreen";
import { useCallback, useEffect, useState } from "react";
import ToTop from "../components/ToTop";
import Footer from "../components/Footer";
import BtnWhatsapp from "../components/BtnWhatsapp";
import MaintenancePage from "../components/MaintenancePage";

const MainLayout = () => {
  const [loading, setLoading] = useState(
    () => !window.location.pathname.startsWith("/auth"),
  );
  const [showToTop, setShowToTop] = useState(false);
  const [maintenance, setMaintenance] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const { pathname } = useLocation();

  // Re-usable status check; `serverOffset` = server clock minus this device's clock, so the countdown follows
  // the SERVER's time (a visitor whose clock is minutes ahead would otherwise reload endlessly).
  const check = useCallback(
    () =>
      !maintenanceAppliesHere()
        ? Promise.resolve().then(() => setMaintenance({ enabled: false }))
        : fetch(`${import.meta.env.VITE_API}/api/dashboard/maintenance`)
            .then((response) => {
              if (!response.ok)
                throw new Error("Maintenance status unavailable");
              return response.json();
            })
            .then((result) => {
              const data = result.data || { enabled: false };
              const serverTime = Date.parse(data.serverTime);
              setMaintenance({
                ...data,
                serverOffset: Number.isFinite(serverTime)
                  ? serverTime - Date.now()
                  : 0,
              });
            })
            .catch(() => setMaintenance({ enabled: false })),
    [],
  );

  useEffect(() => {
    check();
    const interval = window.setInterval(check, 60000);
    return () => window.clearInterval(interval);
  }, [check]);

  useEffect(() => {
    const handleScroll = () => {
      setShowToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // The admin login page stays reachable during maintenance, otherwise an admin whose session expired is locked out.
  const isAuthRoute = pathname.startsWith("/auth");
  if (maintenance?.enabled && !isAuthRoute)
    return <MaintenancePage data={maintenance} onExpired={check} />;

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
