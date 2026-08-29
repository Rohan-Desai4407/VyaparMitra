import { calculateProjectCostAndLoan, determineScheme } from "../utils/calculations.js";

export interface WhatIfInput {
  marginCapital?: number;
  volumeChangePct?: number;
  priceChangePct?: number;
  rawMaterialCostChangePct?: number;
  opexChangePct?: number;
  interestRateShift?: number;
  tenureYearsOverride?: number;
  baseMonthlyUnits?: number;
  basePricePerUnit?: number;
}

export const financeService = {
  calculateFinancials(marginCapital: number) {
    if (!marginCapital || marginCapital <= 0) {
      throw new Error("Margin capital must be a positive number.");
    }

    const { projectCost, rawLoanAmount } = calculateProjectCostAndLoan(marginCapital);
    return {
      marginCapital,
      projectCost,
      loanAmount: rawLoanAmount,
      agencyFinancingPercentage: 90,
    };
  },

  simulateWhatIf(input: WhatIfInput = {}) {
    const marginCapital = input.marginCapital || 25000;
    const volumeChangePct = input.volumeChangePct || 0;
    const priceChangePct = input.priceChangePct || 0;
    const rawMaterialCostChangePct = input.rawMaterialCostChangePct || 0;
    const opexChangePct = input.opexChangePct || 0;
    const interestRateShift = input.interestRateShift || 0;
    const baseMonthlyUnits = input.baseMonthlyUnits || 1000;
    const basePricePerUnit = input.basePricePerUnit || 60;

    const { projectCost, rawLoanAmount } = calculateProjectCostAndLoan(marginCapital);
    const matchedScheme = determineScheme(projectCost);

    const tenureYears = input.tenureYearsOverride || matchedScheme.tenureYears;
    const effectiveInterestRate = Math.max(1, matchedScheme.interestRate + interestRateShift);

    // Base financials calculation
    const baseMonthlyRevenue = baseMonthlyUnits * basePricePerUnit;
    const baseRawMaterialCost = Math.round(baseMonthlyRevenue * 0.45);
    const baseOpex = Math.round(baseMonthlyRevenue * 0.20);

    const baseMonthlyRate = matchedScheme.interestRate / 100 / 12;
    const baseTotalMonths = matchedScheme.tenureYears * 12;
    const baseMonthlyEmi = Math.round(
      (rawLoanAmount * baseMonthlyRate * Math.pow(1 + baseMonthlyRate, baseTotalMonths)) /
        (Math.pow(1 + baseMonthlyRate, baseTotalMonths) - 1)
    ) || 0;

    const baseNetProfit = baseMonthlyRevenue - (baseRawMaterialCost + baseOpex + baseMonthlyEmi);

    // Simulated calculations
    const simPricePerUnit = Math.round(basePricePerUnit * (1 + priceChangePct / 100));
    const simMonthlyUnits = Math.round(baseMonthlyUnits * (1 + volumeChangePct / 100));
    const simMonthlyRevenue = Math.round(simMonthlyUnits * simPricePerUnit);

    const simRawMaterialCost = Math.round(
      baseRawMaterialCost * (simMonthlyUnits / baseMonthlyUnits) * (1 + rawMaterialCostChangePct / 100)
    );
    const simOpex = Math.round(baseOpex * (1 + opexChangePct / 100));

    const simMonthlyRate = effectiveInterestRate / 100 / 12;
    const simTotalMonths = tenureYears * 12;
    const simMonthlyEmi = Math.round(
      (rawLoanAmount * simMonthlyRate * Math.pow(1 + simMonthlyRate, simTotalMonths)) /
        (Math.pow(1 + simMonthlyRate, simTotalMonths) - 1)
    ) || 0;

    const simTotalExpenses = simRawMaterialCost + simOpex + simMonthlyEmi;
    const simNetProfit = simMonthlyRevenue - simTotalExpenses;
    const simNetMarginPct = simMonthlyRevenue > 0 ? Number(((simNetProfit / simMonthlyRevenue) * 100).toFixed(2)) : 0;

    // Break-even analysis
    const varCostPerUnit = simMonthlyUnits > 0 ? simRawMaterialCost / simMonthlyUnits : 0;
    const contribMarginPerUnit = simPricePerUnit - varCostPerUnit;
    const fixedCosts = simOpex + simMonthlyEmi;
    const breakEvenUnits = contribMarginPerUnit > 0 ? Math.ceil(fixedCosts / contribMarginPerUnit) : 0;
    const breakEvenRevenue = breakEvenUnits * simPricePerUnit;

    // DSCR (Debt Service Coverage Ratio) & Risk Score (0-100)
    const dscr = simMonthlyEmi > 0 ? Number(((simNetProfit + simMonthlyEmi) / simMonthlyEmi).toFixed(2)) : 5;
    
    let stressScore = 100;
    if (simNetProfit < 0) stressScore -= 50;
    else if (simNetMarginPct < 10) stressScore -= 20;
    
    if (dscr < 1.0) stressScore -= 30;
    else if (dscr < 1.3) stressScore -= 15;

    if (volumeChangePct < -20) stressScore -= 10;
    if (rawMaterialCostChangePct > 20) stressScore -= 10;

    stressScore = Math.max(0, Math.min(100, stressScore));

    const riskRating = stressScore >= 75 ? "LOW_RISK" : stressScore >= 50 ? "MODERATE_RISK" : "HIGH_RISK";

    // 12-Month Projections
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let cumulativeCash = 0;
    const projections12Months = monthNames.map((m, idx) => {
      // Add slight seasonal multiplier
      const seasonalFactor = 1 + Math.sin((idx / 12) * 2 * Math.PI) * 0.08;
      const monthRev = Math.round(simMonthlyRevenue * seasonalFactor);
      const monthExp = Math.round(simTotalExpenses * (0.95 + (seasonalFactor - 1) * 0.5));
      const monthNet = monthRev - monthExp;
      cumulativeCash += monthNet;
      return {
        month: m,
        revenue: monthRev,
        expenses: monthExp,
        netCashFlow: monthNet,
        cumulativeCash,
      };
    });

    // AI Insights & Recommendations
    const recommendations: string[] = [];
    if (simNetProfit <= 0) {
      recommendations.push("Critical: Project operates at a net loss in this scenario. Consider increasing selling price or negotiating lower supplier raw material rates.");
    } else if (simNetMarginPct < 10) {
      recommendations.push("Warning: Profit margin is thin (< 10%). Maintain strict control over operational expenses.");
    } else {
      recommendations.push("Healthy Profitability: The project maintains robust positive net margins under this scenario.");
    }

    if (dscr < 1.25) {
      recommendations.push("Debt Risk: Debt Service Coverage Ratio is below 1.25. Requesting a longer moratorium period or lower interest rate is advised.");
    } else {
      recommendations.push("Strong Loan Repayment: Cash flows comfortably cover loan EMI obligations.");
    }

    if (simMonthlyUnits < breakEvenUnits) {
      recommendations.push(`Volume Shortfall: Current volume (${simMonthlyUnits} units) is below the break-even threshold of ${breakEvenUnits} units.`);
    }

    return {
      inputs: {
        marginCapital,
        volumeChangePct,
        priceChangePct,
        rawMaterialCostChangePct,
        opexChangePct,
        interestRateShift,
        tenureYears,
        baseMonthlyUnits,
        basePricePerUnit,
      },
      scheme: matchedScheme,
      baseCase: {
        revenue: baseMonthlyRevenue,
        rawMaterialCost: baseRawMaterialCost,
        opex: baseOpex,
        emi: baseMonthlyEmi,
        netProfit: baseNetProfit,
      },
      simulatedCase: {
        pricePerUnit: simPricePerUnit,
        monthlyUnits: simMonthlyUnits,
        revenue: simMonthlyRevenue,
        rawMaterialCost: simRawMaterialCost,
        opex: simOpex,
        interestRate: effectiveInterestRate,
        emi: simMonthlyEmi,
        totalExpenses: simTotalExpenses,
        netProfit: simNetProfit,
        netMarginPct: simNetMarginPct,
      },
      breakEven: {
        units: breakEvenUnits,
        revenue: breakEvenRevenue,
        contribMarginPerUnit: Math.round(contribMarginPerUnit),
      },
      health: {
        dscr,
        stressScore,
        riskRating,
      },
      projections12Months,
      recommendations,
    };
  },
};

