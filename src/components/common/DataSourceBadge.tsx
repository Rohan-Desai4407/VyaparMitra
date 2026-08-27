import { useState } from 'react';
import { Info } from 'lucide-react';

interface DataSourceBadgeProps {
  source: string;
  method?: string;
  confidence?: string;
  freshness?: string;
}

export default function DataSourceBadge({ source, method, confidence, freshness }: DataSourceBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-block ml-2">
      <button 
        type="button" 
        className="text-gray-400 hover:text-brand-500 focus:outline-none"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
      >
        <Info className="w-4 h-4" />
      </button>

      {showTooltip && (
        <div className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 text-xs">
          <div className="mb-2 pb-2 border-b border-gray-100 dark:border-gray-700">
            <span className="font-semibold text-gray-900 dark:text-white block mb-1">Source</span>
            <span className="text-brand-600 dark:text-brand-400">{source}</span>
          </div>
          {method && (
            <div className="mb-2">
              <span className="font-semibold text-gray-900 dark:text-white block mb-1">Method</span>
              <span className="text-gray-600 dark:text-gray-300">{method}</span>
            </div>
          )}
          <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
            {confidence && (
              <div>
                <span className="font-semibold text-gray-900 dark:text-white block">Confidence</span>
                <span className={`
                  ${confidence === 'High' ? 'text-green-600 dark:text-green-400' : ''}
                  ${confidence === 'Medium' ? 'text-amber-600 dark:text-amber-400' : ''}
                  ${confidence === 'Low' ? 'text-red-600 dark:text-red-400' : ''}
                `}>{confidence}</span>
              </div>
            )}
            {freshness && (
              <div className="text-right">
                <span className="font-semibold text-gray-900 dark:text-white block">Updated</span>
                <span className="text-gray-600 dark:text-gray-300">{freshness}</span>
              </div>
            )}
          </div>
          
          {/* Triangle pointer */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white dark:border-t-gray-800"></div>
          {/* Border pointer */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-[9px] border-transparent border-t-gray-200 dark:border-t-gray-700 -z-10 mt-[1px]"></div>
        </div>
      )}
    </div>
  );
}
