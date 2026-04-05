import React, { createContext, useContext, useState, useEffect } from 'react';

const LoanContext = createContext(null);

export function LoanProvider({ children }) {
    setOffers((prev) => [newOffer, ...prev]);
    return newOffer;
  };

  const deleteOffer = (id) => {
    setOffers((prev) => prev.filter((o) => o.id !== id));
  };

  return (
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
