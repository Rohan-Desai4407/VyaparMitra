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

const API_BASE_URL = "http://localhost:3000/api";

export const apiService = {
  async submitBusinessInput(input: BusinessInputData) {
    try {
      const res = await fetch(`${API_BASE_URL}/business`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessCategory: input.category,
          state: input.state,
          district: input.district,
          block: input.block,
          village: input.village,
          marginCapital: input.marginCapital,
          language: input.language || "en",
        }),
      });
      const data = await res.json();
      return data.data;
    } catch (e) {
      console.warn("Backend API unavailable, using offline response");
      return { assessmentId: "vm_" + Date.now(), status: "OFFLINE" };
    }
  },

  async analyzeFeasibility(input: BusinessInputData): Promise<FeasibilityReport> {
    try {
      const res = await fetch(`${API_BASE_URL}/business/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessCategory: input.category,
          state: input.state,
          district: input.district,
          block: input.block,
          village: input.village,
          marginCapital: input.marginCapital,
          language: input.language || "en",
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        return {
          assessmentId: data.data.assessmentId,
          viabilityScore: data.data.feasibilityScore,
          overallVerdict: data.data.rating.includes("Highly") ? "Highly Viable" : "Moderately Viable",
          recommendation: data.data.recommendation,
          marketInsights: `Consumer Base: ${data.data.marketData?.consumerBase5to10km || 18500}. Niche Gap: ${data.data.competitorData?.marketGap}`,
          keyActionItems: [
            `Apply under ${data.data.schemeDetails?.schemeName || "Loan Scheme"}`,
            `Leverage ${data.data.schemeDetails?.moratoriumMonths || 6}-month moratorium period`,
            "Tie up with local milk collection hubs and mandi aggregators",
          ],
        };
      }
    } catch (e) {
      console.warn("Backend API unavailable for analyze");
    }

    return {
      assessmentId: "vm_demo",
      viabilityScore: 84,
      overallVerdict: "Highly Viable",
      recommendation: "Proposed setup is viable based on local demographic parameters.",
      marketInsights: "Local demand is strong within 5-10km radius.",
      keyActionItems: ["Apply for scheme financing at local cooperative bank"],
    };
  },

  async calculateFinancials(margin: number): Promise<FinancialCalculation> {
    try {
      const res = await fetch(`${API_BASE_URL}/finance/calculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ marginCapital: margin }),
      });
      const data = await res.json();
      if (data.success) {
        return financeService.calculateScheme(margin);
      }
    } catch (e) {}
    return financeService.calculateScheme(margin);
  },

  async getAiAdvice(input: BusinessInputData) {
    try {
      const res = await fetch(`${API_BASE_URL}/ai/advice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessCategory: input.category,
          state: input.state,
          district: input.district,
          block: input.block,
          village: input.village,
          marginCapital: input.marginCapital,
          language: input.language || "en",
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        return data.data;
      }
    } catch (e) {}
    return null;
  },
};

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

