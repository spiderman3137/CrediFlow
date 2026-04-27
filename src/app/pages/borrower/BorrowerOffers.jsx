import { DollarSign, Percent, Calendar, CheckCircle } from 'lucide-react';
import { useLoans } from '../../context/LoanContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { useState } from 'react';
import { Pagination, Stack, Typography, Card, CardContent, Divider, Chip, Button, Paper } from '@mui/material';

export function BorrowerOffers() {
    const { offers, addLoan, deleteOffer } = useLoans();
    const { user } = useAuth();
    const [page, setPage] = useState(1);
    const offersPerPage = 10;

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const paginatedOffers = offers.slice((page - 1) * offersPerPage, page * offersPerPage);

    const handleAcceptOffer = (offer) => {
        // Convert offer to an active loan
        addLoan({
            principalAmount: Number(offer.amount),
            interestRate: Number(offer.interestRate),
            durationMonths: Number(offer.tenure),
            purpose: offer.description || 'Pre-approved loan offer',
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

            <Stack spacing={3}>
                {offers.length === 0 ? (
                    <Paper variant="outlined" sx={{ p: 6, textAlign: 'center', backgroundColor: '#f9fafb', borderColor: '#e2e8f0', borderRadius: '1rem' }}>
                        <Typography variant="body1" color="text.secondary">No loan offers available at the moment. Please check back later.</Typography>
                    </Paper>
                ) : (
                    paginatedOffers.map((offer) => (
                        <Card key={offer.id} elevation={0} variant="outlined" sx={{ borderRadius: '1rem', transition: 'all 0.2s', '&:hover': { borderColor: '#5B2DFF', boxShadow: '0 4px 20px rgba(91,45,255,0.08)' } }}>
                            <CardContent sx={{ p: 4, '&:last-child': { pb: 4 } }}>
                                <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
                                    <div className="flex-1 space-y-4 w-full">
                                        <div className="flex items-center gap-2">
                                            <Chip label={`${offer.riskCategory} Risk`} size="small" sx={{ backgroundColor: '#d1fae5', color: '#166534', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', borderRadius: '4px' }} />
                                            <Typography variant="caption" color="text.secondary">
                                                Posted on {new Date(offer.createdAt).toLocaleDateString()}
                                            </Typography>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                            <div>
                                                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}><DollarSign className="w-4 h-4" /> Amount</Typography>
                                                <Typography variant="h6" fontWeight="bold" color="text.primary">${Number(offer.amount).toLocaleString()}</Typography>
                                            </div>
                                            <div>
                                                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}><Percent className="w-4 h-4" /> Interest</Typography>
                                                <Typography variant="h6" fontWeight="bold" color="#5B2DFF">{offer.interestRate}% <span className="text-xs text-gray-400 font-normal">p.a.</span></Typography>
                                            </div>
                                            <div>
                                                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}><Calendar className="w-4 h-4" /> Tenure</Typography>
                                                <Typography variant="h6" fontWeight="bold" color="text.primary">{offer.tenure} <span className="text-sm text-gray-500 font-normal">Months</span></Typography>
                                            </div>
                                            <div>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Monthly EMI</Typography>
                                                <Typography variant="h6" fontWeight="bold" color="#ea580c">
                                                    ${((Number(offer.amount) * (1 + (Number(offer.interestRate) || 0) / 100)) / (Number(offer.tenure) || 12)).toFixed(2)}
                                                </Typography>
                                            </div>
                                        </div>

                                        {offer.description && (
                                            <Typography variant="body2" sx={{ backgroundColor: '#f8fafc', p: 1.5, borderRadius: '8px', border: '1px solid #f1f5f9', color: '#475569', mt: 2 }}>
                                                <strong>Terms:</strong> {offer.description}
                                            </Typography>
                                        )}
                                    </div>

                                    <div className="w-full md:w-auto md:pl-4">
                                        <Button
                                            variant="contained"
                                            onClick={() => handleAcceptOffer(offer)}
                                            fullWidth
                                            sx={{ 
                                                backgroundColor: '#28C76F', 
                                                '&:hover': { backgroundColor: '#209d57' },
                                                px: 4, py: 1.5,
                                                borderRadius: '0.75rem',
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                boxShadow: 'none'
                                            }}
                                            startIcon={<CheckCircle className="w-5 h-5" />}
                                        >
                                            Accept Offer
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
                
                {offers.length > offersPerPage && (
                    <div className="flex justify-center mt-6">
                        <Pagination 
                            count={Math.ceil(offers.length / offersPerPage)} 
                            page={page} 
                            onChange={handlePageChange} 
                            color="primary"
                        />
                    </div>
                )}
            </Stack>
        </div>
    );
}
