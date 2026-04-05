import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import { ShieldCheck, ChartColumnBig, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Captcha } from '../components/Captcha';
import { getErrorMessage } from '../../api/responseUtils';
import { getDashboardPath } from '../lib/crediflow';
=======
import { useAuth } from '../context/AuthContext';
import { Captcha } from '../components/Captcha';
>>>>>>> 5ad99e5b2827ca57162b42a5a11994b1a8b4ac5c

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

<<<<<<< HEAD
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!captchaVerified) {
      setError('Please complete the CAPTCHA verification.');
=======
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!captchaVerified) {
      setError('Please complete the CAPTCHA verification');
      return;
    }

    if (!email || !password) {
      setError('Please fill in all fields');
>>>>>>> 5ad99e5b2827ca57162b42a5a11994b1a8b4ac5c
      return;
    }

    setLoading(true);

    try {
<<<<<<< HEAD
      const session = await login(email, password);
      navigate(getDashboardPath(session?.role));
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to sign in with those credentials.'));
=======
      // Look up the user's role from the registered users registry
      const registeredUsers = JSON.parse(localStorage.getItem('crediflow_registered_users') || '{}');
      const registeredUser = registeredUsers[email.toLowerCase()];

      let role = 'borrower';
      if (registeredUser) {
        // Use the role they selected during registration
        role = registeredUser.role;
      } else if (email.includes('admin')) {
        role = 'admin';
      } else if (email.includes('lender')) {
        role = 'lender';
      } else if (email.includes('analyst')) {
        role = 'analyst';
      }

      await login(email, password, role);

      // Redirect based on role
      navigate(`/${role}/dashboard`);
    } catch (err) {
      setError('Invalid credentials. Please try again.');
>>>>>>> 5ad99e5b2827ca57162b42a5a11994b1a8b4ac5c
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  const highlights = [
    {
      title: 'Live servicing data',
      text: 'Track loan decisions, repayments, and balance changes from the backend in one place.',
      icon: ChartColumnBig,
    },
    {
      title: 'Role-based workspaces',
      text: 'Borrowers, lenders, analysts, and admins each land in a dashboard tailored to their workflow.',
      icon: ShieldCheck,
    },
    {
      title: 'Faster operations',
      text: 'Approve, review, and export directly from a connected workflow instead of juggling spreadsheets.',
      icon: Zap,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f3eb] lg:grid lg:grid-cols-[1.1fr_0.9fr]">
      <section className="hidden lg:flex flex-col justify-between bg-[radial-gradient(circle_at_top_left,_rgba(238,167,74,0.32),_transparent_38%),linear-gradient(135deg,_#0f172a,_#1e293b_55%,_#334155)] p-12 text-white">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm uppercase tracking-[0.2em] text-amber-100">
            CrediFlow
          </div>
          <div className="max-w-xl space-y-4">
            <h1 className="text-5xl font-semibold leading-tight">
              Loan operations that feel clear, fast, and audit-ready.
            </h1>
            <p className="text-lg text-slate-200">
              Sign in to your connected workspace and manage the full lending cycle with live backend data.
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          {highlights.map(({ title, text, icon: Icon }) => (
            <div key={title} className="rounded-3xl border border-white/10 bg-white/8 p-5 backdrop-blur-sm">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-300/20 text-amber-200">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mb-2 text-lg font-semibold">{title}</h2>
              <p className="text-sm leading-6 text-slate-200">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-6 py-10">
        <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
          <div className="mb-8 space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-700">Welcome back</p>
            <h2 className="text-3xl font-semibold text-slate-900">Sign in to CrediFlow</h2>
            <p className="text-sm text-slate-500">Use your registered account to access your role-specific dashboard.</p>
          </div>

          {error ? (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full input-sharp"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full input-sharp"
                placeholder="Enter your password"
                required
              />
            </div>

            <Captcha onVerify={setCaptchaVerified} />

            <button
              type="submit"
              disabled={loading || !captchaVerified}
              className="w-full rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

            <div className="flex items-center justify-between text-sm">
              <Link to="/forgot-password" className="font-semibold text-slate-600 hover:text-slate-900">
                Forgot password?
              </Link>
              <Link to="/register" className="font-semibold text-amber-700 hover:text-amber-800">
                Create account
              </Link>
            </div>
          </form>
        </div>
      </section>
=======
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#5B2DFF] to-[#3A1FBF] p-12 flex-col justify-between text-white">
        <div>
          <h1 className="text-5xl font-bold mb-4">CrediFlow</h1>
          <p className="text-xl text-purple-200">Complete Loan Lifecycle Management</p>
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <div className="w-6 h-1 bg-white rounded-full"></div>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Real-time Analytics</h3>
              <p className="text-purple-200 text-sm">Monitor loan performance and track metrics</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <div className="w-6 h-1 bg-white rounded-full"></div>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Secure Platform</h3>
              <p className="text-purple-200 text-sm">Bank-grade security for all transactions</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <div className="w-6 h-1 bg-white rounded-full"></div>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Fast Processing</h3>
              <p className="text-purple-200 text-sm">Quick loan approvals and disbursements</p>
            </div>
          </div>
        </div>

        <div className="text-sm text-purple-200">
          © 2026 CrediFlow. All rights reserved.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#F3F0FF]">
        <div className="w-full max-w-md">
          <div className="bg-white border border-gray-200 shadow-lg p-8">
            <div className="mb-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
                <p className="text-sm text-gray-600 mt-1">Sign in to your account</p>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full input-sharp"
                  placeholder="you@example.com"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Sign in with the email you used during registration
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full input-sharp"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <Captcha onVerify={setCaptchaVerified} />

              <button
                type="submit"
                disabled={loading || !captchaVerified}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              <div className="flex items-center justify-between text-sm">
                <Link
                  to="/forgot-password"
                  className="text-[#5B2DFF] hover:text-[#3A1FBF] font-semibold"
                >
                  Forgot Password?
                </Link>
                <Link
                  to="/register"
                  className="text-[#5B2DFF] hover:text-[#3A1FBF] font-semibold"
                >
                  Create Account
                </Link>
              </div>
            </form>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </div>
      </div>
>>>>>>> 5ad99e5b2827ca57162b42a5a11994b1a8b4ac5c
    </div>
  );
}
