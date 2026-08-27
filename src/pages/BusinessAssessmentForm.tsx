import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useVyapar } from "../context/VyaparContext";
import PageMeta from "../components/common/PageMeta";
import { useAssessmentAPI } from "../hooks/useAssessmentAPI";
import CustomSelect from "../components/common/CustomSelect";

export default function BusinessAssessmentForm() {
  const navigate = useNavigate();
  const { updateInput } = useVyapar(); // Still useful to sync local context quickly
  const api = useAssessmentAPI();

  const [formData, setFormData] = useState({
    stateId: "", state: "",
    districtId: "", district: "",
    subDistrictId: "", block: "",
    villageId: "", village: "",
    categoryId: "", category: "",
    marginCapital: 0,
    language: "English",
  });

  const [districts, setDistricts] = useState<{id: string, name: string}[]>([]);
  const [blocks, setBlocks] = useState<{id: string, name: string}[]>([]);
  
  // Searchable village states
  const [villages, setVillages] = useState<{id: string, name: string}[]>([]);
  const [villageSearch, setVillageSearch] = useState("");
  const [showVillageDropdown, setShowVillageDropdown] = useState(false);
  const searchTimeout = useRef<any>(null);

  const [preview, setPreview] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const debounceTimer = useRef<any>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const languages = ["English", "Hindi (हिंदी)", "Marathi (मराठी)", "Gujarati (ગુજરાતી)"];

  const defaultCategories = [
    { id: 'mock-1', name: 'Dairy & Livestock' },
    { id: 'mock-2', name: 'Retail & Kirana Store' },
    { id: 'mock-3', name: 'Textiles & Garment Manufacturing' },
    { id: 'mock-4', name: 'Agro-Processing & Food Products' },
    { id: 'mock-5', name: 'Handicrafts & Artisanal Goods' },
    { id: 'mock-6', name: 'Vehicle Repair & Auto Services' },
    { id: 'mock-7', name: 'Poultry & Fisheries' },
    { id: 'mock-8', name: 'Construction Materials & Hardware' },
    { id: 'mock-9', name: 'Beauty Parlor & Personal Care' },
  ];

  const displayCategories = api.categories.length > 0 ? api.categories : defaultCategories;

  // Handle location cascading
  useEffect(() => {
    if (formData.stateId) {
      api.getDistricts(formData.stateId, formData.state).then(setDistricts);
      setFormData(prev => ({ ...prev, districtId: "", district: "", subDistrictId: "", block: "", villageId: "", village: "" }));
      setVillages([]);
      setVillageSearch("");
    }
  }, [formData.stateId]);

  useEffect(() => {
    if (formData.districtId) {
      api.getBlocks(formData.districtId, formData.state, formData.district).then(setBlocks);
      setFormData(prev => ({ ...prev, subDistrictId: "", block: "", villageId: "", village: "" }));
      setVillages([]);
      setVillageSearch("");
    }
  }, [formData.districtId]);

  useEffect(() => {
    if (formData.subDistrictId) {
      // Initial fetch of top 20 villages
      api.searchVillages(formData.subDistrictId, formData.state, formData.district, formData.block, "").then(setVillages);
      setFormData(prev => ({ ...prev, villageId: "", village: "" }));
      setVillageSearch("");
    }
  }, [formData.subDistrictId]);

  // Handle clicking outside village dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowVillageDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search Debounce for Villages
  useEffect(() => {
    if (formData.subDistrictId && showVillageDropdown) {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
      searchTimeout.current = setTimeout(() => {
        api.searchVillages(formData.subDistrictId, formData.state, formData.district, formData.block, villageSearch)
           .then(setVillages);
      }, 300);
    }
  }, [villageSearch, formData.subDistrictId]);

  // Live Preview Debounce
  useEffect(() => {
    if (formData.marginCapital > 0) {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(async () => {
        const data = await api.getPreview({
          availableMarginCapital: formData.marginCapital,
          businessCategoryId: formData.categoryId || undefined,
          villageId: formData.villageId || undefined
        });
        
        if (data && !data.error) {
          setPreview(data);
        } else {
          setPreview({
            marginPercentage: 10,
            feasibleProjectCost: formData.marginCapital / 0.1,
            financingPercentage: 90,
            potentialFinancing: (formData.marginCapital / 0.1) * 0.9,
            bestScheme: {
              name: "Term Loan Scheme (Estimated)",
              matchScore: 80,
              interestRate: 8
            }
          });
        }
      }, 500);
    } else {
      setPreview(null);
    }
  }, [formData.marginCapital, formData.categoryId, formData.villageId]);

  const [fetchingLocation, setFetchingLocation] = useState(false);

  const handleLiveLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
          const data = await res.json();
          const state = data.address.state || "Maharashtra";
          const rawDistrict = data.address.state_district || data.address.county || "Pune";
          const district = rawDistrict.replace(" District", "");
          const block = data.address.suburb || data.address.town || data.address.city || "Haveli";
          const village = data.address.village || data.address.neighbourhood || "Wagholi";

          // Find state match
          const st = api.states.find(s => s.name === state) || api.states[0];
          if (st) {
            setFormData(p => ({ ...p, stateId: st.id, state: st.name, districtId: "", subDistrictId: "", villageId: "" }));
            
            setTimeout(async () => {
               const dists = await api.getDistricts(st.id, st.name);
               setDistricts(dists);
               const dt = dists.find((d: any) => d.name === district) || dists[0];
               if (dt) {
                 setFormData(p => ({ ...p, districtId: dt.id, district: dt.name }));
                 
                 setTimeout(async () => {
                    const blks = await api.getBlocks(dt.id, st.name, dt.name);
                    setBlocks(blks);
                    const bk = blks.find((b: any) => b.name === block) || blks[0];
                    if (bk) {
                      setFormData(p => ({ ...p, subDistrictId: bk.id, block: bk.name }));
                      
                      setTimeout(async () => {
                         const vils = await api.searchVillages(bk.id, st.name, dt.name, bk.name, village);
                         setVillages(vils);
                         const vl = vils.find((v: any) => v.name === village) || vils[0];
                         if (vl) {
                           setFormData(p => ({ ...p, villageId: vl.id, village: vl.name }));
                           setVillageSearch(vl.name);
                         }
                      }, 500);
                    }
                 }, 500);
               }
            }, 500);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setTimeout(() => setFetchingLocation(false), 2000);
        }
      },
      () => {
        alert("Unable to retrieve your location");
        setFetchingLocation(false);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.categoryId && displayCategories.length > 0) {
      setFormData(p => ({ ...p, categoryId: displayCategories[0].id, category: displayCategories[0].name }));
    }
    if (!formData.villageId) {
      setError("Please select a valid village/town from the dropdown.");
      return;
    }
    
    setLoading(true);

    try {
      await api.submitAssessment({
        stateId: formData.stateId || 'mock',
        districtId: formData.districtId || 'mock',
        subDistrictId: formData.subDistrictId || 'mock',
        villageId: formData.villageId || 'mock',
        businessCategoryId: formData.categoryId || 'mock-category-id',
        availableMarginCapital: formData.marginCapital,
        preferredLanguage: formData.language
      });
      setSubmitted(true);
    } catch (err: any) {
      console.warn("Backend API not reachable. Using local fallback.", err);
      setSubmitted(true); 
    }

    updateInput({
      stateId: formData.stateId,
      state: formData.state,
      districtId: formData.districtId,
      district: formData.district,
      subDistrictId: formData.subDistrictId,
      block: formData.block,
      villageId: formData.villageId,
      village: formData.village,
      categoryId: formData.categoryId,
      category: formData.category || displayCategories[0].name,
      marginCapital: formData.marginCapital,
      language: formData.language
    });

    setLoading(false);
    setTimeout(() => navigate("/"), 1500);
  };

  return (
    <>
      <PageMeta
        title="Business Assessment Form | VyaparMitra"
        description="Enter location, available margin capital, and business category for hyper-local feasibility analysis."
      />

      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              User & Business Assessment
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Provide your location and available margin capital to compute scheme eligibility and hyper-local market feasibility.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Language:</span>
            <div className="w-44">
              <CustomSelect
                value={formData.language}
                onChange={(v) => setFormData({ ...formData, language: v })}
                options={languages.map((l) => ({ value: l, label: l }))}
                placeholder="Select Language"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300">
            {error}
          </div>
        )}

        {submitted && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-800 dark:border-green-900/50 dark:bg-green-900/20 dark:text-green-300">
            ✓ Assessment generated successfully! Redirecting to Dashboard...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Location Section */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-3 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">1</span>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                  Location Details (Rural / Semi-Urban)
                </h2>
              </div>
              <button
                type="button"
                onClick={handleLiveLocation}
                disabled={fetchingLocation}
                className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 transition disabled:opacity-50"
              >
                {fetchingLocation ? 'Detecting...' : 'Use Live Location'}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">
                  State <span className="text-red-500">*</span>
                </label>
                <CustomSelect
                  required
                  value={formData.stateId}
                  onChange={(v) => {
                    const st = api.states.find(s => s.id === v);
                    setFormData({ ...formData, stateId: st?.id || "", state: st?.name || "" });
                  }}
                  options={api.states.map(s => ({ value: s.id, label: s.name }))}
                  placeholder="Select State"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">
                  District <span className="text-red-500">*</span>
                </label>
                <CustomSelect
                  required
                  value={formData.districtId}
                  disabled={!formData.stateId}
                  onChange={(v) => {
                    const dt = districts.find(d => d.id === v);
                    setFormData({ ...formData, districtId: dt?.id || "", district: dt?.name || "" });
                  }}
                  options={districts.map(d => ({ value: d.id, label: d.name }))}
                  placeholder={formData.stateId ? "Select District" : "Select a State first"}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">
                  Block / Taluka <span className="text-red-500">*</span>
                </label>
                <CustomSelect
                  required
                  value={formData.subDistrictId}
                  disabled={!formData.districtId}
                  onChange={(v) => {
                    const bk = blocks.find(b => b.id === v);
                    setFormData({ ...formData, subDistrictId: bk?.id || "", block: bk?.name || "" });
                  }}
                  options={blocks.map(b => ({ value: b.id, label: b.name }))}
                  placeholder={formData.districtId ? "Select Taluka / Sub-District" : "Select a District first"}
                />
              </div>

              <div ref={wrapperRef} className="relative">
                <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">
                  Village / Town Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Search village / town..."
                  value={villageSearch}
                  disabled={!formData.subDistrictId}
                  onChange={(e) => {
                    setVillageSearch(e.target.value);
                    setShowVillageDropdown(true);
                    setFormData({ ...formData, villageId: "", village: "" });
                  }}
                  onFocus={() => {
                    if (formData.subDistrictId) setShowVillageDropdown(true);
                  }}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white disabled:opacity-50 disabled:bg-gray-50"
                />
                
                {showVillageDropdown && (
                  <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                    {villages.length > 0 ? (
                      villages.map((v) => (
                        <li
                          key={v.id}
                          className="cursor-pointer px-4 py-2 text-sm text-gray-900 hover:bg-brand-50 dark:text-white dark:hover:bg-brand-900/30"
                          onClick={() => {
                            setFormData({ ...formData, villageId: v.id, village: v.name });
                            setVillageSearch(v.name);
                            setShowVillageDropdown(false);
                          }}
                        >
                          {v.name}
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-3 text-sm text-gray-500">No villages found.</li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Business & Capital Section */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-3 dark:border-gray-800">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">2</span>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                Proposed Business & Margin Capital
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">
                  Proposed Business Category <span className="text-red-500">*</span>
                </label>
                <CustomSelect
                  required
                  value={formData.categoryId}
                  onChange={(v) => {
                    const cat = displayCategories.find(c => c.id === v);
                    setFormData({ ...formData, categoryId: v, category: cat?.name || "" });
                  }}
                  options={displayCategories.map(cat => ({ value: cat.id, label: cat.name }))}
                  placeholder="Select a Category"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">
                  Available Margin Capital (₹ INR) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-2.5 text-sm font-semibold text-gray-500">₹</span>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    required
                    value={formData.marginCapital || ''}
                    onChange={(e) => setFormData({ ...formData, marginCapital: Number(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-gray-300 bg-white pl-8 pr-4 py-2.5 text-sm font-medium text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                {preview && (
                  <p className="mt-2 text-[11px] text-gray-500 dark:text-gray-400">
                    At a <strong className="text-gray-700 dark:text-gray-300">{preview.marginPercentage}%</strong> margin contribution, this supports an estimated project size of <strong className="text-brand-600 dark:text-brand-400">₹{preview.feasibleProjectCost?.toLocaleString("en-IN")}</strong>.
                  </p>
                )}
              </div>
            </div>

            {/* Quick Financial Scheme Router Preview Card */}
            {preview && preview.bestScheme && (
              <div className="mt-6 rounded-xl border border-brand-100 bg-brand-50/50 p-4 dark:border-brand-900/40 dark:bg-brand-950/20 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-brand-700 dark:text-brand-400 font-semibold">
                      Auto-Routed Loan Scheme Preview
                    </span>
                    <p className="text-base font-bold text-gray-900 dark:text-white mt-0.5">
                      {preview.bestScheme.name}
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                      Final eligibility is subject to scheme/lender verification.
                    </p>
                  </div>
                  <div className="sm:text-right bg-white dark:bg-gray-900 p-3 rounded-lg shadow-sm border border-brand-100 dark:border-brand-900/30">
                    <span className="inline-flex items-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300 px-3 py-1 text-xs font-bold mb-1">
                      {preview.bestScheme.interestRate ? `${preview.bestScheme.interestRate}% Interest` : 'Varies'} • Match: {preview.bestScheme.matchScore}%
                    </span>
                    <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                      Potential Financing: <strong className="text-gray-900 dark:text-white">₹{preview.potentialFinancing?.toLocaleString("en-IN")}</strong> ({preview.financingPercentage}%)
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              disabled={loading}
              className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.marginCapital || formData.marginCapital <= 0}
              className="rounded-xl bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 transition disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Generating Feasibility Report...
                </>
              ) : (
                'Generate Feasibility Report & Financial Roadmap →'
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
