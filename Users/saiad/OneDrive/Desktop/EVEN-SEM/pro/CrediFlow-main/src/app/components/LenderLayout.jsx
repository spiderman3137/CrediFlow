import { DashboardLayout } from './DashboardLayout';
import { Outlet } from 'react-router-dom';

export function LenderLayout() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
