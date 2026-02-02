import { createBrowserRouter, RouterProvider } from "react-router";
import MainLayout from "./pages/MainLayout";
import Home from "./pages/Home";
import NotFoundPage from "./pages/NotFoundPage";
import WorksPage from "./pages/WorksPage";
import AboutMePage from "./pages/AboutMePage";
import ContactsPage from "./pages/ContactsPage";
import AdminRoute from "./components/protect/AdminRoute";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: "works", element: <WorksPage /> },
        { path: "about-me", element: <AboutMePage /> },
        { path: "contacts", element: <ContactsPage /> },
        {
          path: "dashboard",
          element: (
            <AdminRoute>
              <DashboardPage />{" "}
            </AdminRoute>
          ),
        },
        { path: "/auth/login", element: <LoginPage /> },
      ],
    },
    {
      path: "*",
      element: <NotFoundPage />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
