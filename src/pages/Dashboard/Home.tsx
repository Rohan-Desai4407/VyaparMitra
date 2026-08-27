import React from "react";
import { Link } from "react-router";
import { useVyapar } from "../../context/VyaparContext";
import PageMeta from "../../components/common/PageMeta";

export default function Home() {
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
        title="VyaparMitra — Business Feasibility & Financial Dashboard"
        description="AI-driven hyper-local business advisory dashboard and smart financial calculator."
      />

      <div className="space-y-6 pb-12 max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center rounded-2xl bg-gradient-to-r from-gray-900 via-brand-900 to-gray-900 p-6 text-white shadow-md">
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold text-brand-400 tracking-wider">
              Hyper-Local Business Feasibility Dashboard
            </span>
            <h1 className="text-2xl font-bold">
              {input.category} Venture — {input.village}, {input.block}
            </h1>
            <p className="text-xs opacity-80">
              State: {input.state} • District: {input.district} • Language: {input.language}
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex gap-3">
            <Link to="/assessment" className="rounded-xl bg-white/10 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/20 transition">
              Modify Inputs
            </Link>
            <Link to="/final-report" className="rounded-xl bg-white text-gray-900 px-4 py-2.5 text-xs font-semibold hover:bg-gray-100 transition">
              View Full Report →
            </Link>
          </div>
        </div>

        {/* TOP KPI ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Viability</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{report.viabilityScore}</span>
              <span className="text-sm font-normal text-gray-400">/ 100</span>
            </div>
            <span className="mt-1 text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {report.overallVerdict || "Highly Viable"}
            </span>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Available Capital</span>
            <p className="mt-2 text-3xl font-black text-gray-900 dark:text-white">₹{financials.userContribution.toLocaleString("en-IN")}</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Project Cost</span>
            <p className="mt-2 text-3xl font-black text-gray-900 dark:text-white">₹{financials.projectCost.toLocaleString("en-IN")}</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Loan Eligibility</span>
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
            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-4">LOCAL MARKET SNAPSHOT</span>
            <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm mb-4">
              <div><span className="text-gray-500 block text-xs">Demand:</span><span className="font-bold text-emerald-600">HIGH</span></div>
              <div><span className="text-gray-500 block text-xs">Competition:</span><span className="font-bold text-amber-600">MEDIUM</span></div>
              <div><span className="text-gray-500 block text-xs">Potential Buyers:</span><span className="font-bold text-gray-900 dark:text-white">18,500</span></div>
              <div><span className="text-gray-500 block text-xs">Price Range:</span><span className="font-bold text-gray-900 dark:text-white">₹58–₹64/L</span></div>
            </div>
            <div className="bg-brand-50 dark:bg-brand-900/20 p-3 rounded-xl border border-brand-100 dark:border-brand-900/30 mb-4 flex-grow">
              <span className="block text-xs font-bold text-brand-700 dark:text-brand-300 mb-1">Opportunity:</span>
              <span className="text-sm text-brand-900 dark:text-brand-100 font-medium">Value-added dairy products</span>
            </div>
            <Link to="/market-analysis" className="text-xs font-semibold text-brand-600">View Market Analysis →</Link>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 flex flex-col">
            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-4">FINANCIAL SNAPSHOT</span>
            <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm mb-4 flex-grow">
              <div><span className="text-gray-500 block text-xs">Revenue:</span><span className="font-bold text-gray-900 dark:text-white">₹{estMonthlyRevenue.toLocaleString('en-IN')}/month</span></div>
              <div><span className="text-gray-500 block text-xs">Profit:</span><span className="font-bold text-emerald-600">₹{estMonthlyProfit.toLocaleString('en-IN')}/month</span></div>
              <div><span className="text-gray-500 block text-xs">Margin:</span><span className="font-bold text-gray-900 dark:text-white">{profitMargin}%</span></div>
              <div><span className="text-gray-500 block text-xs">Break-even:</span><span className="font-bold text-gray-900 dark:text-white">{breakEvenMonths} months</span></div>
            </div>
            <Link to="/financial-planner" className="text-xs font-semibold text-brand-600 block mt-auto pt-4">Open Financial Planner →</Link>
          </div>
        </div>

        {/* 2-COLUMN SECTION: RISK & SUPPORT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 flex flex-col">
            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-4">RISK SUMMARY</span>
            <div className="mb-4">
              <span className="text-gray-500 block text-xs mb-1">Overall Risk:</span>
              <span className="text-lg font-black text-amber-600">MEDIUM</span>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/10 p-3 rounded-xl border border-amber-100 dark:border-amber-900/20 mb-4 flex-grow">
              <span className="block text-xs font-bold text-amber-700 dark:text-amber-400 mb-1">Main Risk:</span>
              <span className="text-sm text-amber-900 dark:text-amber-100 font-medium">Raw material price fluctuations</span>
            </div>
            <Link to="/ai-advisor" className="text-xs font-semibold text-brand-600 mt-auto">Ask AI Advisor →</Link>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 flex flex-col">
            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-4">GOVERNMENT SUPPORT</span>
            <div className="mb-4">
              <span className="text-sm font-bold text-gray-900 dark:text-white block mb-1">3 potentially relevant schemes</span>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/10 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/20 mb-4 space-y-2 flex-grow">
              <div>
                <span className="block text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">Best Match:</span>
                <span className="text-sm text-emerald-900 dark:text-emerald-100 font-bold">{financials.scheme.name}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">Potential Financing:</span>
                <span className="text-sm text-emerald-900 dark:text-emerald-100 font-bold">₹{financials.maxLoanAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <Link to="/financial-planner" className="text-xs font-semibold text-brand-600 mt-auto">View Scheme Details →</Link>
          </div>
        </div>

        {/* SMART ALERTS */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-4">SMART ALERTS</span>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <span className="text-red-500">⚠</span>
              <span className="text-gray-700 dark:text-gray-300"><strong>Capital gap:</strong> ₹{(financials.projectCost - financials.userContribution).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-brand-500">💡</span>
              <span className="text-gray-700 dark:text-gray-300"><strong>Opportunity:</strong> High local demand for value-added dairy products</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-emerald-500">🏦</span>
              <span className="text-gray-700 dark:text-gray-300"><strong>Support:</strong> 3 potentially relevant schemes identified</span>
            </div>
          </div>
        </div>

        {/* NEXT ACTIONS */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-4">NEXT ACTIONS</span>
          <div className="space-y-4 mb-5 text-gray-700 dark:text-gray-300">
            <div className="flex gap-4 items-start">
              <span className="text-lg font-black text-gray-300 dark:text-gray-600">01</span>
              <div className="mt-1"><span className="text-sm font-semibold text-gray-900 dark:text-white">Apply for suitable financing</span></div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="text-lg font-black text-gray-300 dark:text-gray-600">02</span>
              <div className="mt-1"><span className="text-sm font-semibold text-gray-900 dark:text-white">Secure local supplier agreement</span></div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="text-lg font-black text-gray-300 dark:text-gray-600">03</span>
              <div className="mt-1"><span className="text-sm font-semibold text-gray-900 dark:text-white">Validate demand with retailers</span></div>
            </div>
          </div>
          <Link to="/final-report" className="text-xs font-semibold text-brand-600">View Full Action Plan →</Link>
        </div>

        {/* FINAL REPORT CTA */}
        <div className="rounded-2xl border-2 border-brand-500 bg-brand-50 dark:bg-brand-900/10 p-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6">
          <div>
            <h3 className="text-lg font-black text-brand-900 dark:text-brand-100 uppercase mb-2">YOUR FEASIBILITY REPORT IS READY</h3>
            <p className="text-sm text-brand-700 dark:text-brand-300 max-w-xl">
              View the complete business feasibility analysis, financial details, market analysis, risk assessment, scheme matching and recommendations.
            </p>
          </div>
          <Link to="/final-report" className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-6 rounded-xl transition shadow-md whitespace-nowrap">
            View Full Report →
          </Link>
        </div>

        {/* DATA TRANSPARENCY */}
        <div className="flex justify-between items-center text-[10px] text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-wrap gap-4">
            <span>Data Sources</span>
            <span>Model Version: 1.2</span>
            <span>Last Updated: Today</span>
          </div>
          <button className="hover:text-gray-600 dark:hover:text-gray-300">View Details</button>
        </div>

      </div>
    </>
  );
}
