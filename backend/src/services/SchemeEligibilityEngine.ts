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

    if (evaluatedSchemes.length === 0) {
      const marginCapital = capital > 0 ? capital : 25000;
      const projectCost = Math.round(marginCapital / 0.10);
      const isMicro = projectCost <= 140000;

      const microProjectCost = isMicro ? projectCost : 140000;
      const microLoan = Math.round(microProjectCost * 0.90);
      const microRate = 6.5 / 12 / 100;
      const microN = 36;
      const microEmi = Math.round((microLoan * microRate * Math.pow(1 + microRate, microN)) / (Math.pow(1 + microRate, microN) - 1)) || 0;

      const microScheme = {
        schemeId: "scheme_micro_finance",
        schemeCode: "MICRO",
        schemeName: "Micro Finance Scheme",
        officialName: "Micro Finance Scheme (Up to ₹1.40 Lakh)",
        ministry: "Ministry of MSME, Govt. of India",
        sourceUrl: "https://msme.gov.in",
        lastVerified: new Date(),
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
          interestRate: "6.5",
          tenureMonths: 36,
          moratoriumMonths: 3,
          emi: microEmi,
          totalInterest: (microEmi * microN) - microLoan,
          totalRepayment: microEmi * microN,
          marginPercentage: "10%",
          financingPercentage: "90%"
        }
      };

      const termProjectCost = !isMicro ? Math.min(projectCost, 5000000) : 250000;
      const termLoan = Math.round(termProjectCost * 0.90);
      const termRate = 8.0 / 12 / 100;
      const termN = 84;
      const termEmi = Math.round((termLoan * termRate * Math.pow(1 + termRate, termN)) / (Math.pow(1 + termRate, termN) - 1)) || 0;

      const termScheme = {
        schemeId: "scheme_term_loan",
        schemeCode: "TERM",
        schemeName: "Term Loan Scheme",
        officialName: "Term Loan Scheme (₹1.40 Lakh to ₹50 Lakh)",
        ministry: "Ministry of Finance & MSME",
        sourceUrl: "https://msme.gov.in",
        lastVerified: new Date(),
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
          interestRate: "8.0",
          tenureMonths: 84,
          moratoriumMonths: 6,
          emi: termEmi,
          totalInterest: (termEmi * termN) - termLoan,
          totalRepayment: termEmi * termN,
          marginPercentage: "10%",
          financingPercentage: "90%"
        }
      };

      evaluatedSchemes.push(microScheme, termScheme);
      evaluatedSchemes.sort((a, b) => b.score - a.score);
    }

    return evaluatedSchemes;
  }
}
