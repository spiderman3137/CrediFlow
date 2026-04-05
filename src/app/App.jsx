import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { AuthProvider } from './context/AuthContext';
import { LoanProvider } from './context/LoanContext';
import { NotificationProvider } from './context/NotificationContext';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <AuthProvider>
      <LoanProvider>
        <NotificationProvider>
          {/* Global toast container */}
          <Toaster />
          <RouterProvider router={router} />
        </NotificationProvider>
      </LoanProvider>
    </AuthProvider>
  );
}