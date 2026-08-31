import { useState, useEffect } from 'react';
import { useVyapar } from '../context/VyaparContext';

export function useFinancialSchemes() {
  const { input, financials } = useVyapar();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchemes = async () => {
    setLoading(true);
    setError(null);
    try {
      // Create comprehensive payload based on current global state
      const payload = {
        projectCost: financials.projectCost || Math.round(input.marginCapital / 0.10) || 100000,
        marginCapital: input.marginCapital || 10000,
        business: {
          categoryId: input.categoryId,
          isNewBusiness: true, // Assuming true for now as per current Vyapar context
        },
        applicant: {
          age: 25, // Mock value, in a real app this would come from user profile
          locationType: 'RURAL'
        }
      };

      const res = await fetch("http://localhost:3001/api/schemes/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error("Failed to fetch schemes");
      
      const json = await res.json();
      
      // Our API returns { status, data: { schemes, recommendedScheme } }
      console.log("Scheme API Response:", json);
      if (json && json.data && json.data.schemes) {
        setData(json.data);
      } else {
         throw new Error("Invalid backend response format");
      }
    } catch (err: any) {
      console.error("Scheme engine error:", err?.message);
      setError("Official scheme information could not be verified at this time.");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, [input.marginCapital, input.stateId, input.categoryId, financials.projectCost]);

  return { data, loading, error, refetch: fetchSchemes };
}
