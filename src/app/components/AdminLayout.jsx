import { DashboardLayout } from './DashboardLayout';
import { Outlet } from 'react-router-dom';

export function AdminLayout() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
