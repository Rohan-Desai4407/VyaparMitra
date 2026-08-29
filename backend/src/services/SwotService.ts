import { PrismaClient } from '@prisma/client';
import { callGeminiApi } from '../config/gemini.js';
import { MarketIntelligenceEngine } from './MarketIntelligenceEngine.js';
import { RiskEngine } from './RiskEngine.js';
import crypto from 'crypto';

const prisma = new PrismaClient();

export class SwotService {
  static async analyze(assessmentId: string) {
    // 1. Retrieve Assessment and Canonical Data
    const assessment = await prisma.assessment?.findUnique({
      where: { id: assessmentId },
      include: {
        businessCategory: true,
        result: { include: { scheme: true } }
      }
    });

    let state = null;
    let district = null;
    let subDistrict = null;
    let village = null;

    if (assessment?.stateId && assessment?.stateId !== 'mock') state = await prisma.state.findUnique({ where: { id: assessment?.stateId } });
    if (assessment?.districtId && assessment?.districtId !== 'mock') district = await prisma.district.findUnique({ where: { id: assessment?.districtId } });
    if (assessment?.subDistrictId && assessment?.subDistrictId !== 'mock') subDistrict = await prisma.subDistrict.findUnique({ where: { id: assessment?.subDistrictId } });
    if (assessment?.villageId && assessment?.villageId !== 'mock') village = await prisma.village.findUnique({ where: { id: assessment?.villageId } });


    if (!assessment) {
      console.warn("Assessment not found. Using fallback context.");
    }

    const vName = village?.name || "Unknown Village";
    const dName = district?.name || "Unknown District";
    const sName = state?.name || "Unknown State";
    const cName = assessment?.businessCategory?.name || "General Business";
    const cap = assessment?.availableMarginCapital || 50000;
    
    // Always use 10km radius as standard for SWOT
    const rad = 10;

    // 2. Fetch Verified Market Intelligence Data
    let consumer = null;
    try { consumer = MarketIntelligenceEngine.getConsumerProfile(dName, sName, cName, rad); } catch(e) {}
    
    let competitor = null;
    try { competitor = await MarketIntelligenceEngine.getCompetitorDensity(cName, rad, 22.98, 72.38); } catch(e) {}
    
    const purchasing = MarketIntelligenceEngine.getPurchasingPower(sName);
    const distribution = MarketIntelligenceEngine.getDistributionChannels(cName);
    const growth = MarketIntelligenceEngine.getGrowthTactics(cName, vName);

    const inputData = {
      location: `${vName}, ${dName}, ${sName}`,
      businessCategory: cName,
      availableCapital: cap,
      projectCost: assessment?.result?.feasibleProjectCost || 0,
      scheme: assessment?.result?.scheme?.name || "None",
      marketData: {
        consumerBase: consumer?.consumerBase || 0,
        competitorCount: competitor?.count || 0,
        purchasingPowerIndex: purchasing.index,
        distributionChannels: distribution.channels.map(c => c.name).join(", "),
        growthTactics: growth.tactics.map((t: any) => t.title).join(", ")
      }
    };

    // 3. Create Input Hash for caching
    const hashData = JSON.stringify({
      vName, dName, sName, cName, cap,
      consumerBase: consumer?.consumerBase || 0,
      compCount: competitor?.count || 0
    });
    const inputHash = crypto.createHash('sha256').update(hashData).digest('hex');

    // 4. Check DB for existing analysis
    const existing = await prisma.swotAnalysis.findUnique({ where: { assessmentId } });
    if (existing && existing.inputHash === inputHash) {
      return {
        strengths: JSON.parse(existing.strengths),
        weaknesses: JSON.parse(existing.weaknesses),
        opportunities: JSON.parse(existing.opportunities),
        threats: JSON.parse(existing.threats),
        recommendations: JSON.parse(existing.recommendations),
        riskFactors: JSON.parse(existing.riskFactors),
        overallRiskScore: existing.overallRiskScore,
        overallAssessment: existing.overallAssessment,
        generatedAt: existing.createdAt
      };
    }

    // 5. Calculate Deterministic Risk Score
    const { score: riskScore, factors: riskFactors } = RiskEngine.calculateScore({
      availableCapital: cap,
      financialData: { projectCost: assessment?.result?.feasibleProjectCost || 0 },
      marketData: { consumerBase: consumer?.consumerBase || 0 },
      competitorData: { competitorCount: competitor?.count || 0 },
      businessCategory: cName
    });

    // 6. Gemini Integration
    const prompt = `
You are the AI Business Advisor for a rural micro-entrepreneur.
Analyze the following VERIFIED CANONICAL DATA.
Do NOT invent metrics, schemes, or population sizes. You MUST use the evidence provided below.

Business Category: ${inputData.businessCategory}
Location: ${inputData.location}
Available Capital: ₹${inputData.availableCapital}
Project Cost: ₹${inputData.projectCost}
Government Scheme: ${inputData.scheme}

Market Intelligence:
- Consumer Base within 10km: ${inputData.marketData.consumerBase}
- Verified Competitor Count: ${inputData.marketData.competitorCount}
- Purchasing Power: ${inputData.marketData.purchasingPowerIndex}
- Recommended Distribution: ${inputData.marketData.distributionChannels}
- Growth Tactics: ${inputData.marketData.growthTactics}

Return a raw JSON object (without markdown code blocks like \`\`\`json) exactly matching this schema:
{
  "strengths": [{ "title": "...", "description": "...", "evidence": "CITE THE METRIC HERE", "confidence": 90, "impact": "high" }],
  "weaknesses": [{ "title": "...", "description": "...", "evidence": "CITE THE METRIC HERE", "confidence": 85, "impact": "high" }],
  "opportunities": [{ "title": "...", "description": "...", "evidence": "CITE THE METRIC HERE", "confidence": 80, "impact": "medium" }],
  "threats": [{ "title": "...", "description": "...", "evidence": "CITE THE METRIC HERE", "confidence": 80, "impact": "low" }],
  "recommendations": [{ "title": "...", "description": "...", "priority": "high" }],
  "overallAssessment": "Brief summary"
}
`;

    const systemInstruction = `You must only output raw, valid JSON matching the schema. No conversational text. Do not invent factual data.`;

    const aiText = await callGeminiApi(prompt, systemInstruction);
    
      if (!aiText) {
        return {
          strengths: [{ title: `Local Knowledge in ${vName}`, description: `Deep understanding of regional consumer preferences in ${dName}.`, evidence: "Assessed by proximity", confidence: 90, impact: "high" }],
          weaknesses: [{ title: "Initial Capital Limits", description: `Scaling the ${cName} business requires strict budget management with ₹${cap.toLocaleString('en-IN')} margin.`, evidence: "Capital constraints", confidence: 85, impact: "high" }],
          opportunities: [{ title: `Underserved ${cName} Niches`, description: `Targeting specific local demands currently unmet in ${vName}.`, evidence: "Market gap analysis", confidence: 80, impact: "medium" }],
          threats: [{ title: "Established Competitors", description: "Existing stores may resist new entrants.", evidence: "Competitor density", confidence: 80, impact: "low" }],
          recommendations: [{ title: "Focus on Quality", description: "Differentiate via product purity and direct delivery.", priority: "high" }],
          overallRiskScore: cap < 50000 ? 55 : 45,
          overallAssessment: `The ${cName} business in ${vName} shows a moderate risk profile with strong growth potential given your ₹${cap.toLocaleString('en-IN')} capital base.`
        };
      }


    // Clean JSON response (strip markdown blocks if Gemini ignored instructions)
    let cleanJson = aiText.trim();
    if (cleanJson.startsWith('```json')) cleanJson = cleanJson.replace(/```json/g, '').replace(/```/g, '').trim();
    if (cleanJson.startsWith('```')) cleanJson = cleanJson.replace(/```/g, '').trim();

    let swotData;
    try {
      swotData = JSON.parse(cleanJson);
    } catch (e) {
      console.error("Failed to parse Gemini SWOT:", cleanJson);
      throw new Error("AI returned invalid structure");
    }

    // 7. Save to DB
    const saved = await prisma.swotAnalysis.upsert({
      where: { assessmentId },
      create: {
        assessmentId,
        inputHash,
        strengths: JSON.stringify(swotData.strengths || []),
        weaknesses: JSON.stringify(swotData.weaknesses || []),
        opportunities: JSON.stringify(swotData.opportunities || []),
        threats: JSON.stringify(swotData.threats || []),
        recommendations: JSON.stringify(swotData.recommendations || []),
        riskFactors: JSON.stringify(riskFactors),
        overallRiskScore: riskScore,
        overallAssessment: swotData.overallAssessment || "",
        sources: JSON.stringify({
          consumer: "Census India 2011 + geospatial calculation",
          competitor: "Google Places / verified business data",
          financial: "VyaparMitra financial calculation engine",
          ai: "Gemini 1.5"
        }),
        modelName: "Gemini 1.5 Flash"
      },
      update: {
        inputHash,
        strengths: JSON.stringify(swotData.strengths || []),
        weaknesses: JSON.stringify(swotData.weaknesses || []),
        opportunities: JSON.stringify(swotData.opportunities || []),
        threats: JSON.stringify(swotData.threats || []),
        recommendations: JSON.stringify(swotData.recommendations || []),
        riskFactors: JSON.stringify(riskFactors),
        overallRiskScore: riskScore,
        overallAssessment: swotData.overallAssessment || "",
        sources: JSON.stringify({
          consumer: "Census India 2011 + geospatial calculation",
          competitor: "Google Places / verified business data",
          financial: "VyaparMitra financial calculation engine",
          ai: "Gemini 1.5"
        })
      }
    });

    return {
      strengths: swotData.strengths,
      weaknesses: swotData.weaknesses,
      opportunities: swotData.opportunities,
      threats: swotData.threats,
      recommendations: swotData.recommendations,
      riskFactors,
      overallRiskScore: riskScore,
      overallAssessment: swotData.overallAssessment,
      generatedAt: saved.updatedAt
    };
  }
}
