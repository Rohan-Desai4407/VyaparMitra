import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Check, AlertTriangle, Rocket, X, Star, AlertCircle, Shield, Info, Bot } from 'lucide-react';
import { useNavigate } from 'react-router';
import { SwotItem } from '../hooks/useSwotAnalysis';

interface SwotPointProps {
  item: SwotItem;
  category: "strength" | "weakness" | "opportunity" | "threat";
  icon: React.ElementType;
  iconColorClass: string;
  bgColorClass: string;
  textColorClass: string;
}

export default function SwotPoint({ item, category, icon: Icon, iconColorClass, bgColorClass, textColorClass }: SwotPointProps) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const getImpactBadge = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high': return <span className="px-1.5 py-0.5 bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 rounded text-[9px] font-bold uppercase tracking-wider">High Impact</span>;
      case 'medium': return <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 rounded text-[9px] font-bold uppercase tracking-wider">Medium Impact</span>;
      default: return <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 rounded text-[9px] font-bold uppercase tracking-wider">Low Impact</span>;
    }
  };

  const getConfidenceColor = (conf: number) => {
    if (conf >= 90) return 'text-emerald-600 dark:text-emerald-400';
    if (conf >= 75) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };
  
  const handleAskAI = () => {
    const question = `Can you explain more about this ${category}: "${item.title}"? Specifically, how should I handle the fact that ${item.description.toLowerCase()}`;
    navigate('/ai-advisor', { state: { initialQuery: question } });
  };

  return (
    <div className={`rounded-xl ${bgColorClass} overflow-hidden transition-all border border-black/5 dark:border-white/5`}>
      <button 
        onClick={() => setExpanded(!expanded)}
        className={`w-full flex items-start justify-between gap-2.5 p-3 text-left focus:outline-none hover:bg-black/5 dark:hover:bg-white/5 transition-colors`}
      >
        <div className={`flex items-start gap-2.5 text-xs ${textColorClass} flex-1`}>
          <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${iconColorClass}`} />
          <div className="flex flex-col gap-1 w-full">
            <span className="font-semibold text-[13px]">{item.title}</span>
            <span className="opacity-80 line-clamp-2">{item.description}</span>
          </div>
        </div>
        <div className={`shrink-0 ${textColorClass} opacity-50 flex items-center justify-center mt-1`}>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>
      
      {expanded && (
        <div className={`px-4 pb-4 pt-3 text-xs border-t border-black/10 dark:border-white/10 ${textColorClass}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <Shield className={`w-3.5 h-3.5 ${getConfidenceColor(item.confidence)}`} />
              <span className={`font-bold ${getConfidenceColor(item.confidence)}`}>{item.confidence}% Confidence</span>
            </div>
            {getImpactBadge(item.impact)}
          </div>
          
          <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3 border border-black/5 dark:border-white/5 mb-3">
            <h5 className="font-bold flex items-center gap-1 mb-1.5 uppercase text-[10px] tracking-wider opacity-60">
              <Info className="w-3 h-3" />
              Verified Evidence
            </h5>
            <p className="font-medium mb-2">{item.evidence}</p>
            <p className="text-[10px] opacity-70 border-t border-black/5 dark:border-white/5 pt-2 mt-2">
              <span className="font-bold">Source:</span> AI Analysis of Canonical Market Data
            </p>
          </div>
          
          <button 
            onClick={handleAskAI}
            className="w-full mt-1 flex items-center justify-center gap-2 py-2 px-3 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors shadow-sm"
          >
            <Bot className="w-4 h-4" />
            <span>Ask AI About This</span>
          </button>
        </div>
      )}
    </div>
  );
}
