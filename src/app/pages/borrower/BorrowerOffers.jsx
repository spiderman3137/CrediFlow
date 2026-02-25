import { DollarSign, Percent, Calendar, CheckCircle } from 'lucide-react';
import { useLoans } from '../../context/LoanContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

export function BorrowerOffers() {
    const { offers, addLoan, deleteOffer } = useLoans();
    const { user } = useAuth();

    const handleAcceptOffer = (offer) => {
        // Convert offer to an active loan
        addLoan({
            borrowerId: user.id,
            borrowerName: user.name,
            amount: Number(offer.amount),
            interest: Number(offer.interestRate),
            term: Number(offer.tenure),
            status: 'active', // Since it's pre-approved by a lender, we can make it active or pending
        });
        deleteOffer(offer.id); // Remove the offer from the market
        toast('Loan offer accepted successfully!');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Loan Offers</h1>
                <p className="text-gray-600">Browse and accept loan offers from our lenders</p>
            </div>

            <div className="space-y-4">
                {offers.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 bg-white border border-gray-200 shadow-sm">
                        No loan offers available at the moment. Please check back later.
                    </div>
                ) : (
                    offers.map((offer) => (
                        <div key={offer.id} className="card-sharp p-6 flex flex-col md:flex-row gap-6 justify-between items-center transition-all hover:border-[#5B2DFF] border-2 border-transparent bg-white shadow-sm">
                            <div className="flex-1 space-y-4 w-full">
                                <div className="flex items-center gap-2">
                                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase rounded-full tracking-wider">
                                        {offer.riskCategory} Risk
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        Posted on {new Date(offer.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1 flex items-center gap-1"><DollarSign className="w-4 h-4" /> Amount</p>
                                        <p className="text-xl font-bold text-gray-900">${Number(offer.amount).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1 flex items-center gap-1"><Percent className="w-4 h-4" /> Interest</p>
                                        <p className="text-xl font-bold text-[#5B2DFF]">{offer.interestRate}% <span className="text-xs text-gray-400 font-normal">p.a.</span></p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1 flex items-center gap-1"><Calendar className="w-4 h-4" /> Tenure</p>
                                        <p className="text-xl font-bold text-gray-900">{offer.tenure} <span className="text-sm text-gray-500 font-normal">Months</span></p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Monthly EMI</p>
                                        <p className="text-xl font-bold text-orange-600">
                                            ${((Number(offer.amount) * (1 + (Number(offer.interestRate) || 0) / 100)) / (Number(offer.tenure) || 12)).toFixed(2)}
                                        </p>
                                    </div>
                                </div>

                                {offer.description && (
                                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-100">
                                        <strong>Terms:</strong> {offer.description}
                                    </div>
                                )}
                            </div>

                            <div className="w-full md:w-auto">
                                <button
                                    onClick={() => handleAcceptOffer(offer)}
                                    className="w-full md:w-auto btn-primary flex items-center justify-center gap-2 px-8 py-3 bg-[#28C76F] hover:bg-[#209d57]"
                                >
                                    <CheckCircle className="w-5 h-5" />
                                    Accept Offer
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
