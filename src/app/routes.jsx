import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { Settings } from './pages/Settings';
import { NotFound } from './pages/NotFound';
import { Unauthorized } from './pages/Unauthorized';

import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminLoans } from './pages/admin/AdminLoans';
import { LenderDashboard } from './pages/lender/LenderDashboard';
import { LenderOffers } from './pages/lender/LenderOffers';
import { BorrowerDashboard } from './pages/borrower/BorrowerDashboard';
import { BorrowerApply } from './pages/borrower/BorrowerApply';
import { BorrowerOffers } from './pages/borrower/BorrowerOffers';
import { BorrowerEMI } from './pages/borrower/BorrowerEMI';
import { BorrowerHistory } from './pages/borrower/BorrowerHistory';
import { BorrowerBalance } from './pages/borrower/BorrowerBalance';
import { AnalystDashboard } from './pages/analyst/AnalystDashboard';

import { ProtectedRoute } from './routes/ProtectedRoute';
import { AdminLayout } from './components/AdminLayout';
import { LenderLayout } from './components/LenderLayout';
import { BorrowerLayout } from './components/BorrowerLayout';
import { AnalystLayout } from './components/AnalystLayout';

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/forgot-password', element: <ForgotPassword /> },

  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'users', element: <AdminUsers /> },
      { path: 'loans', element: <AdminLoans /> },
      { path: 'transactions', element: <AdminDashboard /> },
      { path: 'analytics', element: <AdminDashboard /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
  {
    path: '/lender',
    element: (
      <ProtectedRoute allowedRoles={["lender"]}>
        <LenderLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <LenderDashboard /> },
      { path: 'offers', element: <LenderOffers /> },
      { path: 'applications', element: <LenderDashboard /> },
      { path: 'repayments', element: <LenderDashboard /> },
      { path: 'earnings', element: <LenderDashboard /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
  {
    path: '/borrower',
    element: (
      <ProtectedRoute allowedRoles={["borrower"]}>
        <BorrowerLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <BorrowerDashboard /> },
      { path: 'apply', element: <BorrowerApply /> },
      { path: 'offers', element: <BorrowerOffers /> },
<<<<<<< HEAD
      { path: 'emi', element: <BorrowerEMI /> },
      { path: 'history', element: <BorrowerHistory /> },
      { path: 'balance', element: <BorrowerBalance /> },
=======
      { path: 'emi', element: <BorrowerDashboard /> },
      { path: 'history', element: <BorrowerDashboard /> },
      { path: 'balance', element: <BorrowerDashboard /> },
>>>>>>> ec1228c5cb63b0c85528e7e4ba8456fadd32f9bf
      { path: 'settings', element: <Settings /> },
    ],
  },
  {
    path: '/analyst',
    element: (
      <ProtectedRoute allowedRoles={["analyst"]}>
        <AnalystLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <AnalystDashboard /> },
      { path: 'reports', element: <AnalystDashboard /> },
      { path: 'defaults', element: <AnalystDashboard /> },
      { path: 'revenue', element: <AnalystDashboard /> },
      { path: 'ratios', element: <AnalystDashboard /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
  { path: '/unauthorized', element: <Unauthorized /> },
  { path: '*', element: <NotFound /> },
]);