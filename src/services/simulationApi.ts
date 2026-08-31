const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const calculateSimulation = async (payload: any) => {
  const res = await fetch(`${API_URL}/api/simulation/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Calculation failed');
  return (await res.json()).data;
};

export const fetchAiAnalysis = async (calcResult: any, businessCategory: string) => {
  const res = await fetch(`${API_URL}/api/simulation/ai-analysis`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ calcResult, businessCategory })
  });
  if (!res.ok) throw new Error('AI analysis failed');
  return (await res.json()).data;
};
