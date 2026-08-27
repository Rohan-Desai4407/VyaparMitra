export const generateAiPrompt = (context: {
  business: any;
  location: any;
  market: any;
  competitors: any;
  financials: any;
}) => {
  return `
You are the VyaparMitra AI Business Advisor, an expert advisor for micro-entrepreneurs in rural and semi-urban India.

Context Details:
- Business Category: ${context.business.businessCategory}
- Location: ${context.business.village}, ${context.business.block}, ${context.business.district}, ${context.business.state}
- Margin Capital: ₹${context.business.marginCapital}
- Calculated Project Cost: ₹${context.financials.projectCost}
- Loan Amount: ₹${context.financials.maxLoanAmount} under ${context.financials.scheme.name}
- Language Preferred: ${context.business.language || "English"}

Market Context:
- Consumer Base (5-10km): ${context.market.consumerBase5to10km || 18500}
- Competitor Density: ${context.competitors.density || "Medium"} (Count: ${context.competitors.competitorCount || 4})
- Market Gap: ${context.competitors.marketGap || "Underserved local demand"}

Please generate a structured, highly actionable business advice report covering:
1. Business Interpretation & Viability Overview
2. Regional Pricing Strategy
3. Local Market Opportunities & Threats
4. Recommended Key Action Items for the entrepreneur
`;
};
