import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import HomePage from '@/pages/HomePage'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import StagePage from '@/pages/StagePage'
import AdminPage from '@/pages/admin/AdminPage'
import AdminReviewPage from '@/pages/admin/AdminReviewPage'
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage'

import AdminUserDetailPage from '@/pages/admin/AdminUserDetailPage'

function RequireRole({ role, children }: { role: 'ADMIN' | 'PARTICIPANT'; children: JSX.Element }) {
  const auth = useAuthStore()
  if (!auth.token) return <Navigate to="/login" replace />
  if (auth.role !== role) return <Navigate to="/" replace />
  return children
}

function HomeRoute() {
  const auth = useAuthStore()
  if (auth.token) {
    return <Navigate to={auth.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'} replace />
  }
  return <HomePage />
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/dashboard"
          element={
            <RequireRole role="PARTICIPANT">
              <DashboardPage />
            </RequireRole>
          }
        />
        <Route
          path="/dashboard/stage/:stage"
          element={
            <RequireRole role="PARTICIPANT">
              <StagePage />
            </RequireRole>
          }
        />

        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        
        <Route
          path="/admin/dashboard"
          element={
            <RequireRole role="ADMIN">
              <AdminDashboardPage />
            </RequireRole>
          }
        />
        <Route
          path="/admin/users"
          element={
            <RequireRole role="ADMIN">
              <AdminPage />
            </RequireRole>
          }
        />
        <Route
          path="/admin/users/:userId"
          element={
            <RequireRole role="ADMIN">
              <AdminUserDetailPage />
            </RequireRole>
          }
        />
        <Route
          path="/admin/review/all"
          element={
            <RequireRole role="ADMIN">
              <AdminReviewPage />
            </RequireRole>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

