import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import { NewProjectPage, ProjectDetailPage } from "./pages/ProjectsPage";
import NewTaskPage from "./pages/NewTaskPage";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const user = localStorage.getItem("user");
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/projects/new"
          element={
            <AdminRoute>
              <NewProjectPage />
            </AdminRoute>
          }
        />
        <Route
          path="/projects/:id"
          element={
            <AdminRoute>
              <ProjectDetailPage />
            </AdminRoute>
          }
        />
        <Route
          path="/projects/:id/tasks/new"
          element={
            <AdminRoute>
              <NewTaskPage />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
