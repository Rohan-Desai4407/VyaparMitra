import { authApiService } from "../services/apiServices";
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { aiAdvisorService } from "../services/aiAdvisorService";

export interface BusinessInputData {
  assessmentId?: string;
  stateId: string;
  state: string;
  districtId: string;
  district: string;
  subDistrictId: string;
  block: string;
  villageId: string;
  village: string;
  marginCapital: number;
  categoryId: string;
  category: string;
  language: string;
}

export interface SchemeDetails {
  name: string;
  maxProjectCost: string;
  agencyFinancing: string;
  maxLoan: number;
  interestRate: number;
  tenureYears: number;
  moratoriumMonths: number;
  code: "MICRO" | "TERM";
}

export interface FinancialCalculation {
  marginCapital: number;
  projectCost: number;
  maxLoanAmount: number;
  userContribution: number;
  scheme: SchemeDetails;
  quarterlyEmi: number;
  monthlyEmi: number;
  totalRepayment: number;
}

export interface MarketData {
  consumerBase5to10km: number;
  distributionChannels: string[];
  unservedNiches: string[];
  competitorDensity: "Low" | "Medium" | "High";
  competitorCount: number;
  suggestedPricing: string;
  purchasingPowerIdx: string;
}

export interface SwotAndRisk {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  localRisks: string[];
}

export interface FeasibilityReport {
  viabilityScore: number;
  overallVerdict: "Highly Viable" | "Moderately Viable" | "Requires Restructuring" | "High Risk";
  recommendation: string;
  marketInsights: string;
  keyActionItems: string[];
}

interface VyaparContextType {
  input: BusinessInputData;
  setInput: React.Dispatch<React.SetStateAction<BusinessInputData>>;
  financials: FinancialCalculation;
  market: MarketData;
  swot: SwotAndRisk;
  report: FeasibilityReport;
  updateInput: (fields: Partial<BusinessInputData>) => void;
  updateProjectCost: (cost: number) => void;
  generateReport: (data: BusinessInputData) => Promise<void>;
  isGenerating: boolean;
  profile: any;
  updateUserProfile: (updates: any) => Promise<void>;
  isProfileLoading: boolean;
}

export const computeFinancials = (margin: number): FinancialCalculation => {
  const projectCost = margin / 0.1;
  const rawLoan = projectCost * 0.9;

  let scheme: SchemeDetails;

  if (projectCost <= 140000) {
    scheme = {
      name: "Micro Finance Scheme",
      maxProjectCost: "Up to ₹1.40 Lakh",
      agencyFinancing: "Up to 90%",
      maxLoan: 125000,
      interestRate: 6.5,
      tenureYears: 3,
      moratoriumMonths: 3,
      code: "MICRO",
    };
  } else {
    scheme = {
      name: "Term Loan Scheme",
      maxProjectCost: "₹1.40 Lakh to ₹50 Lakh",
      agencyFinancing: "Up to 90%",
      maxLoan: 4500000,
      interestRate: 8.0,
      tenureYears: 7,
      moratoriumMonths: 6,
      code: "TERM",
    };
  }

  const maxLoanAmount = Math.min(rawLoan, scheme.maxLoan);
  const r = scheme.interestRate / 100 / 12;
  const n = scheme.tenureYears * 12;
  
  const monthlyEmi = Math.round((maxLoanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)) || 0;
  const quarterlyEmi = monthlyEmi * 3;
  const totalRepayment = monthlyEmi * n;

  return {
    marginCapital: margin,
    projectCost: Math.round(projectCost),
    maxLoanAmount: Math.round(maxLoanAmount),
    userContribution: Math.round(margin),
    scheme,
    monthlyEmi,
    quarterlyEmi,
    totalRepayment: Math.round(totalRepayment),
  };
};

const defaultInput: BusinessInputData = {
  stateId: "cm0az9s8700010cl3f9660dta",
  state: "Gujarat",
  districtId: "cm0az9s8l00q50cl3db306rtt",
  district: "Surat",
  subDistrictId: "cm0az9saf08v90cl336dta1a9",
  block: "Udhna",
  villageId: "cm0az9sfp19u50cl393g08h7g",
  village: "Dindoli",
  marginCapital: 100000,
  categoryId: "mock-1",
  category: "Bakery & Sweets Shop",
  language: "Gujarati",
};

const defaultMarket: MarketData = {
  consumerBase5to10km: 18500,
  distributionChannels: ["Retail Storefront", "Local Event Catering", "Online Food Delivery Apps", "Corporate Tie-ups"],
  unservedNiches: ["Sugar-free/Dietary Sweets", "Custom Themed Cakes", "Artisanal Breads"],
  competitorDensity: "Medium",
  competitorCount: 4,
  suggestedPricing: "₹250 - ₹400 per kg (Premium: ₹600/kg)",
  purchasingPowerIdx: "Moderate-High (Semi-Urban Peripheral)",
};

const defaultSwot: SwotAndRisk = {
  strengths: [
    "High local daily demand for fresh baked goods and sweets",
    "Strong festive season sales and recurring event orders",
    "Immediate cash-flow generation capability",
  ],
  weaknesses: [
    "High perishability of products",
    "Requires skilled local labor for traditional sweets",
  ],
  opportunities: [
    "Expanding product line to health-conscious/dietary options",
    "Partnering with local cafes for B2B supply",
    "Establishing an online delivery presence",
  ],
  threats: [
    "Raw material price fluctuations (sugar, flour, dairy)",
    "Competition from established branded retail chains",
  ],
  localRisks: [
    "Supply-chain bottleneck during festive peak seasons",
    "Power outages affecting refrigeration and baking schedules",
    "Spoilage due to unexpected drops in daily footfall",
  ],
};

const defaultReport: FeasibilityReport = {
  viabilityScore: 84,
  overallVerdict: "Highly Viable",
  recommendation:
    "The proposed Bakery & Sweets Shop unit in Dindoli, Udhna has strong demand parameters and high consumer density within a 5 km radius. Available margin capital of ₹1,00,000 unlocks a total feasible project setup of ₹10,00,000 under the Term Loan Scheme with 90% agency financing (₹9,00,000 loan).",
  marketInsights:
    "Local market analysis reveals underserved demand for specialized and premium baked goods near emerging residential hubs.",
  keyActionItems: [
    "Apply for Term Loan Scheme via local Bank branch",
    "Secure reliable suppliers for high-quality raw materials",
    "Invest in quality display and refrigeration units",
    "Plan marketing campaigns around upcoming local festivals",
  ],
};

const VyaparContext = createContext<VyaparContextType | undefined>(undefined);

export const VyaparProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [input, setInput] = useState<BusinessInputData>(defaultInput);
  const [financials, setFinancials] = useState<FinancialCalculation>(() => computeFinancials(defaultInput.marginCapital));
  
  const [market, setMarket] = useState<MarketData>(defaultMarket);
  const [swot, setSwot] = useState<SwotAndRisk>(defaultSwot);
  const [report, setReport] = useState<FeasibilityReport>(defaultReport);
  const [isGenerating, setIsGenerating] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await authApiService.getProfile(token);
          if (res.success && res.data) {
            setProfile(res.data);
            
            // Sync with default inputs based on profile data
            const newInput = { ...defaultInput };
            if (res.data.locationDetails?.state) newInput.state = res.data.locationDetails.state;
            if (res.data.locationDetails?.city) newInput.district = res.data.locationDetails.city;
            if (res.data.businessDetails?.industry) newInput.category = res.data.businessDetails.industry;
            
            try {
              const assRes = await fetch("http://localhost:3001/api/assessments/latest", {
                headers: { "Authorization": `Bearer ${token}` }
              });
              if (assRes.ok) {
                const ass = await assRes.json();
                if (ass && !ass.error) {
                  if (ass.businessCategoryId) newInput.categoryId = ass.businessCategoryId;
                  if (ass.businessCategory?.name) newInput.category = ass.businessCategory.name;
                  if (ass.availableMarginCapital) newInput.marginCapital = ass.availableMarginCapital;
                  if (ass.stateId) newInput.stateId = ass.stateId;
                  if (ass.districtId) newInput.districtId = ass.districtId;
                  if (ass.subDistrictId) newInput.subDistrictId = ass.subDistrictId;
                  if (ass.villageId) newInput.villageId = ass.villageId;
                  if (ass.state?.name) newInput.state = ass.state.name;
                  if (ass.district?.name) newInput.district = ass.district.name;
                  if (ass.subDistrict?.name) newInput.block = ass.subDistrict.name;
                  if (ass.village?.name) newInput.village = ass.village.name;
                }
              }
            } catch(e) {
              console.warn("Failed to fetch latest assessment", e);
            }
            
            setInput(newInput);
            setFinancials(computeFinancials(newInput.marginCapital));
          }
        } catch (error) {
          console.error("Failed to fetch profile", error);
        }
      }
      setIsProfileLoading(false);
    };

    fetchProfile();
    
    // Also listen for auth changes
    const handleAuthChange = () => fetchProfile();
    window.addEventListener('userUpdated', handleAuthChange);
    return () => window.removeEventListener('userUpdated', handleAuthChange);
  }, []);

  const updateUserProfile = async (updates: any) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");
    try {
      const res = await authApiService.updateProfile(token, updates);
      if (res.success && res.data) {
        setProfile(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
        window.dispatchEvent(new Event('userUpdated'));
      } else {
        throw new Error(res.message || "Failed to update via API");
      }
    } catch (e) {
      console.warn("API failed, using local storage fallback", e);
      setProfile((prev: any) => {
        const currentUser = prev || JSON.parse(localStorage.getItem('user') || '{}');
        const newProfile = { ...currentUser, ...updates };
        localStorage.setItem('user', JSON.stringify(newProfile));
        return newProfile;
      });
      window.dispatchEvent(new Event('userUpdated'));
    }
  };

  const updateProjectCost = (totalCost: number) => {
    setFinancials(prev => {
      const newRawLoan = totalCost * 0.9;
      return {
        ...prev,
        projectCost: Math.round(totalCost),
        maxLoanAmount: Math.round(newRawLoan)
      };
    });
  };

  const updateInput = (fields: Partial<BusinessInputData>) => {
    setInput((prev) => {
      const updated = { ...prev, ...fields };
      if (fields.marginCapital !== undefined) {
        setFinancials(computeFinancials(fields.marginCapital));
      }
      return updated;
    });
  };

  const generateReport = useCallback(async (data: BusinessInputData) => {
    setIsGenerating(true);
    try {
      const generated = await aiAdvisorService.generateFeasibilityReport(data);
      setMarket(generated.marketData);
      setSwot(generated.swotAndRisk);
      setReport(generated.feasibilityReport);
    } catch (error) {
      console.error("Failed to generate report:", error);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return (
    <VyaparContext.Provider
      value={{
        input,
        setInput,
        financials,
        market,
        swot,
        report,
        updateInput,
        updateProjectCost,
        generateReport,
        isGenerating,
        profile,
        updateUserProfile,
        isProfileLoading
      }}
    >
      {children}
    </VyaparContext.Provider>
  );
};

export const useVyapar = () => {
  const context = useContext(VyaparContext);
  if (!context) {
    throw new Error("useVyapar must be used within a VyaparProvider");
  }
  return context;
};
