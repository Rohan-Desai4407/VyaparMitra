import { useNavigate } from "react-router";
import PageMeta from "../components/common/PageMeta";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <>
      <PageMeta
        title="VyaparMitra — Hyper-Local AI Advisory & Smart Financial Structuring"
        description="AI-driven Hyper-Local Business Advisory & Scheme Calculator for rural and semi-urban entrepreneurs."
      />

      <div className="space-y-12 py-4">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 p-8 md:p-12 text-white shadow-xl">
          <div className="max-w-2xl space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              ⚡ AI-Powered Micro-Entrepreneurship
            </span>

            <h1 className="text-3xl font-black leading-tight sm:text-5xl">
              Turn Local Business Ideas into Bankable Ventures.
            </h1>

            <p className="text-sm font-medium opacity-90 sm:text-base leading-relaxed">
              VyaparMitra evaluates hyper-local market feasibility and calculates your eligible government financing scheme from your available margin capital in seconds.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => navigate("/assessment")}
                className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-brand-600 shadow-lg hover:bg-gray-100 transition transform hover:-translate-y-0.5"
              >
                Start Business Assessment →
              </button>
              <button
                onClick={() => navigate("/financial-planner")}
                className="rounded-xl bg-white/10 px-6 py-3 text-sm font-bold text-white border border-white/20 backdrop-blur-md hover:bg-white/20 transition"
              >
                Explore Scheme Calculator
              </button>
            </div>
          </div>
        </div>

        {/* Core Modules Grid */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              PRD Functional Modules
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Complete end-to-end framework built for rural & semi-urban micro-entrepreneurs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <div className="h-10 w-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-lg dark:bg-brand-900/30 dark:text-brand-400 mb-4">
                01
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                Hyper-Local Feasibility Report
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Estimates immediate consumer base within 5–10 km, identifies unserved niches, competitor density, and pricing power.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg dark:bg-emerald-900/30 dark:text-emerald-400 mb-4">
                02
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                Smart Financial & Scheme Router
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Calculates total project cost (Margin ÷ 10%) & 90% loan eligibility. Automatically routes to Micro Finance or Term Loan schemes.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-lg dark:bg-purple-900/30 dark:text-purple-400 mb-4">
                03
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                Multilingual AI Advisor & SWOT
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Generates location & budget-specific SWOT analysis, local risks (supply-chain, seasonal demand), and natural-language guidance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
