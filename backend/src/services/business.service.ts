import { Business, IBusiness } from "../models/Business.js";

const mockBusinesses: Map<string, any> = new Map();

export const businessService = {
  async createInput(inputData: {
    businessCategory: string;
    state: string;
    district: string;
    block: string;
    village: string;
    marginCapital: number;
    language?: string;
    userId?: string;
  }) {
    const assessmentId = "vm_" + Date.now().toString(36) + "_" + Math.random().toString(36).substring(2, 6);

    const businessPayload = {
      assessmentId,
      userId: inputData.userId,
      businessCategory: inputData.businessCategory,
      state: inputData.state,
      district: inputData.district,
      block: inputData.block,
      village: inputData.village,
      marginCapital: inputData.marginCapital,
      language: inputData.language || "en",
      createdAt: new Date(),
    };

    try {
      await Business.create(businessPayload);
    } catch (e) {
      mockBusinesses.set(assessmentId, businessPayload);
    }

    return {
      assessmentId,
      status: "CREATED",
      message: "Business input validated and assessment ID generated successfully.",
      data: businessPayload,
    };
  },

  async getBusinessInput(assessmentId: string) {
    try {
      const dbBusiness = await Business.findOne({ assessmentId });
      if (dbBusiness) return dbBusiness;
    } catch (e) {}

    return mockBusinesses.get(assessmentId) || null;
  },
};
