import { DashboardLayout } from './DashboardLayout';
import { Outlet } from 'react-router-dom';

export function AnalystLayout() {
  return (
    <DashboardLayout>
      <h1 className="text-xl font-bold p-4">AnalystLayout Loaded</h1>
      <Outlet />
    </DashboardLayout>
  );
}
