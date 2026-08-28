import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AmortizationEngine {
  static async calculateSchedule(params: {
    capital: number;
    projectCost: number;
    categoryId: string;
    stateId: string;
  }) {
    // 1. Calculate base scheme params using existing logic
    const { SchemeEligibilityEngine } = await import('./SchemeEligibilityEngine');
    const schemes = await SchemeEligibilityEngine.evaluateSchemes(params.capital, params.projectCost);
    
    if (!schemes || schemes.length === 0) {
      throw new Error("No eligible schemes found");
    }

    const scheme = schemes[0];
    const financials = scheme.financials;

    let loanAmount = financials.loanAmount;
    let interestRate = parseFloat(financials.interestRate || '0');
    let tenureMonths = financials.tenureMonths || 60;
    let moratoriumMonths = financials.moratoriumMonths || 0;
    
    // We persist the input to db
    const loanCalculation = await prisma.loanCalculation.create({
      data: {
        schemeId: scheme.schemeId,
        projectCost: financials.projectCost,
        userContribution: financials.userContribution,
        loanAmount: loanAmount,
        interestRate: interestRate,
        tenureMonths: tenureMonths,
        moratoriumMonths: moratoriumMonths,
        subsidy: financials.subsidy,
        emi: financials.emi,
        totalInterest: financials.totalInterest,
        totalRepayment: financials.totalRepayment
      }
    });

    const repaymentSchedule = await prisma.repaymentSchedule.create({
      data: {
        loanCalculationId: loanCalculation.id
      }
    });

    const scheduleItems = [];
    let balance = loanAmount;
    const r = (interestRate / 12) / 100;
    let repaymentPeriods = tenureMonths;

    // Moratorium: assume interest capitalized if rate > 0
    let capitalizedInterest = 0;
    for (let i = 1; i <= moratoriumMonths; i++) {
      let interest = balance * r;
      balance += interest; // capitalize
      capitalizedInterest += interest;

      scheduleItems.push({
        scheduleId: repaymentSchedule.id,
        periodNumber: i,
        openingBalance: balance - interest,
        principal: 0,
        interest: interest,
        fees: 0,
        totalPayment: 0,
        closingBalance: balance,
        status: 'MORATORIUM'
      });
    }

    // Now calculate new EMI based on capitalized balance
    let emi = 0;
    if (r > 0) {
      emi = balance * r * Math.pow(1 + r, repaymentPeriods) / (Math.pow(1 + r, repaymentPeriods) - 1);
    } else {
      emi = balance / repaymentPeriods;
    }

    for (let i = 1; i <= repaymentPeriods; i++) {
      let openingBalance = balance;
      let interest = openingBalance * r;
      let principal = emi - interest;

      // Handle final period rounding
      if (i === repaymentPeriods) {
        principal = openingBalance;
        emi = principal + interest;
      }

      balance -= principal;
      if (balance < 0.01) balance = 0;

      scheduleItems.push({
        scheduleId: repaymentSchedule.id,
        periodNumber: moratoriumMonths + i,
        openingBalance: openingBalance,
        principal: principal,
        interest: interest,
        fees: 0,
        totalPayment: emi,
        closingBalance: balance,
        status: 'ACTIVE'
      });
    }

    // Insert items in bulk
    await prisma.repaymentScheduleItem.createMany({
      data: scheduleItems
    });

    return {
      calculationId: loanCalculation.id,
      scheduleId: repaymentSchedule.id,
      schemeName: scheme.schemeName,
      officialName: scheme.officialName,
      loanCalculation,
      scheduleItems
    };
  }
}
