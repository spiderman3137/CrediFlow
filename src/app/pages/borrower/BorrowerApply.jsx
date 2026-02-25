import { DollarSign, Calendar, FileText, Briefcase, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLoans } from '../../context/LoanContext';
import { useNotifications } from '../../context/NotificationContext';
import { toast } from 'sonner';

export function BorrowerApply() {
  const [formData, setFormData] = useState({
    amount: '',
    preferredRate: '',
    duration: '',
    purpose: '',
    description: '',
    income: '',
    employment: '',
  });

  const { user } = useAuth();
  const { addLoan } = useLoans();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) return;

    const loan = addLoan({
      borrowerId: user.id,
      borrowerName: user.name,
      amount: Number(formData.amount),
      interest: Number(formData.preferredRate),
    });

    addNotification('New loan application received', 'lender');

    toast('Loan request submitted successfully!');
    // redirect borrower to dashboard
    navigate('/borrower/dashboard');

    setFormData({
      amount: '',
      preferredRate: '',
      duration: '',
      purpose: '',
      description: '',
      income: '',
      employment: '',
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Post Loan Request</h1>
          <p className="text-gray-600">Submit your loan requirements to our lenders</p>
        </div>

        {/* Info Banner */}
        <div className="card-sharp p-6 bg-blue-50 border-2 border-blue-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Application Tips</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Be accurate with your financial information</li>
                <li>• Clearly state your loan purpose</li>
                <li>• Choose a realistic repayment duration</li>
                <li>• Multiple lenders will review your request</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card-sharp p-8">
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Loan Requirements</h2>

            {/* Loan Amount */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Requested Loan Amount
                </div>
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full input-sharp"
                placeholder="Enter amount (e.g., 5000)"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Range: $1,000 - $50,000 for first-time borrowers
              </p>
            </div>

            {/* Preferred Interest Rate */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Preferred Interest Rate (Annual %)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.preferredRate}
                onChange={(e) => setFormData({ ...formData, preferredRate: e.target.value })}
                className="w-full input-sharp"
                placeholder="e.g., 8.5"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                This is your preferred rate. Final rate depends on lender approval.
              </p>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Loan Duration
                </div>
              </label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full input-sharp"
                required
              >
                <option value="">Select duration</option>
                <option value="6">6 Months</option>
                <option value="12">12 Months (1 Year)</option>
                <option value="24">24 Months (2 Years)</option>
                <option value="36">36 Months (3 Years)</option>
                <option value="48">48 Months (4 Years)</option>
              </select>
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Loan Purpose
                </div>
              </label>
              <select
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                className="w-full input-sharp"
                required
              >
                <option value="">Select purpose</option>
                <option value="business">Business Expansion</option>
                <option value="education">Education</option>
                <option value="medical">Medical Emergency</option>
                <option value="home">Home Improvement</option>
                <option value="debt">Debt Consolidation</option>
                <option value="personal">Personal Use</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Purpose Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full input-sharp"
                rows={4}
                placeholder="Provide details about how you'll use the loan..."
                required
              />
            </div>

            <div className="border-t-2 border-gray-200 pt-6 mt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Financial Information</h2>

              {/* Monthly Income */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Monthly Income
                  </div>
                </label>
                <input
                  type="number"
                  value={formData.income}
                  onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                  className="w-full input-sharp"
                  placeholder="Enter your monthly income"
                  required
                />
              </div>

              {/* Employment Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Employment Status
                  </div>
                </label>
                <select
                  value={formData.employment}
                  onChange={(e) => setFormData({ ...formData, employment: e.target.value })}
                  className="w-full input-sharp"
                  required
                >
                  <option value="">Select status</option>
                  <option value="fulltime">Full-time Employed</option>
                  <option value="parttime">Part-time Employed</option>
                  <option value="selfemployed">Self-employed</option>
                  <option value="business">Business Owner</option>
                  <option value="freelancer">Freelancer</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* EMI Estimate */}
            {formData.amount && formData.preferredRate && formData.duration && (
              <div className="p-6 bg-[#F3F0FF] border-2 border-[#5B2DFF]">
                <h3 className="font-semibold text-gray-900 mb-4">Estimated EMI Breakdown</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Requested Amount</p>
                    <p className="text-lg font-bold text-gray-900">${formData.amount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Loan Duration</p>
                    <p className="text-lg font-bold text-gray-900">{formData.duration} months</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Estimated Monthly EMI</p>
                    <p className="text-lg font-bold text-[#5B2DFF]">
                      $
                      {(
                        (Number(formData.amount) +
                          (Number(formData.amount) * Number(formData.preferredRate) * Number(formData.duration)) /
                            (100 * 12)) /
                        Number(formData.duration)
                      ).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Interest</p>
                    <p className="text-lg font-bold text-orange-600">
                      $
                      {(
                        (Number(formData.amount) * Number(formData.preferredRate) * Number(formData.duration)) /
                        (100 * 12)
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <button type="submit" className="flex-1 btn-primary">
                Submit Loan Request
              </button>
              <button
                type="button"
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
  );
}

export default BorrowerApply;
