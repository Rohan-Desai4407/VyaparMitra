import mongoose, { Schema, Document } from "mongoose";

export interface ILoanScheme extends Document {
  code: "MICRO" | "TERM";
  name: string;
  maxProjectCostText: string;
  minProjectCost: number;
  maxProjectCost: number;
  agencyFinancingPercent: number;
  maxLoanAmount: number;
  interestRate: number;
  tenureYears: number;
  moratoriumMonths: number;
}

const LoanSchemeSchema = new Schema<ILoanScheme>({
  code: { type: String, enum: ["MICRO", "TERM"], required: true, unique: true },
  name: { type: String, required: true },
  maxProjectCostText: { type: String, required: true },
  minProjectCost: { type: Number, required: true },
  maxProjectCost: { type: Number, required: true },
  agencyFinancingPercent: { type: Number, default: 90 },
  maxLoanAmount: { type: Number, required: true },
  interestRate: { type: Number, required: true },
  tenureYears: { type: Number, required: true },
  moratoriumMonths: { type: Number, required: true },
});

export const LoanScheme = mongoose.model<ILoanScheme>("LoanScheme", LoanSchemeSchema);
