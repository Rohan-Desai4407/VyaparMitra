import { useVyapar } from "../context/VyaparContext";
import { useTranslation } from "react-i18next";
import PageMeta from "../components/common/PageMeta";
import ComponentCard from "../components/common/ComponentCard";
import { Link } from "react-router";
import { useFinancialSchemes } from "../hooks/useFinancialSchemes";
import { RefreshCw } from "lucide-react";
import { useState } from "react";

export default function FinancialPlanner() {
  const { t } = useTranslation();
  const { updateInput, input } = useVyapar();
  const { data, loading, error, refetch } = useFinancialSchemes();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const activeScheme = data?.recommendedScheme;
  const fData = activeScheme?.financials;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <>
      <PageMeta
        title={`${t("financial.pageTitle")} | VyaparMitra`}
        description={t("financial.pageDesc")}
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t("financial.pageTitle")}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("financial.pageDesc")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/what-if-simulator"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2 text-xs font-bold text-white hover:bg-brand-600 transition shadow-sm"
            >
              Launch What-if Simulator 🎛️
            </Link>
            <button 
               onClick={handleRefresh} 
               disabled={loading || isRefreshing}
               className="rounded-full bg-white p-2 text-gray-500 shadow-sm hover:bg-gray-50 hover:text-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-brand-400 transition-all duration-200"
               title={t("common.refresh")}
            >
               <RefreshCw className={`h-5 w-5 ${(loading || isRefreshing) ? "animate-spin text-brand-500" : ""}`} />
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Interactive Margin Capital Slider */}
        <ComponentCard title={t("financial.simulatorTitle")}>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {t("financial.selfContribution")}
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">₹</span>
                  <input
                    type="number"
                    min="5000"
                    max="5000000"
                    step="1000"
                    value={input.marginCapital}
                    onChange={(e) => updateInput({ marginCapital: Number(e.target.value) })}
                    className="w-28 text-right bg-transparent text-xl font-bold text-brand-600 focus:outline-none dark:text-brand-400 border-b border-brand-200 dark:border-brand-900"
                  />
                </div>
              </div>

              <input
                type="range"
                min="5000"
                max="1000000"
                step="5000"
                value={input.marginCapital}
                onChange={(e) => updateInput({ marginCapital: Number(e.target.value) })}
                className="h-3 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-brand-500 dark:bg-gray-700"
              />
            </div>

            {/* Main Financial Result Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/40">
                <span className="text-xs text-gray-500 dark:text-gray-400">{t("financial.userMargin")} ({fData?.marginPercentage || '10%'})</span>
                <p className="mt-1 text-2xl font-extrabold text-gray-900 dark:text-white">
                  {loading ? '...' : (fData?.userContribution ? `₹${fData.userContribution.toLocaleString("en-IN")}` : `₹${input.marginCapital.toLocaleString("en-IN")}`)}
                </p>
                <p className="mt-1 text-xs text-gray-400">{t("financial.outOfPocket")}</p>
              </div>

              <div className="rounded-xl border border-brand-200 bg-brand-50/40 p-4 dark:border-brand-900/50 dark:bg-brand-950/20">
                <span className="text-xs font-semibold text-brand-700 dark:text-brand-300">
                  {t("financial.totalFeasibleCost")}
                </span>
                <p className="mt-1 text-3xl font-black text-brand-600 dark:text-brand-400">
                  {loading ? '...' : (fData?.projectCost ? `₹${fData.projectCost.toLocaleString("en-IN")}` : `₹${(input.marginCapital * 10).toLocaleString("en-IN")}`)}
                </p>
                <p className="mt-1 text-xs text-brand-600 dark:text-brand-400">
                  {t("financial.formulaCost")}
                </p>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                  {t("financial.eligibleLoan")}
                </span>
                <p className="mt-1 text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  {loading ? '...' : (fData?.loanAmount ? `₹${fData.loanAmount.toLocaleString("en-IN")}` : `₹${(input.marginCapital * 9).toLocaleString("en-IN")}`)}
                </p>
                <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-300">
                  {t("financial.govFinancingShare")}
                </p>
              </div>
            </div>
          </div>
        </ComponentCard>

        {/* Auto Selected Scheme Details */}
        <ComponentCard title={t("scheme.autoRecTitle")}>
          {loading ? (
             <div className="py-10 text-center text-gray-500">{t("common.loading")}</div>
          ) : !activeScheme ? (
             <div className="py-10 text-center text-red-500">No verified matching government scheme found.</div>
          ) : (
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3 lg:w-1/2">
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                  activeScheme.status === 'ELIGIBLE' ? 'bg-emerald-500 text-white' : 
                  activeScheme.status === 'POTENTIALLY_ELIGIBLE' ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'
                }`}>
                  {activeScheme.status.replace('_', ' ')}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Score: {activeScheme.score}/100
                </span>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {activeScheme.name}
              </h2>

              <p className="text-sm text-gray-600 dark:text-gray-300">
                {activeScheme.reason}
              </p>
              
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/60 rounded text-xs text-gray-600 dark:text-gray-400">
                <p><strong>{t("scheme.officialMinistry")}</strong> {activeScheme.ministry}</p>
                <p><strong>{t("scheme.source")}</strong> <a href={activeScheme.sourceUrl} target="_blank" className="text-brand-500 hover:underline">{activeScheme.sourceUrl}</a></p>
                <p><strong>{t("scheme.lastVerified")}</strong> {new Date(activeScheme.lastVerified).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/60 lg:w-96">
              <div>
                <span className="text-xs text-gray-400">{t("scheme.interestRate")}</span>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {fData?.interestRate ? `${fData.interestRate}% ${t("common.perAnnum")}` : 'Lender Dependent'}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-400">{t("scheme.repaymentTenure")}</span>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {fData?.tenureMonths} {t("common.months")}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-400">{t("scheme.moratoriumPeriod")}</span>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {fData?.moratoriumMonths} {t("common.months")}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-400">{t("dashboard.estMonthlyEmi")}</span>
                <p className="text-lg font-bold text-brand-600 dark:text-brand-400">
                  ₹{fData?.emi?.toLocaleString("en-IN")}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-400">{t("dashboard.subsidyAmount")}</span>
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  ₹{fData?.subsidy?.toLocaleString("en-IN")}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-400">{t("repayment.totalRepayment")}</span>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  ₹{fData?.totalRepayment?.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>
          )}
        </ComponentCard>

        {/* Real Dynamic Scheme Comparison Table */}
        <ComponentCard title="Government Scheme Comparison Matrix">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-10 text-center text-gray-500">Loading scheme comparison...</div>
            ) : (!data?.schemes || data.schemes.length === 0) ? (
              <div className="py-10 text-center text-gray-500">No schemes to compare.</div>
            ) : (
            <table className="min-w-full text-left text-sm text-gray-800 dark:text-gray-200">
              <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50 text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-4 py-3">Feature</th>
                  {data.schemes.slice(0, 3).map((s: any) => (
                    <th key={s.schemeId} className="px-4 py-3">{s.officialName || s.schemeCode}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                <tr>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Eligibility</td>
                  {data.schemes.slice(0, 3).map((s: any) => (
                    <td key={s.schemeId} className={`px-4 py-3 font-bold ${s.status === 'ELIGIBLE' ? 'text-emerald-500' : s.status === 'POTENTIALLY_ELIGIBLE' ? 'text-amber-500' : 'text-red-500'}`}>
                      {s.status.replace('_', ' ')}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Max Project Cost</td>
                  {data.schemes.slice(0, 3).map((s: any) => (
                    <td key={s.schemeId} className="px-4 py-3">₹{s.financials.projectCost.toLocaleString("en-IN")}</td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Eligible Loan</td>
                  {data.schemes.slice(0, 3).map((s: any) => (
                    <td key={s.schemeId} className="px-4 py-3">₹{s.financials.loanAmount.toLocaleString("en-IN")}</td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Gov Subsidy</td>
                  {data.schemes.slice(0, 3).map((s: any) => (
                    <td key={s.schemeId} className="px-4 py-3">{s.financials.subsidy > 0 ? `₹${s.financials.subsidy.toLocaleString("en-IN")}` : 'None'}</td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Interest Rate</td>
                  {data.schemes.slice(0, 3).map((s: any) => (
                    <td key={s.schemeId} className="px-4 py-3">{s.financials.interestRate ? `${s.financials.interestRate}%` : 'Variable'}</td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Repayment Tenure</td>
                  {data.schemes.slice(0, 3).map((s: any) => (
                    <td key={s.schemeId} className="px-4 py-3">{s.financials.tenureMonths} Months</td>
                  ))}
                </tr>
              </tbody>
            </table>
            )}
          </div>
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            * Scheme eligibility, loan approval, interest rate and financing terms are subject to the latest official guidelines and lender approval. VyaparMitra provides decision support and does not guarantee loan approval.
          </p>
        </ComponentCard>
      </div>
    </>
  );
}
