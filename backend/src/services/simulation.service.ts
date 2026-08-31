import { PrismaClient } from '@prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai';

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface SimulationPayload {
  userId: string;
  assessmentId: string;
  schemeId?: string;
  projectCost: number;
  marginCapital: number;
  salesVolumeChange: number;
  sellingPriceChange: number;
  rawMaterialCostChange: number;
  opexChange: number;
  interestRateChange: number;
}

export const simulationService = {
  async calculate(payload: SimulationPayload) {
    // 1. Fetch base data
    const assessment = await prisma.assessment.findUnique({
      where: { id: payload.assessmentId },
      include: { businessCategory: true }
    });

    let schemeRules = null;
    if (payload.schemeId) {
       const scheme = await prisma.governmentScheme.findUnique({
         where: { id: payload.schemeId },
         include: { financialRules: true }
       });
       if (scheme && scheme.financialRules.length > 0) {
         schemeRules = scheme.financialRules[0];
       }
    }

    // Baseline Benchmarks
    const basePricePerUnit = 60;
    const baseMonthlyUnits = Math.round((payload.projectCost * 0.25) / basePricePerUnit) || 1000;
    const baseMonthlyRevenue = baseMonthlyUnits * basePricePerUnit;
    const baseRawMaterialCost = Math.round(baseMonthlyRevenue * 0.45);
    const baseOpex = Math.round(baseMonthlyRevenue * 0.20);
    
    const simPricePerUnit = Math.round(basePricePerUnit * (1 + payload.sellingPriceChange / 100));
    const simMonthlyUnits = Math.round(baseMonthlyUnits * (1 + payload.salesVolumeChange / 100));
    const monthlyRevenue = Math.round(simMonthlyUnits * simPricePerUnit);

    const simRawMaterialCost = Math.round(
      baseRawMaterialCost * (simMonthlyUnits / baseMonthlyUnits) * (1 + payload.rawMaterialCostChange / 100)
    );
    const simOpex = Math.round(baseOpex * (1 + payload.opexChange / 100));

    let emi = 0;
    let baseRate = 12;
    let tenure = 60;
    let loanAmount = payload.projectCost - payload.marginCapital;

    if (schemeRules) {
      baseRate = parseFloat(schemeRules.interestRate || '12');
      tenure = schemeRules.tenureMonths || 60;
    }
    
    const effectiveInterestRate = Math.max(1, baseRate + payload.interestRateChange);
    const r = effectiveInterestRate / 100 / 12;
    if (r > 0 && loanAmount > 0) {
      emi = Math.round((loanAmount * r * Math.pow(1 + r, tenure)) / (Math.pow(1 + r, tenure) - 1));
    }

    const totalExpenses = simRawMaterialCost + simOpex + emi;
    const operatingProfit = monthlyRevenue - totalExpenses;
    const profitMargin = monthlyRevenue > 0 ? Number(((operatingProfit / monthlyRevenue) * 100).toFixed(2)) : 0;

    const varCostPerUnit = simMonthlyUnits > 0 ? simRawMaterialCost / simMonthlyUnits : 0;
    const contribMarginPerUnit = simPricePerUnit - varCostPerUnit;
    const fixedCosts = simOpex + emi;
    const breakEvenUnits = contribMarginPerUnit > 0 ? Math.ceil(fixedCosts / contribMarginPerUnit) : 0;

    const dscr = emi > 0 ? Number(((operatingProfit + emi) / emi).toFixed(2)) : 5;

    const startingCash = payload.marginCapital * 0.5;
    const monthlyCashFlow = operatingProfit;
    let runwayMonths = 12;
    if (monthlyCashFlow < 0) {
      runwayMonths = Math.floor(startingCash / Math.abs(monthlyCashFlow));
    }

    let stressScore = 100;
    if (operatingProfit < 0) stressScore -= 50;
    else if (profitMargin < 10) stressScore -= 20;
    if (dscr < 1.0) stressScore -= 30;
    else if (dscr < 1.3) stressScore -= 15;
    if (payload.salesVolumeChange < -20) stressScore -= 10;
    if (payload.rawMaterialCostChange > 20) stressScore -= 10;
    stressScore = Math.max(0, Math.min(100, stressScore));

    const riskLevel = stressScore >= 75 ? "LOW_RISK" : stressScore >= 50 ? "MODERATE_RISK" : "HIGH_RISK";

    return {
      monthlyRevenue,
      totalExpenses,
      operatingProfit,
      profitMargin,
      emi,
      dscr,
      breakEvenUnits,
      runwayMonths,
      stressScore,
      riskLevel
    };
  },

  async analyzeWithAI(calcResult: any, businessCategory: string) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY not configured.");
    }
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `
You are a financial AI advisor for MSMEs. Analyze this deterministic financial simulation result for a ${businessCategory} business.
Do not invent or assume values for interest rates, schemes, or markets that are not provided.
Simulation Results:
${JSON.stringify(calcResult, null, 2)}

Return a strict JSON object with this exact structure:
{
  "verdict": "string (Viable | Moderately Viable | High Risk | Not Viable)",
  "summary": "string (Brief overall assessment)",
  "keyRisks": ["string"],
  "recommendations": ["string"],
  "strengths": ["string"]
}
Only output the raw JSON, no markdown formatting blocks.
`;
    
    const response = await model.generateContent(prompt);
    let text = response.response.text();
    text = text.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
    
    try {
      return JSON.parse(text);
    } catch (e) {
      throw new Error("Failed to parse AI response");
    }
  }
};
