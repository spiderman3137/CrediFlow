import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  BarChart3,
  LogOut,
  Bell,
  ChevronRight,
  Settings,
  DollarSign,
  CheckSquare,
  TrendingUp,
  Clock,
  PieChart,
  AlertTriangle,
  FilePlus,
  Calendar,
  History,
  Wallet,
} from 'lucide-react';

const navigationByRole = {
  admin: [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Manage Users', path: '/admin/users', icon: Users },
    { name: 'Loans Monitoring', path: '/admin/loans', icon: FileText },
    { name: 'Transactions', path: '/admin/transactions', icon: CreditCard },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
  ],
  lender: [
    { name: 'Dashboard', path: '/lender/dashboard', icon: LayoutDashboard },
    { name: 'Create Offer', path: '/lender/offers', icon: FilePlus },
    { name: 'Applications', path: '/lender/applications', icon: CheckSquare },
    { name: 'Repayments', path: '/lender/repayments', icon: Calendar },
    { name: 'Earnings', path: '/lender/earnings', icon: TrendingUp },
  ],
  borrower: [
    { name: 'Dashboard', path: '/borrower/dashboard', icon: LayoutDashboard },
    { name: 'Lender Offers', path: '/borrower/offers', icon: DollarSign },
    { name: 'Post Request', path: '/borrower/apply', icon: FilePlus },
    { name: 'EMI Schedule', path: '/borrower/emi', icon: Clock },
    { name: 'Payment History', path: '/borrower/history', icon: History },
    { name: 'Balance', path: '/borrower/balance', icon: Wallet },
  ],
  analyst: [
    { name: 'Dashboard', path: '/analyst/dashboard', icon: LayoutDashboard },
    { name: 'Approval Reports', path: '/analyst/reports', icon: PieChart },
    { name: 'Default Monitoring', path: '/analyst/defaults', icon: AlertTriangle },
    { name: 'Revenue Trends', path: '/analyst/revenue', icon: TrendingUp },
    { name: 'Financial Ratios', path: '/analyst/ratios', icon: BarChart3 },
  ],
};

export function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const { getNotificationsForRole, getUnreadCountForRole, markAsRead } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);

  if (!user) return null;

  const roleNotifications = getNotificationsForRole(user.role);
  const unreadCount = getUnreadCountForRole(user.role);

  const navigation = navigationByRole[user.role] || [];
  const pathParts = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = pathParts.map((part, index) => ({
    name: part.charAt(0).toUpperCase() + part.slice(1),
    path: '/' + pathParts.slice(0, index + 1).join('/'),
  }));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F3F0FF] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r-2 border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="h-16 border-b-2 border-gray-200 flex items-center px-6 bg-gradient-to-r from-[#5B2DFF] to-[#3A1FBF]">
          <h1 className="text-xl font-bold text-white">CrediFlow</h1>
        </div>

        {/* User Info */}
        <div className="p-6 border-b-2 border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#5B2DFF] to-[#8C6CFF] flex items-center justify-center text-white font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 transition-colors ${isActive
                    ? 'bg-[#5B2DFF] text-white'
                    : 'text-gray-700 hover:bg-[#F3F0FF]'
                    }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{item.name}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t-2 border-gray-200 space-y-1">
          <Link
            to={`/${user.role}/settings`}
            className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${location.pathname.includes('/settings')
              ? 'bg-[#5B2DFF] text-white'
              : 'text-gray-700 hover:bg-[#F3F0FF]'
              }`}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-16 bg-white border-b-2 border-gray-200 flex items-center justify-between px-8">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.path} className="flex items-center gap-2">
                {index > 0 && <ChevronRight className="w-4 h-4" />}
                <Link
                  to={crumb.path}
                  className={`hover:text-[#5B2DFF] ${index === breadcrumbs.length - 1 ? 'font-semibold text-gray-900' : ''
                    }`}
                >
                  {crumb.name}
                </Link>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setNotifOpen((o) => !o)}
                className="relative p-2 hover:bg-gray-100 transition-colors"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 shadow-lg z-50">
                  {roleNotifications.length === 0 ? (
                    <div className="p-4 text-sm text-gray-500">No notifications</div>
                  ) : (
                    roleNotifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 cursor-pointer border-b last:border-b-0 ${!n.read ? 'bg-gray-100' : ''}`}
                        onClick={() => markAsRead(n.id)}
                      >
                        <p className="text-sm text-gray-800">{n.message}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(n.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#5B2DFF] to-[#8C6CFF] flex items-center justify-center text-white text-sm font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
