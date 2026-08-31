import { useState } from "react";
import { Link } from "react-router";
import {
  Bot,
  Zap,
  AlertTriangle,
  Check,
  Rocket,
  Star,
  AlertCircle,
  X,
  ChevronRight,
  RefreshCw,
  Download,
  Edit2,
  Shield,
  Lightbulb,
  CheckCircle2,
  HelpCircle,
  ArrowRight
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useVyapar } from "../context/VyaparContext";
import PageMeta from "../components/common/PageMeta";
import ComponentCard from "../components/common/ComponentCard";
import { useSwotAnalysis } from "../hooks/useSwotAnalysis";
import SwotPoint from "../components/SwotPoint";

export default function SwotRiskAdvisor() {
  const { t } = useTranslation();
  const { input } = useVyapar();
  const { data: swotData, loading: swotLoading, error: swotError, refetch: refetchSwot } = useSwotAnalysis(input.assessmentId);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetchSwot();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleExport = () => {
    window.print();
  };

  if (!input.stateId || !input.categoryId) {
    return (
      <div className="mx-auto max-w-4xl text-center py-20">
        <h2 className="text-xl font-bold mb-4">{t("assessment.selectStateFirst")}</h2>
        <Link to="/assessment" className="text-brand-500 hover:underline">
          {t("assessment.pageTitle")} &rarr;
        </Link>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title={`${t("swot.pageTitle", "AI SWOT & Risk Advisor")} | VyaparMitra`}
        description={t(
          "swot.pageDesc",
          "Comprehensive AI-driven SWOT Matrix, risk assessment, and strategic recommendations for your rural business venture."
        )}
      />

      <div className="space-y-6 stagger-slide-up">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400">
                <Bot className="h-5 w-5" />
              </span>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t("swot.pageTitle", "AI SWOT & Risk Advisor")}
              </h1>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Evaluating <span className="font-semibold text-gray-800 dark:text-gray-200">{input.category}</span> in{" "}
              <span className="font-semibold text-gray-800 dark:text-gray-200">{input.village}, {input.block}</span> (Margin Capital: ₹{input.marginCapital.toLocaleString('en-IN')})
            </p>
          </div>

          <div className="flex flex-col gap-2 items-end">
            <Link
              to="/assessment"
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-500 hover:text-brand-600"
            >
              &larr; {t("dashboard.modifyInputs")} <Edit2 className="w-3.5 h-3.5 ml-1" />
            </Link>
            <div className="flex gap-2">
              <button
                onClick={handleRefresh}
                className="p-2 border rounded hover:bg-gray-50 flex items-center justify-center text-gray-600 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800"
                title={t("common.refresh")}
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-brand-500' : ''}`} />
              </button>
              <button
                onClick={handleExport}
                className="px-3 py-1.5 text-xs bg-brand-500 text-white rounded hover:bg-brand-600 flex items-center gap-1"
              >
                <Download className="w-3 h-3" /> {t("common.print")}
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {swotLoading && (
          <div className="w-full bg-brand-50/50 dark:bg-brand-950/20 border border-brand-100 dark:border-brand-900/50 rounded-2xl p-12 flex flex-col items-center justify-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin"></div>
              <Bot className="w-6 h-6 text-brand-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <h3 className="text-lg font-bold text-brand-900 dark:text-brand-300">Analyzing your business feasibility & risk profile...</h3>
            <p className="text-xs text-gray-500 max-w-md text-center">Evaluating localized risk factors, internal operational capacity, and market dynamics for {input.category}.</p>
          </div>
        )}

        {/* Error State */}
        {swotError && !swotLoading && (
          <div className="w-full bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 text-center">
            <AlertCircle className="w-12 h-12 text-red-500" />
            <h3 className="text-lg font-bold text-red-900 dark:text-red-300">{swotError}</h3>
            <button
              onClick={refetchSwot}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              Retry Analysis
            </button>
          </div>
        )}

        {/* SWOT & Risk Advisor Content */}
        {!swotLoading && !swotError && swotData && (
          <div className="space-y-6">
            {/* Top KPI Cards Row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Risk Score */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
                  Overall Risk Score
                  <Shield className="w-4 h-4 text-brand-500" />
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className={`text-2xl font-black ${
                    swotData.overallRiskScore > 40
                      ? 'text-red-600 dark:text-red-400'
                      : swotData.overallRiskScore > 25
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {swotData.overallRiskScore}
                  </span>
                  <span className="text-xs text-gray-500">/ 100</span>
                </div>
                <p className="mt-2 text-xs font-semibold text-gray-600 dark:text-gray-300">
                  {swotData.overallRiskScore <= 25 ? "Low Risk (Favorable)" : swotData.overallRiskScore <= 40 ? "Moderate Risk (Manageable)" : "High Risk (Caution)"}
                </p>
              </div>

              {/* Strengths Count */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
                  Identified Strengths
                  <Check className="w-4 h-4 text-emerald-600" />
                </span>
                <p className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {swotData.strengths?.length || 0}
                </p>
                <p className="mt-2 text-xs text-gray-500">Key business advantages</p>
              </div>

              {/* Opportunities Count */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
                  Growth Opportunities
                  <Rocket className="w-4 h-4 text-blue-600" />
                </span>
                <p className="mt-2 text-2xl font-black text-blue-600 dark:text-blue-400">
                  {swotData.opportunities?.length || 0}
                </p>
                <p className="mt-2 text-xs text-gray-500">Market niches & expansions</p>
              </div>

              {/* Threats Count */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
                  Threats & Bottlenecks
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                </span>
                <p className="mt-2 text-2xl font-black text-amber-600 dark:text-amber-400">
                  {swotData.threats?.length || 0}
                </p>
                <p className="mt-2 text-xs text-gray-500">External & supply risks</p>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 flex items-start gap-4 shadow-sm">
              <div className="bg-brand-100 dark:bg-brand-900/50 p-3 rounded-xl shrink-0">
                <Bot className="w-6 h-6 text-brand-700 dark:text-brand-300" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white mb-1 text-base">Executive Strategic Assessment</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{swotData.overallAssessment}</p>
              </div>
            </div>

            {/* 4-Quadrant SWOT Matrix */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Strengths */}
              <ComponentCard title={<div className="flex items-center gap-2"><Zap className="w-4 h-4 text-emerald-600" /> Key Business Strengths</div>}>
                <ul className="space-y-2.5">
                  {swotData.strengths?.map((item: any, idx: number) => (
                    <SwotPoint
                      key={idx}
                      item={item}
                      category="strength"
                      icon={Check}
                      iconColorClass="text-emerald-600"
                      bgColorClass="bg-emerald-50/60 dark:bg-emerald-950/30"
                      textColorClass="text-emerald-900 dark:text-emerald-300"
                    />
                  ))}
                </ul>
              </ComponentCard>

              {/* Weaknesses */}
              <ComponentCard title={<div className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-600" /> Operational Weaknesses</div>}>
                <ul className="space-y-2.5">
                  {swotData.weaknesses?.map((item: any, idx: number) => (
                    <SwotPoint
                      key={idx}
                      item={item}
                      category="weakness"
                      icon={ChevronRight}
                      iconColorClass="text-amber-600"
                      bgColorClass="bg-amber-50/60 dark:bg-amber-950/30"
                      textColorClass="text-amber-900 dark:text-amber-300"
                    />
                  ))}
                </ul>
              </ComponentCard>

              {/* Opportunities */}
              <ComponentCard title={<div className="flex items-center gap-2"><Rocket className="w-4 h-4 text-blue-600" /> Local Market Opportunities</div>}>
                <ul className="space-y-2.5">
                  {swotData.opportunities?.map((item: any, idx: number) => (
                    <SwotPoint
                      key={idx}
                      item={item}
                      category="opportunity"
                      icon={Star}
                      iconColorClass="text-blue-600"
                      bgColorClass="bg-blue-50/60 dark:bg-blue-950/30"
                      textColorClass="text-blue-900 dark:text-blue-300"
                    />
                  ))}
                </ul>
              </ComponentCard>

              {/* Threats */}
              <ComponentCard title={<div className="flex items-center gap-2"><AlertCircle className="w-4 h-4 text-rose-600" /> Threats & Local Bottlenecks</div>}>
                <ul className="space-y-2.5">
                  {swotData.threats?.map((item: any, idx: number) => (
                    <SwotPoint
                      key={idx}
                      item={item}
                      category="threat"
                      icon={X}
                      iconColorClass="text-red-500"
                      bgColorClass="bg-red-50/60 dark:bg-red-950/30"
                      textColorClass="text-red-900 dark:text-red-300"
                    />
                  ))}
                </ul>
              </ComponentCard>
            </div>

            {/* Strategic AI Recommendations */}
            {swotData.recommendations && swotData.recommendations.length > 0 && (
              <ComponentCard title={<div className="flex items-center gap-2"><Lightbulb className="w-5 h-5 text-amber-500" /> Strategic AI Business Recommendations</div>}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {swotData.recommendations.map((rec: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex flex-col justify-between rounded-xl border border-gray-100 bg-gray-50/60 p-4 dark:border-gray-800 dark:bg-gray-800/40 hover:shadow-sm transition-shadow"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700 dark:bg-brand-900/50 dark:text-brand-300">
                            {idx + 1}
                          </span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            rec.priority === 'high'
                              ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                              : rec.priority === 'medium'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                          }`}>
                            {rec.priority || 'Action'}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{rec.title}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{rec.description}</p>
                      </div>
                      <Link
                        to="/ai-advisor"
                        state={{ initialQuery: `How do I implement this recommendation: "${rec.title}"?` }}
                        className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700"
                      >
                        Ask AI how to execute <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ))}
                </div>
              </ComponentCard>
            )}

            {/* Hyper-Local Risk Factor Assessment */}
            {swotData.riskFactors && swotData.riskFactors.length > 0 && (
              <ComponentCard title={<div className="flex items-center gap-2"><Shield className="w-5 h-5 text-brand-600" /> Hyper-Local Risk Factor Breakdown</div>}>
                <div className="space-y-3">
                  {swotData.riskFactors.map((rf: any, idx: number) => {
                    const pct = Math.round((rf.score / (rf.max || 10)) * 100);
                    return (
                      <div key={idx} className="space-y-1.5 p-3 rounded-xl bg-gray-50/70 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-gray-800 dark:text-gray-200">{rf.name}</span>
                          <span className={`font-bold ${
                            rf.riskLevel === 'HIGH' || pct >= 70
                              ? 'text-red-600'
                              : rf.riskLevel === 'MEDIUM' || pct >= 40
                              ? 'text-amber-600'
                              : 'text-emerald-600'
                          }`}>
                            {rf.riskLevel || (pct >= 70 ? 'HIGH' : pct >= 40 ? 'MEDIUM' : 'LOW')} ({rf.score}/{rf.max || 10})
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              pct >= 70 ? 'bg-red-500' : pct >= 40 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ComponentCard>
            )}
          </div>
        )}
      </div>
    </>
  );
}
