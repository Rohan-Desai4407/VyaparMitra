import { Link } from "react-router";
import { useVyapar } from "../context/VyaparContext";
import PageMeta from "../components/common/PageMeta";

export default function FinalReport() {
  const { input, financials, market, report } = useVyapar();

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <PageMeta
        title="Final Feasibility & Financial Report | VyaparMitra"
        description="Consolidated AI feasibility recommendation report with financial eligibility, scheme details, market findings, and repayment roadmap."
      />

      <div className="space-y-6 print:m-0 print:p-0">
        {/* Print & Action Bar */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between print:hidden">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Module 8 — Final Feasibility Report
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Consolidated hyper-local recommendation and financial structuring report ready for bank submission.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900"
            >
              🖨️ Print / Download PDF Report
            </button>
            <Link
              to="/assessment"
              className="rounded-xl border border-gray-300 px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
            >
              Edit Assessment
            </Link>
          </div>
        </div>

        {/* Report Card Header */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900 space-y-6">
          {/* Top Banner */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-6 dark:border-gray-800 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-brand-500 px-2.5 py-1 text-xs font-bold text-white uppercase">
                  VyaparMitra Feasibility Report
                </span>
                <span className="text-xs text-gray-400">ID: VM-2026-8492</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {input.category} Feasibility & Financial Plan
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Location: {input.village}, {input.block} Block, {input.district} District, {input.state}
              </p>
            </div>

            <div className="flex items-center gap-4 bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <div className="text-center">
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">Viability Score</span>
                <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  {report.viabilityScore}/100
                </p>
              </div>
              <div className="h-10 w-[1px] bg-emerald-200 dark:bg-emerald-800" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                  Verdict
                </span>
                <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                  {report.overallVerdict}
                </p>
              </div>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">
              1. Executive Summary & AI Recommendation
            </h3>
            <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-800 dark:bg-gray-800/40 dark:text-gray-200 leading-relaxed border border-gray-100 dark:border-gray-800">
              {report.recommendation}
            </div>
          </div>

          {/* Section 2: Financial Structuring */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">
              2. Financial Structuring & Scheme Auto-Router
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                <span className="text-xs text-gray-400">Available Margin (10%)</span>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  ₹{financials.userContribution.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                <span className="text-xs text-gray-400">Feasible Project Cost</span>
                <p className="text-lg font-bold text-brand-600 dark:text-brand-400">
                  ₹{financials.projectCost.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                <span className="text-xs text-gray-400">Auto-Selected Scheme</span>
                <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">
                  {financials.scheme.name}
                </p>
              </div>
              <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                <span className="text-xs text-gray-400">Eligible Loan (90%)</span>
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  ₹{financials.maxLoanAmount.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/40 p-3 rounded-lg">
              <span><strong>Interest:</strong> {financials.scheme.interestRate}% p.a.</span>
              <span><strong>Tenure:</strong> {financials.scheme.tenureYears} Years</span>
              <span><strong>Moratorium:</strong> {financials.scheme.moratoriumMonths} Months</span>
              <span><strong>Monthly EMI:</strong> ₹{financials.monthlyEmi.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {/* Section 3: Hyper-Local Market Findings */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">
              3. Hyper-Local Market Intelligence Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-800/20">
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Consumer Base & Pricing</span>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Immediate reach of <strong>{market.consumerBase5to10km.toLocaleString("en-IN")} consumers</strong> within 5-10 km radius. Suggested market price point: <strong>{market.suggestedPricing}</strong>.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-800/20">
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Underserved Market Gap</span>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  High potential for: {market.unservedNiches.join(", ")}.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Key Action Plan */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">
              4. Key Action Items Before Loan Disbursement
            </h3>
            <ol className="space-y-2">
              {report.keyActionItems.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-xs text-gray-800 dark:text-gray-200 font-medium">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 text-[10px] font-bold text-brand-700">
                    {idx + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Footer signature line */}
          <div className="border-t border-gray-100 pt-6 dark:border-gray-800 flex justify-between items-end text-xs text-gray-400">
            <div>
              <p>VyaparMitra AI Advisory Engine</p>
              <p>Generated for rural entrepreneur empowerment</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-700 dark:text-gray-300">Applicant Signature / Authorization</p>
              <div className="mt-4 border-b border-gray-300 dark:border-gray-700 w-48 ml-auto" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
