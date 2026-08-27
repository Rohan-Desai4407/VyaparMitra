import { Competitor, ICompetitor } from "../models/Competitor.js";

const mockCompetitors = [
  { businessName: "Amul Milk Hub Sanand", category: "Dairy", location: "Sanand", coordinates: { latitude: 22.96, longitude: 72.41 }, information: "Major cooperative collection point" },
  { businessName: "Desai Dairy Farm", category: "Dairy", location: "Changodar", coordinates: { latitude: 22.94, longitude: 72.39 }, information: "Private supplier 30 cows" },
  { businessName: "Kisan Feed & Milk Store", category: "Dairy", location: "Changodar", coordinates: { latitude: 22.95, longitude: 72.42 }, information: "Retail feed & packaged milk store" },
];

export const competitorService = {
  async getCompetitors(category?: string, radius: number = 10) {
    try {
      const dbCompetitors = await Competitor.find(category ? { category: new RegExp(category, "i") } : {});
      if (dbCompetitors.length > 0) return dbCompetitors;
    } catch (e) {}

    if (category) {
      return mockCompetitors.filter((c) => c.category.toLowerCase().includes(category.toLowerCase()));
    }
    return mockCompetitors;
  },

  async analyzeCompetitors(businessCategory: string, latitude: number, longitude: number, radius: number = 10) {
    const list = await this.getCompetitors(businessCategory, radius);
    const count = list.length;
    let density: "Low" | "Medium" | "High" = "Medium";

    if (count <= 2) density = "Low";
    else if (count >= 8) density = "High";

    return {
      businessCategory,
      latitude,
      longitude,
      radiusKm: radius,
      competitorCount: count,
      density,
      majorCompetitors: list.map((c) => c.businessName),
      marketGap: `Fresh doorstep home-delivery & direct B2B supply of packaged ${businessCategory} products.`,
    };
  },
};
