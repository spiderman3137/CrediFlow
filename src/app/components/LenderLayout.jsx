import { DashboardLayout } from './DashboardLayout';
import { Outlet } from 'react-router-dom';

export function LenderLayout() {
  return (
    <DashboardLayout>
      <h1 className="text-xl font-bold p-4">LenderLayout Loaded</h1>
      <Outlet />
    </DashboardLayout>
  );
}
