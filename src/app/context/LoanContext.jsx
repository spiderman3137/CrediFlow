import React, { createContext, useContext, useState, useEffect } from 'react';
<<<<<<< HEAD
import { loanService } from '../../api/loanService';
import { useAuth } from './AuthContext';
import { getPageItems } from '../../api/responseUtils';
import { normalizeLoan, normalizeRole } from '../lib/crediflow';
=======
>>>>>>> 5ad99e5b2827ca57162b42a5a11994b1a8b4ac5c

const LoanContext = createContext(null);

export function LoanProvider({ children }) {
<<<<<<< HEAD
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
=======
  const [loans, setLoans] = useState(() => {
    try {
      const stored = localStorage.getItem('loans');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [offers, setOffers] = useState(() => {
    try {
      const stored = localStorage.getItem('offers');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('loans', JSON.stringify(loans));
    } catch { }
  }, [loans]);

  useEffect(() => {
    try {
      localStorage.setItem('offers', JSON.stringify(offers));
    } catch { }
  }, [offers]);

  const addLoan = (loan) => {
    const newLoan = {
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      createdAt: new Date().toISOString(),
      ...loan,
    };
    setLoans((prev) => [newLoan, ...prev]);
    return newLoan;
  };

  const updateLoanStatus = (id, status) => {
    setLoans((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status } : l))
    );
  };

  const addOffer = (offer) => {
    const newOffer = {
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      ...offer,
    };
>>>>>>> 5ad99e5b2827ca57162b42a5a11994b1a8b4ac5c
    setOffers((prev) => [newOffer, ...prev]);
    return newOffer;
  };

  const deleteOffer = (id) => {
    setOffers((prev) => prev.filter((o) => o.id !== id));
  };

  return (
<<<<<<< HEAD
    <LoanContext.Provider value={{ loans, loading, fetchLoans, addLoan, updateLoanStatus, offers, addOffer, deleteOffer }}>
=======
    <LoanContext.Provider value={{ loans, addLoan, updateLoanStatus, offers, addOffer, deleteOffer }}>
>>>>>>> 5ad99e5b2827ca57162b42a5a11994b1a8b4ac5c
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
