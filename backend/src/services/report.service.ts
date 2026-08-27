import { assessmentService } from "./assessment.service.js";
import { geminiService } from "./gemini.service.js";
import { BusinessReport, IBusinessReport } from "../models/BusinessReport.js";

const mockReports: Map<string, any> = new Map();

export const reportService = {
  async generateReport(payload: any) {
    const assessment = await assessmentService.analyzeFeasibility(payload);
    const aiAdvice = await geminiService.getAiAdvice(payload);

    const reportData = {
      assessmentId: assessment.assessmentId,
      userId: payload.userId || "guest_entrepreneur",
      businessDetails: assessment.businessInput,
      location: assessment.locationData,
      marketAnalysis: assessment.marketData,
      competitors: assessment.competitorData,
      swot: assessment.swot,
      financialAnalysis: assessment.financialResults,
      loanScheme: assessment.schemeDetails,
      repaymentPlan: assessment.repaymentSchedule,
      aiRecommendation: aiAdvice.aiRecommendation,
      feasibilityScore: assessment.feasibilityScore,
      rating: assessment.rating,
      createdAt: new Date(),
    };

    try {
      await BusinessReport.create(reportData);
    } catch (e) {
      mockReports.set(assessment.assessmentId, reportData);
    }

    return reportData;
  },

  async getReportById(id: string) {
    try {
      const dbReport = await BusinessReport.findOne({ $or: [{ _id: id }, { assessmentId: id }] });
      if (dbReport) return dbReport;
    } catch (e) {}

    return mockReports.get(id) || null;
  },

  async getReportsByUserId(userId: string) {
    try {
      const dbReports = await BusinessReport.find({ userId }).sort({ createdAt: -1 });
      if (dbReports.length > 0) return dbReports;
    } catch (e) {}

    return Array.from(mockReports.values()).filter((r) => r.userId === userId);
  },
};
