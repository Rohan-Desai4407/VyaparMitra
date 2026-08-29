export class RiskEngine {
  static calculateScore(data: any): { score: number, factors: any } {
    let score = 0;
    const factors = [];

    // Competitor Risk (0-20)
    const compCount = data.competitorData?.competitorCount || 0;
    let compRisk = 5;
    if (compCount > 20) compRisk = 18;
    else if (compCount > 10) compRisk = 12;
    else if (compCount > 5) compRisk = 8;
    score += compRisk;
    factors.push({ name: 'Competition', riskLevel: compRisk > 12 ? 'High' : 'Medium', score: compRisk, max: 20 });

    // Capital Risk (0-30)
    const projectCost = data.financialData?.projectCost || 0;
    const capital = data.availableCapital || 0;
    let capRisk = 0;
    if (capital < projectCost * 0.1) capRisk = 25;
    else if (capital < projectCost * 0.2) capRisk = 15;
    else if (capital < projectCost * 0.3) capRisk = 10;
    else capRisk = 5;
    score += capRisk;
    factors.push({ name: 'Capital Gap', riskLevel: capRisk > 15 ? 'High' : capRisk > 10 ? 'Medium' : 'Low', score: capRisk, max: 30 });

    // Market / Consumer Risk (0-25)
    const population = data.marketData?.consumerBase || 0;
    let mktRisk = 0;
    if (population < 5000) mktRisk = 20;
    else if (population < 20000) mktRisk = 12;
    else mktRisk = 5;
    score += mktRisk;
    factors.push({ name: 'Market Size', riskLevel: mktRisk > 15 ? 'High' : mktRisk > 10 ? 'Medium' : 'Low', score: mktRisk, max: 25 });

    // Operations / Sector Risk (0-25)
    const category = (data.businessCategory || "").toLowerCase();
    let opRisk = 10;
    if (category.includes('dairy') || category.includes('agri') || category.includes('food')) {
      opRisk = 15; // Perishability risk
    } else if (category.includes('retail')) {
      opRisk = 8;
    }
    score += opRisk;
    factors.push({ name: 'Operational/Sector', riskLevel: opRisk > 12 ? 'High' : 'Medium', score: opRisk, max: 25 });

    // Cap at 100
    score = Math.min(100, Math.max(0, score));

    return { score, factors };
  }
}
