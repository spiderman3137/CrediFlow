import { DashboardLayout } from './DashboardLayout';
import { Outlet } from 'react-router-dom';

export function BorrowerLayout() {
  return (
    <DashboardLayout>
      <h1 className="text-xl font-bold p-4">BorrowerLayout Loaded</h1>
      <Outlet />
    </DashboardLayout>
  );
}
