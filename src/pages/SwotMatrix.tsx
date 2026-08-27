import { useVyapar } from "../context/VyaparContext";
import PageMeta from "../components/common/PageMeta";
import ComponentCard from "../components/common/ComponentCard";

export default function SwotMatrix() {
  const { input, swot } = useVyapar();

  return (
    <>
      <PageMeta
        title="SWOT Matrix & Risk Advisor | VyaparMitra"
        description="Comprehensive SWOT matrix analysis, local bottlenecks, and risk assessment for your business."
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              SWOT Matrix & Risk Advisor
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Structured strategic evaluation across Strengths, Weaknesses, Opportunities, Threats, and Local Bottlenecks for {input.category}.
            </p>
          </div>
        </div>

        {/* Location & Sector Banner */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase text-brand-600 dark:text-brand-400">
                Evaluation Target
              </span>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                {input.category} — {input.village}, {input.block} ({input.district}, {input.state})
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                Risk Rating: Low-to-Moderate
              </span>
            </div>
          </div>
        </div>

        {/* SWOT Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Strengths */}
          <ComponentCard title="💪 Key Business Strengths">
            <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
              Internal advantages and localized operational strengths.
            </p>
            <ul className="space-y-2.5">
              {swot.strengths.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 rounded-xl bg-emerald-50/60 p-3 text-xs text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300"
                >
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </ComponentCard>

          {/* Weaknesses */}
          <ComponentCard title="⚠️ Operational Weaknesses">
            <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
              Internal operational gaps or capital-intensive requirements.
            </p>
            <ul className="space-y-2.5">
              {swot.weaknesses.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 rounded-xl bg-amber-50/60 p-3 text-xs text-amber-900 dark:bg-amber-950/30 dark:text-amber-300"
                >
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </ComponentCard>

          {/* Opportunities */}
          <ComponentCard title="🚀 Local Market Opportunities">
            <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
              External market trends, government incentives, and demand growth.
            </p>
            <ul className="space-y-2.5">
              {swot.opportunities.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 rounded-xl bg-blue-50/60 p-3 text-xs text-blue-900 dark:bg-blue-950/30 dark:text-blue-300"
                >
                  <span className="text-blue-600 font-bold">★</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </ComponentCard>

          {/* Threats */}
          <ComponentCard title="🛑 Market Threats">
            <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
              External competitors, raw material volatility, and external market shifts.
            </p>
            <ul className="space-y-2.5">
              {swot.threats.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 rounded-xl bg-rose-50/60 p-3 text-xs text-rose-900 dark:bg-rose-950/30 dark:text-rose-300"
                >
                  <span className="text-rose-500 font-bold">!</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </ComponentCard>
        </div>

        {/* Local Bottlenecks & Risk Mitigation Section */}
        <ComponentCard title="🛡️ Hyper-Local Risk Assessment & Mitigation Strategies">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {swot.localRisks.map((risk, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-red-200 bg-red-50/40 p-4 dark:border-red-900/40 dark:bg-red-950/20"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600 dark:bg-red-900/50 dark:text-red-300">
                    {idx + 1}
                  </span>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">Identified Risk</h4>
                </div>
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                  {risk}
                </p>
              </div>
            ))}
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
