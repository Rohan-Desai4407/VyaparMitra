import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash?: string;
  preferredLanguage: string;
  isVerified: boolean;
  googleId?: string | null;
  picture?: string | null;
  verificationToken?: string | null;
  verificationTokenExpires?: Date | null;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  createdAt: Date;
  
  personalDetails?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    dateOfBirth?: Date;
    gender?: string;
  };
  businessDetails?: {
    businessName?: string;
    industry?: string;
    registrationType?: string;
    yearEstablished?: number;
    annualTurnover?: number;
    gstNumber?: string;
  };
  locationDetails?: {
    addressLine1?: string;
    addressLine2?: string;
    district?: string;
    taluka?: string;
    village?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };
  financialDetails?: {
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    panNumber?: string;
    availableMarginCapital?: number;
    existingBusinessInvestment?: number;
    monthlyBusinessIncomeRange?: string;
    existingLoanStatus?: boolean;
    preferredLoanAmount?: number;
  };
  kycDetails?: {
    aadhaarNumber?: string;
    kycStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED';
    kycSubmittedAt?: Date;
  };
  preferences?: {
    newsletter?: boolean;
    smsAlerts?: boolean;
    whatsappAlerts?: boolean;
    schemeAlerts?: boolean;
    repaymentReminders?: boolean;
    currency?: string;
  };
  documents?: {
    documentType: string;
    documentUrl: string;
    uploadedAt: Date;
  }[];
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, default: "" },
  preferredLanguage: { type: String, default: "en" },
  isVerified: { type: Boolean, default: false },
  googleId: { type: String, default: null },
  picture: { type: String, default: null },
  verificationToken: { type: String, default: null },
  verificationTokenExpires: { type: Date, default: null },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },

  personalDetails: {
    firstName: { type: String },
    lastName: { type: String },
    phone: { type: String },
    dateOfBirth: { type: Date },
    gender: { type: String },
  },
  businessDetails: {
    businessName: { type: String },
    industry: { type: String },
    registrationType: { type: String },
    yearEstablished: { type: Number },
    annualTurnover: { type: Number },
    gstNumber: { type: String },
  },
  locationDetails: {
    addressLine1: { type: String },
    addressLine2: { type: String },
    district: { type: String },
    taluka: { type: String },
    village: { type: String },
    state: { type: String },
    pincode: { type: String },
    country: { type: String },
  },
  financialDetails: {
    bankName: { type: String },
    accountNumber: { type: String },
    ifscCode: { type: String },
    panNumber: { type: String },
    availableMarginCapital: { type: Number },
    existingBusinessInvestment: { type: Number },
    monthlyBusinessIncomeRange: { type: String },
    existingLoanStatus: { type: Boolean },
    preferredLoanAmount: { type: Number },
  },
  kycDetails: {
    aadhaarNumber: { type: String },
    kycStatus: { type: String, enum: ['PENDING', 'VERIFIED', 'REJECTED'] },
    kycSubmittedAt: { type: Date },
  },
  preferences: {
    newsletter: { type: Boolean, default: true },
    smsAlerts: { type: Boolean, default: true },
    whatsappAlerts: { type: Boolean, default: true },
    schemeAlerts: { type: Boolean, default: true },
    repaymentReminders: { type: Boolean, default: true },
    currency: { type: String, default: 'INR' },
  },
  documents: [{
    documentType: { type: String },
    documentUrl: { type: String },
    uploadedAt: { type: Date, default: Date.now }
  }]
});

export const User = mongoose.model<IUser>("User", UserSchema);
