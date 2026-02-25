import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Captcha } from '../components/Captcha';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
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
    </div>
  );
}
