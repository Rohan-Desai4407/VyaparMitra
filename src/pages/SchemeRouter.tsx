import { useVyapar } from "../context/VyaparContext";
import { useTranslation } from "react-i18next";
import PageMeta from "../components/common/PageMeta";
import ComponentCard from "../components/common/ComponentCard";
import { Link } from "react-router";
import { useFinancialSchemes } from "../hooks/useFinancialSchemes";
import { RefreshCw } from "lucide-react";
import { useState } from "react";

export default function SchemeRouter() {
  const { t } = useTranslation();
  const { financials } = useVyapar();
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
        title={`${t("scheme.pageTitle")} | VyaparMitra`}
        description={t("scheme.pageDesc")}
      />

      <div className="space-y-6 stagger-slide-up">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t("scheme.pageTitle")}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("scheme.pageDesc")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleRefresh} 
              disabled={loading || isRefreshing}
              className="rounded-full bg-white p-2 text-gray-500 shadow-sm hover:bg-gray-50 hover:text-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-brand-400 transition-all duration-200"
              title={t("common.refresh")}
            >
              <RefreshCw className={`h-5 w-5 ${(loading || isRefreshing) ? "animate-spin text-brand-500" : ""}`} />
            </button>
            <Link
              to="/financial-planner"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-semibold text-gray-800 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 transition shadow-sm"
            >
              {t("scheme.adjustFinancials")}
            </Link>
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-amber-50 p-4 text-xs text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
            {t("scheme.offlineNotice")}
          </div>
        )}

        {/* Primary Auto-Selected Scheme Banner Card */}
        <ComponentCard title={t("scheme.autoRecTitle")}>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-brand-500 px-3 py-1 text-xs font-bold text-white uppercase tracking-wider">
                  {financials.scheme.code === "MICRO" ? t("scheme.microHeader") : t("scheme.termHeader")}
                </span>
                <span className="rounded-md bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  {t("scheme.optimalMatch")}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {t("scheme.projectCostLabel")} <strong>₹{financials.projectCost.toLocaleString("en-IN")}</strong>
                </span>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {activeScheme?.name || financials.scheme.name}
              </h2>

              <p className="text-sm text-gray-600 dark:text-gray-300 max-w-2xl">
                {activeScheme?.reason || (financials.scheme.code === "MICRO"
                  ? t("scheme.microDesc")
                  : t("scheme.termDesc"))}
              </p>

              <div className="flex items-center gap-4 pt-2">
                <Link
                  to="/repayment-schedule"
                  className="rounded-xl bg-brand-500 px-4 py-2 text-xs font-bold text-white hover:bg-brand-600 transition"
                >
                  {t("scheme.viewRepaymentBtn")}
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/60 lg:w-96 shrink-0">
              <div className="rounded-lg bg-white p-3 shadow-xs dark:bg-gray-900">
                <span className="text-xs text-gray-400">{t("scheme.interestRate")}</span>
                <p className="text-lg font-black text-brand-600 dark:text-brand-400">
                  {fData?.interestRate ? `${fData.interestRate}% ${t("common.perAnnum")}` : `${financials.scheme.interestRate}% ${t("common.perAnnum")}`}
                </p>
              </div>
              <div className="rounded-lg bg-white p-3 shadow-xs dark:bg-gray-900">
                <span className="text-xs text-gray-400">{t("scheme.repaymentTenure")}</span>
                <p className="text-lg font-black text-gray-900 dark:text-white">
                  {fData?.tenureMonths ? `${fData.tenureMonths} ${t("common.months")}` : `${financials.scheme.tenureYears} ${t("common.years")}`}
                </p>
              </div>
              <div className="rounded-lg bg-white p-3 shadow-xs dark:bg-gray-900">
                <span className="text-xs text-gray-400">{t("scheme.moratoriumPeriod")}</span>
                <p className="text-lg font-black text-gray-900 dark:text-white">
                  {fData?.moratoriumMonths ? `${fData.moratoriumMonths} ${t("common.months")}` : `${financials.scheme.moratoriumMonths} ${t("common.months")}`}
                </p>
              </div>
              <div className="rounded-lg bg-white p-3 shadow-xs dark:bg-gray-900">
                <span className="text-xs text-gray-400">{t("scheme.agencyFinancing")}</span>
                <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                  {fData?.financingPercentage ? `${fData.financingPercentage}` : financials.scheme.agencyFinancing}
                </p>
              </div>
            </div>
          </div>
        </ComponentCard>

        {/* PRD Loan & Financial Rules Comparison Table */}
        <ComponentCard title={t("scheme.comparisonMatrix")}>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-gray-800 dark:text-gray-200">
              <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50 text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-4 py-3.5 font-semibold">{t("scheme.criteriaHeader")}</th>
                  <th className={`px-4 py-3.5 font-semibold ${financials.scheme.code === "MICRO" ? "text-brand-600 dark:text-brand-400" : ""}`}>
                    {t("scheme.microHeader")} {financials.scheme.code === "MICRO" && t("scheme.activeStar")}
                  </th>
                  <th className={`px-4 py-3.5 font-semibold ${financials.scheme.code === "TERM" ? "text-brand-600 dark:text-brand-400" : ""}`}>
                    {t("scheme.termHeader")} {financials.scheme.code === "TERM" && t("scheme.activeStar")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                <tr className={financials.scheme.code === "MICRO" ? "bg-brand-50/40 dark:bg-brand-950/20" : ""}>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{t("scheme.rowProjectCost")}</td>
                  <td className="px-4 py-3 font-medium">{t("scheme.upTo140")}</td>
                  <td className="px-4 py-3 font-medium">{t("scheme.range140to50")}</td>
                </tr>
                <tr className={financials.scheme.code === "MICRO" ? "bg-brand-50/40 dark:bg-brand-950/20" : ""}>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{t("scheme.rowAgencyFinancing")}</td>
                  <td className="px-4 py-3">{t("scheme.upTo90")}</td>
                  <td className="px-4 py-3">{t("scheme.upTo90")}</td>
                </tr>
                <tr className={financials.scheme.code === "MICRO" ? "bg-brand-50/40 dark:bg-brand-950/20" : ""}>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{t("scheme.rowMaxLoan")}</td>
                  <td className="px-4 py-3">{t("scheme.capMicro")}</td>
                  <td className="px-4 py-3">{t("scheme.capTerm")}</td>
                </tr>
                <tr className={financials.scheme.code === "MICRO" ? "bg-brand-50/40 dark:bg-brand-950/20" : ""}>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{t("scheme.rowInterestRate")}</td>
                  <td className="px-4 py-3 text-emerald-600 font-bold dark:text-emerald-400">{t("scheme.rateMicro")}</td>
                  <td className="px-4 py-3 text-brand-600 font-bold dark:text-brand-400">{t("scheme.rateTerm")}</td>
                </tr>
                <tr className={financials.scheme.code === "MICRO" ? "bg-brand-50/40 dark:bg-brand-950/20" : ""}>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{t("scheme.rowTenure")}</td>
                  <td className="px-4 py-3">{t("scheme.tenureMicro")}</td>
                  <td className="px-4 py-3">{t("scheme.tenureTerm")}</td>
                </tr>
                <tr className={financials.scheme.code === "MICRO" ? "bg-brand-50/40 dark:bg-brand-950/20" : ""}>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{t("scheme.rowMoratorium")}</td>
                  <td className="px-4 py-3">{t("scheme.moraMicro")}</td>
                  <td className="px-4 py-3">{t("scheme.moraTerm")}</td>
                </tr>
                <tr className={financials.scheme.code === "MICRO" ? "bg-brand-50/40 dark:bg-brand-950/20" : ""}>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{t("scheme.rowInstallment")}</td>
                  <td className="px-4 py-3">{t("scheme.quarterlyMonthly")}</td>
                  <td className="px-4 py-3">{t("scheme.quarterlyMonthly")}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}


