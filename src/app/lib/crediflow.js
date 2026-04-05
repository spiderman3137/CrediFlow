export function normalizeRole(role) {
  const normalized = String(role || '').toLowerCase();
  return normalized || 'borrower';
}

export function getDashboardPath(role) {
  return `/${normalizeRole(role)}/dashboard`;
}

export function titleCase(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function currency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export function formatDate(value) {
  if (!value) {
    return '-';
  }

  return new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function getLoanStatusTone(status) {
  const normalized = String(status || '').toUpperCase();

  if (normalized === 'APPROVED' || normalized === 'ACTIVE' || normalized === 'CLOSED') {
    return 'badge-active';
  }

  if (normalized === 'REJECTED' || normalized === 'DEFAULTED') {
    return 'badge-defaulted';
  }

  return 'badge-pending';
}

export function normalizeLoan(loan) {
  return {
    ...loan,
    amount: Number(loan?.principalAmount || 0),
    interest: Number(loan?.interestRate || 0),
    term: Number(loan?.durationMonths || 0),
    borrowerId: loan?.userId,
    borrowerName: loan?.userName,
    borrowerEmail: loan?.userEmail,
    emiAmount: Number(loan?.emiAmount || 0),
    remainingBalance: Number(loan?.remainingBalance || 0),
    totalInterestPayable: Number(loan?.totalInterestPayable || 0),
    riskScore: loan?.riskScore ?? null,
    statusLabel: titleCase(loan?.status),
    statusKey: String(loan?.status || '').toLowerCase(),
  };
}

export function normalizePayment(payment) {
  return {
    ...payment,
    amount: Number(payment?.amount || 0),
    statusKey: String(payment?.status || '').toLowerCase(),
    statusLabel: titleCase(payment?.status),
    methodLabel: titleCase(payment?.paymentMethod),
  };
}
