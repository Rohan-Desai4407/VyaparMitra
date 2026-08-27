import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { RefreshCw, Download } from "lucide-react";
import { useVyapar } from "../context/VyaparContext";
import PageMeta from "../components/common/PageMeta";
import ComponentCard from "../components/common/ComponentCard";
import DataSourceBadge from "../components/common/DataSourceBadge";
import { useMarketIntelligence } from "../hooks/useMarketIntelligence";
import MapVisualization from "../components/MapVisualization";

export default function MarketAnalysis() {
  const { input, swot } = useVyapar();
  const [radius, setRadius] = useState(10);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { data, loading, error, refetch } = useMarketIntelligence(radius);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  if (!input.stateId || !input.categoryId) {
    return (
      <div className="mx-auto max-w-4xl text-center py-20">
        <h2 className="text-xl font-bold mb-4">Complete the Business Assessment to generate Market Intelligence.</h2>
        <Link to="/assessment" className="text-brand-500 hover:underline">
          Go to Assessment &rarr;
        </Link>
      </div>
    );
  }

  const handleExport = () => {
    window.print();
  };

  return (
    <>
      <PageMeta
        title="Market Intelligence & Competitor Analysis | VyaparMitra"
        description="Local market reach, consumer density, unserved niches, competitor density, and product pricing guidance."
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Local Data & Market Intelligence
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Hyper-local consumer analysis, pricing recommendations, and distribution channel map for{" "}
              <span className="font-semibold text-brand-600 dark:text-brand-400">
                {input.village}, {input.block} ({input.district})
              </span>
            </p>
          </div>

          <div className="flex flex-col gap-2 items-end">
            <Link
              to="/assessment"
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-500 hover:text-brand-600"
            >
              &larr; Modify Location & Inputs
            </Link>
            <div className="flex gap-2">
               <button 
                 onClick={handleRefresh} 
                 className="p-2 border rounded hover:bg-gray-50 flex items-center justify-center text-gray-600 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800"
                 title="Refresh Data"
               >
                 <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-brand-500' : ''}`} />
               </button>
               <button 
                 onClick={handleExport} 
                 className="px-3 py-1.5 text-xs bg-brand-500 text-white rounded hover:bg-brand-600 flex items-center gap-1"
               >
                 <Download className="w-3 h-3" /> Export PDF
               </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded border border-red-200 bg-red-50 text-red-800">
            {error}
          </div>
        )}

        {/* Top KPI row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
              Estimated Local Consumer Base
              {data && <DataSourceBadge {...data.consumer} />}
            </span>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
              {loading ? "..." : data?.consumer?.consumerBase?.toLocaleString("en-IN") || "N/A"}
            </p>
            
            <div className="mt-2 flex gap-1">
              {[5, 10, 15, 25].map(r => (
                <button 
                  key={r}
                  onClick={() => setRadius(r)}
                  className={`text-[10px] px-1.5 py-0.5 rounded ${radius === r ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {r}km
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
              Competitor Density
              {data && <DataSourceBadge {...data.competitor} />}
            </span>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {loading ? "..." : data?.competitor?.level?.toUpperCase() || "N/A"}
              </span>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                {loading ? "..." : data?.competitor?.count} Nearby Units
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-400">Within {radius} km</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
              Purchasing Power Index
              {data && <DataSourceBadge {...data.purchasing} />}
            </span>
            <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
              {loading ? "..." : data?.purchasing?.index || "N/A"}
            </p>
            <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">Score: {loading ? "..." : data?.purchasing?.score}/100</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
              Suggested Market Pricing
              {data && <DataSourceBadge {...data.pricing} />}
            </span>
            <p className="mt-1 text-sm font-bold text-brand-600 dark:text-brand-400">
              {loading ? "..." : data?.pricing?.recommendedRange || "N/A"}
            </p>
            <p className="mt-1 text-xs text-gray-400">Est. Margin: {loading ? "..." : data?.pricing?.margin}</p>
          </div>
        </div>

        {/* Middle Section: Channels & Niches */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Distribution Channels */}
          <ComponentCard title="Primary Distribution Channels">
             {data && <div className="absolute top-4 right-4"><DataSourceBadge {...data.distribution} /></div>}
            <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
              Identified accessible sales & supply channels within {input.block} block:
            </p>

            <div className="space-y-3">
              {loading ? <p className="text-sm">Loading...</p> : 
               data?.distribution?.channels?.map((channel: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-3.5 dark:border-gray-800 dark:bg-gray-800/50"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700 dark:bg-brand-900/50 dark:text-brand-300">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {channel.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-500 ml-9">{channel.reason}</span>
                  </div>
                  <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                    {channel.demand} Demand
                  </span>
                </div>
              ))}
            </div>
          </ComponentCard>

          {/* Underserved Business Niches */}
          <ComponentCard title="Top Business Opportunity">
            {data && <div className="absolute top-4 right-4"><DataSourceBadge {...data.opportunities} /></div>}
            <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
              Based on your capital of ₹{input.marginCapital.toLocaleString()} in {input.village}:
            </p>
            
            {loading ? <p className="text-sm">Loading...</p> : (
              data?.opportunities?.recommendation && (
                <div className="p-4 rounded border border-brand-200 bg-brand-50">
                  <h3 className="font-bold text-brand-800 text-lg">{data.opportunities.recommendation.name}</h3>
                  <div className="flex gap-4 mt-2 mb-3 text-sm">
                    <div><span className="text-gray-500">Score:</span> <strong>{data.opportunities.recommendation.score}/100</strong></div>
                    <div><span className="text-gray-500">Capital Fit:</span> <strong className="text-green-600">{data.opportunities.recommendation.capitalFit}</strong></div>
                  </div>
                  <p className="text-xs text-gray-700">{data.opportunities.recommendation.why}</p>
                </div>
              )
            )}

            <div className="space-y-3 mt-4">
              <p className="text-xs font-bold text-gray-500">Other Niches:</p>
              {data?.opportunities?.opportunities?.map((niche: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-xl border border-gray-100 p-3.5"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base">💡</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {niche.name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    Score: {niche.score}
                  </span>
                </div>
              ))}
            </div>
          </ComponentCard>
        </div>

        {/* Interactive Map */}
        <ComponentCard title="Map-Based Visualization — Nearby Businesses & Infrastructure">
          <MapVisualization 
             village={input.village}
             district={input.district}
             state={input.state}
             radius={radius}
          />
        </ComponentCard>

        {/* AI SWOT & Risk Advisor */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 mt-8 flex items-center gap-2">
            🤖 AI SWOT & Risk Advisor
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Strengths */}
            <ComponentCard title="💪 Key Business Strengths">
              <ul className="space-y-2.5">
                {swot.strengths.map((item: any, idx: number) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 rounded-xl bg-emerald-50/60 p-3 text-xs text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300"
                  >
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </ComponentCard>

            {/* Weaknesses */}
            <ComponentCard title="⚠️ Operational Weaknesses">
              <ul className="space-y-2.5">
                {swot.weaknesses.map((item: any, idx: number) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 rounded-xl bg-amber-50/60 p-3 text-xs text-amber-900 dark:bg-amber-950/30 dark:text-amber-300"
                  >
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </ComponentCard>

            {/* Opportunities */}
            <ComponentCard title="🚀 Local Market Opportunities">
              <ul className="space-y-2.5">
                {swot.opportunities.map((item: any, idx: number) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 rounded-xl bg-blue-50/60 p-3 text-xs text-blue-900 dark:bg-blue-950/30 dark:text-blue-300"
                  >
                    <span className="text-blue-600 font-bold">★</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </ComponentCard>

            {/* Threats & Local Risks */}
            <ComponentCard title="🛑 Threats & Local Bottlenecks">
              <ul className="space-y-2.5">
                {swot.threats.concat(swot.localRisks).map((item: any, idx: number) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 rounded-xl bg-red-50/60 p-3 text-xs text-red-900 dark:bg-red-950/30 dark:text-red-300"
                  >
                    <span className="text-red-500 font-bold">!</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </ComponentCard>
          </div>
        </div>
      </div>
    </>
  );
}
