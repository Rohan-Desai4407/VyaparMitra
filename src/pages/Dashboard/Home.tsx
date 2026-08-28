import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { useVyapar } from "../../context/VyaparContext";
import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  const { t } = useTranslation();
  const { input, financials, report } = useVyapar();

  // Financial Snapshot Estimates
  const estMonthlyRevenue = financials.projectCost * 0.15; 
  const estMonthlyExpenses = estMonthlyRevenue * 0.6; 
  const estMonthlyProfit = estMonthlyRevenue - estMonthlyExpenses - financials.monthlyEmi;
  const profitMargin = Math.round((estMonthlyProfit / estMonthlyRevenue) * 100) || 0;
  const breakEvenMonths = 14;

  return (
    <>
      <PageMeta
        title={t("dashboard.title")}
        description="AI-driven hyper-local business advisory dashboard and smart financial calculator."
      />

      <div className="space-y-6 pb-12 max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center rounded-2xl bg-gradient-to-r from-gray-900 via-brand-900 to-gray-900 p-6 text-white shadow-md">
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold text-brand-400 tracking-wider">
              {t("dashboard.subtitle")}
            </span>
            <h1 className="text-2xl font-bold">
              {input.category} — {input.village}, {input.block}
            </h1>
            <p className="text-xs opacity-80">
              {t("dashboard.state")}: {input.state} • {t("dashboard.district")}: {input.district} • {t("dashboard.language")}: {input.language}
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex gap-3">
            <Link to="/assessment" className="rounded-xl bg-white/10 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/20 transition">
              {t("dashboard.modifyInputs")}
            </Link>
            <Link to="/final-report" className="rounded-xl bg-white text-gray-900 px-4 py-2.5 text-xs font-semibold hover:bg-gray-100 transition">
              {t("dashboard.viewFullReport")}
            </Link>
          </div>
        </div>

        {/* TOP KPI ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t("dashboard.overallViability")}</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{report.viabilityScore}</span>
              <span className="text-sm font-normal text-gray-400">/ 100</span>
            </div>
            <span className="mt-1 text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {report.overallVerdict || "Highly Viable"}
            </span>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t("dashboard.availableMargin")}</span>
            <p className="mt-2 text-3xl font-black text-gray-900 dark:text-white">₹{financials.userContribution.toLocaleString("en-IN")}</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t("dashboard.totalProjectCost")}</span>
            <p className="mt-2 text-3xl font-black text-gray-900 dark:text-white">₹{financials.projectCost.toLocaleString("en-IN")}</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t("dashboard.maxLoanEligibility")}</span>
            <p className="mt-2 text-3xl font-black text-emerald-600 dark:text-emerald-400">₹{financials.maxLoanAmount.toLocaleString("en-IN")}</p>
          </div>
        </div>

        {/* MAIN RECOMMENDATION & AI RANKING */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl border border-emerald-200 bg-emerald-50/30 p-6 dark:border-emerald-900/30 dark:bg-emerald-900/10">
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-2">AI BUSINESS RECOMMENDATION</span>
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{input.category}</h2>
              <span className="text-2xl font-black text-emerald-600">84 <span className="text-sm text-gray-400 font-normal">/ 100</span></span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Why?</h4>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> Strong local demand</li>
                  <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> Suitable capital requirement</li>
                  <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> Good resource availability</li>
                </ul>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Profile Fit:</span>
                  <span className="font-bold text-gray-900 dark:text-white">85%</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Resource Fit:</span>
                  <span className="font-bold text-gray-900 dark:text-white">89%</span>
                </div>
                <Link to="/final-report" className="text-xs font-semibold text-brand-600 inline-block pt-2">View Full Reasoning →</Link>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 flex flex-col">
            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-4">AI OPPORTUNITY RANKING</span>
            <div className="space-y-4 flex-grow">
              <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                <span className="font-bold text-gray-900 dark:text-white text-sm">#1 Dairy & Livestock</span>
                <span className="font-bold text-emerald-600">84</span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                <span className="font-bold text-gray-700 dark:text-gray-300 text-sm">#2 Food Processing</span>
                <span className="font-bold text-emerald-600">81</span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                <span className="font-bold text-gray-700 dark:text-gray-300 text-sm">#3 Poultry</span>
                <span className="font-bold text-amber-600">77</span>
              </div>
            </div>
            <Link to="/ai-advisor" className="text-xs font-semibold text-brand-600 block mt-4">View All Opportunities →</Link>
          </div>
        </div>

        {/* 2-COLUMN SECTION: MARKET & FINANCIAL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 flex flex-col">
            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-4">{t("dashboard.localMarketIntel")}</span>
            <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm mb-4">
              <div><span className="text-gray-500 block text-xs">Demand:</span><span className="font-bold text-emerald-600">HIGH</span></div>
              <div><span className="text-gray-500 block text-xs">Competition:</span><span className="font-bold text-amber-600">MEDIUM</span></div>
              <div><span className="text-gray-500 block text-xs">{t("dashboard.potentialBuyers")}:</span><span className="font-bold text-gray-900 dark:text-white">18,500</span></div>
              <div><span className="text-gray-500 block text-xs">Price Range:</span><span className="font-bold text-gray-900 dark:text-white">₹58–₹64/L</span></div>
            </div>
            <div className="bg-brand-50 dark:bg-brand-900/20 p-3 rounded-xl border border-brand-100 dark:border-brand-900/30 mb-4 flex-grow">
              <span className="block text-xs font-bold text-brand-700 dark:text-brand-300 mb-1">{t("dashboard.unservedOpportunities")}:</span>
              <span className="text-sm text-brand-900 dark:text-brand-100 font-medium">Value-added dairy products</span>
            </div>
            <Link to="/market-analysis" className="text-xs font-semibold text-brand-600">{t("dashboard.fullDetails")}</Link>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 flex flex-col">
            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-4">{t("financial.pageTitle")}</span>
            <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm mb-4 flex-grow">
              <div><span className="text-gray-500 block text-xs">{t("dashboard.estMonthlyRevenue")}:</span><span className="font-bold text-gray-900 dark:text-white">₹{estMonthlyRevenue.toLocaleString('en-IN')}/month</span></div>
              <div><span className="text-gray-500 block text-xs">{t("dashboard.estMonthlyProfit")}:</span><span className="font-bold text-emerald-600">₹{estMonthlyProfit.toLocaleString('en-IN')}/month</span></div>
              <div><span className="text-gray-500 block text-xs">Margin:</span><span className="font-bold text-gray-900 dark:text-white">{profitMargin}%</span></div>
              <div><span className="text-gray-500 block text-xs">Break-even:</span><span className="font-bold text-gray-900 dark:text-white">{breakEvenMonths} {t("common.months")}</span></div>
            </div>
            <Link to="/financial-planner" className="text-xs font-semibold text-brand-600 block mt-auto pt-4">{t("financial.simulatorTitle")} →</Link>
          </div>
        </div>

        {/* 2-COLUMN SECTION: RISK & SUPPORT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 flex flex-col">
            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-4">{t("swot.pageTitle")}</span>
            <div className="mb-4">
              <span className="text-gray-500 block text-xs mb-1">{t("swot.target")}:</span>
              <span className="text-lg font-black text-amber-600">{input.category}</span>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/10 p-3 rounded-xl border border-amber-100 dark:border-amber-900/20 mb-4 flex-grow">
              <span className="block text-xs font-bold text-amber-700 dark:text-amber-400 mb-1">{t("swot.identifiedRisk")}:</span>
              <span className="text-sm text-amber-900 dark:text-amber-100 font-medium">Raw material price fluctuations</span>
            </div>
            <Link to="/ai-advisor" className="text-xs font-semibold text-brand-600 mt-auto">{t("dashboard.launchAiAssistant")}</Link>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 flex flex-col">
            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-4">{t("scheme.pageTitle")}</span>
            <div className="mb-4">
              <span className="text-sm font-bold text-gray-900 dark:text-white block mb-1">{t("scheme.autoRecTitle")}</span>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/10 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/20 mb-4 space-y-2 flex-grow">
              <div>
                <span className="block text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">{t("scheme.optimalMatch")}:</span>
                <span className="text-sm text-emerald-900 dark:text-emerald-100 font-bold">{financials.scheme.name}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">{t("dashboard.maxLoanEligibility")}:</span>
                <span className="text-sm text-emerald-900 dark:text-emerald-100 font-bold">₹{financials.maxLoanAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <Link to="/scheme-router" className="text-xs font-semibold text-brand-600 mt-auto">{t("dashboard.exploreSchemeDetails")}</Link>
          </div>
        </div>

        {/* FINAL REPORT CTA */}
        <div className="rounded-2xl border-2 border-brand-500 bg-brand-50 dark:bg-brand-900/10 p-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6">
          <div>
            <h3 className="text-lg font-black text-brand-900 dark:text-brand-100 uppercase mb-2">{t("report.pageTitle")}</h3>
            <p className="text-sm text-brand-700 dark:text-brand-300 max-w-xl">
              {t("report.pageDesc")}
            </p>
          </div>
          <Link to="/final-report" className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-6 rounded-xl transition shadow-md whitespace-nowrap">
            {t("dashboard.viewFullReport")}
          </Link>
        </div>

      </div>
    </>
  );
}
