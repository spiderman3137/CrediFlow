import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import { BadgeIndianRupee, Building2, SearchCheck, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Captcha } from '../components/Captcha';
import { getErrorMessage } from '../../api/responseUtils';
import { getDashboardPath } from '../lib/crediflow';

const roleCards = [
  { value: 'borrower', title: 'Borrower', text: 'Apply for loans and manage repayments.', icon: BadgeIndianRupee },
  { value: 'lender', title: 'Lender', text: 'Review applications and approve qualified borrowers.', icon: Building2 },
  { value: 'analyst', title: 'Analyst', text: 'Track portfolio health, risk, and exports.', icon: SearchCheck },
  { value: 'admin', title: 'Admin', text: 'Oversee users, loans, and platform activity.', icon: Shield },
];
=======
import { useAuth } from '../context/AuthContext';
import { Captcha } from '../components/Captcha';
import { UserPlus, Mail, Lock, User, Briefcase, AlertCircle } from 'lucide-react';
>>>>>>> 5ad99e5b2827ca57162b42a5a11994b1a8b4ac5c

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('borrower');
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
<<<<<<< HEAD
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!captchaVerified) {
      setError('Please complete the CAPTCHA verification.');
=======
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!captchaVerified) {
      setError('Please complete the CAPTCHA verification');
      return;
    }

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
>>>>>>> 5ad99e5b2827ca57162b42a5a11994b1a8b4ac5c
      return;
    }

    if (password !== confirmPassword) {
<<<<<<< HEAD
      setError('Passwords do not match.');
=======
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
>>>>>>> 5ad99e5b2827ca57162b42a5a11994b1a8b4ac5c
      return;
    }

    setLoading(true);

    try {
<<<<<<< HEAD
      const session = await register({
        name,
        email,
        password,
        role: role.toUpperCase(),
      });
      navigate(getDashboardPath(session?.role));
    } catch (err) {
      setError(getErrorMessage(err, 'Registration failed. Please review the form and try again.'));
=======
      // Save user's role to the registered users registry in localStorage
      const registeredUsers = JSON.parse(localStorage.getItem('crediflow_registered_users') || '{}');
      registeredUsers[email.toLowerCase()] = { name, role, password, joinDate: new Date().toISOString().split('T')[0] };
      localStorage.setItem('crediflow_registered_users', JSON.stringify(registeredUsers));

      await login(email, password, role);
      navigate(`/${role}/dashboard`);
    } catch (err) {
      setError('Registration failed. Please try again.');
>>>>>>> 5ad99e5b2827ca57162b42a5a11994b1a8b4ac5c
    } finally {
      setLoading(false);
    }
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-[#fcfaf5] lg:grid lg:grid-cols-[1fr_0.95fr]">
      <section className="hidden lg:flex flex-col justify-between bg-[linear-gradient(160deg,_#7c2d12,_#9a3412_40%,_#fed7aa)] p-12 text-white">
        <div className="space-y-5">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-orange-100">Join CrediFlow</p>
          <h1 className="max-w-xl text-5xl font-semibold leading-tight">
            Create a connected account for your role in the lending lifecycle.
          </h1>
          <p className="max-w-lg text-base leading-7 text-orange-50/90">
            Every account lands in a real backend-powered workspace, from borrower applications to analyst exports.
          </p>
        </div>

        <div className="grid gap-4">
          {roleCards.map(({ value, title, text, icon: Icon }) => (
            <div key={value} className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mb-2 text-lg font-semibold">{title}</h2>
              <p className="text-sm text-orange-50/90">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-6 py-10">
        <div className="w-full max-w-xl rounded-[2rem] border border-orange-100 bg-white p-8 shadow-[0_24px_80px_rgba(124,45,18,0.12)]">
          <div className="mb-8 space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-orange-700">Account setup</p>
            <h2 className="text-3xl font-semibold text-slate-900">Create your workspace</h2>
            <p className="text-sm text-slate-500">Pick a role, register securely, and start working with live loan data.</p>
          </div>

          {error ? (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Full name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full input-sharp"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full input-sharp"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Choose role</label>
              <div className="grid gap-3 md:grid-cols-2">
                {roleCards.map(({ value, title, text }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRole(value)}
                    className={`rounded-2xl border px-4 py-4 text-left transition ${
                      role === value
                        ? 'border-orange-400 bg-orange-50 shadow-sm'
                        : 'border-slate-200 hover:border-orange-200 hover:bg-orange-50/50'
                    }`}
                  >
                    <p className="font-semibold text-slate-900">{title}</p>
                    <p className="mt-1 text-sm text-slate-500">{text}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full input-sharp"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Confirm password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="w-full input-sharp"
                  required
                />
              </div>
            </div>

            <div className="rounded-2xl bg-orange-50 px-4 py-3 text-sm text-slate-600">
              Passwords must be at least 8 characters and include an uppercase letter, lowercase letter, number, and special character.
            </div>

            <Captcha onVerify={setCaptchaVerified} />

            <button
              type="submit"
              disabled={loading || !captchaVerified}
              className="w-full rounded-2xl bg-orange-700 px-5 py-3 font-semibold text-white transition hover:bg-orange-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>

            <p className="text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-orange-700 hover:text-orange-800">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </section>
=======
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#5B2DFF] to-[#3A1FBF] p-12 flex-col justify-between text-white">
        <div>
          <h1 className="text-5xl font-bold mb-4">CrediFlow</h1>
          <p className="text-xl text-purple-200">Join Our Lending Platform</p>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-semibold mb-4">Choose Your Role</h3>
            <div className="space-y-4">
              <div className="bg-white/10 p-4 border-2 border-white/20">
                <h4 className="font-semibold mb-1"> Borrower</h4>
                <p className="text-sm text-purple-200">Apply for loans and manage repayments</p>
              </div>
              <div className="bg-white/10 p-4 border-2 border-white/20">
                <h4 className="font-semibold mb-1"> Lender</h4>
                <p className="text-sm text-purple-200">Offer loans and earn interest</p>
              </div>
              <div className="bg-white/10 p-4 border-2 border-white/20">
                <h4 className="font-semibold mb-1"> Analyst</h4>
                <p className="text-sm text-purple-200">Monitor trends and generate reports</p>
              </div>
              <div className="bg-white/10 p-4 border-2 border-white/20">
                <h4 className="font-semibold mb-1"> Admin</h4>
                <p className="text-sm text-purple-200">Platform management and oversight</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-sm text-purple-200">
          © 2026 CrediFlow. All rights reserved.
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#F3F0FF]">
        <div className="w-full max-w-md">
          <div className="bg-white border border-gray-200 shadow-lg p-8">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#5B2DFF] to-[#3A1FBF] flex items-center justify-center">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
                  <p className="text-sm text-gray-600">Join CrediFlow today</p>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full input-sharp pl-11"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full input-sharp pl-11"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Role
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full input-sharp pl-11 appearance-none"
                    required
                  >
                    <option value="borrower">Borrower</option>
                    <option value="lender">Lender</option>
                    <option value="analyst">Analyst</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full input-sharp pl-11"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full input-sharp pl-11"
                    required
                  />
                </div>
              </div>

              <Captcha onVerify={setCaptchaVerified} />

              <button
                type="submit"
                disabled={loading || !captchaVerified}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>

              <div className="text-center text-sm">
                <span className="text-gray-600">Already have an account? </span>
                <Link
                  to="/login"
                  className="text-[#5B2DFF] hover:text-[#3A1FBF] font-semibold"
                >
                  Sign In
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
>>>>>>> 5ad99e5b2827ca57162b42a5a11994b1a8b4ac5c
    </div>
  );
}
