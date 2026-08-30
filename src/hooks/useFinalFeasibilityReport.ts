import { useMemo } from 'react';
import { useVyapar } from '../context/VyaparContext';
import { useMarketIntelligence } from './useMarketIntelligence';
import { useFinancialSchemes } from './useFinancialSchemes';
import { useRepaymentSchedule } from './useRepaymentSchedule';
import { useSwotAnalysis } from './useSwotAnalysis';

export function useFinalFeasibilityReport() {
  const { input } = useVyapar();
  const { data: swotData, loading: swotLoading, refetch: refetchSwot } = useSwotAnalysis(input.assessmentId);

  // Load from upstream hooks
  const { data: marketData, loading: marketLoading, error: marketError, refetch: refetchMarket } = useMarketIntelligence(10);
  const { data: financialData, loading: financialLoading, error: financialError, refetch: refetchFinancial } = useFinancialSchemes();
  const { data: repaymentData, loading: repaymentLoading, error: repaymentError, refetch: refetchRepayment } = useRepaymentSchedule();

  const loading = marketLoading || financialLoading || repaymentLoading;

  const report = useMemo(() => {
    if (loading) return null;
    
    // Cross-module validation checks
    const mismatches: string[] = [];
    let isDataConsistent = true;
    const scheme = financialData?.recommendedScheme;
    const fin = scheme?.financials;
    const financing = scheme?.financing;

    if (financing?.requestedLoan && repaymentData?.loanCalculation?.loanAmount) {
      const frLoan = financing.requestedLoan;
      const repLoan = repaymentData.loanCalculation.loanAmount;
      
      if (Math.abs(frLoan - repLoan) > 10) {
        mismatches.push(`Financial synchronization error: Loan amount mismatch (Router: ₹${frLoan} vs Repayment: ₹${repLoan})`);
        isDataConsistent = false;
      }
    }

    // Dynamic Viability Scoring Engine
    let marketScore = marketData?.opportunities?.recommendation?.score || 60;
    let financialScore = 80;
    let fundingScore = financing && financing.projectCost > 0 ? (financing.marginCapital / financing.projectCost) * 100 : 50;
    if (fundingScore > 100) fundingScore = 100;
    
    let riskScore = swotData ? 100 - swotData.overallRiskScore : 50; // Inverse of risk factor

    const weights = {
      market: 0.35,
      financial: 0.30,
      funding: 0.20,
      risk: 0.15
    };

    const overallScore = Math.round(
      (marketScore * weights.market) +
      (financialScore * weights.financial) +
      (fundingScore * weights.funding) +
      (riskScore * weights.risk)
    );

    let verdict = "Highly Viable";
    if (!isDataConsistent) verdict = "Insufficient Data / Error";
    else if (overallScore < 40) verdict = "Low Viability";
    else if (overallScore < 60) verdict = "Moderate Viability";
    else if (overallScore < 75) verdict = "Viable with Conditions";
    else if (overallScore >= 90) verdict = "Very Strong / Highly Viable";

    const dataQuality = {
      financial: financialData ? "Verified" : "Pending",
      market: marketData ? (marketData.consumer?.confidence === "High" ? "Verified" : "Estimated") : "Unavailable",
      repayment: repaymentData ? "Calculated" : "Pending",
      overall: isDataConsistent && financialData && marketData ? "High" : "Low"
    };

    const schemeName = financialData?.recommendedScheme?.name || "No Scheme Available";

    return {
      reportId: `VM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      generatedAt: new Date().toISOString(),
      location: { ...input },
      business: { category: input.category },
      financial: financialData?.recommendedScheme,
      market: marketData,
      repayment: repaymentData,
      swot: swotData || { strengths: [], weaknesses: [], opportunities: [], threats: [] },
      scoring: {
        overall: overallScore || 0,
        verdict,
        breakdown: {
          market: Math.round(marketScore) || 0,
          financial: Math.round(financialScore) || 0,
          funding: Math.round(fundingScore) || 0,
          risk: Math.round(riskScore) || 0
        },
        weights
      },
      validation: {
        isConsistent: isDataConsistent,
        mismatches
      },
      dataQuality,
      executiveSummary: `The proposed ${input.category} in ${input.village}, ${input.block}, ${input.district} has an estimated addressable market of ${marketData?.consumer?.consumerBase?.toLocaleString('en-IN') || 'N/A'} consumers within 10 km. Based on available margin capital of ₹${input.marginCapital.toLocaleString('en-IN')}, the calculated feasible project cost is ₹${financing?.projectCost?.toLocaleString('en-IN') || 'N/A'}, with an estimated financing requirement of ₹${financing?.requestedLoan?.toLocaleString('en-IN') || 'N/A'} under the ${schemeName} scheme.`,
      actionItems: [
        { task: `Apply for ${schemeName}`, status: 'Pending' },
        { task: `Verify margin capital of ₹${input.marginCapital.toLocaleString('en-IN')}`, status: 'Pending' },
        { task: `Maintain working capital reserves of ₹${repaymentData?.loanCalculation?.loanAmount ? Math.round(repaymentData.loanCalculation.loanAmount * 0.15).toLocaleString('en-IN') : 'N/A'}`, status: 'Pending' },
        { task: `Validate top market opportunity: ${marketData?.opportunities?.recommendation?.name || 'N/A'}`, status: 'Pending' }
      ]
    };

  }, [input, swotData, marketData, financialData, repaymentData, loading]);

  const refetchAll = async () => {
    await Promise.all([refetchMarket(), refetchFinancial(), refetchRepayment(), refetchSwot()]);
  };

  return { report, loading, error: marketError || financialError || repaymentError, refetchAll };
}
