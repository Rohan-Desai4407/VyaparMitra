import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SchemeEligibilityEngine {
  static async evaluateSchemes(capital: number, projectCostInput?: number) {
    const schemes = await prisma.governmentScheme.findMany({
      where: { active: true },
      include: { financialRules: true, eligibilityRules: true }
    });

    const evaluatedSchemes = [];

    for (const scheme of schemes) {
      if (scheme.financialRules.length === 0) continue;
      const fRule = scheme.financialRules[0];

      // Calculate project cost
      let projectCost = 0;
      if (projectCostInput && projectCostInput > 0) {
        projectCost = projectCostInput;
      } else {
        if (fRule.marginPercentage > 0) {
          projectCost = capital / fRule.marginPercentage;
        } else {
          projectCost = fRule.maximumProjectCost;
        }
      }

      // Check limits
      let status = 'ELIGIBLE';
      let reason = 'Matches capital requirement and scheme ranges.';
      let score = 90;

      if (projectCost < fRule.minimumProjectCost) {
        status = 'NOT_ELIGIBLE';
        reason = `Project cost (₹${projectCost}) is below minimum allowed (₹${fRule.minimumProjectCost}).`;
        score = 0;
      } else if (projectCost > fRule.maximumProjectCost) {
        if (capital > 0) {
            projectCost = fRule.maximumProjectCost;
            status = 'POTENTIALLY_ELIGIBLE';
            reason = `Capped at scheme maximum. You have surplus capital.`;
            score = 70;
        } else {
            status = 'NOT_ELIGIBLE';
            reason = `Project cost exceeds scheme maximum (₹${fRule.maximumProjectCost}).`;
            score = 0;
        }
      }

      if (status === 'NOT_ELIGIBLE') continue;

      // Calculate financials
      let loanAmount = projectCost * fRule.maximumFinancingPercentage;
      if (fRule.maximumLoan && loanAmount > fRule.maximumLoan) {
        loanAmount = fRule.maximumLoan;
      }

      let subsidy = 0;
      if (fRule.subsidyPercentage) {
        subsidy = projectCost * fRule.subsidyPercentage;
        if (fRule.maximumSubsidy && subsidy > fRule.maximumSubsidy) {
          subsidy = fRule.maximumSubsidy;
        }
      }

      let requiredMargin = projectCost * fRule.marginPercentage;
      let fundingGap = requiredMargin - capital;
      if (fundingGap < 0) fundingGap = 0;

      // Calculate EMI
      const ir = parseFloat(fRule.interestRate || '8.5') / 12 / 100;
      const n = fRule.tenureMonths || 60;
      let emi = 0;
      let totalInterest = 0;
      
      if (ir > 0) {
        emi = loanAmount * ir * (Math.pow(1 + ir, n)) / (Math.pow(1 + ir, n) - 1);
        totalInterest = (emi * n) - loanAmount;
      } else {
        emi = loanAmount / n;
      }

      evaluatedSchemes.push({
        schemeId: scheme.id,
        schemeCode: scheme.schemeCode,
        schemeName: scheme.name,
        officialName: scheme.officialName,
        ministry: scheme.ministry,
        sourceUrl: scheme.officialSourceUrl,
        lastVerified: scheme.lastVerifiedAt,
        status,
        reason,
        score,
        financials: {
          projectCost: Math.round(projectCost),
          userContribution: Math.round(requiredMargin),
          availableCapital: Math.round(capital),
          fundingGap: Math.round(fundingGap),
          loanAmount: Math.round(loanAmount),
          subsidy: Math.round(subsidy),
          interestRate: fRule.interestRate,
          tenureMonths: fRule.tenureMonths,
          moratoriumMonths: fRule.moratoriumMonths,
          emi: Math.round(emi),
          totalInterest: Math.round(totalInterest),
          totalRepayment: Math.round(loanAmount + totalInterest),
          marginPercentage: (fRule.marginPercentage * 100).toFixed(1) + '%',
          financingPercentage: (fRule.maximumFinancingPercentage * 100).toFixed(1) + '%'
        }
      });
    }

    evaluatedSchemes.sort((a, b) => b.score - a.score);
    return evaluatedSchemes;
  }
}
