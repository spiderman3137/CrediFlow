import React, { createContext, useContext, useState, useEffect } from 'react';
import { loanService } from '../../api/loanService';
import { useAuth } from './AuthContext';
import { getPageItems } from '../../api/responseUtils';
import { normalizeLoan, normalizeRole } from '../lib/crediflow';

const LoanContext = createContext(null);

export function LoanProvider({ children }) {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offers, setOffers] = useState([]);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchLoans();
    } else {
      setLoans([]);
    }
  }, [isAuthenticated, user]);

  const fetchLoans = async () => {
    setLoading(true);
    try {
      let payload;
      if (normalizeRole(user?.role) === 'borrower') {
        payload = await loanService.getMyLoans();
      } else {
        payload = await loanService.getAllLoans();
      }

      setLoans(getPageItems(payload).map(normalizeLoan));
    } catch (err) {
      console.error('Failed to fetch loans', err);
    } finally {
      setLoading(false);
    }
  };

  const addLoan = async (loan) => {
    try {
      const createdLoan = normalizeLoan(await loanService.applyForLoan(loan));
      setLoans((prev) => [createdLoan, ...prev]);
      return createdLoan;
    } catch (err) {
      console.error('Failed to apply for loan', err);
      throw err;
    }
  };

  const updateLoanStatus = async (id, status, lenderNote = '') => {
    try {
      const updatedLoan = normalizeLoan(
        await loanService.updateLoanStatus(id, String(status).toUpperCase(), lenderNote)
      );
      setLoans((prev) =>
        prev.map((loan) => (loan.id === id ? updatedLoan : loan))
      );
      return updatedLoan;
    } catch (err) {
      console.error('Failed to update loan status', err);
      throw err;
    }
  };

  const addOffer = (offer) => {
    const newOffer = { id: Math.random().toString(36).substr(2, 9), ...offer };
    setOffers((prev) => [newOffer, ...prev]);
    return newOffer;
  };

  const deleteOffer = (id) => {
    setOffers((prev) => prev.filter((o) => o.id !== id));
  };

  return (
    <LoanContext.Provider value={{ loans, loading, fetchLoans, addLoan, updateLoanStatus, offers, addOffer, deleteOffer }}>
      {children}
    </LoanContext.Provider>
  );
}

export function useLoans() {
  const context = useContext(LoanContext);
  if (!context) {
    throw new Error('useLoans must be used within a LoanProvider');
  }
  return context;
}
