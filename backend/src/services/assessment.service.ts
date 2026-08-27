import { businessService } from "./business.service.js";
import { locationService } from "./location.service.js";
import { marketService } from "./market.service.js";
import { competitorService } from "./competitor.service.js";
import { financeService } from "./finance.service.js";
import { schemeService } from "./scheme.service.js";
import { repaymentService } from "./repayment.service.js";

export const assessmentService = {
  async analyzeFeasibility(payload: {
    assessmentId?: string;
    businessCategory?: string;
    state?: string;
    district?: string;
    block?: string;
    village?: string;
    marginCapital?: number;
    language?: string;
  }) {
    let businessInput: any;

    if (payload.assessmentId) {
      businessInput = await businessService.getBusinessInput(payload.assessmentId);
    }

    if (!businessInput && payload.marginCapital && payload.businessCategory) {
      const created = await businessService.createInput({
        businessCategory: payload.businessCategory,
        state: payload.state || "Gujarat",
        district: payload.district || "Ahmedabad",
        block: payload.block || "Sanand",
        village: payload.village || "Changodar",
        marginCapital: payload.marginCapital,
        language: payload.language || "en",
      });
      businessInput = created.data;
    }

    if (!businessInput) {
      businessInput = {
        assessmentId: "vm_demo_" + Date.now(),
        businessCategory: payload.businessCategory || "Dairy & Livestock",
        state: payload.state || "Gujarat",
        district: payload.district || "Ahmedabad",
        block: payload.block || "Sanand",
        village: payload.village || "Changodar",
        marginCapital: payload.marginCapital || 25000,
        language: payload.language || "en",
      };
    }

    // Coordinate pipeline services
    const locationData = await locationService.search(businessInput.village);
    const marketData = await marketService.getMarketIntelligence("loc_sanand_01");
    const competitorData = await competitorService.analyzeCompetitors(businessInput.businessCategory, 22.95, 72.4, 10);
    const financialResults = financeService.calculateFinancials(businessInput.marginCapital);
    const schemeDetails = schemeService.getEligibleScheme(financialResults.projectCost);
    const repaymentSchedule = repaymentService.calculateRepayment(
      Math.min(financialResults.loanAmount, schemeDetails.maxLoan),
      schemeDetails.interestRate,
      schemeDetails.tenureYears,
      schemeDetails.moratoriumMonths
    );

    // Compute feasibility score based on margin capital and market density
    let feasibilityScore = 78;
    if (businessInput.marginCapital >= 50000) feasibilityScore += 8;
    if (competitorData.density === "Low") feasibilityScore += 6;
    if (competitorData.density === "High") feasibilityScore -= 10;

    let rating = "Good";
    let recommendation = "Business is reasonably viable in the target village.";
    if (feasibilityScore >= 80) {
      rating = "Excellent / Highly Viable";
      recommendation = `The proposed ${businessInput.businessCategory} unit has strong demand parameters. Capital of ₹${businessInput.marginCapital} unlocks ₹${financialResults.projectCost} project setup under ${schemeDetails.schemeName}.`;
    } else if (feasibilityScore < 65) {
      rating = "Requires Restructuring";
      recommendation = "High local competition or low initial capital. Consider starting with higher margin capital or alternative product lines.";
    }

    return {
      assessmentId: businessInput.assessmentId,
      feasibilityScore,
      rating,
      opportunity: "High",
      competition: competitorData.density,
      risk: "Low-Medium",
      recommendation,
      swot: {
        strengths: [
          "High local daily demand in target village/block",
          "Immediate cash flow generation potential",
        ],
        weaknesses: ["Dependence on local feed/raw material prices"],
        opportunities: [`Tie-up with nearby Mandi & government scheme (${schemeDetails.schemeName})`],
        threats: ["Seasonal price fluctuations and transport delays during monsoon"],
      },
      businessInput,
      locationData: locationData[0] || null,
      marketData,
      competitorData,
      financialResults,
      schemeDetails,
      repaymentSchedule,
    };
  },
};
