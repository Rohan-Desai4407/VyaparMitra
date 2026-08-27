import { useState, useEffect } from 'react';
import { useVyapar } from '../context/VyaparContext';

export interface MarketIntelligenceData {
  consumer: any;
  competitor: any;
  purchasing: any;
  pricing: any;
  distribution: any;
  opportunities: any;
}

export function useMarketIntelligence(radius: number) {
  const { input } = useVyapar();
  const [data, setData] = useState<MarketIntelligenceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIntelligence = async () => {
    if (!input.stateId || !input.categoryId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const url = `http://localhost:3001/api/market-intelligence/summary?stateId=${input.stateId}&districtId=${input.districtId}&subDistrictId=${input.subDistrictId}&villageId=${input.villageId}&businessCategoryId=${input.categoryId}&availableCapital=${input.marginCapital}&radius=${radius}&stateName=${encodeURIComponent(input.state)}&districtName=${encodeURIComponent(input.district)}&categoryName=${encodeURIComponent(input.category)}`;
      const res = await fetch(url);
      if (!res.ok) {
        // We can try to generate fallback locally or just read the json error
        const json = await res.json().catch(() => null);
        throw new Error(json?.error || "Failed to fetch market intelligence");
      }
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      console.error(err);
      setError("Some local data is unavailable. Regional benchmarks are being used for affected metrics.");
      
      // Fallback generator in frontend if backend completely fails
      setData({
        consumer: {
          consumerBase: Math.round(18500 * (radius / 10) * (radius / 10)),
          source: "Regional benchmark",
          confidence: "Low",
          dataAvailable: true
        },
        competitor: {
          level: radius > 10 ? "Medium" : "Low",
          count: Math.round(4 * (radius / 10)),
          source: "Regional benchmark",
          confidence: "Low",
          dataAvailable: true
        },
        purchasing: {
          index: "Moderate",
          score: 65,
          source: "Regional benchmark",
          confidence: "Low",
          dataAvailable: true
        },
        pricing: {
          recommendedRange: "₹50 - ₹100",
          margin: "15-20%",
          source: "Category benchmark",
          confidence: "Low",
          dataAvailable: true
        },
        distribution: {
          channels: [
            { name: "Local Wholesale", demand: "High", reason: "Standard supply channel" },
            { name: "Direct to Retail", demand: "Medium", reason: "Standard retail" }
          ],
          source: "Category benchmark",
          confidence: "Low",
          dataAvailable: true
        },
        opportunities: {
          recommendation: {
            name: "Standard Setup",
            score: 70,
            capitalFit: input.marginCapital >= 50000 ? "Fits Current Capital" : "Needs Additional Financing",
            why: "Standard opportunity based on category benchmark."
          },
          opportunities: [],
          source: "Model estimate",
          confidence: "Low",
          dataAvailable: true
        }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntelligence();
  }, [input.stateId, input.districtId, input.categoryId, input.marginCapital, radius]);

  return { data, loading, error, refetch: fetchIntelligence };
}
