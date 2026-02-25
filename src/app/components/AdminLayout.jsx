import { DashboardLayout } from './DashboardLayout';
import { Outlet } from 'react-router-dom';

export function AdminLayout() {
  return (
    <DashboardLayout>
      <h1 className="text-xl font-bold p-4">AdminLayout Loaded</h1>
      <Outlet />
    </DashboardLayout>
  );
}
