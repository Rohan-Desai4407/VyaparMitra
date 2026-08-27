import mongoose, { Schema, Document } from "mongoose";

export interface IBusinessReport extends Document {
  assessmentId: string;
  userId?: string;
  businessDetails: Record<string, any>;
  location: Record<string, any>;
  marketAnalysis: Record<string, any>;
  competitors: Record<string, any>;
  swot: Record<string, any>;
  financialAnalysis: Record<string, any>;
  loanScheme: Record<string, any>;
  repaymentPlan: Record<string, any>;
  aiRecommendation: string;
  createdAt: Date;
}

const BusinessReportSchema = new Schema<IBusinessReport>({
  assessmentId: { type: String, required: true, unique: true },
  userId: { type: String },
  businessDetails: { type: Schema.Types.Mixed, required: true },
  location: { type: Schema.Types.Mixed, required: true },
  marketAnalysis: { type: Schema.Types.Mixed, required: true },
  competitors: { type: Schema.Types.Mixed, required: true },
  swot: { type: Schema.Types.Mixed, required: true },
  financialAnalysis: { type: Schema.Types.Mixed, required: true },
  loanScheme: { type: Schema.Types.Mixed, required: true },
  repaymentPlan: { type: Schema.Types.Mixed, required: true },
  aiRecommendation: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const BusinessReport = mongoose.model<IBusinessReport>("BusinessReport", BusinessReportSchema);
