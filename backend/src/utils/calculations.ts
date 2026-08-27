export interface SchemeConfig {
  code: "MICRO" | "TERM";
  name: string;
  maxProjectCostText: string;
  agencyFinancingText: string;
  maxLoanAmount: number;
  interestRate: number;
  tenureYears: number;
  moratoriumMonths: number;
}

export const SCHEME_RULES: Record<"MICRO" | "TERM", SchemeConfig> = {
  MICRO: {
    code: "MICRO",
    name: "Micro Finance Scheme",
    maxProjectCostText: "Up to ₹1.40 Lakh",
    agencyFinancingText: "Up to 90%",
    maxLoanAmount: 125000,
    interestRate: 6.5,
    tenureYears: 3,
    moratoriumMonths: 3,
  },
  TERM: {
    code: "TERM",
    name: "Term Loan Scheme",
    maxProjectCostText: "₹1.40 Lakh to ₹50 Lakh",
    agencyFinancingText: "Up to 90%",
    maxLoanAmount: 4500000,
    interestRate: 8.0,
    tenureYears: 7,
    moratoriumMonths: 6,
  },
};

export const calculateProjectCostAndLoan = (marginCapital: number) => {
  // Formula: Project Cost = Margin Capital / 10%
  const projectCost = Math.round(marginCapital / 0.1);
  // Maximum Loan = 90% of Project Cost
  const rawLoanAmount = Math.round(projectCost * 0.9);
  return { projectCost, rawLoanAmount };
};

export const determineScheme = (projectCost: number): SchemeConfig => {
  // Logic: < ₹1.40L -> Micro Finance, else -> Term Loan
  if (projectCost <= 140000) {
    return SCHEME_RULES.MICRO;
  }
  return SCHEME_RULES.TERM;
};

export interface RepaymentQuarter {
  quarter: number;
  principal: number;
  interest: number;
  totalPayment: number;
  remainingPrincipal: number;
}

export const calculateRepaymentSchedule = (
  loanAmount: number,
  interestRate: number,
  tenureYears: number,
  moratoriumMonths: number
) => {
  const annualRate = interestRate / 100;
  const quarterlyRate = annualRate / 4;
  const totalQuarters = tenureYears * 4;
  const moratoriumQuarters = Math.floor(moratoriumMonths / 3);
  const repaymentQuarters = totalQuarters - moratoriumQuarters;

  // Equal Principal Repayment per active quarter
  const principalPerQuarter = repaymentQuarters > 0 ? Math.round(loanAmount / repaymentQuarters) : 0;

  const schedule: RepaymentQuarter[] = [];
  let remainingPrincipal = loanAmount;

  for (let q = 1; q <= totalQuarters; q++) {
    const isMoratorium = q <= moratoriumQuarters;
    const interest = Math.round(remainingPrincipal * quarterlyRate);
    const principal = isMoratorium ? 0 : Math.min(principalPerQuarter, remainingPrincipal);
    const totalPayment = principal + interest;

    if (!isMoratorium) {
      remainingPrincipal = Math.max(0, remainingPrincipal - principal);
    }

    schedule.push({
      quarter: q,
      principal,
      interest,
      totalPayment,
      remainingPrincipal,
    });
  }

  // Calculate standard monthly EMI
  const monthlyRate = interestRate / 100 / 12;
  const totalMonths = tenureYears * 12;
  const monthlyEmi =
    Math.round(
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1)
    ) || 0;

  return {
    loanAmount,
    interestRate,
    tenureYears,
    moratoriumMonths,
    monthlyEmi,
    quarterlyEmi: monthlyEmi * 3,
    totalRepayment: Math.round(monthlyEmi * totalMonths),
    schedule,
  };
};
