import mongoose, { Schema, Document } from "mongoose";

export interface IBusiness extends Document {
  assessmentId: string;
  userId?: string;
  businessCategory: string;
  state: string;
  district: string;
  block: string;
  village: string;
  marginCapital: number;
  language: string;
  createdAt: Date;
}

const BusinessSchema = new Schema<IBusiness>({
  assessmentId: { type: String, required: true, unique: true },
  userId: { type: String },
  businessCategory: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  block: { type: String, required: true },
  village: { type: String, required: true },
  marginCapital: { type: Number, required: true },
  language: { type: String, default: "en" },
  createdAt: { type: Date, default: Date.now },
});

export const Business = mongoose.model<IBusiness>("Business", BusinessSchema);
