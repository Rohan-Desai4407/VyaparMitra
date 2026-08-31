import { useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { useVyapar } from "../context/VyaparContext";
import { useFinalFeasibilityReport } from "../hooks/useFinalFeasibilityReport";
import PageMeta from "../components/common/PageMeta";
import { RefreshCw, Download } from "lucide-react";

export default function FinalReport() {
  const { t } = useTranslation();
  const { input } = useVyapar();
  const { report, loading, refetchAll } = useFinalFeasibilityReport();
  const [showAssumptions, setShowAssumptions] = useState(false);
  const [showScoreBreakdown, setShowScoreBreakdown] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handlePrint = () => {
    setIsDownloading(true);
    setTimeout(() => setIsDownloading(false), 1000);
    window.print();
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetchAll();
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

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl text-center py-20">
        <h2 className="text-xl font-bold mb-4 text-brand-600 animate-pulse">{t("common.loading")}</h2>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="mx-auto max-w-4xl text-center py-20">
        <h2 className="text-xl font-bold mb-4 text-red-600">Failed to generate report.</h2>
        <button onClick={refetchAll} className="px-4 py-2 bg-brand-500 text-white rounded">{t("common.refresh")}</button>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title={`${t("report.pageTitle")} | VyaparMitra`}
        description={t("report.pageDesc")}
      />

      <div className="space-y-6 print:m-0 print:p-0 text-sm stagger-slide-up">
        {/* Print & Action Bar */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between print:hidden">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t("report.pageTitle")}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("report.pageDesc")}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={loading || isRefreshing}
              className="rounded-xl border border-gray-200 bg-white p-2.5 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
              title={t("report.recalculate")}
            >
              <RefreshCw className={`h-4 w-4 ${loading || isRefreshing ? 'animate-spin text-brand-500' : ''}`} />
            </button>
            <button
              onClick={handlePrint}
              disabled={isDownloading}
              className="rounded-xl border border-gray-200 bg-white p-2.5 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
              title={t("report.printReport")}
            >
              <Download className={`h-4 w-4 ${isDownloading ? 'animate-bounce text-brand-500' : ''}`} />
            </button>
          </div>
        </div>

        {report.validation.mismatches.length > 0 && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl print:hidden">
            <strong>Data Synchronization Error:</strong>
            <ul className="list-disc pl-5 mt-2 text-xs">
              {report.validation.mismatches.map((m: string, i: number) => <li key={i}>{m}</li>)}
            </ul>
          </div>
        )}

        {/* Report Card Header */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900 space-y-6 stagger-slide-up">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-6 dark:border-gray-800 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-brand-500 px-2.5 py-1 text-xs font-bold text-white uppercase">
                  VyaparMitra Feasibility Report
                </span>
                <span className="text-xs text-gray-400">ID: {report.reportId} | Version: v1.0</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {report.business.category} Feasibility & Financial Plan
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Location: {report.location.village}, {report.location.block} Block, {report.location.district} District, {report.location.state}
              </p>
              <p className="text-xs text-gray-400 mt-1">Generated: {new Date(report.generatedAt).toLocaleString()}</p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4 bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 cursor-pointer" onClick={() => setShowScoreBreakdown(!showScoreBreakdown)}>
                <div className="text-center">
                  <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">{t("report.viabilityScore")}</span>
                  <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                    {report.scoring.overall}{t("report.outOf100")}
                  </p>
                </div>
                <div className="h-10 w-[1px] bg-emerald-200 dark:bg-emerald-800" />
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                    Verdict
                  </span>
                  <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                    {report.scoring.verdict}
                  </p>
                </div>
              </div>
              {showScoreBreakdown && (
                <div className="text-xs bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700">
                  <p className="font-bold mb-2">Score Methodology</p>
                  <div className="flex justify-between"><span>Market Potential:</span> <span>{report.scoring.breakdown.market}/100</span></div>
                  <div className="flex justify-between"><span>Financial Feasibility:</span> <span>{report.scoring.breakdown.financial}/100</span></div>
                  <div className="flex justify-between"><span>Funding Capacity:</span> <span>{report.scoring.breakdown.funding}/100</span></div>
                  <div className="flex justify-between"><span>Risk Profile:</span> <span>{report.scoring.breakdown.risk}/100</span></div>
                </div>
              )}
            </div>
          </div>

          {/* Section 1 */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">1. {t("report.executiveSummary")}</h3>
            <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-800 dark:bg-gray-800/40 dark:text-gray-200 leading-relaxed border border-gray-100 dark:border-gray-800">
              {report.executiveSummary}
            </div>
          </div>

          {/* Section 2 */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">2. {t("report.projectCostBreakdown")}</h3>
            {!report.financial ? (
               <div className="text-red-500 text-xs font-bold">Financial calculation unavailable.</div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                    <span className="text-xs text-gray-400">{t("financial.userMargin")} ({Math.round(report.financial.financing?.marginCapital / report.financial.financing?.projectCost * 100)}%)</span>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">₹{report.financial.financing?.marginCapital?.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                    <span className="text-xs text-gray-400">{t("financial.totalFeasibleCost")}</span>
                    <p className="text-lg font-bold text-brand-600 dark:text-brand-400">₹{report.financial.financing?.projectCost?.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                    <span className="text-xs text-gray-400">{t("scheme.autoRecTitle")}</span>
                    <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">{report.financial.name}</p>
                  </div>
                  <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                    <span className="text-xs text-gray-400">{t("financial.eligibleLoan")} ({Math.round(report.financial.financing?.requestedLoan / report.financial.financing?.projectCost * 100)}%)</span>
                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">₹{report.financial.financing?.requestedLoan?.toLocaleString('en-IN')}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/40 p-3 rounded-lg">
                  <span><strong>{t("scheme.interestRate")}:</strong> {report.financial.financials?.interestRate}% {t("common.perAnnum")}</span>
                  <span><strong>{t("scheme.repaymentTenure")}:</strong> {report.financial.financials?.tenureMonths / 12} {t("common.years")}</span>
                  <span><strong>{t("scheme.moratoriumPeriod")}:</strong> {report.financial.financials?.moratoriumMonths} {t("common.months")}</span>
                  <span><strong>{t("dashboard.estMonthlyEmi")}:</strong> ₹{report.repayment?.loanCalculation?.emi?.toLocaleString('en-IN') || 'N/A'}</span>
                </div>
              </>
            )}
          </div>

          {/* Section 3: Market */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">3. {t("report.marketInsights")}</h3>
            {!report.market ? (
               <div className="text-red-500 text-xs font-bold">Live market intelligence is currently unavailable.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-800/20">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{t("market.potentialConsumers")}</span>
                    <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{report.dataQuality.market}</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    Estimated reach of <strong>{report.market.consumer?.consumerBase?.toLocaleString('en-IN') || 'N/A'} consumers</strong> within 10 km radius. Suggested market price point: <strong>{report.market.pricing?.suggestedPricing || 'N/A'}</strong>.
                  </p>
                  <p className="text-[10px] text-gray-400 mt-2">Source: {report.market.consumer?.source || 'Model estimate'}</p>
                </div>
                <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-800/20">
                  <div className="flex justify-between items-center">
                     <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{t("market.unservedNiches")}</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    High potential for: {report.market.opportunities?.opportunities?.map((o:any)=>o.name).join(", ") || 'N/A'}.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section 4 & 5: Actions and Checklists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">4. {t("report.actionItems")}</h3>
              <ol className="space-y-2">
                {report.actionItems.map((item: any, idx: number) => (
                  <li key={idx} className="flex items-center gap-3 text-xs text-gray-800 dark:text-gray-200 font-medium">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/40 text-[10px] font-bold text-brand-700 dark:text-brand-400">
                      {idx + 1}
                    </span>
                    <span>{item.task}</span>
                    <span className="ml-auto text-[10px] text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700 px-2 py-0.5 rounded">{item.status}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">5. {t("report.bankChecklist")}</h3>
              <ul className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
                 <li className="flex gap-2"><span>[✓]</span> {t("report.checklist1")}</li>
                 <li className="flex gap-2"><span>[✓]</span> {t("report.checklist2")}</li>
                 <li className="flex gap-2"><span>[✓]</span> {t("report.checklist3")}</li>
                 <li className="flex gap-2"><span>[✓]</span> {t("report.checklist4")}</li>
                 <li className="flex gap-2"><span>[!]</span> {t("report.checklist5")}</li>
              </ul>
            </div>
          </div>

          {/* Data Quality & Assumptions */}
          <div className="border-t border-gray-100 dark:border-gray-800 pt-6 mt-6">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">Data Quality & Assumptions</h3>
                <button onClick={() => setShowAssumptions(!showAssumptions)} className="text-xs text-brand-500 dark:text-brand-400 underline print:hidden">
                  {showAssumptions ? "Hide Details" : "Show Details"}
                </button>
             </div>
             
             {showAssumptions && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs bg-gray-50 dark:bg-gray-800/20 p-4 rounded-xl border border-gray-200 dark:border-gray-700/50">
                  <div>
                    <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-2">Data Quality Confidence</h4>
                    <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                       <li><strong>Overall Confidence:</strong> {report.dataQuality.overall}</li>
                       <li><strong>Financial Data:</strong> {report.dataQuality.financial}</li>
                       <li><strong>Market Data:</strong> {report.dataQuality.market}</li>
                       <li><strong>Repayment Data:</strong> {report.dataQuality.repayment}</li>
                       <li><strong>Risk Analysis:</strong> Model-generated</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-2">Calculation Assumptions</h4>
                    <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                       <li><strong>Project Cost:</strong> ₹{report.financial?.financials?.projectCost?.toLocaleString('en-IN') || 'N/A'}</li>
                       <li><strong>Loan / EMI:</strong> ₹{report.financial?.financials?.loanAmount?.toLocaleString('en-IN') || 'N/A'} / ₹{report.financial?.financials?.emi?.toLocaleString('en-IN') || 'N/A'}</li>
                       <li><strong>Interest Rate:</strong> {report.financial?.financials?.interestRate || 'N/A'}% p.a.</li>
                       <li><strong>Tenure:</strong> {report.financial?.financials?.tenureMonths ? report.financial.financials.tenureMonths / 12 : 'N/A'} Years</li>
                       <li><strong>Moratorium:</strong> {report.financial?.financials?.moratoriumMonths || 'N/A'} Months</li>
                       <li><strong>Working Capital Reserve:</strong> 15%</li>
                    </ul>
                  </div>
               </div>
             )}
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


