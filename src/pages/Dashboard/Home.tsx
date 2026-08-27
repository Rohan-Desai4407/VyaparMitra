import { Link } from "react-router";
import { useVyapar } from "../../context/VyaparContext";
import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  const { input, financials, market, report } = useVyapar();

  return (
    <>
      <PageMeta
        title="VyaparMitra — Business Feasibility & Financial Dashboard"
        description="AI-driven hyper-local business advisory dashboard and smart financial calculator."
      />

      <div className="space-y-6">
        {/* Banner Card */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center rounded-2xl bg-gradient-to-r from-gray-900 via-brand-900 to-gray-900 p-6 text-white shadow-md">
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold text-brand-400 tracking-wider">
              Hyper-Local Business Feasibility Dashboard
            </span>
            <h1 className="text-2xl font-bold">
              {input.category} Venture — {input.village}, {input.block}
            </h1>
            <p className="text-xs opacity-80">
              State: {input.state} • District: {input.district} • Preferred Language: {input.language}
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex gap-3">
            <Link
              to="/assessment"
              className="rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-gray-900 hover:bg-gray-100 transition"
            >
              Modify Inputs ✏️
            </Link>
            <Link
              to="/final-report"
              className="rounded-xl bg-brand-500 px-4 py-2.5 text-xs font-semibold text-white hover:bg-brand-600 transition"
            >
              View Full Report →
            </Link>
          </div>
        </div>

        {/* Top 4 KPI Metrics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Viability Score */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Overall Business Viability
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {report.viabilityScore}
              </span>
              <span className="text-xs text-gray-400">/ 100</span>
              <span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                {report.overallVerdict}
              </span>
            </div>
            <p className="mt-2 text-[11px] text-gray-400">High local demand & low margin barriers</p>
          </div>

          {/* User Margin Contribution */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Available Margin Capital
            </span>
            <p className="mt-2 text-3xl font-black text-gray-900 dark:text-white">
              ₹{financials.userContribution.toLocaleString("en-IN")}
            </p>
            <p className="mt-2 text-[11px] text-brand-600 dark:text-brand-400">
              Represents 10% self-contribution
            </p>
          </div>

          {/* Feasible Project Cost */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Total Feasible Project Cost
            </span>
            <p className="mt-2 text-3xl font-black text-brand-600 dark:text-brand-400">
              ₹{financials.projectCost.toLocaleString("en-IN")}
            </p>
            <p className="mt-2 text-[11px] text-gray-400">Margin Capital ÷ 10%</p>
          </div>

          {/* Maximum Eligible Loan Amount */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Max Loan Eligibility (90%)
            </span>
            <p className="mt-2 text-3xl font-black text-emerald-600 dark:text-emerald-400">
              ₹{financials.maxLoanAmount.toLocaleString("en-IN")}
            </p>
            <p className="mt-2 text-[11px] text-emerald-600 dark:text-emerald-400">
              Via {financials.scheme.name}
            </p>
          </div>
        </div>

        {/* Main Grid: Auto Scheme Router + Local Market Intelligence */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column: Scheme Details */}
          <div className="lg:col-span-7 space-y-6">
            {/* Auto Selected Scheme Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-bold text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                    SCHEME AUTO-ROUTER
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-2">
                    {financials.scheme.name}
                  </h3>
                </div>

                <span className="rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-300">
                  {financials.scheme.interestRate}% Interest
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50 mb-4">
                <div>
                  <span className="text-[11px] text-gray-400">Tenure</span>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {financials.scheme.tenureYears} Years
                  </p>
                </div>
                <div>
                  <span className="text-[11px] text-gray-400">Moratorium</span>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {financials.scheme.moratoriumMonths} Months
                  </p>
                </div>
                <div>
                  <span className="text-[11px] text-gray-400">Est. Monthly EMI</span>
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    ₹{financials.monthlyEmi.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Rule applied: Project cost ₹{financials.projectCost.toLocaleString("en-IN")}</span>
                <Link to="/scheme-router" className="font-semibold text-brand-500 hover:text-brand-600">
                  Explore Scheme Details →
                </Link>
              </div>
            </div>

            {/* Quick Action & Next Steps */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3">
                Key Action Recommendations
              </h3>
              <div className="space-y-2.5">
                {report.keyActionItems.map((action, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3 text-xs text-gray-800 dark:border-gray-800 dark:bg-gray-800/40 dark:text-gray-200"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white">
                      {idx + 1}
                    </span>
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Local Data Summary */}
          <div className="lg:col-span-5 space-y-6">
            {/* Market Intelligence Summary */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3 dark:border-gray-800">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Local Market Intelligence
                </h3>
                <Link to="/market-analysis" className="text-xs font-medium text-brand-500 hover:text-brand-600">
                  Full Details →
                </Link>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-xs text-gray-400">Consumer Density (5-10km)</span>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {market.consumerBase5to10km.toLocaleString("en-IN")} Potential Buyers
                  </p>
                </div>

                <div>
                  <span className="text-xs text-gray-400">Competitor Density</span>
                  <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                    {market.competitorDensity} ({market.competitorCount} active units)
                  </p>
                </div>

                <div>
                  <span className="text-xs text-gray-400">Suggested Pricing Benchmark</span>
                  <p className="text-sm font-bold text-brand-600 dark:text-brand-400">
                    {market.suggestedPricing}
                  </p>
                </div>

                <div>
                  <span className="text-xs text-gray-400">Unserved Opportunities</span>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {market.unservedNiches.map((niche, i) => (
                      <span
                        key={i}
                        className="rounded-md bg-brand-50 px-2 py-1 text-[11px] font-semibold text-brand-700 dark:bg-brand-950/40 dark:text-brand-300"
                      >
                        {niche}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Advisor Banner */}
            <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-6 dark:border-purple-900/40 dark:bg-purple-950/20">
              <span className="text-xs uppercase font-bold text-purple-700 dark:text-purple-300 tracking-wider">
                AI Business Advisor
              </span>
              <h4 className="text-base font-bold text-gray-900 dark:text-white mt-1">
                Have questions about local risks or loans?
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 mb-4">
                Talk with our NLP-powered multilingual AI assistant trained on rural business feasibility.
              </p>
              <Link
                to="/ai-advisor"
                className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-700 transition"
              >
                Launch AI Assistant Chat 💬
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
