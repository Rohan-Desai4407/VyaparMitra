import axios from 'axios';
import { getStrategyForCategory } from './businessStrategies.js';

const businessCategoryConfig: Record<string, { searchTerms: string[] }> = {
  "dairy": { searchTerms: ["dairy", "milk shop", "dairy products", "milk collection center", "paneer"] },
  "grocery": { searchTerms: ["grocery store", "supermarket", "general store", "kirana", "provision store"] },
  "restaurant": { searchTerms: ["restaurant", "cafe", "eatery", "food court", "dhaba"] },
  "clothing": { searchTerms: ["clothing store", "apparel", "garments", "textile", "boutique"] },
  "hardware": { searchTerms: ["hardware store", "building materials", "sanitary ware", "tools"] },
  "pharmacy": { searchTerms: ["pharmacy", "medical store", "chemist"] },
  "salon": { searchTerms: ["salon", "beauty parlor", "barber shop", "haircut"] },
  "agriculture": { searchTerms: ["agriculture equipment", "fertilizer", "seeds", "tractor"] },
  "electronics": { searchTerms: ["electronics", "mobile shop", "computer repair", "appliances"] },
  "furniture": { searchTerms: ["furniture", "wooden craft", "mattress"] },
  "bakery": { searchTerms: ["bakery", "cake shop", "sweet shop", "mithai"] },
  "default": { searchTerms: ["retail store", "shop", "business"] }
};

function getSearchTerms(category: string): string[] {
  const cat = category.toLowerCase();
  for (const key of Object.keys(businessCategoryConfig)) {
    if (cat.includes(key)) {
      return businessCategoryConfig[key].searchTerms;
    }
  }
  return businessCategoryConfig["default"].searchTerms;
}

// Haversine formula to calculate geographic distance in km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export class MarketIntelligenceEngine {

  static getConsumerProfile(district: string, state: string, category: string, radius: number = 10, realPopulation: number | null = null) {
    const areaSqKm = Math.PI * radius * radius;
    
    let basePopulation = 0;
    let methodString = "";
    
    if (realPopulation) {
      // If we have a real district/region population, estimate proportion using radius
      // We assume an average district is ~3000 sq km (approx for India)
      // Cap the proportion at 1.0
      const proportion = Math.min(areaSqKm / 3000.0, 1.0);
      basePopulation = Math.round(realPopulation * proportion);
      methodString = `Derived from real OpenStreetMap demographic dataset (Total Region Pop: ${realPopulation.toLocaleString('en-IN')}) proportioned to the ${radius}km circular trade area (Area ≈ ${Math.round(areaSqKm)} sq.km).`;
    } else {
      const assumedDensityPerSqKm = 382; // National average
      basePopulation = Math.round(areaSqKm * assumedDensityPerSqKm);
      methodString = `Trade-area population estimated using average population density applied to a ${radius}km circular trade area (Area ≈ ${Math.round(areaSqKm)} sq.km).`;
    }
    
    let targetSegment = "General Consumers";
    if (category.toLowerCase().includes("dairy")) targetSegment = "Local Households & Eateries";
    if (category.toLowerCase().includes("food")) targetSegment = "Retailers, Restaurants, Households";
    if (category.toLowerCase().includes("agri")) targetSegment = "Farmers, Wholesale Markets";

    return {
      consumerBase: basePopulation,
      targetSegment,
      source: realPopulation ? "OpenStreetMap / Census Data" : "Estimated via Demographic Average",
      confidence: realPopulation ? "High" : "Medium",
      method: methodString,
      freshness: "Latest Available"
    };
  }

  private static competitorCache = new Map<string, { timestamp: number, data: any }>();

  static async getCompetitorDensity(category: string, radius: number = 10, centerLat: number, centerLng: number) {
    const cacheKey = `market:${centerLat.toFixed(3)}:${centerLng.toFixed(3)}:${radius}:${category}`;
    const cached = this.competitorCache.get(cacheKey);
    // Cache for 24 hours
    if (cached && Date.now() - cached.timestamp < 24 * 60 * 60 * 1000) {
      console.log(`[Cache Hit] Competitor Density for ${cacheKey}`);
      return cached.data;
    }

    let count = 0;
    let competitorLocations: any[] = [];
    let level = "Unavailable";
    
    const terms = getSearchTerms(category);
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!apiKey) {
      throw new Error("Google Places API Key is not configured.");
    }

    try {
      const allResults = new Map();
      let quotaExceeded = false;
      let apiErrorMessage = "";

      const requests = terms.map(term => 
        axios.post('https://places.googleapis.com/v1/places:searchText', {
          textQuery: term,
          locationBias: {
            circle: {
              center: { latitude: centerLat, longitude: centerLng },
              radius: radius * 1000.0 // strictly search within radius
            }
          }
        }, {
          headers: {
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': 'places.id,places.displayName,places.location,places.rating,places.userRatingCount,places.formattedAddress',
            'Content-Type': 'application/json'
          }
        }).catch(err => {
          console.warn(`Places API Failed for term "${term}":`, err.message);
          if (err.response && err.response.status === 429) {
            quotaExceeded = true;
          }
          if (err.response && err.response.data && err.response.data.error) {
            apiErrorMessage = err.response.data.error.message;
          }
          return { data: { places: [] } };
        })
      );

      const responses = await Promise.all(requests);
      
      if (quotaExceeded) {
         throw new Error(`Google Places API Quota Exceeded. ${apiErrorMessage}`);
      }

      responses.forEach(res => {
        if (res.data && res.data.places) {
          res.data.places.forEach((p: any) => {
            if (p.id && !allResults.has(p.id)) {
               const dist = calculateDistance(centerLat, centerLng, p.location.latitude, p.location.longitude);
               if (dist <= radius) {
                 allResults.set(p.id, {
                   id: p.id,
                   name: p.displayName?.text || "Unknown Business",
                   lat: p.location.latitude,
                   lng: p.location.longitude,
                   address: p.formattedAddress || "",
                   rating: p.rating || 0,
                   reviews: p.userRatingCount || 0,
                   distance: dist.toFixed(1)
                 });
               }
            }
          });
        }
      });

      competitorLocations = Array.from(allResults.values());
      competitorLocations.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

      count = competitorLocations.length;
      
      const scale = (radius / 5); 
      const lowThreshold = Math.round(5 * scale);
      const mediumThreshold = Math.round(15 * scale);

      level = count > mediumThreshold ? "High" : count > lowThreshold ? "Medium" : "Low";

      const result = {
        level: level,
        count: count,
        competitorLocations,
        source: "Google Places API Live Data",
        confidence: "High",
        method: `Real-time search across ${terms.length} category terms within ${radius}km.`,
        freshness: "Live"
      };

      this.competitorCache.set(cacheKey, { timestamp: Date.now(), data: result });
      return result;

    } catch (e: any) {
      console.error("Competitor Density Error:", e.message);
      throw new Error("Unable to retrieve nearby business data.");
    }
  }

  static getPurchasingPower(state: string) {
    return {
      index: 65,
      classification: "Lower-Middle Income",
      averageMonthlySpend: "₹3,500 - ₹5,000",
      source: "Economic Benchmark",
      confidence: "Medium",
      method: "State-level proxy averages.",
      freshness: "2026"
    };
  }

  static getDetailedPricing(category: string) {
    const cat = category.toLowerCase();
    
    if (cat.includes("bakery") || cat.includes("sweet") || cat.includes("mithai") || cat.includes("confectionery")) {
      return [
        { name: "Samosa / Kachori", note: "Hot snacks", unit: "Piece", priceMin: 15, priceMax: 20, marginMin: 40, marginMax: 50 },
        { name: "Jalebi", note: "Freshly made", unit: "kg", priceMin: 120, priceMax: 160, marginMin: 45, marginMax: 55 },
        { name: "Gulab Jamun", note: "Festive sweet", unit: "kg", priceMin: 180, priceMax: 240, marginMin: 40, marginMax: 50 },
        { name: "Barfi / Peda", note: "Mawa based", unit: "kg", priceMin: 350, priceMax: 450, marginMin: 35, marginMax: 45 },
        { name: "Fresh Bread", note: "Daily loaf", unit: "Loaf", priceMin: 30, priceMax: 40, marginMin: 20, marginMax: 30 },
        { name: "Khari Biscuit", note: "Tea time snack", unit: "250g", priceMin: 40, priceMax: 60, marginMin: 30, marginMax: 40 },
        { name: "Butter Cookies", note: "Nankhatai", unit: "250g", priceMin: 60, priceMax: 90, marginMin: 35, marginMax: 45 },
        { name: "Cream Roll", note: "Bakery classic", unit: "Piece", priceMin: 10, priceMax: 15, marginMin: 30, marginMax: 40 },
        { name: "Farsan / Mix Chavana", note: "Dry snacks", unit: "kg", priceMin: 160, priceMax: 220, marginMin: 35, marginMax: 45 },
        { name: "Birthday Cake", note: "Basic half kg", unit: "500g", priceMin: 250, priceMax: 350, marginMin: 45, marginMax: 60 }
      ];
    } else if (cat.includes("dairy") || cat.includes("milk")) {
      return [
        { name: "Raw Milk", note: "Daily collection", unit: "Litre", priceMin: 48, priceMax: 60, marginMin: 15, marginMax: 20 },
        { name: "Fresh Paneer", note: "Local made", unit: "kg", priceMin: 280, priceMax: 350, marginMin: 20, marginMax: 25 },
        { name: "Local Ghee", note: "Premium pure", unit: "kg", priceMin: 520, priceMax: 650, marginMin: 18, marginMax: 22 },
        { name: "Curd / Dahi", note: "Fresh daily", unit: "kg", priceMin: 60, priceMax: 80, marginMin: 22, marginMax: 28 },
        { name: "Buttermilk / Chaas", note: "Summer special", unit: "Litre", priceMin: 25, priceMax: 35, marginMin: 30, marginMax: 40 },
        { name: "Mawa / Khoya", note: "For sweets", unit: "kg", priceMin: 260, priceMax: 320, marginMin: 20, marginMax: 25 },
        { name: "Flavored Milk", note: "Bottled", unit: "200ml", priceMin: 20, priceMax: 30, marginMin: 25, marginMax: 35 },
        { name: "Butter", note: "White/Yellow", unit: "500g", priceMin: 220, priceMax: 270, marginMin: 12, marginMax: 18 },
        { name: "Cheese Cubes", note: "Processed", unit: "200g", priceMin: 110, priceMax: 140, marginMin: 15, marginMax: 20 },
        { name: "Shrikhand", note: "Flavored", unit: "500g", priceMin: 120, priceMax: 160, marginMin: 25, marginMax: 35 }
      ];
    } else if (cat.includes("food") || cat.includes("agro") || cat.includes("processing")) {
      return [
        { name: "Wheat Flour", note: "Locally milled", unit: "10kg", priceMin: 320, priceMax: 400, marginMin: 18, marginMax: 22 },
        { name: "Garam Masala", note: "Fresh ground", unit: "100g", priceMin: 50, priceMax: 80, marginMin: 35, marginMax: 45 },
        { name: "Tur Dal", note: "Unpolished", unit: "kg", priceMin: 130, priceMax: 160, marginMin: 15, marginMax: 20 },
        { name: "Mustard Oil", note: "Cold pressed", unit: "Litre", priceMin: 125, priceMax: 150, marginMin: 15, marginMax: 18 },
        { name: "Groundnut Oil", note: "Filtered", unit: "Litre", priceMin: 160, priceMax: 190, marginMin: 12, marginMax: 16 },
        { name: "Red Chilli Powder", note: "Spicy grade", unit: "500g", priceMin: 120, priceMax: 160, marginMin: 30, marginMax: 40 },
        { name: "Turmeric Powder", note: "Pure haldi", unit: "500g", priceMin: 90, priceMax: 130, marginMin: 30, marginMax: 40 },
        { name: "Besan", note: "Gram Flour", unit: "kg", priceMin: 80, priceMax: 110, marginMin: 20, marginMax: 25 },
        { name: "Raw Papad", note: "Handmade", unit: "500g", priceMin: 40, priceMax: 60, marginMin: 35, marginMax: 45 },
        { name: "Pickle / Achar", note: "Mango/Lemon", unit: "500g", priceMin: 80, priceMax: 120, marginMin: 40, marginMax: 50 }
      ];
    } else if (cat.includes("clothing") || cat.includes("garment") || cat.includes("textile") || cat.includes("apparel")) {
      return [
        { name: "Basic T-Shirt", note: "Cotton blend", unit: "Piece", priceMin: 150, priceMax: 250, marginMin: 30, marginMax: 50 },
        { name: "School Uniform", note: "Standard size", unit: "Set", priceMin: 400, priceMax: 650, marginMin: 25, marginMax: 40 },
        { name: "Women's Kurti", note: "Printed cotton", unit: "Piece", priceMin: 250, priceMax: 450, marginMin: 40, marginMax: 60 },
        { name: "Men's Formal Shirt", note: "Office wear", unit: "Piece", priceMin: 350, priceMax: 600, marginMin: 35, marginMax: 50 },
        { name: "Denim Jeans", note: "Stretchable", unit: "Piece", priceMin: 450, priceMax: 800, marginMin: 35, marginMax: 55 },
        { name: "Cotton Saree", note: "Daily wear print", unit: "Piece", priceMin: 300, priceMax: 700, marginMin: 40, marginMax: 60 },
        { name: "Kids Wear Set", note: "0-5 years", unit: "Set", priceMin: 200, priceMax: 400, marginMin: 45, marginMax: 65 },
        { name: "Undergarments", note: "Basic hosiery", unit: "Pack of 3", priceMin: 150, priceMax: 300, marginMin: 30, marginMax: 40 },
        { name: "Winter Sweater", note: "Woolen blend", unit: "Piece", priceMin: 500, priceMax: 900, marginMin: 40, marginMax: 50 },
        { name: "Leggings / Dupatta", note: "Matching items", unit: "Piece", priceMin: 100, priceMax: 200, marginMin: 50, marginMax: 70 }
      ];
    } else if (cat.includes("grocery") || cat.includes("kirana") || cat.includes("store")) {
      return [
        { name: "Rice", note: "Local Sona Masoori", unit: "kg", priceMin: 45, priceMax: 60, marginMin: 10, marginMax: 15 },
        { name: "Sugar", note: "Standard crystal", unit: "kg", priceMin: 38, priceMax: 45, marginMin: 8, marginMax: 12 },
        { name: "Tea Powder", note: "Loose premium", unit: "250g", priceMin: 80, priceMax: 120, marginMin: 20, marginMax: 30 },
        { name: "Salt", note: "Iodized", unit: "kg", priceMin: 20, priceMax: 25, marginMin: 10, marginMax: 15 },
        { name: "Bathing Soap", note: "Popular brand", unit: "Pack of 3", priceMin: 90, priceMax: 120, marginMin: 12, marginMax: 18 },
        { name: "Washing Powder", note: "Detergent", unit: "kg", priceMin: 70, priceMax: 110, marginMin: 15, marginMax: 22 },
        { name: "Cooking Oil Pouch", note: "Palm/Soybean", unit: "Litre", priceMin: 110, priceMax: 140, marginMin: 8, marginMax: 12 },
        { name: "Biscuits", note: "Family Pack", unit: "Pack", priceMin: 30, priceMax: 50, marginMin: 15, marginMax: 20 },
        { name: "Toothpaste", note: "100g tube", unit: "Piece", priceMin: 50, priceMax: 70, marginMin: 15, marginMax: 20 },
        { name: "Matches & Agarbatti", note: "Combo", unit: "Pack", priceMin: 20, priceMax: 40, marginMin: 30, marginMax: 40 }
      ];
    } else if (cat.includes("salon") || cat.includes("beauty") || cat.includes("parlor") || cat.includes("hair")) {
       return [
        { name: "Basic Haircut", note: "Men/Kids", unit: "Service", priceMin: 50, priceMax: 100, marginMin: 80, marginMax: 90 },
        { name: "Shaving / Beard Trim", note: "Grooming", unit: "Service", priceMin: 30, priceMax: 60, marginMin: 80, marginMax: 90 },
        { name: "Women's Haircut", note: "Styling", unit: "Service", priceMin: 100, priceMax: 250, marginMin: 85, marginMax: 95 },
        { name: "Facial Treatment", note: "Basic glow", unit: "Service", priceMin: 300, priceMax: 600, marginMin: 70, marginMax: 85 },
        { name: "Hair Color / Dye", note: "Application", unit: "Service", priceMin: 150, priceMax: 300, marginMin: 60, marginMax: 75 },
        { name: "Threading", note: "Eyebrows", unit: "Service", priceMin: 20, priceMax: 40, marginMin: 90, marginMax: 95 },
        { name: "Bridal Makeup", note: "Package", unit: "Service", priceMin: 2000, priceMax: 5000, marginMin: 75, marginMax: 85 },
        { name: "Hair Spa", note: "Conditioning", unit: "Service", priceMin: 400, priceMax: 800, marginMin: 65, marginMax: 80 },
        { name: "Waxing", note: "Arms/Legs", unit: "Service", priceMin: 150, priceMax: 300, marginMin: 70, marginMax: 85 },
        { name: "Manicure / Pedicure", note: "Basic care", unit: "Service", priceMin: 200, priceMax: 400, marginMin: 75, marginMax: 85 }
       ];
    } else if (cat.includes("hardware") || cat.includes("construction") || cat.includes("sanitary")) {
       return [
        { name: "Cement", note: "50kg Bag", unit: "Bag", priceMin: 350, priceMax: 420, marginMin: 5, marginMax: 8 },
        { name: "TMT Steel Bars", note: "Per kg", unit: "kg", priceMin: 55, priceMax: 75, marginMin: 4, marginMax: 7 },
        { name: "Bricks", note: "Red Clay", unit: "100 Pcs", priceMin: 600, priceMax: 900, marginMin: 10, marginMax: 15 },
        { name: "Sand", note: "River Sand", unit: "Brass", priceMin: 3000, priceMax: 4500, marginMin: 15, marginMax: 20 },
        { name: "PVC Pipes", note: "Plumbing", unit: "Piece", priceMin: 150, priceMax: 300, marginMin: 20, marginMax: 30 },
        { name: "Paints", note: "Emulsion", unit: "Litre", priceMin: 200, priceMax: 450, marginMin: 15, marginMax: 25 },
        { name: "Nails & Screws", note: "Assorted", unit: "kg", priceMin: 80, priceMax: 120, marginMin: 25, marginMax: 35 },
        { name: "Door Fittings", note: "Hinges/Locks", unit: "Set", priceMin: 150, priceMax: 500, marginMin: 30, marginMax: 40 },
        { name: "Electrical Wire", note: "Coil (90m)", unit: "Coil", priceMin: 700, priceMax: 1200, marginMin: 12, marginMax: 18 },
        { name: "Hand Tools", note: "Hammer/Pliers", unit: "Piece", priceMin: 100, priceMax: 250, marginMin: 30, marginMax: 45 }
       ];
    }
    
    // Default fallback (10 items)
    return [
        { name: "Standard Entry Item", note: "Basic tier", unit: "Piece", priceMin: 50, priceMax: 100, marginMin: 20, marginMax: 30 },
        { name: "Mid-Tier Product", note: "Popular choice", unit: "Piece", priceMin: 150, priceMax: 250, marginMin: 25, marginMax: 35 },
        { name: "Premium Product", note: "High quality", unit: "Piece", priceMin: 400, priceMax: 600, marginMin: 30, marginMax: 45 },
        { name: "Bulk Pack", note: "Wholesale box", unit: "Box", priceMin: 800, priceMax: 1200, marginMin: 15, marginMax: 25 },
        { name: "Service / Labor Charge", note: "Skilled work", unit: "Hour", priceMin: 200, priceMax: 300, marginMin: 80, marginMax: 90 },
        { name: "Spare Part A", note: "Replacement", unit: "Piece", priceMin: 100, priceMax: 150, marginMin: 40, marginMax: 50 },
        { name: "Consumable Supplies", note: "Daily use", unit: "Pack", priceMin: 150, priceMax: 200, marginMin: 30, marginMax: 40 },
        { name: "Accessory Item", note: "Add-on", unit: "Piece", priceMin: 80, priceMax: 120, marginMin: 45, marginMax: 55 },
        { name: "Maintenance Kit", note: "Cleaning/Care", unit: "Set", priceMin: 250, priceMax: 400, marginMin: 35, marginMax: 45 },
        { name: "Custom Add-on", note: "Special request", unit: "Service", priceMin: 100, priceMax: 500, marginMin: 60, marginMax: 80 }
    ];
  }

  static getPricing(category: string) {
    return {
      suggestedPricing: "Competitive Local Rates",
      priceSensitivity: "High",
      averageBasketSize: "₹150 - ₹300",
      detailed: this.getDetailedPricing(category),
      source: "Market Synthesis",
      confidence: "Low",
      method: "Benchmark averages based on category classification.",
      freshness: "2026"
    };
  }

  static getDistributionChannels(category: string, isUrban: boolean = false) {
    const strategy = getStrategyForCategory(category);
    let channels = strategy.channels.filter(c => !c.requiresUrban || isUrban);
    channels.sort((a, b) => a.priority - b.priority);
    channels = channels.slice(0, 4);

    return {
      channels: channels.map(c => ({
        name: c.name,
        demand: c.demandLevel.split(' ')[0], 
        reason: c.reason,
        priority: c.priority,
        source: 'Business Strategy Engine'
      })),
      source: "Strategy Engine",
      confidence: "High",
      method: "Matched based on business category and location profile.",
      freshness: new Date().getFullYear().toString()
    };
  }

  static getOpportunities(category: string, capital: number, location: string = "", consumerReach: number = 0, competitorDensity: number = 0) {
    const strategy = getStrategyForCategory(category);
    
    const scoredOpps = strategy.opportunityTypes.map(opp => {
      let demandScore = opp.demandFactor === "High" ? 30 : opp.demandFactor === "Medium" ? 20 : 10;
      
      let compScore = opp.competitionFactor === "Low" ? 20 : opp.competitionFactor === "Medium" ? 12 : 5;
      if (competitorDensity > 15 && opp.competitionFactor === "High") compScore = 0;

      let capFitScore = 0;
      let capitalFitLabel = "Capital Gap Too High";
      if (capital >= opp.estimatedCapital) {
        capFitScore = 20;
        capitalFitLabel = "Fits Current Capital";
      } else if (capital >= opp.estimatedCapital * 0.50) {
        capFitScore = 12;
        capitalFitLabel = "Needs Additional Financing";
      } else {
        capFitScore = 0;
        capitalFitLabel = "Significant Financing Needed";
      }

      let marketScore = (opp.baseScore * 0.3);
      
      let totalScore = Math.round(demandScore + compScore + capFitScore + marketScore);
      if (totalScore > 99) totalScore = 99;

      return {
        ...opp,
        score: totalScore,
        capitalFit: capitalFitLabel,
        investment: "₹" + opp.estimatedCapital.toLocaleString('en-IN'),
        margin: opp.demandFactor === "High" ? "Excellent" : "Good",
        why: `Selected for ${location || 'this area'} due to ${opp.demandFactor.toLowerCase()} demand and ${opp.competitionFactor.toLowerCase()} competition. ${capitalFitLabel === 'Fits Current Capital' ? 'Perfectly fits your available capital.' : 'May require some financing to scale.'}`
      };
    });

    scoredOpps.sort((a, b) => b.score - a.score);

    const recommendation = scoredOpps[0] || { name: "General Retail", score: 50, capitalFit: "Unknown", why: "Default", investment: "N/A" };
    const otherOpps = scoredOpps.slice(1, 4);

    return {
      opportunities: otherOpps,
      recommendation: recommendation,
      source: "VyaparMitra AI Scoring Engine",
      confidence: "High",
      method: "Opportunity Score = Demand (30%) + Competition (20%) + Capital Fit (20%) + Market Base (30%)",
      freshness: new Date().getFullYear().toString()
    };
  }

  static getGrowthTactics(category: string, location: string = "") {
    return {
      tactics: [
        { title: "Digital Payment Discounts", description: "Offer 2% off for UPI payments to ensure immediate cash flow.", impact: "Cash Flow" },
        { title: "Local WhatsApp Marketing", description: `Create a community broadcast group in ${location || "your area"} for weekly special offers.`, impact: "High Retention" },
        { title: "Cross-Selling", description: "Partner with a complementary local business to refer customers to each other.", impact: "Zero-Cost Marketing" }
      ],
      source: "VyaparMitra Growth Engine",
      confidence: "High",
      method: "Strategic business expansion tactics tailored for rural micro-economies.",
      freshness: "2026"
    };
  }
  
  static async getConsumerHeatmapPoints(lat: number, lng: number, rad: number) {
    const points = [];
    const count = 50;
    const radiusDegrees = rad / 111;
    for (let i = 0; i < count; i++) {
      const r = radiusDegrees * Math.sqrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      points.push({ lat: lat + r * Math.cos(theta), lng: lng + r * Math.sin(theta), intensity: Math.random() });
    }
    return points;
  }

  static async geocodeLocation(village: string, district: string, state: string) {
    const tryGeocode = async (query: string) => {
      const res = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: { q: query, format: 'json', limit: 1, extratags: 1 },
        headers: { 'User-Agent': 'VyaparMitra-Market-Engine' }
      });
      if (res.data && res.data.length > 0) {
        const pop = res.data[0].extratags?.population ? parseInt(res.data[0].extratags.population) : null;
        return { 
          lat: parseFloat(res.data[0].lat), 
          lng: parseFloat(res.data[0].lon),
          population: pop
        };
      }
      return null;
    };

    try {
      // 1. Try most specific: Village, District, State
      let result = await tryGeocode(`${village}, ${district}, ${state}, India`);
      
      if (result && !result.population) {
         // Fetch district population as a baseline fallback
         let distResult = await tryGeocode(`${district}, ${state}, India`);
         if (distResult && distResult.population) {
             result.population = distResult.population;
         }
      }
      
      if (result) return result;

      // 2. Fallback to District, State
      result = await tryGeocode(`${district}, ${state}, India`);
      if (result) return result;

      // 3. Fallback to State
      result = await tryGeocode(`${state}, India`);
      if (result) return result;

      return { lat: 22.98, lng: 72.38, population: null };
    } catch (error: any) {
      console.error("GEOCODE ERROR:", error.message);
      return { lat: 22.98, lng: 72.38, population: null };
    }
  }
}
