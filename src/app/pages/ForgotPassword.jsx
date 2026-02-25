import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock password reset
    setTimeout(() => {
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-[#F3F0FF] to-[#E8DCFF]">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 shadow-lg p-8">
          {!submitted ? (
            <>
              <div className="mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-[#5B2DFF] to-[#3A1FBF] flex items-center justify-center mb-6">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
                <p className="text-sm text-gray-600">
                  No worries, we'll send you reset instructions.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
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

                <button type="submit" className="w-full btn-primary">
                  Send Reset Link
                </button>

                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 text-sm text-[#5B2DFF] hover:text-[#3A1FBF] font-semibold"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </Link>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 mx-auto flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
              <p className="text-gray-600 mb-6">
                We've sent password reset instructions to <strong>{email}</strong>
              </p>
              <Link to="/login" className="btn-primary inline-block px-8">
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
