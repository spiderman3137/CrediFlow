import { DollarSign, Percent, Calendar, Target, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useLoans } from '../../context/LoanContext';

export function LenderOffers() {
  const [formData, setFormData] = useState({
    amount: '',
    interestRate: '',
    tenure: '',
    riskCategory: 'low',
    description: '',
  });

  const { addOffer } = useLoans();

  const handleSubmit = (e) => {
    e.preventDefault();
    addOffer(formData);
    alert('Loan offer created successfully!');
    setFormData({
      amount: '',
      interestRate: '',
      tenure: '',
      riskCategory: 'low',
      description: '',
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Loan Offer</h1>
        <p className="text-gray-600">Set up a new loan offer for borrowers</p>
      </div>

      {/* Info Banner */}
      <div className="card-sharp p-6 bg-blue-50 border-2 border-blue-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Loan Offer Guidelines</h3>
            <p className="text-sm text-blue-700">
              Set competitive interest rates based on risk category. Lower risk loans should have
              lower interest rates. Ensure your offer terms comply with platform regulations.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card-sharp p-8">
        <div className="space-y-6">
          {/* Loan Amount */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Loan Amount
              </div>
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full input-sharp"
              placeholder="Enter amount (e.g., 10000)"
              required
            />
            <p className="mt-1 text-xs text-gray-500">Minimum: $1,000 | Maximum: $100,000</p>
          </div>

          {/* Interest Rate */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4" />
                Interest Rate (Annual)
              </div>
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.interestRate}
              onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
              className="w-full input-sharp"
              placeholder="Enter rate (e.g., 8.5)"
              required
            />
            <p className="mt-1 text-xs text-gray-500">Recommended range: 5% - 15%</p>
          </div>

          {/* Tenure */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Loan Tenure (Months)
              </div>
            </label>
            <select
              value={formData.tenure}
              onChange={(e) => setFormData({ ...formData, tenure: e.target.value })}
              className="w-full input-sharp"
              required
            >
              <option value="">Select tenure</option>
              <option value="6">6 Months</option>
              <option value="12">12 Months (1 Year)</option>
              <option value="24">24 Months (2 Years)</option>
              <option value="36">36 Months (3 Years)</option>
              <option value="48">48 Months (4 Years)</option>
              <option value="60">60 Months (5 Years)</option>
            </select>
          </div>

          {/* Risk Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Risk Category
              </div>
            </label>
            <div className="grid grid-cols-3 gap-4">
              {['low', 'medium', 'high'].map((risk) => (
                <label
                  key={risk}
                  className={`p-4 border-2 cursor-pointer transition-all ${formData.riskCategory === risk
                      ? 'border-[#5B2DFF] bg-[#F3F0FF]'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <input
                    type="radio"
                    name="riskCategory"
                    value={risk}
                    checked={formData.riskCategory === risk}
                    onChange={(e) =>
                      setFormData({ ...formData, riskCategory: e.target.value })
                    }
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div
                      className={`w-3 h-3 mx-auto mb-2 ${risk === 'low'
                          ? 'bg-green-500'
                          : risk === 'medium'
                            ? 'bg-orange-500'
                            : 'bg-red-500'
                        }`}
                    ></div>
                    <p className="font-semibold text-gray-900 capitalize">{risk} Risk</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {risk === 'low'
                        ? 'Secured loans'
                        : risk === 'medium'
                          ? 'Standard loans'
                          : 'Higher returns'}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Offer Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full input-sharp"
              rows={4}
              placeholder="Add any additional terms or conditions..."
            />
          </div>

          {/* Calculation Summary */}
          {formData.amount && formData.interestRate && formData.tenure && (
            <div className="p-6 bg-[#F3F0FF] border-2 border-[#5B2DFF]">
              <h3 className="font-semibold text-gray-900 mb-4">Offer Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Principal Amount</p>
                  <p className="text-lg font-bold text-gray-900">${formData.amount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Monthly Interest</p>
                  <p className="text-lg font-bold text-gray-900">
                    $
                    {(
                      (Number(formData.amount) * Number(formData.interestRate)) /
                      100 /
                      12
                    ).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Interest</p>
                  <p className="text-lg font-bold text-gray-900">
                    $
                    {(
                      ((Number(formData.amount) * Number(formData.interestRate)) / 100) *
                      (Number(formData.tenure) / 12)
                    ).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Return</p>
                  <p className="text-lg font-bold text-green-600">
                    $
                    {(
                      Number(formData.amount) +
                      ((Number(formData.amount) * Number(formData.interestRate)) / 100) *
                      (Number(formData.tenure) / 12)
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button type="submit" className="flex-1 btn-primary">
              Create Offer
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
