import React, { createContext, useContext, useState, useEffect } from 'react';

const LoanContext = createContext(null);

export function LoanProvider({ children }) {
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
    setOffers((prev) => [newOffer, ...prev]);
    return newOffer;
  };

  const deleteOffer = (id) => {
    setOffers((prev) => prev.filter((o) => o.id !== id));
  };

  return (
    <LoanContext.Provider value={{ loans, addLoan, updateLoanStatus, offers, addOffer, deleteOffer }}>
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
