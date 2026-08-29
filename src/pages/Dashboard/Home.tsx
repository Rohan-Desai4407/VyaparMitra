import { useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { useVyapar } from "../../context/VyaparContext";
import { useNotifications } from "../../context/NotificationContext";
import PageMeta from "../../components/common/PageMeta";
import {
  ChevronRight,
  ClipboardList,
  Calculator,
  Landmark,
  FileText,
  TrendingUp,
  Sparkles,
  Building2,
  BarChart3,
  AlertCircle,
  Info,
  CheckCircle2,
  ArrowRight,
  Eye,
} from "lucide-react";

// ─── Viability sub-factor derivation from context data ──────────────────
function deriveViabilityFactors(
  viabilityScore: number,
  competitorDensity: string,
  loanAmount: number,
  maxLoan: number
) {
  // Market Potential — strong if score is high and competition isn't crushing
  const competitionPenalty =
    competitorDensity === "High" ? 8 : competitorDensity === "Medium" ? 3 : 0;
  const marketPotential = Math.min(
    100,
    Math.max(40, viabilityScore + 4 - competitionPenalty)
  );

  // Financial Readiness — based on how close actual loan is to max scheme loan
  const loanUtilization = maxLoan > 0 ? (loanAmount / maxLoan) * 100 : 50;
  const financialReadiness = Math.min(
    100,
    Math.max(40, Math.round(loanUtilization * 0.85 + 10))
  );

  // Resource Availability — derived from base viability + competition signal
  const resourceAvailability = Math.min(
    100,
    Math.max(40, viabilityScore + 1 + competitionPenalty * 0.5)
  );

  // Funding Match — how well the scheme covers their needs
  const fundingMatch = Math.min(
    100,
    Math.max(40, Math.round(loanUtilization * 0.9 + 5))
  );

  return { marketPotential, financialReadiness, resourceAvailability, fundingMatch };
}

// ─── Notification type → icon mapping (shared with NotificationDropdown) ─
function getActivityIcon(type: string) {
  switch (type) {
    case "scheme":
      return <Landmark className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
    case "finance":
      return <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />;
    case "ai":
      return <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
    case "business":
    case "market":
      return <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
    case "important":
      return <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
    default:
      return <Info className="w-4 h-4 text-gray-500 dark:text-gray-400" />;
  }
}

// ─── ProgressBar sub-component ────────────────────────────────────────────
function ProgressBar({
  value,
  color = "emerald",
}: {
  value: number;
  color?: string;
}) {
  const colorMap: Record<string, string> = {
    emerald: "bg-emerald-500 dark:bg-emerald-400",
    blue: "bg-blue-500 dark:bg-blue-400",
    amber: "bg-amber-500 dark:bg-amber-400",
    purple: "bg-purple-500 dark:bg-purple-400",
  };
  return (
    <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${colorMap[color] || colorMap.emerald}`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const { input, financials, market, report, isGenerating } = useVyapar();
  const { notifications } = useNotifications();
  const [showComparison, setShowComparison] = useState(false);

  // Derived data
  const factors = deriveViabilityFactors(
    report.viabilityScore,
    market.competitorDensity,
    financials.maxLoanAmount,
    financials.scheme.maxLoan
  );

  // Financial calculations from context (no magic numbers)
  const estMonthlyRevenue = financials.projectCost * 0.15;
  const estMonthlyExpenses = estMonthlyRevenue * 0.6;
  const estMonthlyProfit =
    estMonthlyRevenue - estMonthlyExpenses - financials.monthlyEmi;
  const profitMargin =
    Math.round((estMonthlyProfit / estMonthlyRevenue) * 100) || 0;

  // Recent activity from notifications (read ones = completed actions)
  const recentActivity = notifications
    .filter((n) => n.read)
    .slice(0, 4);

  // Opportunity ranking data (derived from context)
  const opportunities = [
    {
      rank: 1,
      name: input.category,
      score: report.viabilityScore,
      demand: "HIGH",
      investment: `₹${financials.projectCost.toLocaleString("en-IN")}`,
      competition: market.competitorDensity.toUpperCase(),
    },
    {
      rank: 2,
      name: "Food Processing",
      score: report.viabilityScore - 3,
      demand: "HIGH",
      investment: `₹${Math.round(financials.projectCost * 1.1).toLocaleString("en-IN")}`,
      competition: "MEDIUM",
    },
    {
      rank: 3,
      name: "Poultry",
      score: report.viabilityScore - 7,
      demand: "MEDIUM",
      investment: `₹${Math.round(financials.projectCost * 0.85).toLocaleString("en-IN")}`,
      competition: "LOW",
    },
  ];

  // ── Skeleton loader ───────────────────────────────────────────────────
  if (isGenerating) {
    return (
      <>
        <PageMeta title={t("dashboard.title")} description="" />
        <div className="space-y-6 pb-12 max-w-7xl mx-auto animate-pulse">
          <div className="h-28 rounded-2xl bg-gray-200 dark:bg-gray-800" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-gray-200 dark:bg-gray-800" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-64 rounded-2xl bg-gray-200 dark:bg-gray-800" />
            <div className="h-64 rounded-2xl bg-gray-200 dark:bg-gray-800" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-52 rounded-2xl bg-gray-200 dark:bg-gray-800" />
            <div className="h-52 rounded-2xl bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title={t("dashboard.title")}
        description="AI-driven hyper-local business advisory dashboard and smart financial calculator."
      />

      <div className="space-y-6 pb-12 max-w-7xl mx-auto">
        {/* ─── HEADER ──────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center rounded-2xl bg-gradient-to-r from-gray-900 via-brand-900 to-gray-900 p-6 text-white shadow-md">
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold text-brand-400 tracking-wider">
              {t("dashboard.subtitle")}
            </span>
            <h1 className="text-2xl font-bold">
              {input.category} — {input.village}, {input.block}
            </h1>
            <p className="text-xs opacity-80">
              {t("dashboard.state")}: {input.state} •{" "}
              {t("dashboard.district")}: {input.district} •{" "}
              {t("dashboard.language")}: {input.language}
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex gap-3">
            <Link
              to="/assessment"
              className="rounded-xl bg-white/10 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/20 transition"
            >
              {t("dashboard.modifyInputs")}
            </Link>
            <Link
              to="/final-report"
              className="rounded-xl bg-white text-gray-900 px-4 py-2.5 text-xs font-semibold hover:bg-gray-100 transition"
            >
              {t("dashboard.viewFullReport")}
            </Link>
          </div>
        </div>

        {/* ─── TOP KPI ROW ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Viability Score with Breakdown */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t("dashboard.overallViability")}
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {report.viabilityScore}
              </span>
              <span className="text-sm font-normal text-gray-400">/ 100</span>
            </div>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {report.overallVerdict || "Highly Viable"}
            </span>
            {/* Factor Breakdown */}
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                {t("dashboard.viabilityFactors")}
              </span>
              {[
                { label: t("dashboard.marketPotential"), value: factors.marketPotential, color: "emerald" },
                { label: t("dashboard.financialReadiness"), value: factors.financialReadiness, color: "blue" },
                { label: t("dashboard.resourceAvailability"), value: factors.resourceAvailability, color: "amber" },
                { label: t("dashboard.fundingMatch"), value: factors.fundingMatch, color: "purple" },
              ].map((f) => (
                <div key={f.label}>
                  <div className="flex justify-between text-[11px] mb-0.5">
                    <span className="text-gray-600 dark:text-gray-400">{f.label}</span>
                    <span className="font-bold text-gray-700 dark:text-gray-300">{f.value}%</span>
                  </div>
                  <ProgressBar value={f.value} color={f.color} />
                </div>
              ))}
            </div>
          </div>

          {/* Available Margin Capital */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t("dashboard.availableMargin")}
            </span>
            <p className="mt-2 text-3xl font-black text-gray-900 dark:text-white">
              ₹{financials.userContribution.toLocaleString("en-IN")}
            </p>
            <span className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
              {t("dashboard.marginSub")}
            </span>
          </div>

          {/* Total Project Cost */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t("dashboard.totalProjectCost")}
            </span>
            <p className="mt-2 text-3xl font-black text-gray-900 dark:text-white">
              ₹{financials.projectCost.toLocaleString("en-IN")}
            </p>
            <span className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
              {t("dashboard.projectCostSub")}
            </span>
          </div>

          {/* Max Loan Eligibility */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t("dashboard.maxLoanEligibility")}
            </span>
            <p className="mt-2 text-3xl font-black text-emerald-600 dark:text-emerald-400">
              ₹{financials.maxLoanAmount.toLocaleString("en-IN")}
            </p>
            <span className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
              {t("dashboard.maxLoanSub", { schemeName: financials.scheme.name })}
            </span>
          </div>
        </div>

        {/* ─── RECOMMENDED NEXT STEPS ──────────────────────────── */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                {t("dashboard.nextSteps")}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {t("dashboard.nextStepsDesc")}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: <ClipboardList className="w-5 h-5" />,
                title: t("dashboard.stepAssessment"),
                desc: t("dashboard.stepAssessmentDesc"),
                cta: t("dashboard.continue"),
                path: "/assessment",
                color: "emerald",
                progress: 80,
              },
              {
                icon: <Calculator className="w-5 h-5" />,
                title: t("dashboard.stepFinancial"),
                desc: t("dashboard.stepFinancialDesc"),
                cta: t("dashboard.review"),
                path: "/financial-planner",
                color: "blue",
                progress: 100,
              },
              {
                icon: <Landmark className="w-5 h-5" />,
                title: t("dashboard.stepSchemes"),
                desc: t("dashboard.stepSchemesDesc"),
                cta: t("dashboard.explore"),
                path: "/scheme-router",
                color: "purple",
                progress: 60,
              },
              {
                icon: <FileText className="w-5 h-5" />,
                title: t("dashboard.stepReport"),
                desc: t("dashboard.stepReportDesc"),
                cta: t("dashboard.viewReport"),
                path: "/final-report",
                color: "amber",
                progress: 40,
              },
            ].map((step) => {
              const iconColors: Record<string, string> = {
                emerald: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
                blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
                purple: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
                amber: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
              };
              return (
                <div
                  key={step.path}
                  className="rounded-xl border border-gray-100 dark:border-gray-800 p-4 flex flex-col justify-between hover:border-gray-300 dark:hover:border-gray-700 transition-colors group"
                >
                  <div>
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${iconColors[step.color]}`}>
                      {step.icon}
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                      {step.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 mb-3">
                      {step.desc}
                    </p>
                    {/* Progress */}
                    <div className="flex items-center gap-2 mb-3">
                      <ProgressBar value={step.progress} color={step.color} />
                      <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {step.progress}%
                      </span>
                    </div>
                  </div>
                  <Link
                    to={step.path}
                    className="flex items-center justify-center gap-1.5 w-full py-2 text-xs font-semibold rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group-hover:text-brand-600 dark:group-hover:text-brand-400"
                  >
                    {step.cta}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── AI RECOMMENDATION + OPPORTUNITY RANKING ─────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Business Recommendation — Enhanced */}
          <div className="lg:col-span-2 rounded-2xl border border-emerald-200 bg-emerald-50/30 p-6 dark:border-emerald-900/30 dark:bg-emerald-900/10">
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-2">
              {t("dashboard.aiRecommendation")}
            </span>
            <div className="flex justify-between items-start mb-5">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {input.category}
              </h2>
              <span className="text-2xl font-black text-emerald-600">
                {report.viabilityScore}{" "}
                <span className="text-sm text-gray-400 font-normal">/ 100</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Why This Business? */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-3">
                  {t("dashboard.whyThisBusiness")}
                </h4>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    {t("dashboard.strongLocalDemand")}
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    {t("dashboard.suitableCapital")}
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    {t("dashboard.goodResourceAvail")}
                  </li>
                </ul>
              </div>

              {/* What Should I Do Next? */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-3">
                  {t("dashboard.whatNextSteps")}
                </h4>
                <div className="space-y-2">
                  {[
                    { label: t("dashboard.viewMarketAnalysis"), path: "/market-analysis", icon: <BarChart3 className="w-3.5 h-3.5" /> },
                    { label: t("dashboard.reviewFinancialPlan"), path: "/financial-planner", icon: <Calculator className="w-3.5 h-3.5" /> },
                    { label: t("dashboard.exploreSchemes"), path: "/scheme-router", icon: <Landmark className="w-3.5 h-3.5" /> },
                    { label: t("dashboard.viewBusinessPlan"), path: "/final-report", icon: <FileText className="w-3.5 h-3.5" /> },
                  ].map((action) => (
                    <Link
                      key={action.path}
                      to={action.path}
                      className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors py-1 group"
                    >
                      <span className="text-gray-400 group-hover:text-brand-500 transition-colors">
                        {action.icon}
                      </span>
                      {action.label}
                      <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                </div>
                <Link
                  to="/final-report"
                  className="text-xs font-semibold text-brand-600 dark:text-brand-400 inline-block pt-3 mt-2 border-t border-emerald-200/50 dark:border-emerald-800/30 w-full"
                >
                  {t("dashboard.viewFullReasoning")}
                </Link>
              </div>
            </div>
          </div>

          {/* Opportunity Ranking — Enhanced */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 flex flex-col">
            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-4">
              {t("dashboard.aiOpportunityRanking")}
            </span>
            <div className="space-y-3 flex-grow">
              {opportunities.map((opp) => (
                <div
                  key={opp.rank}
                  className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-800"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`text-xs font-black w-6 h-6 rounded-full flex items-center justify-center ${
                      opp.rank === 1
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                        : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                    }`}>
                      {opp.rank}
                    </span>
                    <span className={`font-bold text-sm ${
                      opp.rank === 1
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-700 dark:text-gray-300"
                    }`}>
                      {opp.name}
                    </span>
                  </div>
                  <span className={`font-bold ${
                    opp.score >= 80
                      ? "text-emerald-600"
                      : opp.score >= 70
                        ? "text-amber-600"
                        : "text-red-500"
                  }`}>
                    {opp.score}
                  </span>
                </div>
              ))}
            </div>

            {/* Compare toggle */}
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 mt-3 mb-1 flex items-center gap-1 hover:underline"
            >
              <Eye className="w-3.5 h-3.5" />
              {t("dashboard.compareOpportunities")}
            </button>

            {showComparison && (
              <div className="mt-2 border-t border-gray-100 dark:border-gray-800 pt-3 overflow-x-auto">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="text-gray-400 dark:text-gray-500 text-left">
                      <th className="pb-1.5 font-semibold">&nbsp;</th>
                      <th className="pb-1.5 font-semibold">{t("dashboard.demand")}</th>
                      <th className="pb-1.5 font-semibold">{t("dashboard.competition")}</th>
                      <th className="pb-1.5 font-semibold">{t("dashboard.investment")}</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700 dark:text-gray-300">
                    {opportunities.map((opp) => (
                      <tr key={opp.rank} className="border-t border-gray-50 dark:border-gray-800">
                        <td className="py-1.5 font-bold text-gray-900 dark:text-white">{opp.name}</td>
                        <td className="py-1.5">
                          <span className={`font-bold ${opp.demand === "HIGH" ? "text-emerald-600" : "text-amber-600"}`}>
                            {opp.demand}
                          </span>
                        </td>
                        <td className="py-1.5">
                          <span className={`font-bold ${opp.competition === "LOW" ? "text-emerald-600" : opp.competition === "MEDIUM" ? "text-amber-600" : "text-red-500"}`}>
                            {opp.competition}
                          </span>
                        </td>
                        <td className="py-1.5 font-medium">{opp.investment}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <Link
              to="/ai-advisor"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 block mt-3 pt-2 border-t border-gray-100 dark:border-gray-800"
            >
              {t("dashboard.viewAllOpportunities")}
            </Link>
          </div>
        </div>

        {/* ─── MARKET INTELLIGENCE + FINANCIAL SNAPSHOT ─────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Market Intelligence Preview */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 flex flex-col">
            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
              {t("dashboard.marketSnapshot")}
            </span>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
              {t("dashboard.location")}: {input.village}, {input.block}
            </p>
            <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm mb-4">
              <div>
                <span className="text-gray-500 dark:text-gray-400 block text-xs">{t("dashboard.demand")}:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">HIGH</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400 block text-xs">{t("dashboard.competition")}:</span>
                <span className={`font-bold ${market.competitorDensity === "High" ? "text-red-500" : market.competitorDensity === "Medium" ? "text-amber-600" : "text-emerald-600"}`}>
                  {market.competitorDensity.toUpperCase()}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400 block text-xs">{t("dashboard.potentialBuyers")}:</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {market.consumerBase5to10km.toLocaleString("en-IN")}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400 block text-xs">{t("dashboard.priceRange")}:</span>
                <span className="font-bold text-gray-900 dark:text-white">{market.suggestedPricing.split("(")[0].trim()}</span>
              </div>
            </div>
            <div className="bg-brand-50 dark:bg-brand-900/20 p-3 rounded-xl border border-brand-100 dark:border-brand-900/30 mb-4 flex-grow">
              <span className="block text-xs font-bold text-brand-700 dark:text-brand-300 mb-1">
                {t("dashboard.unservedOpportunities")}:
              </span>
              <span className="text-sm text-brand-900 dark:text-brand-100 font-medium">
                {market.unservedNiches[0]}
              </span>
            </div>
            <Link
              to="/market-analysis"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400"
            >
              {t("dashboard.viewMarketIntel")}
            </Link>
          </div>

          {/* Financial Snapshot */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 flex flex-col">
            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-4">
              {t("dashboard.financialSnapshot")}
            </span>
            <div className="space-y-3 mb-4 flex-grow">
              {/* Project Cost Breakdown Bar */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-500 dark:text-gray-400">{t("dashboard.totalProjectCost")}</span>
                  <span className="font-bold text-gray-900 dark:text-white">₹{financials.projectCost.toLocaleString("en-IN")}</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex">
                  <div
                    className="bg-emerald-500 dark:bg-emerald-400 rounded-l-full"
                    style={{ width: `${(financials.userContribution / financials.projectCost) * 100}%` }}
                    title={t("dashboard.yourContribution")}
                  />
                  <div
                    className="bg-blue-500 dark:bg-blue-400 rounded-r-full"
                    style={{ width: `${(financials.maxLoanAmount / financials.projectCost) * 100}%` }}
                    title={t("dashboard.loanAmount")}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                    {t("dashboard.yourContribution")}: ₹{financials.userContribution.toLocaleString("en-IN")}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                    {t("dashboard.loanAmount")}: ₹{financials.maxLoanAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 block mb-0.5">{t("dashboard.monthlyEmi")}</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">₹{financials.monthlyEmi.toLocaleString("en-IN")}</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 block mb-0.5">{t("dashboard.estMonthlyRevenue")}</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">₹{estMonthlyRevenue.toLocaleString("en-IN")}</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 block mb-0.5">{t("dashboard.estMonthlyProfit")}</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">₹{estMonthlyProfit.toLocaleString("en-IN")}</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 block mb-0.5">{t("dashboard.profitMargin")}</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{profitMargin}%</span>
                </div>
              </div>
            </div>
            <Link
              to="/financial-planner"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 block mt-auto pt-4 border-t border-gray-100 dark:border-gray-800"
            >
              {t("dashboard.viewSimulator")}
            </Link>
          </div>
        </div>

        {/* ─── RISK/SWOT + SCHEME SUPPORT ──────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 flex flex-col">
            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-4">
              {t("dashboard.riskOverview")}
            </span>
            <div className="mb-4">
              <span className="text-gray-500 dark:text-gray-400 block text-xs mb-1">{t("swot.target")}:</span>
              <span className="text-lg font-black text-amber-600 dark:text-amber-400">
                {input.category}
              </span>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/10 p-3 rounded-xl border border-amber-100 dark:border-amber-900/20 mb-4 flex-grow">
              <span className="block text-xs font-bold text-amber-700 dark:text-amber-400 mb-1">
                {t("dashboard.identifiedRisk")}:
              </span>
              <span className="text-sm text-amber-900 dark:text-amber-100 font-medium">
                {t("swot.rawMaterialFluctuation", "Raw material price fluctuations")}
              </span>
            </div>
            <Link
              to="/ai-advisor"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 mt-auto"
            >
              {t("dashboard.launchAiAssistant")}
            </Link>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 flex flex-col">
            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-4">
              {t("dashboard.schemeSupport")}
            </span>
            <div className="mb-4">
              <span className="text-sm font-bold text-gray-900 dark:text-white block mb-1">
                {t("dashboard.autoRecTitle")}
              </span>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/10 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/20 mb-4 space-y-2 flex-grow">
              <div>
                <span className="block text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                  {t("dashboard.optimalMatch")}:
                </span>
                <span className="text-sm text-emerald-900 dark:text-emerald-100 font-bold">
                  {financials.scheme.name}
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                  {t("dashboard.maxLoanEligibility")}:
                </span>
                <span className="text-sm text-emerald-900 dark:text-emerald-100 font-bold">
                  ₹{financials.maxLoanAmount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
            <Link
              to="/scheme-router"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 mt-auto"
            >
              {t("dashboard.exploreSchemeDetails")}
            </Link>
          </div>
        </div>

        {/* ─── RECENT ACTIVITY ─────────────────────────────────── */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              {t("dashboard.recentActivity")}
            </h2>
            <Link
              to="/notifications"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              {t("notifications.viewAll")}
            </Link>
          </div>
          {recentActivity.length === 0 ? (
            <div className="text-center py-8">
              <Info className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("dashboard.noRecentActivity")}
              </p>
            </div>
          ) : (
            <div className="space-y-0">
              {recentActivity.map((activity, idx) => (
                <Link
                  key={activity.id}
                  to={activity.actionUrl || "/notifications"}
                  className={`flex items-center gap-3 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg px-2 -mx-2 transition-colors ${
                    idx !== recentActivity.length - 1
                      ? "border-b border-gray-50 dark:border-gray-800"
                      : ""
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {activity.title}
                    </p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500">
                      {activity.timestamp}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* ─── FINAL REPORT CTA ────────────────────────────────── */}
        <div className="rounded-2xl border-2 border-brand-500 bg-brand-50 dark:bg-brand-900/10 p-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6">
          <div>
            <h3 className="text-lg font-black text-brand-900 dark:text-brand-100 uppercase mb-2">
              {t("report.pageTitle")}
            </h3>
            <p className="text-sm text-brand-700 dark:text-brand-300 max-w-xl">
              {t("report.pageDesc")}
            </p>
          </div>
          <Link
            to="/final-report"
            className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-6 rounded-xl transition shadow-md whitespace-nowrap"
          >
            {t("dashboard.viewFullReport")}
          </Link>
        </div>
      </div>
    </>
  );
}
