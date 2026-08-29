import { useState, useEffect } from 'react';
import { useVyapar } from '../context/VyaparContext';

export interface MarketIntelligenceData {
  consumer: any;
  consumerError?: string;
  competitor: any;
  competitorError?: string;
  heatmapPoints?: {lat: number, lng: number, intensity: number}[];
  purchasing: any;
  pricing: any;
    growth?: any;
    centerCoords?: any;
    
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
      if (json.consumerError || json.competitorError) {
        // Just store the data, we will let frontend render the specific errors!
        setData(json);
      } else {
        setData(json);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Market data unavailable");
      
      // Fallback generator in frontend if backend completely fails
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntelligence();
  }, [input.stateId, input.districtId, input.subDistrictId, input.villageId, input.categoryId, input.category, input.marginCapital, radius]);

  return { data, loading, error, refetch: fetchIntelligence };
}
