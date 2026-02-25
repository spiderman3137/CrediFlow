import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Captcha } from '../components/Captcha';
import { UserPlus, Mail, Lock, User, Briefcase, AlertCircle } from 'lucide-react';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('borrower');
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      // Save user's role to the registered users registry in localStorage
      const registeredUsers = JSON.parse(localStorage.getItem('crediflow_registered_users') || '{}');
      registeredUsers[email.toLowerCase()] = { name, role, password, joinDate: new Date().toISOString().split('T')[0] };
      localStorage.setItem('crediflow_registered_users', JSON.stringify(registeredUsers));

      await login(email, password, role);
      navigate(`/${role}/dashboard`);
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
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
                    placeholder="John Doe"
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
                    placeholder="you@example.com"
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
                    placeholder="Min. 6 characters"
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
                    placeholder="Re-enter password"
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
    </div>
  );
}
