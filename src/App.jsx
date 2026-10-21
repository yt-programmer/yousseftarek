import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import MainLayout from "./pages/MainLayout";
import Home from "./pages/Home";
import NotFoundPage from "./pages/NotFoundPage";
import AdminRoute from "./components/protect/AdminRoute";
import LoginPage from "./pages/LoginPage";
import Loading from "./components/Loading";
import { SiteContentProvider } from "./context/SiteContentContext";

// Everything except the home page and login is loaded on demand: the first visit downloads much less JavaScript.
const WorksPage = lazy(() => import("./pages/WorksPage"));
const AboutMePage = lazy(() => import("./pages/AboutMePage"));
const ContactsPage = lazy(() => import("./pages/ContactsPage"));
const TestimonialsPage = lazy(() => import("./pages/TestimonialsPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));

const later = (element) => <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center"><Loading /></div>}>{element}</Suspense>;

// Created once, outside the component (creating it inside would rebuild the router on every re-render).
const router = createBrowserRouter([
  { path: "/", element: <SiteContentProvider><MainLayout /></SiteContentProvider>, children: [
    { index: true, element: <Home /> },
    { path: "works", element: later(<WorksPage />) },
    { path: "about-me", element: later(<AboutMePage />) },
    { path: "contacts", element: later(<ContactsPage />) },
    { path: "testimonials", element: later(<TestimonialsPage />) },
    { path: "auth/login", element: <LoginPage /> },
  ]},
  { path: "/dashboard/*", element: <SiteContentProvider><AdminRoute>{later(<DashboardPage />)}</AdminRoute></SiteContentProvider> },
  { path: "*", element: <NotFoundPage /> },
]);

function App() {
  return <RouterProvider router={router} />;
}
export default App;
