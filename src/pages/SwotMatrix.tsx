import { useVyapar } from "../context/VyaparContext";
import { useSwotAnalysis } from "../hooks/useSwotAnalysis";
import { Loader2, AlertCircle, Bot, Check, AlertTriangle, Rocket, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import PageMeta from "../components/common/PageMeta";
import ComponentCard from "../components/common/ComponentCard";

export default function SwotMatrix() {
  const { t } = useTranslation();
  const { input } = useVyapar();
  const { data: swotData, loading, error, refetch } = useSwotAnalysis(input.assessmentId);

  return (
    <>
      <PageMeta title={`${t("swot.pageTitle")} | VyaparMitra`} description={t("swot.pageDesc", { category: input.category })} />
      <div className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Bot className="w-8 h-8 text-brand-600" />
              {t("swot.pageTitle")}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t("swot.pageDesc", { category: input.category })}
            </p>
          </div>
        </div>

        {loading && (
          <div className="w-full bg-brand-50/50 rounded-2xl p-12 flex flex-col items-center justify-center gap-4 mt-8">
            <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
            <h3 className="text-lg font-bold text-brand-900">Analyzing your business...</h3>
          </div>
        )}
        
        {error && (
          <div className="w-full bg-red-50 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 text-center mt-8">
            <AlertCircle className="w-12 h-12 text-red-500" />
            <h3 className="text-lg font-bold text-red-900">{error}</h3>
            <button onClick={refetch} className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium">Retry Analysis</button>
          </div>
        )}

        {!loading && !error && swotData && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ComponentCard title={t("swot.strengths")}>
              <ul className="space-y-3">
                {swotData.strengths?.map((item: any, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 rounded-lg bg-emerald-50 p-3 dark:bg-emerald-950/20"><Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" /><span className="text-sm text-gray-700 dark:text-gray-300"><b>{item.title}</b>: {item.description}</span></li>
                ))}
              </ul>
            </ComponentCard>
            
            <ComponentCard title={t("swot.weaknesses")}>
              <ul className="space-y-3">
                {swotData.weaknesses?.map((item: any, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 rounded-lg bg-amber-50 p-3 dark:bg-amber-950/20"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" /><span className="text-sm text-gray-700 dark:text-gray-300"><b>{item.title}</b>: {item.description}</span></li>
                ))}
              </ul>
            </ComponentCard>
            
            <ComponentCard title={t("swot.opportunities")}>
              <ul className="space-y-3">
                {swotData.opportunities?.map((item: any, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 rounded-lg bg-blue-50 p-3 dark:bg-blue-950/20"><Rocket className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" /><span className="text-sm text-gray-700 dark:text-gray-300"><b>{item.title}</b>: {item.description}</span></li>
                ))}
              </ul>
            </ComponentCard>
            
            <ComponentCard title={t("swot.threats")}>
              <ul className="space-y-3">
                {swotData.threats?.map((item: any, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 rounded-lg bg-rose-50 p-3 dark:bg-rose-950/20"><X className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" /><span className="text-sm text-gray-700 dark:text-gray-300"><b>{item.title}</b>: {item.description}</span></li>
                ))}
              </ul>
            </ComponentCard>
          </div>
        )}
      </div>
    </>
  );
}