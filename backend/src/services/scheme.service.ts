import { calculateProjectCostAndLoan, determineScheme } from "../utils/calculations.js";

export const schemeService = {
  getEligibleScheme(projectCost: number) {
    if (!projectCost || projectCost <= 0) {
      throw new Error("Project cost must be a positive number.");
    }

    const scheme = determineScheme(projectCost);
    return {
      projectCost,
      schemeName: scheme.name,
      schemeCode: scheme.code,
      maxProjectCostText: scheme.maxProjectCostText,
      agencyFinancingText: scheme.agencyFinancingText,
      maxLoan: scheme.maxLoanAmount,
      interestRate: scheme.interestRate,
      tenureYears: scheme.tenureYears,
      moratoriumMonths: scheme.moratoriumMonths,
    };
  },

  getSchemeFromMargin(marginCapital: number) {
    const { projectCost } = calculateProjectCostAndLoan(marginCapital);
    return this.getEligibleScheme(projectCost);
  },
};
