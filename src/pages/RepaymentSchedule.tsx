import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import PageMeta from "../components/common/PageMeta";
import ComponentCard from "../components/common/ComponentCard";
import { useRepaymentSchedule } from "../hooks/useRepaymentSchedule";

export default function RepaymentSchedule() {
  const { t } = useTranslation();
  const { data, loading, error, refetch } = useRepaymentSchedule();
  const [view, setView] = useState<'MONTHLY' | 'QUARTERLY'>('QUARTERLY');

  const { loanCalculation, scheduleItems, schemeName } = data || {};

  const displayItems = useMemo(() => {
    if (!scheduleItems) return [];
    
    if (view === 'MONTHLY') return scheduleItems;

    // Aggregate to quarterly
    const quarters = [];
    for (let i = 0; i < scheduleItems.length; i += 3) {
      const chunk = scheduleItems.slice(i, i + 3);
      
      const qNum = Math.floor(i / 3) + 1;
      const principal = chunk.reduce((sum: number, item: any) => sum + item.principal, 0);
      const interest = chunk.reduce((sum: number, item: any) => sum + item.interest, 0);
      const payment = chunk.reduce((sum: number, item: any) => sum + item.totalPayment, 0);
      const lastItem = chunk[chunk.length - 1];
      
      quarters.push({
        id: `Q${qNum}`,
        periodLabel: `Q${qNum} (${t("common.months")} ${chunk[0].periodNumber}-${lastItem.periodNumber})`,
        status: lastItem.status,
        principal: principal,
        interest: interest,
        totalPayment: payment,
        closingBalance: lastItem.closingBalance,
        isMoratorium: lastItem.status === 'MORATORIUM'
      });
    }
    return quarters;
  }, [scheduleItems, view, t]);

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500 animate-pulse">
        <h2 className="text-xl font-bold">{t("common.loading")}</h2>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="py-20 text-center text-red-500">
        <p>{error || "Unable to generate repayment schedule."}</p>
        <button onClick={refetch} className="mt-4 px-4 py-2 bg-brand-500 text-white rounded">{t("common.refresh")}</button>
      </div>
    );
  }

  // Real aggregations
  const totalPrincipal = scheduleItems.reduce((sum: number, item: any) => sum + item.principal, 0);
  const totalInterest = scheduleItems.reduce((sum: number, item: any) => sum + item.interest, 0);
  const totalPayment = scheduleItems.reduce((sum: number, item: any) => sum + item.totalPayment, 0);

  return (
    <>
      <PageMeta
        title={`${t("repayment.pageTitle")} | VyaparMitra`}
        description={t("repayment.pageDesc")}
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t("repayment.pageTitle")}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("repayment.pageDesc")}
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setView('MONTHLY')}
              className={`px-3 py-1.5 text-xs rounded ${view === 'MONTHLY' ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'}`}
            >
              {t("scheme.quarterlyMonthly").split("/")[1] || "Monthly"}
            </button>
            <button 
              onClick={() => setView('QUARTERLY')}
              className={`px-3 py-1.5 text-xs rounded ${view === 'QUARTERLY' ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'}`}
            >
              {t("scheme.quarterlyMonthly").split("/")[0] || "Quarterly"}
            </button>
          </div>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <span className="text-xs text-gray-500 dark:text-gray-400">{t("repayment.totalRepayment")}</span>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
              ₹{Math.round(totalPayment).toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-xs text-gray-400">{t("repayment.principal")} + {t("repayment.interest")}</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <span className="text-xs text-gray-500 dark:text-gray-400">{t("dashboard.estMonthlyEmi")}</span>
            <p className="mt-1 text-2xl font-bold text-brand-600 dark:text-brand-400">
              ₹{Math.round(loanCalculation.emi).toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
              {loanCalculation.interestRate}% {t("common.perAnnum")}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <span className="text-xs text-gray-500 dark:text-gray-400">{t("scheme.moratoriumPeriod")}</span>
            <p className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">
              {loanCalculation.moratoriumMonths} {t("common.months")}
            </p>
            <p className="mt-1 text-xs text-gray-400">{t("repayment.moratoriumTag")}</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <span className="text-xs text-gray-500 dark:text-gray-400">{t("repayment.effectiveTenure")}</span>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
              {loanCalculation.tenureMonths} {t("common.months")}
            </p>
            <p className="mt-1 text-xs text-gray-400">{schemeName}</p>
          </div>
        </div>

        {/* Repayment Schedule Table */}
        <ComponentCard title={t("repayment.tableTitle")}>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-gray-800 dark:text-gray-200">
              <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50 text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-4 py-3">{t("repayment.month")}</th>
                  <th className="px-4 py-3">{t("repayment.status")}</th>
                  <th className="px-4 py-3">{t("repayment.principal")}</th>
                  <th className="px-4 py-3">{t("repayment.interest")}</th>
                  <th className="px-4 py-3">{t("repayment.totalPayment")}</th>
                  <th className="px-4 py-3">{t("repayment.closingBalance")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {displayItems.map((row: any) => {
                  const isMoratorium = row.isMoratorium || row.status === 'MORATORIUM';
                  return (
                  <tr
                    key={row.id || row.periodNumber}
                    className={
                      isMoratorium
                        ? "bg-amber-50/50 dark:bg-amber-950/20"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    }
                  >
                    <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                      {row.periodLabel || `${t("repayment.month")} ${row.periodNumber}`}
                    </td>
                    <td className="px-4 py-3">
                      {isMoratorium ? (
                        <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                          {t("repayment.moratoriumTag")}
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                          {t("repayment.activeEmi")}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono">₹{Math.round(row.principal).toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3 font-mono">₹{Math.round(row.interest).toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3 font-mono font-bold text-gray-900 dark:text-white">
                      ₹{Math.round(row.totalPayment).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3 font-mono text-gray-600 dark:text-gray-400">
                      ₹{Math.max(0, Math.round(row.closingBalance)).toLocaleString("en-IN")}
                    </td>
                  </tr>
                )})}
                {/* Validation Totals Row */}
                <tr className="bg-gray-100 dark:bg-gray-800 font-bold border-t-2 border-gray-300 dark:border-gray-700">
                  <td className="px-4 py-3 text-right" colSpan={2}>TOTALS:</td>
                  <td className="px-4 py-3 font-mono text-emerald-600 dark:text-emerald-400">₹{Math.round(totalPrincipal).toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3 font-mono text-red-500">₹{Math.round(totalInterest).toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3 font-mono text-brand-600 dark:text-brand-400">₹{Math.round(totalPayment).toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3 font-mono text-gray-500 dark:text-gray-400">₹0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
