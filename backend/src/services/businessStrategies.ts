export const businessStrategies = {
  dairy: {
    channels: [
      { name: "Dairy Cooperatives", demandLevel: "High Demand", priority: 1, reason: "Stable daily collection points are common in this region.", requiresUrban: false },
      { name: "Local Mandi", demandLevel: "Medium Demand", priority: 2, reason: "Good for direct sales to bulk buyers.", requiresUrban: false },
      { name: "Retail Grocery Stores", demandLevel: "High Demand", priority: 3, reason: "Strong daily demand for packaged milk and ghee.", requiresUrban: false },
      { name: "Direct-to-Consumer", demandLevel: "High Demand", priority: 4, reason: "High margin, smaller volume. Excellent for doorstep subscription.", requiresUrban: false },
      { name: "Restaurants / Hotels", demandLevel: "Medium Demand", priority: 5, reason: "B2B supply for paneer and bulk milk.", requiresUrban: true },
      { name: "Milk Collection Centers", demandLevel: "High Demand", priority: 1, reason: "Ideal for fresh raw milk offload.", requiresUrban: false }
    ],
    opportunityTypes: [
      { name: "Specialty Local Produce Aisle", baseScore: 60, estimatedCapital: 45000, demandFactor: "High", competitionFactor: "Medium", type: "Retail" },
      { name: "Home Delivery Subscription", baseScore: 65, estimatedCapital: 30000, demandFactor: "Medium", competitionFactor: "Low", type: "Service" },
      { name: "Value-Added Ghee & Paneer", baseScore: 75, estimatedCapital: 80000, demandFactor: "High", competitionFactor: "Medium", type: "Processing" },
      { name: "Automated Milking Unit", baseScore: 50, estimatedCapital: 250000, demandFactor: "Medium", competitionFactor: "Low", type: "Farming" },
      { name: "Mini Dairy Collection Center", baseScore: 70, estimatedCapital: 120000, demandFactor: "High", competitionFactor: "High", type: "Aggregation" }
    ],
  },
  foodProcessing: {
    channels: [
      { name: "Local Wholesale", demandLevel: "High Demand", priority: 1, reason: "Primary bulk movement for processed staples.", requiresUrban: false },
      { name: "Retail Stores", demandLevel: "Medium Demand", priority: 2, reason: "Good for branded local packaging.", requiresUrban: false },
      { name: "Supermarkets", demandLevel: "High Demand", priority: 3, reason: "Excellent margins for premium packaging.", requiresUrban: true },
      { name: "Restaurants", demandLevel: "Medium Demand", priority: 4, reason: "Bulk supply of spices and processed ingredients.", requiresUrban: true },
      { name: "B2B Distribution", demandLevel: "Medium Demand", priority: 5, reason: "Selling to regional distributors.", requiresUrban: false },
      { name: "Direct Retail", demandLevel: "Low Demand", priority: 6, reason: "Factory outlet style sales.", requiresUrban: false }
    ],
    opportunityTypes: [
      { name: "Spices & Flour Milling", baseScore: 70, estimatedCapital: 150000, demandFactor: "High", competitionFactor: "High", type: "Processing" },
      { name: "Snacks & Namkeen Manufacturing", baseScore: 65, estimatedCapital: 90000, demandFactor: "High", competitionFactor: "Medium", type: "Processing" },
      { name: "Cold Pressed Oil Extraction", baseScore: 75, estimatedCapital: 200000, demandFactor: "Medium", competitionFactor: "Low", type: "Processing" },
      { name: "Pickle & Papads Small Unit", baseScore: 60, estimatedCapital: 40000, demandFactor: "Medium", competitionFactor: "High", type: "Processing" }
    ]
  },
  agriculture: {
    channels: [
      { name: "APMC / Mandi", demandLevel: "High Demand", priority: 1, reason: "Regulated wholesale market for bulk sales.", requiresUrban: false },
      { name: "Local Wholesale", demandLevel: "Medium Demand", priority: 2, reason: "Direct to regional traders.", requiresUrban: false },
      { name: "Farmer Producer Organizations", demandLevel: "Medium Demand", priority: 3, reason: "Aggregated selling for better negotiation.", requiresUrban: false },
      { name: "Retail Buyers", demandLevel: "Low Demand", priority: 4, reason: "Farm-gate sales to consumers.", requiresUrban: false },
      { name: "Food Processors", demandLevel: "High Demand", priority: 5, reason: "Direct contract farming supply.", requiresUrban: false }
    ],
    opportunityTypes: [
      { name: "Organic Vegetables Farming", baseScore: 75, estimatedCapital: 80000, demandFactor: "High", competitionFactor: "Low", type: "Farming" },
      { name: "Greenhouse / Polyhouse Setup", baseScore: 65, estimatedCapital: 300000, demandFactor: "High", competitionFactor: "Medium", type: "Farming" },
      { name: "Mushroom Cultivation", baseScore: 60, estimatedCapital: 50000, demandFactor: "Medium", competitionFactor: "Low", type: "Farming" },
      { name: "Vermi-Compost Unit", baseScore: 70, estimatedCapital: 30000, demandFactor: "Medium", competitionFactor: "Low", type: "Farming" }
    ]
  },
  clothing: {
    channels: [
      { name: "Local Retail", demandLevel: "High Demand", priority: 1, reason: "Direct sales to local consumers.", requiresUrban: false },
      { name: "Wholesale Market", demandLevel: "Medium Demand", priority: 2, reason: "Supplying to smaller shops in surrounding villages.", requiresUrban: false },
      { name: "Direct-to-Consumer Online", demandLevel: "Medium Demand", priority: 3, reason: "Selling via Instagram and WhatsApp.", requiresUrban: false },
      { name: "Nearby Boutiques", demandLevel: "Medium Demand", priority: 4, reason: "Supplying specific tailored or ethnic wear.", requiresUrban: true }
    ],
    opportunityTypes: [
      { name: "Readymade Garments Shop", baseScore: 75, estimatedCapital: 100000, demandFactor: "High", competitionFactor: "High", type: "Retail" },
      { name: "Boutique & Tailoring Center", baseScore: 70, estimatedCapital: 60000, demandFactor: "Medium", competitionFactor: "Medium", type: "Service" },
      { name: "School & Work Uniforms", baseScore: 80, estimatedCapital: 80000, demandFactor: "High", competitionFactor: "Low", type: "Retail" },
      { name: "Online Ethnic Wear Reselling", baseScore: 65, estimatedCapital: 30000, demandFactor: "Medium", competitionFactor: "High", type: "Retail" }
    ]
  },
  grocery: {
    channels: [
      { name: "Local Retail", demandLevel: "High Demand", priority: 1, reason: "Walk-in customers for daily necessities.", requiresUrban: false },
      { name: "Home Delivery", demandLevel: "Medium Demand", priority: 2, reason: "Convenience for regular local buyers.", requiresUrban: false },
      { name: "Wholesale (B2B)", demandLevel: "Low Demand", priority: 3, reason: "Supplying small pan shops or tea stalls.", requiresUrban: false }
    ],
    opportunityTypes: [
      { name: "Modern Kirana Setup", baseScore: 75, estimatedCapital: 150000, demandFactor: "High", competitionFactor: "High", type: "Retail" },
      { name: "Mini-Supermarket", baseScore: 70, estimatedCapital: 400000, demandFactor: "High", competitionFactor: "Medium", type: "Retail" },
      { name: "Specialty Health/Organic Store", baseScore: 65, estimatedCapital: 120000, demandFactor: "Medium", competitionFactor: "Low", type: "Retail" },
      { name: "Wholesale Staples Supply", baseScore: 60, estimatedCapital: 250000, demandFactor: "Medium", competitionFactor: "High", type: "Wholesale" }
    ]
  },
  general: {
    channels: [
      { name: "Direct to Consumer", demandLevel: "High Demand", priority: 1, reason: "General consumer walk-ins.", requiresUrban: false },
      { name: "B2B Services", demandLevel: "Medium Demand", priority: 2, reason: "Providing services/goods to local businesses.", requiresUrban: false }
    ],
    opportunityTypes: [
      { name: "Standard Retail Outlet", baseScore: 60, estimatedCapital: 100000, demandFactor: "Medium", competitionFactor: "Medium", type: "Retail" },
      { name: "Essential Local Service", baseScore: 70, estimatedCapital: 50000, demandFactor: "High", competitionFactor: "Low", type: "Service" },
      { name: "Digital Services & CSC", baseScore: 75, estimatedCapital: 60000, demandFactor: "High", competitionFactor: "Medium", type: "Service" }
    ]
  }
};

export function getStrategyForCategory(category: string) {
  const cat = category.toLowerCase();
  if (cat.includes("dairy") || cat.includes("milk") || cat.includes("cow")) return businessStrategies.dairy;
  if (cat.includes("food") || cat.includes("agro") || cat.includes("processing")) return businessStrategies.foodProcessing;
  if (cat.includes("agriculture") || cat.includes("farm")) return businessStrategies.agriculture;
  if (cat.includes("cloth") || cat.includes("textile") || cat.includes("garment")) return businessStrategies.clothing;
  if (cat.includes("shop") || cat.includes("store") || cat.includes("kirana") || cat.includes("retail")) return businessStrategies.grocery;
  return businessStrategies.general;
}
