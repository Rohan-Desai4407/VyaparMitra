import { useState, useEffect } from 'react';
import { useVyapar } from '../context/VyaparContext';

export function computeProblemStatementSchemes(marginCapitalInput: number) {
  const marginCapital = marginCapitalInput > 0 ? marginCapitalInput : 25000;
  const projectCost = Math.round(marginCapital / 0.10);
  const isMicro = projectCost <= 140000;

  // 1. Micro Finance Scheme
  // Project Cost: Up to ₹1.40L, Interest: 6.5%, Tenure: 3 years (36 months), Moratorium: 3 months
  const microProjectCost = isMicro ? projectCost : 140000;
  const microLoan = Math.round(microProjectCost * 0.90);
  const microRate = 6.5 / 12 / 100;
  const microN = 36;
  const microEmi = Math.round((microLoan * microRate * Math.pow(1 + microRate, microN)) / (Math.pow(1 + microRate, microN) - 1)) || 0;

  const microScheme = {
    schemeId: "scheme_micro_finance",
    schemeCode: "MICRO",
    name: "Micro Finance Scheme",
    officialName: "Micro Finance Scheme (Up to ₹1.40 Lakh)",
    ministry: "Ministry of MSME, Govt. of India",
    sourceUrl: "https://msme.gov.in",
    lastVerified: new Date().toISOString(),
    status: isMicro ? "ELIGIBLE" : "NOT_ELIGIBLE",
    reason: isMicro 
      ? `Project cost (₹${projectCost.toLocaleString("en-IN")}) is within Micro Finance limit (Up to ₹1.40 Lakh).`
      : `Project cost (₹${projectCost.toLocaleString("en-IN")}) exceeds Micro Finance limit (Up to ₹1.40 Lakh).`,
    score: isMicro ? 95 : 30,
    financials: {
      projectCost: microProjectCost,
      userContribution: Math.round(microProjectCost * 0.10),
      availableCapital: marginCapital,
      fundingGap: 0,
      loanAmount: microLoan,
      subsidy: 0,
      interestRate: 6.5,
      tenureMonths: 36,
      moratoriumMonths: 3,
      emi: microEmi,
      totalInterest: (microEmi * microN) - microLoan,
      totalRepayment: microEmi * microN,
      marginPercentage: "10%",
      financingPercentage: "90%"
    }
  };

  // 2. Term Loan Scheme
  // Project Cost: ₹1.40L–₹50L, Interest: 8%, Tenure: 7 years (84 months), Moratorium: 6 months
  const termProjectCost = !isMicro ? Math.min(projectCost, 5000000) : 250000;
  const termLoan = Math.round(termProjectCost * 0.90);
  const termRate = 8.0 / 12 / 100;
  const termN = 84;
  const termEmi = Math.round((termLoan * termRate * Math.pow(1 + termRate, termN)) / (Math.pow(1 + termRate, termN) - 1)) || 0;

  const termScheme = {
    schemeId: "scheme_term_loan",
    schemeCode: "TERM",
    name: "Term Loan Scheme",
    officialName: "Term Loan Scheme (₹1.40 Lakh to ₹50 Lakh)",
    ministry: "Ministry of Finance & MSME",
    sourceUrl: "https://msme.gov.in",
    lastVerified: new Date().toISOString(),
    status: !isMicro ? "ELIGIBLE" : "POTENTIALLY_ELIGIBLE",
    reason: !isMicro 
      ? `Project cost (₹${projectCost.toLocaleString("en-IN")}) is within Term Loan range (₹1.40 Lakh to ₹50 Lakh).`
      : `Project cost (₹${projectCost.toLocaleString("en-IN")}) is eligible for expansion under Term Loan Scheme.`,
    score: !isMicro ? 95 : 75,
    financials: {
      projectCost: termProjectCost,
      userContribution: Math.round(termProjectCost * 0.10),
      availableCapital: marginCapital,
      fundingGap: 0,
      loanAmount: termLoan,
      subsidy: 0,
      interestRate: 8.0,
      tenureMonths: 84,
      moratoriumMonths: 6,
      emi: termEmi,
      totalInterest: (termEmi * termN) - termLoan,
      totalRepayment: termEmi * termN,
      marginPercentage: "10%",
      financingPercentage: "90%"
    }
  };

  const schemes = [microScheme, termScheme].sort((a, b) => b.score - a.score);
  return {
    schemes,
    recommendedScheme: schemes[0],
    generatedAt: new Date().toISOString()
  };
}

export function useFinancialSchemes() {
  const { input } = useVyapar();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchemes = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `http://localhost:3001/api/financial/schemes?availableCapital=${input.marginCapital}&stateId=${input.stateId}&businessCategoryId=${input.categoryId}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch schemes");
      const json = await res.json();
      if (json && json.schemes && json.schemes.length > 0) {
        setData(json);
        return;
      }
      throw new Error("No backend schemes found");
    } catch (err: any) {
      console.warn("Backend API schemes fetch fallback to problem statement engine:", err?.message);
      const fallback = computeProblemStatementSchemes(input.marginCapital);
      setData(fallback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, [input.marginCapital, input.stateId, input.categoryId]);

  return { data, loading, error, refetch: fetchSchemes };
}

