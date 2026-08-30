import { Sparkles, Info, ClipboardList, Calculator, FileText, CheckCircle2, ArrowRight, Eye, MapPin, Store, TrendingUp, Users, Activity, AlertCircle, Landmark, IndianRupee, Building2, Leaf, Wallet, MessageCircle, ChevronRight, Download, BarChart3, HelpCircle } from 'lucide-react';

import { useState } from "react";
import { Link } from "react-router";

import React from 'react';
import { useTranslation } from "react-i18next";
import { useVyapar } from "../../context/VyaparContext";
import { useNotifications } from "../../context/NotificationContext";
import PageMeta from "../../components/common/PageMeta";


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

  // Financial Snapshot Estimates
  const estMonthlyRevenue = financials.projectCost * 0.15; 
  const estMonthlyExpenses = estMonthlyRevenue * 0.6; 
  const estMonthlyProfit = estMonthlyRevenue - estMonthlyExpenses - financials.monthlyEmi;
  const profitMargin = Math.round((estMonthlyProfit / estMonthlyRevenue) * 100) || 0;
  const breakEvenMonths = 14;
  const [userName, setUserName] = React.useState('Guest User');
  React.useEffect(() => {
    const updateName = () => {
      try {
        const u = localStorage.getItem('user');
        if (u) setUserName(JSON.parse(u).name);
        else setUserName('Guest User');
      } catch(e){}
    };
    updateName();
    window.addEventListener('userUpdated', updateName);
    return () => window.removeEventListener('userUpdated', updateName);
  }, []);

  
  const opportunities = [
    {
      rank: 1,
      name: input?.category || "Dairy",
      score: report?.viabilityScore || 85,
      demand: "HIGH",
      investment: `₹${(financials?.projectCost || 500000).toLocaleString("en-IN")}`,
      competition: (market?.competitorDensity || "LOW").toUpperCase(),
    },
    {
      rank: 2,
      name: "Food Processing",
      score: (report?.viabilityScore || 85) - 3,
      demand: "HIGH",
      investment: `₹${Math.round((financials?.projectCost || 500000) * 1.1).toLocaleString("en-IN")}`,
      competition: "MEDIUM",
    },
    {
      rank: 3,
      name: "Poultry",
      score: (report?.viabilityScore || 85) - 7,
      demand: "MEDIUM",
      investment: `₹${Math.round((financials?.projectCost || 500000) * 0.8).toLocaleString("en-IN")}`,
      competition: "LOW",
    }
  ];
  return (

    <>
      <PageMeta
        title={t("dashboard.title")}
        description="AI-driven hyper-local business advisory dashboard and smart financial calculator."
      />

      <div className="space-y-6 pb-12 max-w-7xl mx-auto">
        {/* COMBINED HERO & KPI ROW */}
        <div className="relative mb-8 opacity-0" style={{ animation: 'slide-up 0.6s ease-out forwards' }}>
          {/* Banner */}
          <div className="relative rounded-t-[2rem] bg-gradient-to-br from-brand-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden px-8 pt-8 pb-16">
            <div 
              className="absolute inset-0 z-0 opacity-40 dark:opacity-40 dark:brightness-50 dark:saturate-[0.4] dark:contrast-125 pointer-events-none" 
              style={{ backgroundImage: 'url("/bg-landscape.jpg")', backgroundPosition: 'center 40%', backgroundSize: 'cover' }} 
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-white/90 via-white/70 to-transparent dark:from-slate-950 dark:via-slate-950/90 dark:to-slate-950/40 pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                  Welcome back, {userName}
                </h1>
                <p className="text-gray-700 dark:text-gray-300 mt-2 font-medium">
                  Here is the feasibility for <span className="font-bold">{input.category}</span> in {input.village}, {input.block}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {input.district} District • {input.state} • {input.language}
                </p>
              </div>


            </div>
          </div>

          {/* Overlapping KPI Cards */}
          <div className="relative z-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-6 -mt-10">
            {/* Card 1 */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:border-gray-800 dark:bg-gray-900 flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100/80 dark:bg-emerald-900/40">
                <Leaf className="w-6 h-6 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{t("dashboard.overallViability")}</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-2xl font-black text-gray-900 dark:text-white">{report.viabilityScore}</span>
                  <span className="text-xs font-semibold text-gray-400">/ 100</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{report.overallVerdict || "Highly Viable"}</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:border-gray-800 dark:bg-gray-900 flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100/80 dark:bg-amber-900/40">
                <Wallet className="w-6 h-6 text-amber-600 dark:text-amber-400" strokeWidth={2} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{t("dashboard.availableMargin")}</span>
                <p className="text-xl lg:text-2xl font-black text-gray-900 dark:text-white mt-0.5">₹{financials.userContribution.toLocaleString("en-IN")}</p>
                <span className="text-[10px] font-bold text-gray-400 mt-0.5">Available Capital</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:border-gray-800 dark:bg-gray-900 flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100/80 dark:bg-emerald-900/40">
                <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{t("dashboard.totalProjectCost")}</span>
                <p className="text-xl lg:text-2xl font-black text-gray-900 dark:text-white mt-0.5">₹{financials.projectCost.toLocaleString("en-IN")}</p>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">High Potential</span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:border-gray-800 dark:bg-gray-900 flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100/80 dark:bg-amber-900/40">
                <Landmark className="w-6 h-6 text-amber-600 dark:text-amber-400" strokeWidth={2} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{t("dashboard.maxLoanEligibility")}</span>
                <p className="text-xl lg:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">₹{financials.maxLoanAmount.toLocaleString("en-IN")}</p>
                <span className="text-[10px] font-bold text-gray-400 mt-0.5">Approximate limit</span>
              </div>
            </div>
          </div>
        </div>
        {/* MAIN RECOMMENDATION & AI RANKING */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl border border-emerald-200 bg-emerald-50/30 p-6 dark:border-emerald-900/30 dark:bg-emerald-900/10">
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-2">AI BUSINESS RECOMMENDATION</span>
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{input.category}</h2>
              <span className="text-2xl font-black text-emerald-600">84 <span className="text-sm text-gray-400 font-normal">/ 100</span></span>
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
              {(opportunities || []).map((opp) => (
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
                    {(opportunities || []).map((opp) => (
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
            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-4">{t("financial.pageTitle")}</span>
            <div className="grid grid-cols-2 gap-y-8 gap-x-4 mb-4 flex-grow items-center">
              <div><span className="text-gray-500 block text-xs md:text-sm mb-1">{t("dashboard.estMonthlyRevenue")}:</span><span className="text-lg md:text-xl font-black text-gray-900 dark:text-white">₹{estMonthlyRevenue.toLocaleString('en-IN')}/mo</span></div>
              <div><span className="text-gray-500 block text-xs md:text-sm mb-1">{t("dashboard.estMonthlyProfit")}:</span><span className="text-lg md:text-xl font-black text-emerald-600">₹{estMonthlyProfit.toLocaleString('en-IN')}/mo</span></div>
              <div><span className="text-gray-500 block text-xs md:text-sm mb-1">Margin:</span><span className="text-lg md:text-xl font-black text-gray-900 dark:text-white">{profitMargin}%</span></div>
              <div><span className="text-gray-500 block text-xs md:text-sm mb-1">Break-even:</span><span className="text-lg md:text-xl font-black text-gray-900 dark:text-white">{breakEvenMonths} {t("common.months")}</span></div>
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
            <Link to="/ai-advisor" className="text-xs font-semibold text-brand-600 mt-auto flex items-center gap-1.5 w-fit hover:text-brand-700 transition-colors">{t("dashboard.launchAiAssistant")} <MessageCircle className="w-3.5 h-3.5" /></Link>
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

        {/* FINAL REPORT CTA */}
        <div className="rounded-2xl border border-brand-200 bg-brand-50 dark:border-gray-700 dark:bg-gray-800/80 shadow-sm p-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6">
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
