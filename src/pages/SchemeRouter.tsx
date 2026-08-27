import { useVyapar } from "../context/VyaparContext";
import PageMeta from "../components/common/PageMeta";
import ComponentCard from "../components/common/ComponentCard";
import { Link } from "react-router";

export default function SchemeRouter() {
  const { financials } = useVyapar();

  return (
    <>
      <PageMeta
        title="Government Scheme Router | VyaparMitra"
        description="Auto-select government schemes (Micro Finance Scheme vs. Term Loan Scheme) based on project size, interest rates, and moratorium periods."
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Government Scheme Auto-Selection Router
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Intelligent policy matching based on project cost thresholds, interest subsidies, and repayment conditions.
            </p>
          </div>
          <Link
            to="/financial-planner"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-semibold text-gray-800 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 transition shadow-sm"
          >
            ← Adjust Financials & Margin
          </Link>
        </div>

        {/* Primary Auto-Selected Scheme Banner Card */}
        <ComponentCard title="Auto-Selected Scheme Recommendation">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-brand-500 px-3 py-1 text-xs font-bold text-white uppercase tracking-wider">
                  {financials.scheme.code === "MICRO" ? "Micro Finance Scheme" : "Term Loan Scheme"}
                </span>
                <span className="rounded-md bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  Optimal Match
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Project Cost: <strong>₹{financials.projectCost.toLocaleString("en-IN")}</strong>
                </span>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {financials.scheme.name}
              </h2>

              <p className="text-sm text-gray-600 dark:text-gray-300 max-w-2xl">
                {financials.scheme.code === "MICRO"
                  ? "Selected because total project cost is within ₹1.40 Lakh. Features subsidized 6.5% interest rate, 3 months moratorium, and simplified approval for micro village entrepreneurs."
                  : "Selected because total project cost is between ₹1.40 Lakh and ₹50 Lakh. Structured for higher capital ventures with 8.0% interest rate, 7-year repayment window, and 6 months moratorium."}
              </p>

              <div className="flex items-center gap-4 pt-2">
                <Link
                  to="/repayment-schedule"
                  className="rounded-xl bg-brand-500 px-4 py-2 text-xs font-bold text-white hover:bg-brand-600 transition"
                >
                  View Repayment & EMI Schedule →
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/60 lg:w-96 shrink-0">
              <div className="rounded-lg bg-white p-3 shadow-xs dark:bg-gray-900">
                <span className="text-xs text-gray-400">Interest Rate</span>
                <p className="text-lg font-black text-brand-600 dark:text-brand-400">
                  {financials.scheme.interestRate}% p.a.
                </p>
              </div>
              <div className="rounded-lg bg-white p-3 shadow-xs dark:bg-gray-900">
                <span className="text-xs text-gray-400">Repayment Tenure</span>
                <p className="text-lg font-black text-gray-900 dark:text-white">
                  {financials.scheme.tenureYears} Years
                </p>
              </div>
              <div className="rounded-lg bg-white p-3 shadow-xs dark:bg-gray-900">
                <span className="text-xs text-gray-400">Moratorium Period</span>
                <p className="text-lg font-black text-gray-900 dark:text-white">
                  {financials.scheme.moratoriumMonths} Months
                </p>
              </div>
              <div className="rounded-lg bg-white p-3 shadow-xs dark:bg-gray-900">
                <span className="text-xs text-gray-400">Agency Financing</span>
                <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                  {financials.scheme.agencyFinancing}
                </p>
              </div>
            </div>
          </div>
        </ComponentCard>

        {/* PRD Loan & Financial Rules Comparison Table */}
        <ComponentCard title="Scheme Comparison & Routing Matrix">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-gray-800 dark:text-gray-200">
              <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50 text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-4 py-3.5 font-semibold">Eligibility & Terms Criteria</th>
                  <th className={`px-4 py-3.5 font-semibold ${financials.scheme.code === "MICRO" ? "text-brand-600 dark:text-brand-400" : ""}`}>
                    Micro Finance Scheme {financials.scheme.code === "MICRO" && "★ (Active)"}
                  </th>
                  <th className={`px-4 py-3.5 font-semibold ${financials.scheme.code === "TERM" ? "text-brand-600 dark:text-brand-400" : ""}`}>
                    Term Loan Scheme {financials.scheme.code === "TERM" && "★ (Active)"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                <tr className={financials.scheme.code === "MICRO" ? "bg-brand-50/40 dark:bg-brand-950/20" : ""}>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Project Cost Range</td>
                  <td className="px-4 py-3 font-medium">Up to ₹1.40 Lakh</td>
                  <td className="px-4 py-3 font-medium">₹1.40 Lakh to ₹50 Lakh</td>
                </tr>
                <tr className={financials.scheme.code === "MICRO" ? "bg-brand-50/40 dark:bg-brand-950/20" : ""}>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Agency Financing Ratio</td>
                  <td className="px-4 py-3">Up to 90% of Project Cost</td>
                  <td className="px-4 py-3">Up to 90% of Project Cost</td>
                </tr>
                <tr className={financials.scheme.code === "MICRO" ? "bg-brand-50/40 dark:bg-brand-950/20" : ""}>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Maximum Cap on Loan</td>
                  <td className="px-4 py-3">₹1.25 Lakh</td>
                  <td className="px-4 py-3">₹45 Lakh</td>
                </tr>
                <tr className={financials.scheme.code === "MICRO" ? "bg-brand-50/40 dark:bg-brand-950/20" : ""}>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Interest Rate</td>
                  <td className="px-4 py-3 text-emerald-600 font-bold dark:text-emerald-400">6.5% per annum</td>
                  <td className="px-4 py-3 text-brand-600 font-bold dark:text-brand-400">8.0% per annum</td>
                </tr>
                <tr className={financials.scheme.code === "MICRO" ? "bg-brand-50/40 dark:bg-brand-950/20" : ""}>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Repayment Tenure</td>
                  <td className="px-4 py-3">3 Years (36 Months)</td>
                  <td className="px-4 py-3">7 Years (84 Months)</td>
                </tr>
                <tr className={financials.scheme.code === "MICRO" ? "bg-brand-50/40 dark:bg-brand-950/20" : ""}>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Moratorium Period</td>
                  <td className="px-4 py-3">3 Months Grace Period</td>
                  <td className="px-4 py-3">6 Months Grace Period</td>
                </tr>
                <tr className={financials.scheme.code === "MICRO" ? "bg-brand-50/40 dark:bg-brand-950/20" : ""}>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Repayment Installment Type</td>
                  <td className="px-4 py-3">Quarterly / Monthly EMI</td>
                  <td className="px-4 py-3">Quarterly / Monthly EMI</td>
                </tr>
              </tbody>
            </table>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
