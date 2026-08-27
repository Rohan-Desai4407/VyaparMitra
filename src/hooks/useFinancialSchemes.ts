import { useState, useEffect } from 'react';
import { useVyapar } from '../context/VyaparContext';

export function useFinancialSchemes() {
  const { input } = useVyapar();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchemes = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `http://localhost:3001/api/financial/schemes?availableCapital=${input.marginCapital}&stateId=${input.stateId}&businessCategoryId=${input.categoryId}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch schemes");
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      console.error(err);
      setError("Unable to verify government schemes at this moment.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, [input.marginCapital, input.stateId, input.categoryId]);

  return { data, loading, error, refetch: fetchSchemes };
}
