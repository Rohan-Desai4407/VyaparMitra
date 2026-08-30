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
    const { schemeService } = await import('./scheme.service.js');
    const schemesData = await schemeService.evaluateSchemes({
      projectCost: params.projectCost || (params.capital / 0.1),
      marginCapital: params.capital,
      business: { categoryId: params.categoryId, isNewBusiness: true },
      applicant: { age: 25, locationType: 'RURAL' }
    });
    let bestMatch = schemesData.recommendedScheme;
    if (!bestMatch && schemesData.schemes.length > 0) {
      // Fallback to closest match if none are strictly eligible
      bestMatch = schemesData.schemes.sort((a, b) => b.score - a.score)[0];
    }

    if (!bestMatch) {
      throw new Error('No eligible schemes found');
    }

    const scheme = { 
      schemeId: bestMatch.schemeId, 
      schemeName: bestMatch.name, 
      officialName: bestMatch.officialName 
    };
    const financials = {
      projectCost: params.projectCost || (params.capital / 0.1),
      userContribution: params.capital,
      loanAmount: bestMatch.financing.requestedLoan,
      interestRate: bestMatch.financials.interestRate ? String(bestMatch.financials.interestRate) : '0',
      tenureMonths: bestMatch.financials.tenureMonths || 60,
      moratoriumMonths: bestMatch.financials.moratoriumMonths || 0,
      subsidy: 0,
      emi: 0,
      totalInterest: 0,
      totalRepayment: 0
    };

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

    // Update loanCalculation with calculated totals
    let totalRepayment = 0;
    let totalInterestComputed = 0;
    scheduleItems.forEach(item => {
      totalRepayment += item.totalPayment;
      totalInterestComputed += item.interest;
    });

    const updatedCalculation = await prisma.loanCalculation.update({
      where: { id: loanCalculation.id },
      data: {
        emi: emi,
        totalInterest: totalInterestComputed,
        totalRepayment: totalRepayment
      }
    });

    return {
      calculationId: updatedCalculation.id,
      scheduleId: repaymentSchedule.id,
      schemeName: scheme.schemeName,
      officialName: scheme.officialName,
      loanCalculation: updatedCalculation,
      scheduleItems
    };
  }
}






