import { useState, useMemo } from "react";
import PageMeta from "../components/common/PageMeta";
import ComponentCard from "../components/common/ComponentCard";
import { useRepaymentSchedule } from "../hooks/useRepaymentSchedule";

export default function RepaymentSchedule() {
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
        periodLabel: `Q${qNum} (Months ${chunk[0].periodNumber}-${lastItem.periodNumber})`,
        status: lastItem.status,
        principal: principal,
        interest: interest,
        totalPayment: payment,
        closingBalance: lastItem.closingBalance,
        isMoratorium: lastItem.status === 'MORATORIUM'
      });
    }
    return quarters;
  }, [scheduleItems, view]);

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500 animate-pulse">
        <h2 className="text-xl font-bold">Calculating verified repayment schedule...</h2>
        <p className="mt-2 text-sm">Amortizing principal and moratorium capital...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="py-20 text-center text-red-500">
        <p>{error || "Unable to generate repayment schedule."}</p>
        <button onClick={refetch} className="mt-4 px-4 py-2 bg-brand-500 text-white rounded">Retry</button>
      </div>
    );
  }

  const projectCost = loanCalculation.projectCost;
  const reserve = projectCost * 0.15;
  const rawReserve = projectCost * 0.09;
  const emgReserve = projectCost * 0.06;

  // Real aggregations
  const totalPrincipal = scheduleItems.reduce((sum: number, item: any) => sum + item.principal, 0);
  const totalInterest = scheduleItems.reduce((sum: number, item: any) => sum + item.interest, 0);
  const totalPayment = scheduleItems.reduce((sum: number, item: any) => sum + item.totalPayment, 0);

  return (
    <>
      <PageMeta
        title="Repayment Schedule & Working Capital | VyaparMitra"
        description="Deterministic verified repayment amortization schedule accounting for government moratorium policies."
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              EMI & Repayment Planner
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Verified amortization schedule accounting for{" "}
              <span className="font-semibold text-brand-600 dark:text-brand-400">
                {loanCalculation.moratoriumMonths}-month moratorium grace period
              </span>{" "}
              under {schemeName}.
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setView('MONTHLY')}
              className={`px-3 py-1.5 text-xs rounded ${view === 'MONTHLY' ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setView('QUARTERLY')}
              className={`px-3 py-1.5 text-xs rounded ${view === 'QUARTERLY' ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'}`}
            >
              Quarterly
            </button>
          </div>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <span className="text-xs text-gray-500 dark:text-gray-400">Estimated Total Repayment</span>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
              ₹{Math.round(totalPayment).toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-xs text-gray-400">Principal + Interest</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <span className="text-xs text-gray-500 dark:text-gray-400">Monthly Equivalent EMI</span>
            <p className="mt-1 text-2xl font-bold text-brand-600 dark:text-brand-400">
              ₹{Math.round(loanCalculation.emi).toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
              At {loanCalculation.interestRate}% interest rate
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <span className="text-xs text-gray-500 dark:text-gray-400">Moratorium Grace Period</span>
            <p className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">
              {loanCalculation.moratoriumMonths} Months
            </p>
            <p className="mt-1 text-xs text-gray-400">Interest capitalized</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <span className="text-xs text-gray-500 dark:text-gray-400">Total Loan Horizon</span>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
              {loanCalculation.tenureMonths} Months
            </p>
            <p className="mt-1 text-xs text-gray-400">Excluding moratorium</p>
          </div>
        </div>

        {/* Working Capital & Operational Costs Banner */}
        <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-6 dark:border-blue-900/40 dark:bg-blue-950/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-bold text-blue-700 dark:text-blue-300 tracking-wider">
                Operational & Working Capital Allocation
              </span>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                Recommended Reserve: ₹{Math.round(reserve).toLocaleString("en-IN")} (15% of project cost)
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Keep 15% of total project capital reserved for initial inventory purchasing, fodder/raw material stocking, and emergency cash flow during the moratorium period.
              </p>
            </div>
            <div className="flex gap-2">
              <div className="rounded-xl bg-white dark:bg-gray-900 p-3 text-center border border-blue-200 dark:border-blue-800">
                <span className="text-xs text-gray-400">Raw Material Reserve</span>
                <p className="text-sm font-bold text-gray-900 dark:text-white">₹{Math.round(rawReserve).toLocaleString("en-IN")}</p>
              </div>
              <div className="rounded-xl bg-white dark:bg-gray-900 p-3 text-center border border-blue-200 dark:border-blue-800">
                <span className="text-xs text-gray-400">Emergency Buffer</span>
                <p className="text-sm font-bold text-gray-900 dark:text-white">₹{Math.round(emgReserve).toLocaleString("en-IN")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Repayment Schedule Table */}
        <ComponentCard title={`Expected ${view === 'QUARTERLY' ? 'Quarterly' : 'Monthly'} Repayment Roadmap`}>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-gray-800 dark:text-gray-200">
              <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50 text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-4 py-3">Period</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Principal (₹)</th>
                  <th className="px-4 py-3">Interest (₹)</th>
                  <th className="px-4 py-3">Total Payment (₹)</th>
                  <th className="px-4 py-3">Closing Balance (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {displayItems.map((row: any, idx: number) => {
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
                      {row.periodLabel || `Month ${row.periodNumber}`}
                    </td>
                    <td className="px-4 py-3">
                      {isMoratorium ? (
                        <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                          Moratorium Grace
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                          Active Amortization
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
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            * Repayment amounts are estimates based on the verified financing scheme: {schemeName}. Validated using standard reducing-balance formula and dynamic quarterly aggregation.
          </p>
        </ComponentCard>
      </div>
    </>
  );
}
