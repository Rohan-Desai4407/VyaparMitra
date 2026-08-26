import { useVyapar } from "../context/VyaparContext";
import PageMeta from "../components/common/PageMeta";
import ComponentCard from "../components/common/ComponentCard";

export default function FinancialPlanner() {
  const { financials, updateInput } = useVyapar();

  return (
    <>
      <PageMeta
        title="Smart Financial Calculator & Scheme Router | VyaparMitra"
        description="Calculate total feasible project cost, auto-select applicable loan scheme, maximum 90% loan, interest rate, and moratorium."
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Module 4 & 5 — Smart Financial Calculator & Scheme Auto-Selection Router
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Deterministic calculations based on PRD financial rules: Project Cost = Margin ÷ 10%, Max Loan = 90%.
            </p>
          </div>
        </div>

        {/* Interactive Margin Capital Slider */}
        <ComponentCard title="Interactive Margin Capital & Loan Calculator">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Available Margin Capital (User Contribution):
                </label>
                <span className="text-xl font-bold text-brand-600 dark:text-brand-400">
                  ₹{financials.marginCapital.toLocaleString("en-IN")}
                </span>
              </div>

              <input
                type="range"
                min="5000"
                max="500000"
                step="5000"
                value={financials.marginCapital}
                onChange={(e) => updateInput({ marginCapital: Number(e.target.value) })}
                className="h-2.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-brand-500 dark:bg-gray-700"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Min ₹5,000</span>
                <span>₹1.4L Scheme Threshold</span>
                <span>Max ₹5,00,000</span>
              </div>
            </div>

            {/* Main Financial Result Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/40">
                <span className="text-xs text-gray-500 dark:text-gray-400">User Margin (10%)</span>
                <p className="mt-1 text-2xl font-extrabold text-gray-900 dark:text-white">
                  ₹{financials.userContribution.toLocaleString("en-IN")}
                </p>
                <p className="mt-1 text-xs text-gray-400">Your out-of-pocket investment</p>
              </div>

              <div className="rounded-xl border border-brand-200 bg-brand-50/40 p-4 dark:border-brand-900/50 dark:bg-brand-950/20">
                <span className="text-xs font-semibold text-brand-700 dark:text-brand-300">
                  Total Feasible Project Cost
                </span>
                <p className="mt-1 text-3xl font-black text-brand-600 dark:text-brand-400">
                  ₹{financials.projectCost.toLocaleString("en-IN")}
                </p>
                <p className="mt-1 text-xs text-brand-600 dark:text-brand-400">
                  Formula: Margin Capital ÷ 10%
                </p>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                  Maximum Eligible Loan Amount (90%)
                </span>
                <p className="mt-1 text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  ₹{financials.maxLoanAmount.toLocaleString("en-IN")}
                </p>
                <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-300">
                  Agency Financing Share
                </p>
              </div>
            </div>
          </div>
        </ComponentCard>

        {/* Auto Selected Scheme Details */}
        <ComponentCard title="Auto-Selected Government Loan Scheme">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-brand-500 px-3 py-1 text-xs font-bold text-white uppercase tracking-wider">
                  {financials.scheme.code === "MICRO" ? "Micro Finance Scheme" : "Term Loan Scheme"}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Auto-routed based on project cost rule
                </span>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {financials.scheme.name}
              </h2>

              <p className="text-sm text-gray-600 dark:text-gray-300">
                {financials.scheme.code === "MICRO"
                  ? "Selected because total project cost is below ₹1.40 Lakh. Offers subsidized interest rates and low moratorium for micro-enterprises."
                  : "Selected because total project cost is between ₹1.40 Lakh and ₹50 Lakh. Tailored for scalable village ventures with longer repayment horizons."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/60 lg:w-96">
              <div>
                <span className="text-xs text-gray-400">Interest Rate</span>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {financials.scheme.interestRate}% p.a.
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-400">Repayment Tenure</span>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {financials.scheme.tenureYears} Years
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-400">Moratorium Period</span>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {financials.scheme.moratoriumMonths} Months
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-400">Agency Financing</span>
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {financials.scheme.agencyFinancing}
                </p>
              </div>
            </div>
          </div>
        </ComponentCard>

        {/* PRD Loan & Financial Rules Comparison Table */}
        <ComponentCard title="PRD Scheme Comparison Reference Matrix">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-gray-800 dark:text-gray-200">
              <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50 text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Micro Finance Scheme</th>
                  <th className="px-4 py-3">Term Loan Scheme</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                <tr className={financials.scheme.code === "MICRO" ? "bg-brand-50/50 dark:bg-brand-950/20 font-medium" : ""}>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Project Range</td>
                  <td className="px-4 py-3">Up to ₹1.40 Lakh</td>
                  <td className="px-4 py-3">₹1.40 Lakh to ₹50 Lakh</td>
                </tr>
                <tr className={financials.scheme.code === "MICRO" ? "bg-brand-50/50 dark:bg-brand-950/20" : ""}>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Agency Financing</td>
                  <td className="px-4 py-3">Up to 90%</td>
                  <td className="px-4 py-3">Up to 90%</td>
                </tr>
                <tr className={financials.scheme.code === "MICRO" ? "bg-brand-50/50 dark:bg-brand-950/20" : ""}>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Maximum Loan</td>
                  <td className="px-4 py-3">₹1.25 Lakh</td>
                  <td className="px-4 py-3">₹45 Lakh</td>
                </tr>
                <tr className={financials.scheme.code === "MICRO" ? "bg-brand-50/50 dark:bg-brand-950/20" : ""}>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Interest Rate</td>
                  <td className="px-4 py-3 text-brand-600 font-bold">6.5% per annum</td>
                  <td className="px-4 py-3 text-brand-600 font-bold">8.0% per annum</td>
                </tr>
                <tr className={financials.scheme.code === "MICRO" ? "bg-brand-50/50 dark:bg-brand-950/20" : ""}>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Repayment Tenure</td>
                  <td className="px-4 py-3">3 Years</td>
                  <td className="px-4 py-3">7 Years</td>
                </tr>
                <tr className={financials.scheme.code === "MICRO" ? "bg-brand-50/50 dark:bg-brand-950/20" : ""}>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Moratorium Period</td>
                  <td className="px-4 py-3">3 Months</td>
                  <td className="px-4 py-3">6 Months</td>
                </tr>
              </tbody>
            </table>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
