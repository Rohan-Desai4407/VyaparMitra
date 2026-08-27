import { assessmentService } from "./assessment.service.js";
import { callGeminiApi } from "../config/gemini.js";
import { generateAiPrompt } from "../utils/prompts.js";

export const geminiService = {
  async getAiAdvice(payload: any) {
    // Gather assessment context
    const assessment = await assessmentService.analyzeFeasibility(payload);

    const prompt = generateAiPrompt({
      business: assessment.businessInput,
      location: assessment.locationData,
      market: assessment.marketData,
      competitors: assessment.competitorData,
      financials: {
        projectCost: assessment.financialResults.projectCost,
        maxLoanAmount: assessment.financialResults.loanAmount,
        scheme: { name: assessment.schemeDetails.schemeName },
      },
    });

    const systemInstruction = `
You are the AI Business Advisor for VyaparMitra, dedicated to rural micro-entrepreneurs.
Crucial Rule: DO NOT calculate numerical financials (project cost, maximum loan, interest, scheme eligibility, EMI).
Use the pre-calculated numbers given in the context and provide strategic advice, regional market insights, pricing guidance, and risk mitigations.
`;

    const aiText = await callGeminiApi(prompt, systemInstruction);

    if (aiText) {
      return {
        assessmentId: assessment.assessmentId,
        aiRecommendation: aiText,
        source: "Gemini API",
      };
    }

    // Smart structured fallback if Gemini key is not set
    return {
      assessmentId: assessment.assessmentId,
      aiRecommendation: `
### 💡 Strategic Advisory for ${assessment.businessInput.businessCategory} (${assessment.businessInput.village})

1. **Market Interpretation**:
   - The local demand in ${assessment.businessInput.block} block is strong with a consumer base of ~${assessment.marketData.consumerBase5to10km} people.
   - Competitor density is **${assessment.competitorData.density}** (${assessment.competitorData.competitorCount} existing units). There is an underserved niche for fresh, quality doorstep delivery.

2. **Pricing & Revenue Guidance**:
   - Recommended local retail pricing: ${assessment.marketData.suggestedPricing}.
   - Focus on building direct subscriptions with village households and local eateries for steady daily cash flow.

3. **Financial Alignment**:
   - With your margin capital of ₹${assessment.businessInput.marginCapital.toLocaleString("en-IN")}, you qualify for a total project setup of **₹${assessment.financialResults.projectCost.toLocaleString("en-IN")}** under the **${assessment.schemeDetails.schemeName}** (${assessment.schemeDetails.interestRate}% interest, ${assessment.schemeDetails.moratoriumMonths}-month moratorium).

4. **Actionable Roadmap**:
   - Apply for scheme approval at your local Gramin / Cooperative bank.
   - Use the ${assessment.schemeDetails.moratoriumMonths}-month moratorium period to stabilize supply lines before principal repayments begin.
`,
      source: "VyaparMitra AI Rules Engine (Fallback)",
    };
  },
};
