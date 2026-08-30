import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { CalculationService } from '../services/CalculationService.js';
import { SchemeMatcher } from '../services/SchemeMatcher.js';
import { MarketIntelligenceEngine } from '../services/MarketIntelligenceEngine.js';
import { callGeminiApi } from "../config/gemini.js";
import { SchemeEligibilityEngine } from '../services/SchemeEligibilityEngine.js';
import { AmortizationEngine } from '../services/AmortizationEngine.js';
import { SwotService } from '../services/SwotService.js';
const router = Router();
const prisma = new PrismaClient();

// GET /api/market-intelligence/summary
router.get('/market-intelligence/summary', async (req, res) => {
  const { stateId, districtId, subDistrictId, villageId, businessCategoryId, availableCapital, radius } = req.query;
  
  if (!stateId || !businessCategoryId) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    const state = stateId && stateId !== 'mock' ? await prisma.state.findUnique({ where: { id: String(stateId) } }) : null;
    const district = districtId && districtId !== 'mock' ? await prisma.district.findUnique({ where: { id: String(districtId) } }) : null;
    const village = villageId && String(villageId) !== 'mock' ? await prisma.village.findUnique({ where: { id: String(villageId) } }) : null;
    const category = businessCategoryId && !String(businessCategoryId).includes('mock') ? await prisma.businessCategory.findUnique({ where: { id: String(businessCategoryId) } }) : null;

    const rad = parseInt(String(radius)) || 10;
    const cap = parseInt(String(availableCapital)) || 0;
    
    const sName = state ? state.name : (req.query.stateName ? String(req.query.stateName) : "Unknown State");
    const dName = district ? district.name : (req.query.districtName ? String(req.query.districtName) : sName);
    const vName = village ? village.name : (req.query.villageName ? String(req.query.villageName) : dName);
    
    // Trust the explicit categoryName passed by the frontend first, because frontend state might be unsynced with the DB ID
    const cName = req.query.categoryName ? String(req.query.categoryName) : (category ? category.name : "General Business");

    // Geocode once for efficiency
    const geocoded = await MarketIntelligenceEngine.geocodeLocation(vName, dName, sName);

    // Consumer reach
    let consumer = null;
    let consumerError = null;
    try {
      const realPop = geocoded && (geocoded as any).population ? (geocoded as any).population : null;
      consumer = MarketIntelligenceEngine.getConsumerProfile(dName, sName, cName, rad, realPop);
    } catch (err: any) {
      consumerError = err.message || "Consumer reach data unavailable";
    }

    // Competitor density
    let competitor = null;
    let competitorError = null;
    try {
      const cLat = geocoded ? (geocoded as any).lat : 22.98;
      const cLng = geocoded ? (geocoded as any).lng : 72.38;
      competitor = await MarketIntelligenceEngine.getCompetitorDensity(cName, rad, cLat, cLng);
    } catch (err: any) {
      competitorError = err.message || "Competitor data unavailable";
    }

    // Consumer heatmap points
    let heatmapPoints: any[] = [];
    if (consumer && consumer.consumerBase > 0 && geocoded) {
       heatmapPoints = await MarketIntelligenceEngine.getConsumerHeatmapPoints((geocoded as any).lat, (geocoded as any).lng, rad);
    }

    const centerCoords = geocoded ? { lat: (geocoded as any).lat, lng: (geocoded as any).lng } : null;

    const purchasing = MarketIntelligenceEngine.getPurchasingPower(sName);
    const pricing = MarketIntelligenceEngine.getPricing(cName);
    const dist = MarketIntelligenceEngine.getDistributionChannels(cName);
    const opps = MarketIntelligenceEngine.getOpportunities(cName, cap, vName, consumer?.consumerBase || 0, competitor?.count || 0);
    const growth = MarketIntelligenceEngine.getGrowthTactics(cName, vName);

    res.json({
      consumer,
      consumerError,
      competitor,
      competitorError,
      heatmapPoints,
      purchasing,
      pricing,
      distribution: dist,
      opportunities: opps,
      growth,
      centerCoords
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /business-categories
router.get('/business-categories', async (req, res) => {
  const categories = await prisma.businessCategory.findMany({ orderBy: { name: 'asc' } });
  res.json(categories);
});

// GET /api/locations/states
router.get('/locations/states', async (req, res) => {
  const states = await prisma.state.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' }
  });
  res.json(states);
});

// GET /api/locations/states/:stateId/districts
router.get('/locations/states/:stateId/districts', async (req, res) => {
  const { stateId } = req.params;
  const districts = await prisma.district.findMany({
    where: { stateId, isActive: true },
    orderBy: { name: 'asc' }
  });
  res.json(districts);
});

// GET /api/locations/districts/:districtId/sub-districts
router.get('/locations/districts/:districtId/sub-districts', async (req, res) => {
  const { districtId } = req.params;
  const subDistricts = await prisma.subDistrict.findMany({
    where: { districtId, isActive: true },
    orderBy: { name: 'asc' }
  });
  res.json(subDistricts);
});

// GET /api/locations/sub-districts/:subDistrictId/villages?search=&page=&size=
router.get('/locations/sub-districts/:subDistrictId/villages', async (req, res) => {
  const { subDistrictId } = req.params;
  const search = req.query.search ? String(req.query.search) : '';
  const page = Math.max(0, parseInt(String(req.query.page)) || 0);
  const size = Math.max(1, Math.min(100, parseInt(String(req.query.size)) || 20));

  const whereClause = {
    subDistrictId,
    isActive: true,
    ...(search ? { name: { contains: search, mode: 'insensitive' as any } } : {})
  };

  const [totalElements, content] = await Promise.all([
    prisma.village.count({ where: whereClause }),
    prisma.village.findMany({
      where: whereClause,
      orderBy: { name: 'asc' },
      skip: page * size,
      take: size
    })
  ]);

  res.json({
    content,
    page,
    size,
    totalElements,
    totalPages: Math.ceil(totalElements / size)
  });
});

// POST /api/assessment/preview
router.post('/assessment/preview', async (req, res) => {
  const { availableMarginCapital, businessCategoryId, villageId } = req.body;

  if (!availableMarginCapital || availableMarginCapital <= 0) {
    return res.status(400).json({ error: 'Valid availableMarginCapital is required' });
  }

  const projectCost = CalculationService.calculateFeasibleProjectCost(availableMarginCapital);
  const potentialFinancing = CalculationService.calculatePotentialFinancing(projectCost);

  let bestSchemeMatch = null;
  
  if (businessCategoryId && villageId) {
    const village = await prisma.village.findUnique({ where: { id: villageId } });
    if (village) {
      // Using LGD categorization for rural vs urban if available, default true
      const isRural = village.locationType !== 'URBANIZED_VILLAGE' && village.locationType !== 'TOWN';
      bestSchemeMatch = await SchemeMatcher.matchBestScheme({
        projectCost,
        businessCategoryId,
        isRural
      });
    }
  }

  res.json({
    marginPercentage: CalculationService.getMarginPercentage() * 100,
    feasibleProjectCost: projectCost.toNumber(),
    financingPercentage: CalculationService.getFinancingPercentage() * 100,
    potentialFinancing: potentialFinancing.toNumber(),
    bestScheme: bestSchemeMatch ? {
      name: bestSchemeMatch.scheme.name,
      matchScore: bestSchemeMatch.score,
      interestRate: (bestSchemeMatch.scheme as any).interestRate
    } : null
  });
});

// POST /api/assessments
router.post('/assessments', async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const { stateId, districtId, subDistrictId, villageId, businessCategoryId, availableMarginCapital, preferredLanguage } = req.body;

  if (!stateId || !districtId || !subDistrictId || !villageId || !businessCategoryId || !availableMarginCapital) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const projectCost = CalculationService.calculateFeasibleProjectCost(availableMarginCapital);
    const potentialFinancing = CalculationService.calculatePotentialFinancing(projectCost);

    const village = await prisma.village.findUnique({ where: { id: villageId } });
    const isRural = village ? (village.locationType !== 'URBANIZED_VILLAGE' && village.locationType !== 'TOWN') : true;

    const bestSchemeMatch = await SchemeMatcher.matchBestScheme({
      projectCost,
      businessCategoryId,
      isRural
    });

    const result = await prisma.$transaction(async (tx) => {
      await tx.user.upsert({
        where: { id: userId },
        update: {},
        create: { id: userId, email: 'mock@example.com', name: 'Mock User' }
      });
      
      const assessment = await tx.assessment.create({
        data: {
          userId,
          stateId,
          districtId,
          subDistrictId,
          villageId,
          businessCategoryId,
          availableMarginCapital: availableMarginCapital,
          preferredLanguage: preferredLanguage || 'English',
          result: {
            create: {
              marginPercentage: CalculationService.getMarginPercentage(),
              feasibleProjectCost: projectCost.toNumber(),
              financingPercentage: CalculationService.getFinancingPercentage(),
              potentialFinancing: potentialFinancing.toNumber(),
              matchScore: bestSchemeMatch?.score || 0,
              matchedSchemeId: bestSchemeMatch?.scheme.id
            }
          }
        },
        include: { result: true }
      });
      return assessment;
    });

    res.json(result);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create assessment', details: error.message });
  }
});

// GET /api/assessments/latest
router.get('/assessments/latest', async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const assessment = await prisma.assessment.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      result: { include: { scheme: true } },
      businessCategory: true
    }
  });

  if (!assessment) return res.status(404).json({ error: 'No assessment found' });
  
  let state = null;
  let district = null;
  let subDistrict = null;
  let village = null;

  if (assessment.stateId && assessment.stateId !== 'mock') state = await prisma.state.findUnique({ where: { id: assessment.stateId } });
  if (assessment.districtId && assessment.districtId !== 'mock') district = await prisma.district.findUnique({ where: { id: assessment.districtId } });
  if (assessment.subDistrictId && assessment.subDistrictId !== 'mock') subDistrict = await prisma.subDistrict.findUnique({ where: { id: assessment.subDistrictId } });
  if (assessment.villageId && assessment.villageId !== 'mock') village = await prisma.village.findUnique({ where: { id: assessment.villageId } });

  res.json({
    ...assessment,
    state: state ? { name: state.name } : undefined,
    district: district ? { name: district.name } : undefined,
    subDistrict: subDistrict ? { name: subDistrict.name } : undefined,
    village: village ? { name: village.name } : undefined
  });
});

// GET /api/financial/schemes
router.get('/financial/schemes', async (req, res) => {
  try {
    const capital = parseFloat(String(req.query.availableCapital)) || 0;
    const projectCost = parseFloat(String(req.query.projectCost)) || 0;
    const schemes = await SchemeEligibilityEngine.evaluateSchemes(capital, projectCost);
    
    res.json({
      schemes,
      recommendedScheme: schemes.length > 0 ? schemes[0] : null,
      generatedAt: new Date()
    });
  } catch (error: any) {
    console.error('Error evaluating schemes:', error);
    res.status(500).json({ error: 'Failed to evaluate financial schemes' });
  }
});
// POST /api/financial/calculate-schedule
router.post('/financial/calculate-schedule', async (req, res) => {
  try {
    const { capital, projectCost, categoryId, stateId } = req.body;
    
    if (!capital) {
      return res.status(400).json({ error: 'Missing capital' });
    }

    const schedule = await AmortizationEngine.calculateSchedule({
      capital: parseFloat(capital),
      projectCost: projectCost ? parseFloat(projectCost) : 0,
      categoryId: categoryId || 'mock-1',
      stateId: stateId || 'mock-1'
    });

    res.json(schedule);
  } catch (error: any) {
    console.error('Error calculating schedule:', error);
    res.status(500).json({ error: 'Failed to calculate repayment schedule' });
  }
});


// POST /api/ai/explain-point
router.post('/ai/explain-point', async (req, res) => {
  const { point, category, location, businessType } = req.body;
  if (!point || !businessType) return res.status(400).json({ error: "Missing parameters" });

  try {
    const prompt = `
You are an expert rural business advisor.
Business: ${businessType}
Location: ${location}
Point (${category}): "${point}"

Explain this point deeply but concisely (3-4 sentences max) in the context of this specific business and location. Why is this important? How does it specifically affect the business operations or revenue? Use simple, easy-to-understand language. Format with bolding for key terms if helpful. Do NOT use markdown headers, just return the explanation text.
`;

    const aiText = await callGeminiApi(prompt);
    
    if (aiText) {
      res.json({ explanation: aiText });
    } else {
      res.json({ explanation: "This point highlights a critical factor for your business success in the local area. Focus on leveraging local networks and understanding seasonal demand patterns to optimize operations." });
    }
  } catch (error: any) {
    res.status(500).json({ error: "Failed to generate explanation" });
  }
});


// POST /api/swot/analyze
router.post('/swot/analyze', async (req, res) => {
  const { assessmentId } = req.body;
  if (!assessmentId) return res.status(400).json({ error: "Missing assessmentId" });

  try {
    const analysis = await SwotService.analyze(assessmentId);
    res.json(analysis);
  } catch (error: any) {
    console.error("SWOT error:", error);
    res.status(500).json({ error: error.message || "Failed to generate SWOT analysis" });
  }
});

export default router;
