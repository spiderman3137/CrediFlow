import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
<<<<<<< HEAD
import { normalizeRole } from '../lib/crediflow';
=======
>>>>>>> 5ad99e5b2827ca57162b42a5a11994b1a8b4ac5c

export function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

<<<<<<< HEAD
  if (allowedRoles && user && !allowedRoles.includes(normalizeRole(user.role))) {
=======
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
>>>>>>> 5ad99e5b2827ca57162b42a5a11994b1a8b4ac5c
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
