import { useVyapar } from "../context/VyaparContext";
import PageMeta from "../components/common/PageMeta";
import ComponentCard from "../components/common/ComponentCard";
import { Link } from "react-router";

export default function FinancialPlanner() {
  const { financials, updateInput } = useVyapar();

  return (
    <>
      <PageMeta
        title="Smart Financial Calculator | VyaparMitra"
        description="Calculate total feasible project cost, margin capital breakdown, eligible loans, and self-contribution."
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Smart Financial Calculator
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Deterministic capital planning: Project Cost = Margin ÷ 10%, Maximum Agency Loan = 90%.
            </p>
          </div>
          <Link
            to="/scheme-router"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-xs font-semibold text-white hover:bg-brand-600 transition shadow-sm"
          >
            View Auto-Selected Scheme →
          </Link>
        </div>

        {/* Interactive Margin Capital Slider */}
        <ComponentCard title="Interactive Margin Capital & Project Cost Simulator">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Available Margin Capital (Self Contribution):
                </label>
                <span className="text-2xl font-black text-brand-600 dark:text-brand-400">
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
                className="h-3 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-brand-500 dark:bg-gray-700"
              />
              <div className="flex justify-between text-xs font-medium text-gray-400 mt-2">
                <span>Min ₹5,000</span>
                <span>₹14,000 (Threshold for ₹1.4L Scheme)</span>
                <span>Max ₹5,00,000</span>
              </div>
            </div>

            {/* Main Financial Result Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-800/40">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    User Margin (10%)
                  </span>
                  <span className="rounded-md bg-gray-200 px-2 py-0.5 text-[10px] font-bold text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                    Self Equity
                  </span>
                </div>
                <p className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white">
                  ₹{financials.userContribution.toLocaleString("en-IN")}
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Your upfront out-of-pocket investment</p>
              </div>

              <div className="rounded-xl border border-brand-200 bg-brand-50/40 p-5 dark:border-brand-900/50 dark:bg-brand-950/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300">
                    Total Feasible Project Cost
                  </span>
                  <span className="rounded-md bg-brand-100 px-2 py-0.5 text-[10px] font-bold text-brand-800 dark:bg-brand-900 dark:text-brand-200">
                    100% Size
                  </span>
                </div>
                <p className="mt-2 text-3xl font-black text-brand-600 dark:text-brand-400">
                  ₹{financials.projectCost.toLocaleString("en-IN")}
                </p>
                <p className="mt-1 text-xs font-medium text-brand-600/80 dark:text-brand-400/80">
                  Calculated as Margin Capital ÷ 10%
                </p>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-5 dark:border-emerald-900/50 dark:bg-emerald-950/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                    Eligible Loan Amount (90%)
                  </span>
                  <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                    Agency Debt
                  </span>
                </div>
                <p className="mt-2 text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  ₹{financials.maxLoanAmount.toLocaleString("en-IN")}
                </p>
                <p className="mt-1 text-xs font-medium text-emerald-700/80 dark:text-emerald-300/80">
                  Govt / Institutional Financing Share
                </p>
              </div>
            </div>
          </div>
        </ComponentCard>

        {/* Project Cost Breakdown & Capital Structure */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ComponentCard title="Capital Breakdown & Financing Ratios">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/40">
                <div className="flex items-center gap-3">
                  <div className="w-3.5 h-3.5 rounded-full bg-brand-500"></div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Promoter / Self Contribution</p>
                    <p className="text-xs text-gray-400">Required 10% minimum margin</p>
                  </div>
                </div>
                <span className="text-base font-bold text-gray-900 dark:text-white">
                  ₹{financials.userContribution.toLocaleString("en-IN")} (10%)
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/40">
                <div className="flex items-center gap-3">
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500"></div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Agency Loan Financing</p>
                    <p className="text-xs text-gray-400">Maximum eligible bank/agency loan</p>
                  </div>
                </div>
                <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                  ₹{financials.maxLoanAmount.toLocaleString("en-IN")} (90%)
                </span>
              </div>

              {/* Visual Progress Ratio */}
              <div className="pt-2">
                <div className="flex justify-between text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                  <span>Margin: 10%</span>
                  <span>Loan: 90%</span>
                </div>
                <div className="h-3 w-full rounded-full bg-gray-200 overflow-hidden flex dark:bg-gray-700">
                  <div className="h-full bg-brand-500 w-[10%]"></div>
                  <div className="h-full bg-emerald-500 w-[90%]"></div>
                </div>
              </div>
            </div>
          </ComponentCard>

          <ComponentCard title="Financial Quick Summary & Scheme Snapshot">
            <div className="space-y-4">
              <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-900/30 dark:bg-blue-950/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                    Auto-Matched Scheme
                  </span>
                  <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-[10px] font-bold text-white">
                    {financials.scheme.code}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {financials.scheme.name}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Applicable interest rate: <strong>{financials.scheme.interestRate}% p.a.</strong> • Tenure: <strong>{financials.scheme.tenureYears} Years</strong>
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="text-xs text-gray-400">Want full scheme terms & comparison?</span>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Explore government scheme router
                  </p>
                </div>
                <Link
                  to="/scheme-router"
                  className="rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-xs font-bold text-gray-800 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 transition"
                >
                  Scheme Router →
                </Link>
              </div>
            </div>
          </ComponentCard>
        </div>
      </div>
    </>
  );
}
