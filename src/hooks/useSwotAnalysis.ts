import { useState, useEffect } from 'react';

import { useVyapar } from '../context/VyaparContext';

export interface SwotItem {
  title: string;
  description: string;
  evidence: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
}

export interface RecommendationItem {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export interface SwotData {
  strengths: SwotItem[];
  weaknesses: SwotItem[];
  opportunities: SwotItem[];
  threats: SwotItem[];
  recommendations: RecommendationItem[];
  riskFactors: { name: string; riskLevel: string; score: number; max: number }[];
  overallRiskScore: number;
  overallAssessment: string;
  generatedAt?: string;
}

export function useSwotAnalysis(assessmentId?: string) {
  const [data, setData] = useState<SwotData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchSwot = async () => {
    
    setLoading(true);
    setError(null);
    try {
      
      const res = await fetch('http://localhost:3001/api/swot/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentId: assessmentId || "mock-id" })
      });
      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "AI SWOT analysis is temporarily unavailable.");
      }
      setData(resData);

    } catch (err: any) {
      console.error("SWOT error:", err);
      setError(err.message || "AI SWOT analysis is temporarily unavailable.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSwot();
  }, [assessmentId]);

  return { data, loading, error, refetch: fetchSwot };
}
