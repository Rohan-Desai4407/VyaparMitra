import { useState } from "react";
import { Link } from "react-router";
import { Lightbulb, Bot, Zap, AlertTriangle, Check, Rocket, Star, AlertCircle, X, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { RefreshCw, Download, Edit2 } from "lucide-react";
import { useVyapar } from "../context/VyaparContext";
import PageMeta from "../components/common/PageMeta";
import ComponentCard from "../components/common/ComponentCard";
import DataSourceBadge from "../components/common/DataSourceBadge";
import { useMarketIntelligence } from "../hooks/useMarketIntelligence";
import { useSwotAnalysis } from "../hooks/useSwotAnalysis";
import MapVisualization from "../components/MapVisualization";
import PricingModal from "../components/PricingModal";
import SwotPoint from "../components/SwotPoint";

export default function MarketAnalysis() {
  const { t } = useTranslation();
  const { input } = useVyapar();
  const { data: swotData, loading: swotLoading, error: swotError, refetch: refetchSwot } = useSwotAnalysis(input.assessmentId);
  const [radius, setRadius] = useState(10);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);

  const { data, loading, error, refetch } = useMarketIntelligence(radius);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  if (!input.stateId || !input.categoryId) {
    return (
      <div className="mx-auto max-w-4xl text-center py-20">
        <h2 className="text-xl font-bold mb-4">{t("assessment.selectStateFirst")}</h2>
        <Link to="/assessment" className="text-brand-500 hover:underline">
          {t("assessment.pageTitle")} &rarr;
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
        title={`${t("market.pageTitle")} | VyaparMitra`}
        description={t("market.pageDesc")}
      />

      <div className="space-y-6 stagger-slide-up">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t("market.pageTitle")}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("market.pageDesc")}
            </p>
          </div>

          <div className="flex flex-col gap-2 items-end">
            <Link
              to="/assessment"
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-500 hover:text-brand-600"
            >
              &larr; {t("dashboard.modifyInputs")} <Edit2 className="w-3.5 h-3.5 ml-1" />
            </Link>
            <div className="flex gap-2">
               <button
                 onClick={handleRefresh}
                 className="p-2 border rounded hover:bg-gray-50 flex items-center justify-center text-gray-600 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800"
                 title={t("common.refresh")}
               >
                 <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-brand-500' : ''}`} />
               </button>
               <button
                 onClick={handleExport}
                 className="px-3 py-1.5 text-xs bg-brand-500 text-white rounded hover:bg-brand-600 flex items-center gap-1"
               >
                 <Download className="w-3 h-3" /> {t("common.print")}
               </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded border border-red-200 bg-red-50 text-red-800 flex justify-between items-center">
            <span>{error}</span>
            <button onClick={handleRefresh} className="px-4 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded font-semibold text-sm">Retry</button>
          </div>
        )}

        {/* Top KPI row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Consumer Reach */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
              {t("market.potentialConsumers")}
              {data && <DataSourceBadge {...data.consumer} />}
            </span>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
              {loading ? "..." : (data?.consumerError ? <span className="text-sm text-red-500">{data.consumerError}</span> : data?.consumer?.consumerBase?.toLocaleString("en-IN") || "N/A")}
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

          {/* Competitor Density */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
              Competitor Density
              {data && <DataSourceBadge {...data.competitor} />}
            </span>
            <div className="mt-1 flex items-center gap-2">
              {loading ? "..." : (data?.competitorError ? <span className="text-sm text-red-500 font-normal">{data.competitorError}</span> : (
                <>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {data?.competitor?.level?.toUpperCase() || "N/A"}
                  </span>
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                    {data?.competitor?.count} Nearby Units
                  </span>
                </>
              ))}
            </div>
            <p className="mt-1 text-xs text-gray-400">Within {radius} km</p>
          </div>

          {/* Purchasing Power */}
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

          {/* Suggested Market Pricing — CLICKABLE */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
              Suggested Market Pricing
              {data && <DataSourceBadge {...data.pricing} />}
            </span>
            <button
              onClick={() => setShowPricingModal(true)}
              className="mt-1 text-sm font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 hover:underline underline-offset-2 text-left cursor-pointer transition-colors"
              title="Click to see product-wise pricing breakdown"
            >
              {loading ? "..." : data?.pricing?.recommendedRange || "Varies by product"}
            </button>
            <p className="mt-1 text-xs text-gray-400">
              Est. Margin: {loading ? "..." : data?.pricing?.margin}
              {!loading && (
                <button
                  onClick={() => setShowPricingModal(true)}
                  className="ml-2 text-brand-500 hover:text-brand-600 text-[10px] underline"
                >
                  View all products →
                </button>
              )}
            </p>
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

          {/* Top Business Opportunity */}
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
                    <Lightbulb className="w-4 h-4 text-amber-500" />
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

        
          {/* Actionable Revenue Growth Tactics */}
          <div className="mt-6">
            <ComponentCard title={<div className="flex items-center gap-2"><Rocket className="w-5 h-5 text-brand-600" /> Actionable Revenue Growth Tactics</div>}>
              {data && data.growth && <div className="absolute top-4 right-4"><DataSourceBadge {...data.growth} /></div>}
              <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
                Highly recommended expansion strategies to maximize profits for your {input.category} business in {input.village}:
              </p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {loading ? <p className="text-sm">Loading...</p> :
                  data?.growth?.tactics?.map((tactic: any, idx: number) => (
                    <div key={idx} className="flex flex-col gap-2 rounded-xl border border-brand-100 bg-brand-50/30 p-4 dark:border-brand-900/30 dark:bg-brand-950/10 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-brand-900 dark:text-brand-300 text-sm">{tactic.title}</h4>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full dark:bg-emerald-900/50 dark:text-emerald-400">{tactic.impact}</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                        {tactic.description}
                      </p>
                    </div>
                  ))
                }
              </div>
            </ComponentCard>
          </div>


          {/* Interactive Map */}
        <ComponentCard title="Map-Based Visualization — Nearby Businesses & Infrastructure">
          <MapVisualization
             key={`map-${radius}-${(data?.competitor?.count ?? 0)}`}
             village={input.village}
             district={input.district}
             state={input.state}
             radius={radius}
             competitors={data?.competitor?.competitorLocations || []}
             category={input.category}
             heatmapPoints={data?.heatmapPoints || []}
             centerCoords={data?.centerCoords}
          />
        </ComponentCard>

        {/* AI SWOT & Risk Advisor */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6 text-brand-600" /> AI SWOT & Risk Advisor
            </div>
            {swotData?.overallRiskScore !== undefined && (
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">Risk Score:</span>
                <span className={`font-bold ${swotData.overallRiskScore > 40 ? 'text-red-600' : swotData.overallRiskScore > 25 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {swotData.overallRiskScore}/100
                </span>
              </div>
            )}
          </h2>

          {swotLoading && (
            <div className="w-full bg-brand-50/50 dark:bg-brand-950/20 border border-brand-100 dark:border-brand-900/50 rounded-2xl p-12 flex flex-col items-center justify-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin"></div>
                <Bot className="w-6 h-6 text-brand-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <h3 className="text-lg font-bold text-brand-900 dark:text-brand-300">Analyzing your business...</h3>
            </div>
          )}

          {swotError && !swotLoading && (
            <div className="w-full bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 text-center">
              <AlertCircle className="w-12 h-12 text-red-500" />
              <h3 className="text-lg font-bold text-red-900 dark:text-red-300">{swotError}</h3>
              <button onClick={refetchSwot} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors">
                Retry Analysis
              </button>
            </div>
          )}

          {!swotLoading && !swotError && swotData && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 flex items-start gap-4 shadow-sm">
                <div className="bg-brand-100 dark:bg-brand-900/50 p-3 rounded-lg shrink-0">
                  <Bot className="w-6 h-6 text-brand-700 dark:text-brand-300" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">Executive Summary</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{swotData.overallAssessment}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <ComponentCard title={<div className="flex items-center gap-2"><Zap className="w-4 h-4 text-emerald-600" /> Key Business Strengths</div>}>
                  <ul className="space-y-2.5">
                    {swotData.strengths?.map((item: any, idx: number) => (
                      <SwotPoint key={idx} item={item} category="strength" icon={Check} iconColorClass="text-emerald-600" bgColorClass="bg-emerald-50/60 dark:bg-emerald-950/30" textColorClass="text-emerald-900 dark:text-emerald-300" />
                    ))}
                  </ul>
                </ComponentCard>
                <ComponentCard title={<div className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-600" /> Operational Weaknesses</div>}>
                  <ul className="space-y-2.5">
                    {swotData.weaknesses?.map((item: any, idx: number) => (
                      <SwotPoint key={idx} item={item} category="weakness" icon={ChevronRight} iconColorClass="text-amber-600" bgColorClass="bg-amber-50/60 dark:bg-amber-950/30" textColorClass="text-amber-900 dark:text-amber-300" />
                    ))}
                  </ul>
                </ComponentCard>
                <ComponentCard title={<div className="flex items-center gap-2"><Rocket className="w-4 h-4 text-blue-600" /> Local Market Opportunities</div>}>
                  <ul className="space-y-2.5">
                    {swotData.opportunities?.map((item: any, idx: number) => (
                      <SwotPoint key={idx} item={item} category="opportunity" icon={Star} iconColorClass="text-blue-600" bgColorClass="bg-blue-50/60 dark:bg-blue-950/30" textColorClass="text-blue-900 dark:text-blue-300" />
                    ))}
                  </ul>
                </ComponentCard>
                <ComponentCard title={<div className="flex items-center gap-2"><AlertCircle className="w-4 h-4 text-rose-600" /> Threats & Local Bottlenecks</div>}>
                  <ul className="space-y-2.5">
                    {swotData.threats?.map((item: any, idx: number) => (
                      <SwotPoint key={idx} item={item} category="threat" icon={X} iconColorClass="text-red-500" bgColorClass="bg-red-50/60 dark:bg-red-950/30" textColorClass="text-red-900 dark:text-red-300" />
                    ))}
                  </ul>
                </ComponentCard>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pricing Modal */}
      {showPricingModal && (
        <PricingModal
          category={input.category}
          onClose={() => setShowPricingModal(false)}
        />
      )}
    </>
  );
}
