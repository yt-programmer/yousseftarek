import { Outlet, ScrollRestoration, useLocation } from "react-router";
import Header from "../components/Header";
import InteractiveLinesBg from "../components/InteractiveLinesBg";
import FirstScreen from "../components/FirstScreen";
import { useEffect, useState } from "react";
import ToTop from "../components/ToTop";
import Footer from "../components/Footer";
import BtnWhatsapp from "../components/BtnWhatsapp";

const MainLayout = () => {
  const [loading, setLoading] = useState(true);
  const [showToTop, setShowToTop] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const measurementId = import.meta.env.VITE_GA4_MEASUREMENT_ID?.trim();
    if (!measurementId || !measurementId.startsWith("G-")) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };

    if (!document.querySelector(`script[data-ga4="${measurementId}"]`)) {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
      script.dataset.ga4 = measurementId;
      document.head.appendChild(script);
      window.gtag("js", new Date());
      window.gtag("config", measurementId, { send_page_view: false });
    }

    window.gtag("event", "page_view", {
      page_title: document.title,
      page_location: window.location.href,
      page_path: `${location.pathname}${location.search}${location.hash}`,
    });
  }, [location.pathname, location.search, location.hash]);

  useEffect(() => {
    const handleScroll = () => {
      setShowToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
