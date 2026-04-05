import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { normalizeRole } from '../lib/crediflow';

export function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(normalizeRole(user.role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
