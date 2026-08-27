export const marketService = {
  async getMarketIntelligence(locationId: string) {
    return {
      locationId,
      consumerBase5to10km: 18500,
      distributionChannels: [
        "Direct to Local Mandi",
        "Dairy Cooperatives",
        "Doorstep Retail Delivery",
        "Local Sweet Shops",
      ],
      unservedNiches: [
        "Organic A2 Milk Packaging",
        "Value-added Ghee & Paneer",
        "Cold Storage Aggregation",
      ],
      competitorDensity: "Medium",
      competitorCount: 4,
      suggestedPricing: "₹58 - ₹64 per Litre (A2 Premium: ₹75/L)",
      purchasingPowerIdx: "Moderate-High (Semi-Urban Peripheral)",
      regionalRisks: [
        "Summer fodder price escalation",
        "Monsoon road waterlogging near collection hubs",
      ],
    };
  },

  async analyzeMarket(locationId: string, category: string) {
    const market = await this.getMarketIntelligence(locationId);
    return {
      category,
      ...market,
      marketDemandScore: 88,
      demandVerdict: `High demand for ${category} products within 10 km radius.`,
    };
  },
};
