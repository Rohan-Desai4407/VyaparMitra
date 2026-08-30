import { useVyapar } from "../context/VyaparContext";
import { useTranslation } from "react-i18next";
import PageMeta from "../components/common/PageMeta";
import ComponentCard from "../components/common/ComponentCard";
import { Link } from "react-router";
import { useFinancialSchemes } from "../hooks/useFinancialSchemes";
import { RefreshCw, CheckCircle, XCircle, AlertCircle, ExternalLink } from "lucide-react";
import React, { useState } from "react";

export default function SchemeRouter() {
  const { t } = useTranslation();
  const { financials } = useVyapar();
  const { data, loading, error, refetch } = useFinancialSchemes();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const activeScheme = data?.recommendedScheme;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <>
      <PageMeta
        title={`Government Scheme Analysis | VyaparMitra`}
        description={"Data-driven scheme comparison and eligibility engine"}
      />

      <div className="space-y-6 stagger-slide-up pb-24">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Government Scheme Analysis
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Fully deterministic, data-driven eligibility verification based on official guidelines.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleRefresh} 
              disabled={loading || isRefreshing}
              className="rounded-full bg-white p-2 text-gray-500 shadow-sm hover:bg-gray-50 hover:text-brand-600 focus:outline-none disabled:opacity-50 dark:bg-gray-800 transition"
              title={t("common.refresh")}
            >
              <RefreshCw className={`h-5 w-5 ${(loading || isRefreshing) ? "animate-spin text-brand-500" : ""}`} />
            </button>
            <Link
              to="/financial-planner"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-semibold text-gray-800 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 transition shadow-sm"
            >
              Adjust Financials
            </Link>
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300 flex gap-3">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {loading && !data && (
           <div className="flex justify-center py-20">
              <RefreshCw className="h-8 w-8 animate-spin text-brand-500" />
           </div>
        )}

        {/* Primary Auto-Selected Scheme Banner Card */}
        {activeScheme && (
          <ComponentCard title="Recommended Scheme">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-brand-500 px-3 py-1 text-xs font-bold text-white uppercase tracking-wider">
                    {activeScheme.schemeCode}
                  </span>
                  <span className={`rounded-md px-2.5 py-0.5 text-xs font-bold ${activeScheme.eligible ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-amber-100 text-amber-800'}`}>
                    {activeScheme.eligibilityStatus}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Match Score: <strong>{activeScheme.score}/100</strong>
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {activeScheme.name}
                </h2>

                <div className="text-sm text-gray-600 dark:text-gray-300 max-w-2xl">
                  <p className="mb-2">{activeScheme.description}</p>
                  <p className="font-semibold text-gray-900 dark:text-white">Why this recommendation?</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-xs text-gray-600 dark:text-gray-400">
                     {activeScheme.reasons.map((r: string, i: number) => (
                        <li key={i}>{r}</li>
                     ))}
                  </ul>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <Link
                    to="/repayment-schedule"
                    className="rounded-xl bg-brand-500 px-4 py-2 text-xs font-bold text-white hover:bg-brand-600 transition"
                  >
                    View Repayment & EMI Schedule &rarr;
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/60 lg:w-96 shrink-0">
                <div className="rounded-lg bg-white p-3 shadow-xs dark:bg-gray-900">
                  <span className="text-xs text-gray-400">Interest Rate</span>
                  <p className="text-lg font-black text-brand-600 dark:text-brand-400">
                    {activeScheme.financials.interestRate}% p.a.
                  </p>
                </div>
                <div className="rounded-lg bg-white p-3 shadow-xs dark:bg-gray-900">
                  <span className="text-xs text-gray-400">Repayment Tenure</span>
                  <p className="text-lg font-black text-gray-900 dark:text-white">
                    {activeScheme.financials.tenureMonths} Months
                  </p>
                </div>
                <div className="rounded-lg bg-white p-3 shadow-xs dark:bg-gray-900">
                  <span className="text-xs text-gray-400">Moratorium</span>
                  <p className="text-lg font-black text-gray-900 dark:text-white">
                    {activeScheme.financials.moratoriumMonths} Months
                  </p>
                </div>
                <div className="rounded-lg bg-white p-3 shadow-xs dark:bg-gray-900">
                  <span className="text-xs text-gray-400">Max Loan</span>
                  <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                    &#8377;{(activeScheme.financials.maxLoan / 100000).toFixed(2)}L
                  </p>
                </div>
              </div>
            </div>
          </ComponentCard>
        )}

        {/* Dynamic Government Scheme Comparison Matrix */}
        {data?.schemes && data.schemes.length > 0 && (
          <ComponentCard title="Government Scheme Comparison Matrix">
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
              <table className="min-w-full text-left text-sm text-gray-800 dark:text-gray-200">
                <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/60 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-3.5">Scheme</th>
                    <th className="px-4 py-3.5 text-right">Max Project Cost</th>
                    <th className="px-4 py-3.5 text-right">Interest</th>
                    <th className="px-4 py-3.5 text-right">Tenure</th>
                    <th className="px-4 py-3.5 text-center">Eligibility Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {data.schemes.map((scheme: any) => {
                    const isSelected = activeScheme?.schemeId === scheme.schemeId;
                    const isExpanded = expandedRow === scheme.schemeId;
                    
                    return (
                      <React.Fragment key={scheme.schemeId}>
                        <tr 
                          onClick={() => setExpandedRow(isExpanded ? null : scheme.schemeId)} 
                          className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${isSelected ? "bg-brand-50/30 dark:bg-brand-900/10" : ""}`}
                        >
                          <td className="px-4 py-3.5 font-bold text-gray-900 dark:text-white">
                            <div className="flex items-center gap-2">
                              {scheme.name}
                              {isSelected && (
                                <span className="rounded-full bg-brand-500 text-white text-[10px] font-extrabold px-2 py-0.5 uppercase tracking-wide">Recommended</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-right font-medium">
                            Up to &#8377;{(scheme.financials.maxProjectCost / 100000).toFixed(2)}L
                          </td>
                          <td className="px-4 py-3.5 text-right font-bold text-brand-600 dark:text-brand-400">
                            {scheme.financials.interestRate}%
                          </td>
                          <td className="px-4 py-3.5 text-right font-medium">
                            {scheme.financials.tenureMonths} mo
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              scheme.eligibilityStatus === 'ELIGIBLE' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' :
                              scheme.eligibilityStatus === 'PARTIALLY ELIGIBLE' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' :
                              'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                            }`}>
                              {scheme.eligibilityStatus}
                            </span>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr>
                            <td colSpan={5} className="p-0 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30">
                              <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                                
                                {/* Status & Finance Panel */}
                                <div className="space-y-4">
                                  <div>
                                     <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Eligibility Evaluation</h4>
                                     <ul className="space-y-1.5">
                                        {scheme.matchedCriteria.map((c: string, idx: number) => (
                                          <li key={idx} className="flex gap-2 text-xs text-gray-700 dark:text-gray-300">
                                            <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" /> {c}
                                          </li>
                                        ))}
                                        {scheme.failedCriteria.map((c: string, idx: number) => (
                                          <li key={idx} className="flex gap-2 text-xs text-gray-700 dark:text-gray-300">
                                            <XCircle className="h-4 w-4 text-red-500 shrink-0" /> {c}
                                          </li>
                                        ))}
                                        {scheme.warnings.map((c: string, idx: number) => (
                                          <li key={idx} className="flex gap-2 text-xs text-gray-700 dark:text-gray-300">
                                            <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" /> {c}
                                          </li>
                                        ))}
                                     </ul>
                                  </div>
                                  <div>
                                     <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Financial Fit</h4>
                                     <div className="rounded border border-gray-200 dark:border-gray-700 overflow-hidden">
                                        <div className="flex justify-between p-2 text-xs border-b border-gray-100 dark:border-gray-800">
                                          <span>Project Cost:</span>
                                          <strong className="text-gray-900 dark:text-white">&#8377;{scheme.financing.projectCost.toLocaleString('en-IN')}</strong>
                                        </div>
                                        <div className="flex justify-between p-2 text-xs border-b border-gray-100 dark:border-gray-800">
                                          <span>Your Contribution:</span>
                                          <strong className="text-gray-900 dark:text-white">&#8377;{scheme.financing.marginCapital.toLocaleString('en-IN')}</strong>
                                        </div>
                                        <div className="flex justify-between p-2 text-xs border-b border-gray-100 dark:border-gray-800 bg-brand-50 dark:bg-brand-900/10">
                                          <span>Max Eligible Loan:</span>
                                          <strong className="text-brand-700 dark:text-brand-400">&#8377;{scheme.financing.maxEligibleLoan.toLocaleString('en-IN')}</strong>
                                        </div>
                                        {scheme.financing.requiredAdditionalFunding > 0 && (
                                          <div className="flex justify-between p-2 text-xs bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 font-semibold">
                                            <span>Funding Gap:</span>
                                            <span>&#8377;{scheme.financing.requiredAdditionalFunding.toLocaleString('en-IN')}</span>
                                          </div>
                                        )}
                                     </div>
                                  </div>
                                </div>

                                {/* Benefits & Documents Panel */}
                                <div className="space-y-4">
                                  <div>
                                     <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Verified Benefits</h4>
                                     {scheme.benefits.length > 0 ? (
                                       <ul className="space-y-2">
                                          {scheme.benefits.map((b: any, idx: number) => (
                                            <li key={idx} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-2 rounded">
                                               <p className="font-semibold text-xs text-brand-600 dark:text-brand-400">{b.name}</p>
                                               <p className="text-[10px] text-gray-600 dark:text-gray-300 mt-0.5">{b.description}</p>
                                            </li>
                                          ))}
                                       </ul>
                                     ) : (
                                       <p className="text-xs text-gray-400 italic">No special subsidies identified based on your profile.</p>
                                     )}
                                  </div>
                                  <div>
                                     <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Document Checklist</h4>
                                     <ul className="grid grid-cols-2 gap-x-2 gap-y-1">
                                        {scheme.documents.map((doc: any, idx: number) => (
                                          <li key={idx} className="flex items-center gap-1 text-[10px] text-gray-600 dark:text-gray-400">
                                            <div className="h-1 w-1 bg-gray-400 rounded-full" /> {doc.name} {doc.required && '*'}
                                          </li>
                                        ))}
                                     </ul>
                                  </div>
                                </div>
                                
                                {/* Action & Source Panel */}
                                <div className="space-y-4 flex flex-col justify-between">
                                  <div>
                                     <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Official Source Data</h4>
                                     <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg space-y-2 text-[10px]">
                                        <p><span className="text-gray-500">Ministry:</span> <strong className="text-gray-700 dark:text-gray-300">{scheme.source.ministry}</strong></p>
                                        <p><span className="text-gray-500">Verified:</span> <strong className="text-gray-700 dark:text-gray-300">{new Date(scheme.source.lastVerified).toLocaleDateString()}</strong></p>
                                        <p><span className="text-gray-500">Source:</span> <a href={scheme.source.url} target="_blank" rel="noreferrer" className="text-brand-500 hover:underline inline-flex items-center gap-0.5">View Policy <ExternalLink className="h-2 w-2"/></a></p>
                                     </div>
                                  </div>
                                  <div className="pt-4 mt-auto">
                                    <a 
                                      href={scheme.source.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="block w-full text-center rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-3 text-sm font-bold shadow hover:bg-gray-800 dark:hover:bg-gray-100 transition-all"
                                    >
                                      Start Official Application
                                    </a>
                                  </div>
                                </div>

                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </ComponentCard>
        )}
      </div>
    </>
  );
}


