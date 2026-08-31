import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

interface ApplicantData {
  age?: number;
  gender?: string;
  category?: string;
  locationType?: string;
}

interface BusinessData {
  categoryId?: string;
  isNewBusiness?: boolean;
}

export const schemeService = {
  async evaluateSchemes(payload: {
    applicant?: ApplicantData;
    business?: BusinessData;
    projectCost: number;
    marginCapital: number;
  }) {
    const { applicant, business, projectCost, marginCapital } = payload;
    
    // Fetch all active schemes with rules
    const schemes = await prisma.governmentScheme.findMany({
      where: { active: true },
      include: {
        financialRules: true,
        eligibilityRules: true,
      }
    });

    const evaluatedSchemes = [];
    let recommendedScheme = null;
    let highestScore = -1;

    for (const scheme of schemes) {
      const fRule = scheme.financialRules[0];
      if (!fRule) continue; // Skip if no financial rules

      let eligible = true;
      let score = 0;
      const reasons: string[] = [];
      const failedCriteria: string[] = [];
      const matchedCriteria: string[] = [];
      const benefits: any[] = [];
      const documents: any[] = [];
      const warnings: string[] = [];

      // 1. Evaluate Financial Rules
      if (projectCost > fRule.maximumProjectCost) {
        eligible = false;
        failedCriteria.push(`Project cost exceeds maximum limit of ₹${fRule.maximumProjectCost.toLocaleString('en-IN')}`);
      } else if (projectCost < fRule.minimumProjectCost) {
        eligible = false;
        failedCriteria.push(`Project cost is below minimum limit of ₹${fRule.minimumProjectCost.toLocaleString('en-IN')}`);
      } else {
        matchedCriteria.push(`Project cost (₹${projectCost.toLocaleString('en-IN')}) is within allowed range.`);
        score += 15; // Project cost fit
      }

      // Calculate financing
      const applicantContributionPercent = (marginCapital / projectCost) * 100;
      if (applicantContributionPercent < fRule.marginPercentage) {
        eligible = false;
        failedCriteria.push(`Applicant contribution is ${applicantContributionPercent.toFixed(1)}%, but minimum required is ${fRule.marginPercentage}%`);
      } else {
        matchedCriteria.push(`Applicant contribution requirement of ${fRule.marginPercentage}% is met.`);
        score += 20; // Financing fit
      }

      const maxEligibleLoan = Math.min(
        projectCost * (fRule.maximumFinancingPercentage / 100),
        fRule.maximumLoan || Infinity
      );
      
      const requestedLoan = projectCost - marginCapital;
      
      let requiredAdditionalFunding = 0;
      if (requestedLoan > maxEligibleLoan) {
        requiredAdditionalFunding = requestedLoan - maxEligibleLoan;
        warnings.push(`Requested loan exceeds maximum eligible loan. Additional funding of ₹${requiredAdditionalFunding.toLocaleString('en-IN')} required.`);
        // We do not necessarily fail eligibility here, they are just partially eligible.
      } else {
         matchedCriteria.push(`Requested loan is within scheme limits.`);
      }

      // 2. Evaluate Eligibility Rules (Dynamic)
      for (const rule of scheme.eligibilityRules) {
        if (rule.ruleType === 'AGE') {
          if (applicant?.age) {
            if (rule.operator === 'GTE' && applicant.age >= parseInt(rule.value)) {
               matchedCriteria.push(`Age requirement met (${rule.value}+ years).`);
            } else {
               eligible = false;
               failedCriteria.push(`Age requirement not met (Must be ${rule.value}+ years).`);
            }
          } else {
            warnings.push("Applicant age is missing. Cannot verify age eligibility.");
            eligible = false;
            failedCriteria.push(`Verification required: Minimum age ${rule.value}`);
          }
        }
        
        if (rule.ruleType === 'BUSINESS_TYPE') {
          if (business?.isNewBusiness !== undefined) {
             const isNewStr = business.isNewBusiness ? 'true' : 'false';
             if (isNewStr === rule.value) {
                matchedCriteria.push(`Business type matches requirement (New Business: ${rule.value}).`);
             } else {
                eligible = false;
                failedCriteria.push(`Scheme requires New Business = ${rule.value}.`);
             }
          } else {
             warnings.push("Business type (New/Existing) is missing.");
          }
        }
      }

      // Benefits
      if (fRule.subsidyPercentage) {
         benefits.push({
           name: 'Capital Subsidy',
           description: `Up to ${fRule.subsidyPercentage}% (Max ₹${fRule.maximumSubsidy?.toLocaleString('en-IN')})`,
           source: fRule.source
         });
         score += 5;
      }
      
      if (fRule.guaranteeAvailable) {
         benefits.push({
           name: 'Credit Guarantee',
           description: `Up to ${fRule.guaranteePercentage}% coverage. Collateral: ${fRule.collateralRequired}`,
           source: fRule.source
         });
         score += 5;
      }

      // Base eligibility score
      if (eligible) {
        score += 30;
        reasons.push("All strict eligibility criteria and financial limits are satisfied.");
      } else {
        reasons.push("One or more eligibility criteria or financial limits are not met.");
      }

      // Mock dynamic documents
      documents.push(
        { name: 'Detailed Project Report (DPR)', required: true },
        { name: 'Aadhaar Card', required: true },
        { name: 'PAN Card', required: true },
        { name: 'Bank Statement', required: true }
      );

      // Calculate Subsidy
      let calculatedSubsidy = 0;
      if (fRule.subsidyPercentage) {
         calculatedSubsidy = projectCost * (fRule.subsidyPercentage / 100);
         if (fRule.maximumSubsidy && calculatedSubsidy > fRule.maximumSubsidy) {
            calculatedSubsidy = fRule.maximumSubsidy;
         }
      }

      // Calculate EMI and Total Repayment
      let emi = 0;
      let totalRepayment = 0;
      const principal = Math.min(requestedLoan, maxEligibleLoan);
      
      if (fRule.interestRate && fRule.tenureMonths && principal > 0) {
         const annualRate = parseFloat(fRule.interestRate);
         if (!isNaN(annualRate) && annualRate > 0) {
            const r = annualRate / 12 / 100;
            const n = fRule.tenureMonths - (fRule.moratoriumMonths || 0);
            if (n > 0) {
               emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
               emi = Math.round(emi);
               totalRepayment = Math.round(emi * n);
            }
         }
      }

      const result = {
        schemeId: scheme.id,
        schemeCode: scheme.schemeCode,
        name: scheme.name,
        officialName: scheme.officialName,
        description: scheme.description,
        source: {
          url: scheme.officialSourceUrl,
          ministry: scheme.ministry,
          lastVerified: scheme.lastVerifiedAt,
        },
        financials: {
          interestRate: fRule.interestRate,
          tenureMonths: fRule.tenureMonths,
          moratoriumMonths: fRule.moratoriumMonths,
          maxProjectCost: fRule.maximumProjectCost,
          maxLoan: fRule.maximumLoan,
          subsidy: calculatedSubsidy,
          emi: emi,
          totalRepayment: totalRepayment
        },
        eligible,
        eligibilityStatus: eligible ? (requiredAdditionalFunding > 0 ? "PARTIALLY ELIGIBLE" : "ELIGIBLE") : "NOT ELIGIBLE",
        score,
        reasons,
        failedCriteria,
        matchedCriteria,
        financing: {
          projectCost,
          marginCapital,
          requestedLoan,
          maxEligibleLoan,
          requiredAdditionalFunding
        },
        benefits,
        documents,
        warnings
      };

      evaluatedSchemes.push(result);

      if (eligible && score > highestScore) {
         highestScore = score;
         recommendedScheme = result;
      }
    }

    return {
      schemes: evaluatedSchemes,
      recommendedScheme,
      evaluatedAt: new Date()
    };
  },
  
  // Legacy stubs for existing code (so we don't break other parts temporarily)
  getEligibleScheme(projectCost: number) {
     return { schemeCode: 'TERM', schemeName: 'PMEGP Subsidy Scheme', maxLoan: 1000000, interestRate: 8.5, tenureYears: 7, moratoriumMonths: 6 };
  },
  getSchemeFromMargin(marginCapital: number) {
     return { schemeCode: 'TERM', schemeName: 'PMEGP Subsidy Scheme', maxLoan: 1000000, interestRate: 8.5, tenureYears: 7, moratoriumMonths: 6 };
  }
};
