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
  X,
} from 'lucide-react';
import {
  Avatar,
  Badge,
  Tooltip,
  Chip,
  Divider,
} from '@mui/material';

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

const ROLE_COLORS = {
  admin: 'from-violet-600 to-purple-800',
  lender: 'from-blue-600 to-indigo-800',
  borrower: 'from-emerald-500 to-teal-700',
  analyst: 'from-orange-500 to-amber-700',
};

const ROLE_ACCENT = {
  admin: '#7c3aed',
  lender: '#2563eb',
  borrower: '#059669',
  analyst: '#d97706',
};

export function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const { getNotificationsForRole, getUnreadCountForRole, markAsRead } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);

  if (!user) return null;

  const displayName = user.name || user.email || 'User';
  const displayInitial = displayName.charAt(0).toUpperCase();
  const displayRole = user.role || 'user';
  const roleGradient = ROLE_COLORS[displayRole] || 'from-slate-600 to-slate-800';
  const roleAccent = ROLE_ACCENT[displayRole] || '#5B2DFF';

  const roleNotifications = getNotificationsForRole(displayRole);
  const unreadCount = getUnreadCountForRole(displayRole);

  const navigation = navigationByRole[displayRole] || [];
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
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar */}
      <aside
        className="w-64 flex flex-col shadow-xl"
        style={{ background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)' }}
      >
        {/* Logo */}
        <div className={`h-16 flex items-center px-6 bg-gradient-to-r ${roleGradient}`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <span className="text-white font-black text-sm">CF</span>
            </div>
            <h1 className="text-lg font-bold text-white tracking-wide">CrediFlow</h1>
          </div>
        </div>

        {/* User Info */}
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Avatar
              sx={{
                width: 42,
                height: 42,
                background: `linear-gradient(135deg, ${roleAccent}, ${roleAccent}88)`,
                fontSize: '1rem',
                fontWeight: 700,
                boxShadow: `0 0 0 3px ${roleAccent}33`,
              }}
            >
              {displayInitial}
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white text-sm truncate">{displayName}</p>
              <Chip
                label={displayRole.toUpperCase()}
                size="small"
                sx={{
                  height: 18,
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  backgroundColor: `${roleAccent}33`,
                  color: '#fff',
                  mt: 0.5,
                  '& .MuiChip-label': { px: 1 },
                }}
              />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-3 mb-3">
            Navigation
          </p>
          <div className="space-y-0.5">
            {navigation.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Tooltip key={item.path} title={item.name} placement="right" arrow disableHoverListener>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                      isActive
                        ? 'text-white'
                        : 'text-slate-400 hover:text-white hover:bg-white/8'
                    }`}
                    style={isActive ? {
                      background: `linear-gradient(90deg, ${roleAccent}33, ${roleAccent}11)`,
                      borderLeft: `3px solid ${roleAccent}`,
                    } : {}}
                  >
                    <Icon className="w-4.5 h-4.5 flex-shrink-0" style={{ width: 18, height: 18 }} />
                    <span className="font-medium text-sm">{item.name}</span>
                    {isActive && (
                      <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-70" style={{ width: 14, height: 14 }} />
                    )}
                  </Link>
                </Tooltip>
              );
            })}
          </div>
        </nav>

        {/* Footer Actions */}
        <div className="px-3 py-4 border-t border-white/10 space-y-0.5">
          <Link
            to={`/${displayRole}/settings`}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm ${
              location.pathname.includes('/settings')
                ? 'bg-white/15 text-white'
                : 'text-slate-400 hover:text-white hover:bg-white/8'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span className="font-medium">Settings</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200 text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm sticky top-0 z-30">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.path} className="flex items-center gap-1.5">
                {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-300" />}
                <Link
                  to={crumb.path}
                  className={`transition-colors ${
                    index === breadcrumbs.length - 1
                      ? 'font-semibold text-slate-900'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {crumb.name}
                </Link>
              </div>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <Tooltip title="Notifications" arrow>
                <button
                  onClick={() => setNotifOpen((o) => !o)}
                  className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <Badge
                    badgeContent={unreadCount}
                    color="error"
                    max={9}
                    sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', minWidth: 16, height: 16 } }}
                  >
                    <Bell className="w-4.5 h-4.5 text-slate-600" style={{ width: 18, height: 18 }} />
                  </Badge>
                </button>
              </Tooltip>

              {/* Notification Dropdown */}
              {notifOpen && (
                <div className="absolute right-0 top-12 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                    <span className="font-semibold text-sm text-slate-800">Notifications</span>
                    <button
                      onClick={() => setNotifOpen(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {roleNotifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-sm text-slate-400">
                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        No notifications yet
                      </div>
                    ) : (
                      roleNotifications.map((n) => (
                        <div
                          key={n.id}
                          className={`px-4 py-3 cursor-pointer hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors ${!n.read ? 'bg-blue-50/50' : ''}`}
                          onClick={() => markAsRead(n.id)}
                        >
                          {!n.read && (
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mr-2 mb-0.5" />
                          )}
                          <p className="text-xs font-medium text-slate-800">{n.message}</p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {new Date(n.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <Divider orientation="vertical" flexItem sx={{ my: 1 }} />

            {/* User Avatar */}
            <div className="flex items-center gap-2.5">
              <Avatar
                sx={{
                  width: 34,
                  height: 34,
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  background: `linear-gradient(135deg, ${roleAccent}, ${roleAccent}88)`,
                }}
              >
                {displayInitial}
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-slate-800 leading-tight">{displayName}</p>
                <p className="text-xs text-slate-400 capitalize">{displayRole}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
