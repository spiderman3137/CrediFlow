export function calculateLoanEmi(principal, annualRate, termMonths) {
  const safePrincipal = Number(principal || 0);
  const safeRate = Number(annualRate || 0);
  const safeTerm = Math.max(Number(termMonths || 0), 1);
  const monthlyRate = safeRate / 100 / 12;

  if (!monthlyRate) {
    return safePrincipal / safeTerm;
  }

  return (
    (safePrincipal * monthlyRate * Math.pow(1 + monthlyRate, safeTerm)) /
    (Math.pow(1 + monthlyRate, safeTerm) - 1)
  );
}

export function buildSchedule(loan, paidInstallments = 0) {
  const term = Math.max(Number(loan?.term || 0), 1);
  const principal = Number(loan?.amount || 0);
  const monthlyRate = Number(loan?.interest || 0) / 100 / 12;
  const emi = Number(loan?.emiAmount || calculateLoanEmi(principal, loan?.interest, term));
  const baseDate = loan?.startDate || loan?.createdAt || new Date().toISOString();
  let balance = principal;

  return Array.from({ length: term }, (_, index) => {
    const installment = index + 1;
    const dueDate = new Date(baseDate);
    dueDate.setMonth(dueDate.getMonth() + installment);

    const interest = monthlyRate ? balance * monthlyRate : 0;
    const principalPortion = Math.min(balance, emi - interest);
    balance = Math.max(0, balance - principalPortion);

    let status = 'UPCOMING';
    if (installment <= paidInstallments) {
      status = 'PAID';
    } else if (installment === paidInstallments + 1) {
      status = 'DUE';
    }

    return {
      installment,
      dueDate,
      emi,
      interest,
      principal: principalPortion,
      balance,
      status,
    };
  });
}

export function getCompletedPayments(payments) {
  return payments.filter((payment) => payment.status === 'COMPLETED');
}
