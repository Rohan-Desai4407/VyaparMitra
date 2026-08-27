import { Location, ILocation } from "../models/Location.js";

const mockLocations: Partial<ILocation>[] = [
  {
    _id: "loc_sanand_01" as any,
    state: "Gujarat",
    district: "Ahmedabad",
    block: "Sanand",
    village: "Changodar",
    coordinates: { latitude: 22.95, longitude: 72.4 },
    demographics: { population: 18500, purchasingPowerIndex: "Moderate-High (Semi-Urban Peripheral)" },
    infrastructure: ["3 Phase Industrial Electricity", "National Highway Connectivity", "Cold Storage Aggregator 4km away"],
    agricultureIndustryInfo: ["Dairy Cooperatives", "Highway Food Outlets", "Light Industrial Corridor"],
    localBusinesses: ["Amul Milk Parlour", "Jay Bhavani Refreshment", "Kisan Agri Feed Store"],
  },
  {
    _id: "loc_savli_02" as any,
    state: "Gujarat",
    district: "Vadodara",
    block: "Savli",
    village: "Example Village",
    coordinates: { latitude: 22.56, longitude: 73.22 },
    demographics: { population: 12400, purchasingPowerIndex: "Moderate (Rural Agri Belt)" },
    infrastructure: ["Gram Panchayat Solar Microgrid", "State Highway 15 Connectivity"],
    agricultureIndustryInfo: ["Cotton & Wheat Cultivation", "Village Milk Collection Center"],
    localBusinesses: ["Savli General Stores", "Village Dairy Collection Point"],
  },
];

export const locationService = {
  async search(query: string) {
    const q = query.toLowerCase().trim();
    try {
      const dbResults = await Location.find({
        $or: [
          { village: { $regex: q, $options: "i" } },
          { block: { $regex: q, $options: "i" } },
          { district: { $regex: q, $options: "i" } },
        ],
      });
      if (dbResults.length > 0) return dbResults;
    } catch (e) {
      // fallback
    }

    return mockLocations.filter(
      (l) =>
        l.village?.toLowerCase().includes(q) ||
        l.block?.toLowerCase().includes(q) ||
        l.district?.toLowerCase().includes(q) ||
        l.state?.toLowerCase().includes(q)
    );
  },

  async getLocationById(id: string) {
    try {
      const dbLocation = await Location.findById(id);
      if (dbLocation) return dbLocation;
    } catch (e) {}

    const found = mockLocations.find((l) => (l._id as any) === id);
    return found || mockLocations[0];
  },

  async getMarketByLocationId(id: string) {
    const location = await this.getLocationById(id);
    return {
      locationId: id,
      state: location.state,
      district: location.district,
      block: location.block,
      village: location.village,
      consumerBase5to10km: location.demographics?.population || 18500,
      purchasingPowerIndex: location.demographics?.purchasingPowerIndex || "Moderate",
      infrastructure: location.infrastructure,
      localBusinesses: location.localBusinesses,
    };
  },
};
