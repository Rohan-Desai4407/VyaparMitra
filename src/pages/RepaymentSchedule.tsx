import { useVyapar } from "../context/VyaparContext";
import PageMeta from "../components/common/PageMeta";
import ComponentCard from "../components/common/ComponentCard";

export default function RepaymentSchedule() {
  const { financials } = useVyapar();

  // Generate quarterly schedule
  const totalQuarters = financials.scheme.tenureYears * 4;
  const moratoriumQuarters = Math.ceil(financials.scheme.moratoriumMonths / 3);

  const scheduleRows = Array.from({ length: Math.min(totalQuarters, 12) }).map((_, index) => {
    const qNum = index + 1;
    const isMoratorium = qNum <= moratoriumQuarters;
    
    // Simple principal amortization calculation for representation
    const principalPaid = isMoratorium ? 0 : Math.round(financials.maxLoanAmount / (totalQuarters - moratoriumQuarters));
    const interestPaid = Math.round((financials.maxLoanAmount * (financials.scheme.interestRate / 100)) / 4);
    const totalQuarterlyPayment = isMoratorium ? interestPaid : principalPaid + interestPaid;
    const remainingBalance = isMoratorium 
      ? financials.maxLoanAmount 
      : Math.max(0, financials.maxLoanAmount - principalPaid * (qNum - moratoriumQuarters));

    return {
      quarter: `Q${qNum} (Month ${qNum * 3 - 2} - ${qNum * 3})`,
      isMoratorium,
      principalPaid,
      interestPaid,
      totalQuarterlyPayment,
      remainingBalance,
    };
  });

  return (
    <>
      <PageMeta
        title="Repayment Schedule & Working Capital | VyaparMitra"
        description="Quarterly repayment breakdown, interest vs principal amortization, moratorium grace period, and working capital considerations."
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              EMI & Repayment Planner
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Quarterly repayment schedule accounting for{" "}
              <span className="font-semibold text-brand-600 dark:text-brand-400">
                {financials.scheme.moratoriumMonths}-month moratorium grace period
              </span>{" "}
              under {financials.scheme.name}.
            </p>
          </div>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <span className="text-xs text-gray-500 dark:text-gray-400">Estimated Quarterly Repayment</span>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
              ₹{financials.quarterlyEmi.toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-xs text-gray-400">Paid 4 times per year</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <span className="text-xs text-gray-500 dark:text-gray-400">Monthly Equivalent EMI</span>
            <p className="mt-1 text-2xl font-bold text-brand-600 dark:text-brand-400">
              ₹{financials.monthlyEmi.toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
              At {financials.scheme.interestRate}% interest rate
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <span className="text-xs text-gray-500 dark:text-gray-400">Moratorium Grace Period</span>
            <p className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">
              {financials.scheme.moratoriumMonths} Months
            </p>
            <p className="mt-1 text-xs text-gray-400">Interest-only during initial setup</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <span className="text-xs text-gray-500 dark:text-gray-400">Total Loan Horizon</span>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
              {financials.scheme.tenureYears} Years
            </p>
            <p className="mt-1 text-xs text-gray-400">{totalQuarters} total quarters</p>
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
                Recommended Reserve: ₹{Math.round(financials.projectCost * 0.15).toLocaleString("en-IN")} (15% of project cost)
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Keep 15% of total project capital reserved for initial inventory purchasing, fodder/raw material stocking, and emergency cash flow during the moratorium period.
              </p>
            </div>
            <div className="flex gap-2">
              <div className="rounded-xl bg-white dark:bg-gray-900 p-3 text-center border border-blue-200 dark:border-blue-800">
                <span className="text-xs text-gray-400">Raw Material Reserve</span>
                <p className="text-sm font-bold text-gray-900 dark:text-white">₹{Math.round(financials.projectCost * 0.09).toLocaleString("en-IN")}</p>
              </div>
              <div className="rounded-xl bg-white dark:bg-gray-900 p-3 text-center border border-blue-200 dark:border-blue-800">
                <span className="text-xs text-gray-400">Emergency Buffer</span>
                <p className="text-sm font-bold text-gray-900 dark:text-white">₹{Math.round(financials.projectCost * 0.06).toLocaleString("en-IN")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quarterly Repayment Schedule Table */}
        <ComponentCard title="Expected Quarterly Repayment Roadmap (First 3 Years)">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-gray-800 dark:text-gray-200">
              <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50 text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-4 py-3">Quarter Period</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Principal (₹)</th>
                  <th className="px-4 py-3">Interest (₹)</th>
                  <th className="px-4 py-3">Total Payment (₹)</th>
                  <th className="px-4 py-3">Closing Principal Balance (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {scheduleRows.map((row, idx) => (
                  <tr
                    key={idx}
                    className={
                      row.isMoratorium
                        ? "bg-amber-50/50 dark:bg-amber-950/20"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    }
                  >
                    <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                      {row.quarter}
                    </td>
                    <td className="px-4 py-3">
                      {row.isMoratorium ? (
                        <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                          Moratorium Grace
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                          Active Amortization
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono">₹{row.principalPaid.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3 font-mono">₹{row.interestPaid.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3 font-mono font-bold text-gray-900 dark:text-white">
                      ₹{row.totalQuarterlyPayment.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3 font-mono text-gray-600 dark:text-gray-400">
                      ₹{row.remainingBalance.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
