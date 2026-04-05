import { DashboardLayout } from './DashboardLayout';
import { Outlet } from 'react-router-dom';

export function BorrowerLayout() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
