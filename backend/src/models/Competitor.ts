import mongoose, { Schema, Document } from "mongoose";

export interface ICompetitor extends Document {
  businessName: string;
  category: string;
  location: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  information: string;
}

const CompetitorSchema = new Schema<ICompetitor>({
  businessName: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  coordinates: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  information: { type: String, default: "" },
});

export const Competitor = mongoose.model<ICompetitor>("Competitor", CompetitorSchema);
