import { Link } from "react-router";
import { useVyapar } from "../context/VyaparContext";
import PageMeta from "../components/common/PageMeta";
import ComponentCard from "../components/common/ComponentCard";

export default function MarketAnalysis() {
  const { input, market } = useVyapar();

  return (
    <>
      <PageMeta
        title="Market Intelligence & Competitor Analysis | VyaparMitra"
        description="Local market reach, consumer density, unserved niches, competitor density, and product pricing guidance."
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
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

          <Link
            to="/assessment"
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-500 hover:text-brand-600"
          >
            ← Modify Location & Inputs
          </Link>
        </div>

        {/* Top KPI row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <span className="text-xs text-gray-500 dark:text-gray-400">Estimated Local Consumer Base</span>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
              {market.consumerBase5to10km.toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              Within 5–10 km radius
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <span className="text-xs text-gray-500 dark:text-gray-400">Competitor Density</span>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {market.competitorDensity}
              </span>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                {market.competitorCount} Nearby Units
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-400">Moderate market saturation</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <span className="text-xs text-gray-500 dark:text-gray-400">Purchasing Power Index</span>
            <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
              {market.purchasingPowerIdx}
            </p>
            <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">Regional mandi price benchmark</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <span className="text-xs text-gray-500 dark:text-gray-400">Suggested Market Pricing</span>
            <p className="mt-1 text-sm font-bold text-brand-600 dark:text-brand-400">
              {market.suggestedPricing}
            </p>
            <p className="mt-1 text-xs text-gray-400">Provides +15% margin headroom</p>
          </div>
        </div>

        {/* Middle Section: Channels & Niches */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Distribution Channels */}
          <ComponentCard title="Primary Distribution Channels">
            <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
              Identified accessible sales & supply channels within {input.block} block:
            </p>

            <div className="space-y-3">
              {market.distributionChannels.map((channel, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-3.5 dark:border-gray-800 dark:bg-gray-800/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700 dark:bg-brand-900/50 dark:text-brand-300">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {channel}
                    </span>
                  </div>
                  <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                    High Demand
                  </span>
                </div>
              ))}
            </div>
          </ComponentCard>

          {/* Underserved Business Niches */}
          <ComponentCard title="Unserved & Underserved Business Niches">
            <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
              High-value market gaps identified in {input.village} and surrounding villages:
            </p>

            <div className="space-y-3">
              {market.unservedNiches.map((niche, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-xl border border-brand-100 bg-brand-50/40 p-3.5 dark:border-brand-900/30 dark:bg-brand-950/20"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base">💡</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {niche}
                    </span>
                  </div>
                  <span className="rounded-full bg-brand-500 px-2.5 py-0.5 text-xs font-medium text-white">
                    Opportunity Gap
                  </span>
                </div>
              ))}
            </div>
          </ComponentCard>
        </div>

        {/* Interactive Map & Nearby Facilities Mock Representation */}
        <ComponentCard title="Map-Based Visualization — Nearby Businesses & Infrastructure Facilities">
          <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-800/80 p-6 min-h-[280px] flex flex-col justify-between">
            <div className="flex flex-wrap gap-2 justify-between items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  📍 {input.village}, {input.block} Block Map Overlay
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Coordinates: Lat 18.3241° N, Long 73.8472° E
                </p>
              </div>
              <div className="flex gap-2">
                <span className="rounded-md bg-white dark:bg-gray-900 px-2.5 py-1 text-xs font-medium border border-gray-200 dark:border-gray-700">
                  🔵 Milk Cooperatives (2)
                </span>
                <span className="rounded-md bg-white dark:bg-gray-900 px-2.5 py-1 text-xs font-medium border border-gray-200 dark:border-gray-700">
                  🔴 Direct Competitors (4)
                </span>
                <span className="rounded-md bg-white dark:bg-gray-900 px-2.5 py-1 text-xs font-medium border border-gray-200 dark:border-gray-700">
                  🟢 APMC Mandi Hub (1)
                </span>
              </div>
            </div>

            {/* Visual simulation of map pins */}
            <div className="my-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl bg-white dark:bg-gray-900 p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Haveli Dairy Farmers Union</span>
                <p className="text-xs text-gray-500 mt-1">2.4 km away • Daily collection capacity 5,000L</p>
              </div>
              <div className="rounded-xl bg-white dark:bg-gray-900 p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Khed Regional APMC Sub-Market</span>
                <p className="text-xs text-gray-500 mt-1">4.8 km away • Direct wholesale pricing access</p>
              </div>
              <div className="rounded-xl bg-white dark:bg-gray-900 p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">Highway Commercial Food Hub</span>
                <p className="text-xs text-gray-500 mt-1">6.1 km away • Target B2B bulk buyers</p>
              </div>
            </div>

            <p className="text-center text-xs text-gray-500 dark:text-gray-400">
              * Map data aggregated from OpenStreetMap & State Agricultural Department Database
            </p>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
