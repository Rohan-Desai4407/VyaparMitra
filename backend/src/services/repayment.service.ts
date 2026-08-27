import { calculateRepaymentSchedule } from "../utils/calculations.js";
import { schemeService } from "./scheme.service.js";

export const repaymentService = {
  calculateRepayment(loanAmount: number, interestRate?: number, tenureYears?: number, moratoriumMonths?: number) {
    if (!loanAmount || loanAmount <= 0) {
      throw new Error("Loan amount must be a positive number.");
    }

    // Default to Term Loan scheme parameters if not explicitly provided
    const defaultInterest = interestRate ?? 8.0;
    const defaultTenure = tenureYears ?? 7;
    const defaultMoratorium = moratoriumMonths ?? 6;

    return calculateRepaymentSchedule(loanAmount, defaultInterest, defaultTenure, defaultMoratorium);
  },

  calculateRepaymentFromMargin(marginCapital: number) {
    const schemeData = schemeService.getSchemeFromMargin(marginCapital);
    const loanAmount = Math.min(Math.round((marginCapital / 0.1) * 0.9), schemeData.maxLoan);
    return calculateRepaymentSchedule(
      loanAmount,
      schemeData.interestRate,
      schemeData.tenureYears,
      schemeData.moratoriumMonths
    );
  },
};
