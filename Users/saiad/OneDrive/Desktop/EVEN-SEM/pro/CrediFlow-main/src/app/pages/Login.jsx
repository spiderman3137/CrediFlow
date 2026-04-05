import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, ChartColumnBig, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Captcha } from '../components/Captcha';
import { getErrorMessage } from '../../api/responseUtils';
import { getDashboardPath } from '../lib/crediflow';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!captchaVerified) {
      setError('Please complete the CAPTCHA verification.');
      return;
    }

    setLoading(true);

    try {
      const session = await login(email, password);
      navigate(getDashboardPath(session?.role));
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to sign in with those credentials.'));
    } finally {
      setLoading(false);
    }
  };

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
    </div>
  );
}
