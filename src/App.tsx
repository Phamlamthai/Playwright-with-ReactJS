import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import { NewProjectPage, ProjectDetailPage } from './pages/ProjectsPage'
import NewTaskPage from './pages/NewTaskPage'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const user = localStorage.getItem('user')
  return user ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/projects/new" element={<PrivateRoute><NewProjectPage /></PrivateRoute>} />
        <Route path="/projects/:id" element={<PrivateRoute><ProjectDetailPage /></PrivateRoute>} />
        <Route path="/projects/:id/tasks/new" element={<PrivateRoute><NewTaskPage /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
