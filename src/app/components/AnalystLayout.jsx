import { DashboardLayout } from './DashboardLayout';
import { Outlet } from 'react-router-dom';

export function AnalystLayout() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
