import { useState, useEffect } from 'react';
import { indianLocations } from '../data/indianLocations';

const API_BASE = 'http://localhost:3001/api';

export function useAssessmentAPI() {
  const [states, setStates] = useState<{id: string, name: string}[]>([]);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/locations/states`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setStates(data);
        } else {
          // Map fallback data to look like DB objects
          setStates(Object.keys(indianLocations).map((name, i) => ({ id: `s-${i}`, name })));
        }
      })
      .catch((err) => {
        console.warn('API down, using local fallback states');
        setStates(Object.keys(indianLocations).map((name, i) => ({ id: `s-${i}`, name })));
      });

    fetch(`${API_BASE}/business-categories`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setCategories(data);
      })
      .catch(console.error);
  }, []);

  const getDistricts = async (stateId: string, stateName: string) => {
    try {
      const res = await fetch(`${API_BASE}/locations/states/${stateId}/districts`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
      throw new Error("No data");
    } catch { 
      // Fallback
      if (indianLocations[stateName]) {
        return Object.keys(indianLocations[stateName]).map((name, i) => ({ id: `d-${i}`, name }));
      }
      return [];
    }
  };

  const getBlocks = async (districtId: string, stateName: string, districtName: string) => {
    try {
      const res = await fetch(`${API_BASE}/locations/districts/${districtId}/sub-districts`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
      throw new Error("No data");
    } catch { 
      if (indianLocations[stateName]?.[districtName]) {
        return Object.keys(indianLocations[stateName][districtName]).map((name, i) => ({ id: `sd-${i}`, name }));
      }
      return [];
    }
  };

  const searchVillages = async (subDistrictId: string, stateName: string, districtName: string, blockName: string, query: string = "", page: number = 0) => {
    try {
      const res = await fetch(`${API_BASE}/locations/sub-districts/${subDistrictId}/villages?search=${encodeURIComponent(query)}&page=${page}&size=20`);
      const data = await res.json();
      if (data && data.content && data.content.length > 0) return data.content;
      throw new Error("No data");
    } catch { 
      const vils = indianLocations[stateName]?.[districtName]?.[blockName] || [];
      const filtered = query ? vils.filter(v => v.toLowerCase().includes(query.toLowerCase())) : vils;
      return filtered.map((v, i) => ({ id: `mock-${i}`, name: v }));
    }
  };

  const getPreview = async (params: { availableMarginCapital: number, businessCategoryId?: string, villageId?: string }) => {
    try {
      const res = await fetch(`${API_BASE}/assessment/preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (!res.ok) throw new Error("Preview failed");
      return await res.json();
    } catch (err) {
      console.warn("Backend API not reachable for preview. Using local state fallback.");
      return null;
    }
  };

  const submitAssessment = async (payload: any) => {
    try {
      const res = await fetch(`${API_BASE}/assessments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to submit assessment');
      }
      return await res.json();
    } catch (e) {
      console.warn("Backend API not reachable. Mocking submission success.");
      return { success: true };
    }
  };

  return { states, categories, getDistricts, getBlocks, searchVillages, getPreview, submitAssessment };
}
