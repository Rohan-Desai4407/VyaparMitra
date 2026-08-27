import mongoose from "mongoose";
import dns from "dns";
import bcrypt from "bcryptjs";
import { config } from "../config/env.js";
import { User } from "../models/User.js";
import { Location } from "../models/Location.js";
import { LoanScheme } from "../models/LoanScheme.js";

try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {}

export const seedDatabase = async () => {
  try {
    console.log("[Seed] Connecting to MongoDB Atlas...");
    await mongoose.connect(config.mongodbUri);

    // 1. Seed Demo User
    const adminEmail = "admin@vyaparmitra.in";
    const existingUser = await User.findOne({ email: adminEmail });
    if (!existingUser) {
      const passwordHash = await bcrypt.hash("admin123", 10);
      await User.create({
        name: "Admin Entrepreneur",
        email: adminEmail,
        passwordHash,
        preferredLanguage: "en",
      });
      console.log("[Seed] Created default admin user: admin@vyaparmitra.in");
    }

    // 2. Seed Initial Locations
    const locationCount = await Location.countDocuments();
    if (locationCount === 0) {
      await Location.insertMany([
        {
          state: "Gujarat",
          district: "Ahmedabad",
          block: "Sanand",
          village: "Changodar",
          purchasingPowerIdx: "Moderate-High",
          consumerBase5to10km: 18500,
        },
        {
          state: "Gujarat",
          district: "Rajkot",
          block: "Gondal",
          village: "Bhavnath",
          purchasingPowerIdx: "Moderate",
          consumerBase5to10km: 14200,
        },
        {
          state: "Maharashtra",
          district: "Pune",
          block: "Haveli",
          village: "Wagholi",
          purchasingPowerIdx: "High",
          consumerBase5to10km: 32000,
        },
        {
          state: "Rajasthan",
          district: "Jaipur",
          block: "Sanganer",
          village: "Watika",
          purchasingPowerIdx: "Moderate",
          consumerBase5to10km: 16800,
        },
      ]);
      console.log("[Seed] Populated initial location records.");
    }

    // 3. Seed Loan Schemes
    const schemeCount = await LoanScheme.countDocuments();
    if (schemeCount === 0) {
      await LoanScheme.insertMany([
        {
          code: "MICRO",
          name: "Micro Finance Scheme",
          maxProjectCostText: "Up to ₹1.40 Lakh",
          minProjectCost: 0,
          maxProjectCost: 140000,
          agencyFinancingPercent: 90,
          maxLoanAmount: 125000,
          interestRate: 6.5,
          tenureYears: 3,
          moratoriumMonths: 3,
        },
        {
          code: "TERM",
          name: "Term Loan Scheme",
          maxProjectCostText: "₹1.40 Lakh to ₹50 Lakh",
          minProjectCost: 140000,
          maxProjectCost: 5000000,
          agencyFinancingPercent: 90,
          maxLoanAmount: 4500000,
          interestRate: 8.0,
          tenureYears: 7,
          moratoriumMonths: 6,
        },
      ]);
      console.log("[Seed] Populated government loan schemes.");
    }

    console.log("[Seed] Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("[Seed Error] Failed to seed database:", error);
    process.exit(1);
  }
};

seedDatabase();
