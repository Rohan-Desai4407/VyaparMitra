import { calculateProjectCostAndLoan } from "../utils/calculations.js";

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
};
