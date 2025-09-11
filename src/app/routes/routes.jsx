// src/app/routes/routes.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import Layout from "../../layouts/Layout";
import withPageLoader from "../withPageLoader";

// Lazy-wrapped pages
const Home = withPageLoader(() => import("../../pages/Home"));
const Items = withPageLoader(() => import("../../pages/Items"));
const ItemDetail = withPageLoader(() => import("../../pages/ItemDetail"));
const Publish = withPageLoader(() => import("../../pages/Publish"));
const ItemModeration = withPageLoader(() =>
  import("../../pages/admin/ItemModeration")
);
const ManageItems = withPageLoader(() =>
  import("../../pages/admin/ManageItems")
);
const UserModeration = withPageLoader(() =>
  import("../../pages/admin/UserModeration")
);
const AdminSettings = withPageLoader(() =>
  import("../../pages/admin/Settings")
);
const Analytics = withPageLoader(() => import("../../pages/admin/Analytics"));
const UserProfile = withPageLoader(() => import("../../pages/UserProfile"));
const NotFound = withPageLoader(() => import("../../pages/NotFound"));
const AdminLayout = withPageLoader(() => import("../../layouts/AdminLayout"));
const SignUp = withPageLoader(() => import("../../pages/SignUp"));
const Login = withPageLoader(() => import("../../pages/Login"));
const UserDashboard = withPageLoader(() => import("../../pages/UserDashboard"));
const PublisherDashboard = withPageLoader(() =>
  import("../../pages/PublisherDashboard")
);
const Calculator = withPageLoader(() => import("../../pages/Calculator"));
const MaintenancePage = withPageLoader(() =>
  import("../../pages/MaintenancePage")
);

export default function AppRoutes() {
  return (
    <Router>
      <Suspense fallback={null}>
        <Routes>
          {/* Routes with main layout (each page wrapped with Layout) */}
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/signup"
            element={
              <Layout>
                <SignUp />
              </Layout>
            }
          />
          <Route
            path="/login"
            element={
              <Layout>
                <Login />
              </Layout>
            }
          />
          <Route
            path="/dashboard"
            element={
              <Layout>
                <UserDashboard />
              </Layout>
            }
          />
          <Route
            path="/publisher-dashboard"
            element={
              <Layout>
                <PublisherDashboard />
              </Layout>
            }
          />
          <Route
            path="/calculator"
            element={
              <Layout>
                <Calculator />
              </Layout>
            }
          />
          <Route
            path="/items"
            element={
              <Layout>
                <Items />
              </Layout>
            }
          />
          <Route
            path="/items/:id"
            element={
              <Layout>
                <ItemDetail />
              </Layout>
            }
          />
          <Route
            path="/items/:id/edit"
            element={
              <Layout>
                <Publish />
              </Layout>
            }
          />
          <Route
            path="/publish"
            element={
              <Layout>
                <Publish />
              </Layout>
            }
          />
          <Route
            path="publisher-dashboard"
            element={
              <Layout>
                <PublisherDashboard />
              </Layout>
            }
          />
          <Route
            path="/users/:id"
            element={
              <Layout>
                <UserProfile />
              </Layout>
            }
          />

          {/* Admin layout routes (separate from main layout) */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<ItemModeration />} />
            <Route path="manage" element={<ManageItems />} />
            <Route path="users" element={<UserModeration />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>

          <Route path="/maintenance" element={<MaintenancePage />} />
          {/* Not found page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
