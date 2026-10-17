import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import MainLayout from "./pages/MainLayout";
import Home from "./pages/Home";
import NotFoundPage from "./pages/NotFoundPage";
import WorksPage from "./pages/WorksPage";
import AboutMePage from "./pages/AboutMePage";
import ContactsPage from "./pages/ContactsPage";
import TestimonialsPage from "./pages/TestimonialsPage";
import AdminRoute from "./components/protect/AdminRoute";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import { SiteContentProvider } from "./context/SiteContentContext";

function App() {
  const router = createBrowserRouter([
    { path: "/", element: <SiteContentProvider><MainLayout /></SiteContentProvider>, children: [
      { index: true, element: <Home /> },
      { path: "works", element: <WorksPage /> },
      { path: "about-me", element: <AboutMePage /> },
      { path: "contacts", element: <ContactsPage /> },
      { path: "testimonials", element: <TestimonialsPage /> },
      { path: "auth/login", element: <LoginPage /> },
    ]},
    { path: "/dashboard/*", element: <SiteContentProvider><AdminRoute><DashboardPage /></AdminRoute></SiteContentProvider> },
    { path: "*", element: <NotFoundPage /> },
  ]);
  return <RouterProvider router={router} />;
}
export default App;
