// Service layer separating API calls / mock responses from React UI components

export interface BusinessInputData {
  assessmentId?: string;
  state: string;
  district: string;
  block: string;
  village: string;
  marginCapital: number;
  category: string;
  language: string;
}

export interface SchemeDetails {
  name: string;
  maxProjectCost: string;
  agencyFinancing: string;
  maxLoan: number;
  interestRate: number;
  tenureYears: number;
  moratoriumMonths: number;
  code: "MICRO" | "TERM";
}

export interface FinancialCalculation {
  marginCapital: number;
  projectCost: number;
  maxLoanAmount: number;
  userContribution: number;
  scheme: SchemeDetails;
  quarterlyEmi: number;
  monthlyEmi: number;
  totalRepayment: number;
}

export interface MarketData {
  consumerBase5to10km: number;
  distributionChannels: string[];
  unservedNiches: string[];
  competitorDensity: "Low" | "Medium" | "High";
  competitorCount: number;
  suggestedPricing: string;
  purchasingPowerIdx: string;
}

export interface SwotAndRisk {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  localRisks: string[];
}

export interface FeasibilityReport {
  assessmentId: string;
  viabilityScore: number;
  overallVerdict: "Highly Viable" | "Moderately Viable" | "Requires Restructuring" | "High Risk";
  recommendation: string;
  marketInsights: string;
  keyActionItems: string[];
}

// Deterministic Financial Calculations according to PRD Rules
export const financeService = {
  calculateScheme(margin: number): FinancialCalculation {
    const projectCost = margin / 0.1;
    const rawLoan = projectCost * 0.9;

    let scheme: SchemeDetails;

    if (projectCost <= 140000) {
      scheme = {
        name: "Micro Finance Scheme",
        maxProjectCost: "Up to ₹1.40 Lakh",
        agencyFinancing: "Up to 90%",
        maxLoan: 125000,
        interestRate: 6.5,
        tenureYears: 3,
        moratoriumMonths: 3,
        code: "MICRO",
      };
    } else {
      scheme = {
        name: "Term Loan Scheme",
        maxProjectCost: "₹1.40 Lakh to ₹50 Lakh",
        agencyFinancing: "Up to 90%",
        maxLoan: 4500000,
        interestRate: 8.0,
        tenureYears: 7,
        moratoriumMonths: 6,
        code: "TERM",
      };
    }

    const maxLoanAmount = Math.min(rawLoan, scheme.maxLoan);
    const r = scheme.interestRate / 100 / 12;
    const n = scheme.tenureYears * 12;
    const monthlyEmi = Math.round((maxLoanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)) || 0;

    return {
      marginCapital: margin,
      projectCost: Math.round(projectCost),
      maxLoanAmount: Math.round(maxLoanAmount),
      userContribution: Math.round(margin),
      scheme,
      monthlyEmi,
      quarterlyEmi: monthlyEmi * 3,
      totalRepayment: Math.round(monthlyEmi * n),
    };
  },
};
