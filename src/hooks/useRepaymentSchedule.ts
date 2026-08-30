import { useState, useEffect } from 'react';
import { useVyapar } from '../context/VyaparContext';

export function useRepaymentSchedule() {
  const { input, financials } = useVyapar();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedule = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:3001/api/financial/calculate-schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          capital: input.marginCapital,
          projectCost: financials.projectCost,
          categoryId: input.categoryId,
          stateId: input.stateId
        }),
      });

      if (!res.ok) throw new Error("Failed to generate schedule");
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      console.error(err);
      setError("Unable to generate repayment schedule.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, [input.marginCapital, financials.projectCost, input.stateId, input.categoryId]);

  return { data, loading, error, refetch: fetchSchedule };
}

