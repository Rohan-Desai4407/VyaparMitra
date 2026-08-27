import mongoose, { Schema, Document } from "mongoose";

export interface ILocation extends Document {
  state: string;
  district: string;
  block: string;
  village: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  demographics: {
    population: number;
    purchasingPowerIndex: string;
  };
  infrastructure: string[];
  agricultureIndustryInfo: string[];
  localBusinesses: string[];
}

const LocationSchema = new Schema<ILocation>({
  state: { type: String, required: true },
  district: { type: String, required: true },
  block: { type: String, required: true },
  village: { type: String, required: true },
  coordinates: {
    latitude: { type: Number, default: 22.3 },
    longitude: { type: Number, default: 73.2 },
  },
  demographics: {
    population: { type: Number, default: 18500 },
    purchasingPowerIndex: { type: String, default: "Moderate-High" },
  },
  infrastructure: [{ type: String }],
  agricultureIndustryInfo: [{ type: String }],
  localBusinesses: [{ type: String }],
});

export const Location = mongoose.model<ILocation>("Location", LocationSchema);
