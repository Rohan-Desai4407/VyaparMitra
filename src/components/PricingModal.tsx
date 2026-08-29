import { useEffect, useState } from "react";
import { X, TrendingUp, Tag, Info } from "lucide-react";

interface Product {
  name: string;
  unit: string;
  priceMin: number;
  priceMax: number;
  marginMin: number;
  marginMax: number;
  note: string;
}

interface Props {
  category: string;
  onClose: () => void;
}

function MarginBar({ min, max }: { min: number; max: number }) {
  const avg = (min + max) / 2;
  const color = avg >= 50 ? "bg-emerald-500" : avg >= 25 ? "bg-blue-500" : "bg-amber-500";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
        <div
          className={`h-2 rounded-full ${color} transition-all duration-500`}
          style={{ width: `${Math.min(avg, 100)}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 w-16 text-right">
        {min}–{max}%
      </span>
    </div>
  );
}

export default function PricingModal({ category, onClose }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPricing = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(
          `http://localhost:3001/api/market/pricing?category=${encodeURIComponent(category)}`
        );
        if (!res.ok) throw new Error();
        const data = await res.json();
        setProducts(data.products || []);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPricing();
  }, [category]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-start justify-between z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Tag className="w-5 h-5 text-brand-500" />
              Market Pricing Breakdown
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">{category}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Source badge */}
        <div className="px-6 pt-4 pb-2">
          <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>Based on India rural/semi-urban market benchmarks and wholesale data — VyaparMitra Pricing Model 2026</span>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          {loading && (
            <div className="py-16 text-center text-gray-400 text-sm animate-pulse">
              Loading pricing data...
            </div>
          )}

          {error && (
            <div className="py-16 text-center text-red-500 text-sm">
              Pricing data unavailable for this category.
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <>
              {/* Column headers */}
              <div className="grid grid-cols-12 gap-3 mt-4 mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-1">
                <div className="col-span-4">Product / Service</div>
                <div className="col-span-2 text-center">Unit</div>
                <div className="col-span-3 text-center">Price Range (₹)</div>
                <div className="col-span-3">Est. Margin</div>
              </div>

              <div className="space-y-3">
                {products.map((p, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-12 gap-3 items-center bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 border border-gray-100 dark:border-gray-700 hover:border-brand-200 dark:hover:border-brand-700 transition-colors"
                  >
                    {/* Product name + note */}
                    <div className="col-span-4">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 leading-tight">
                        {p.name}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{p.note}</p>
                    </div>

                    {/* Unit */}
                    <div className="col-span-2 text-center">
                      <span className="text-[11px] text-gray-500 dark:text-gray-400">{p.unit}</span>
                    </div>

                    {/* Price range */}
                    <div className="col-span-3 text-center">
                      <span className="text-sm font-bold text-brand-600 dark:text-brand-400">
                        ₹{p.priceMin.toLocaleString("en-IN")}
                      </span>
                      <span className="text-gray-400 text-xs mx-1">–</span>
                      <span className="text-sm font-bold text-brand-600 dark:text-brand-400">
                        ₹{p.priceMax.toLocaleString("en-IN")}
                      </span>
                    </div>

                    {/* Margin bar */}
                    <div className="col-span-3 flex items-center">
                      <div className="w-full">
                        <MarginBar min={p.marginMin} max={p.marginMax} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary footer */}
              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="bg-brand-50 dark:bg-brand-900/20 rounded-xl p-3 text-center border border-brand-100 dark:border-brand-800">
                  <p className="text-[10px] text-brand-600 dark:text-brand-300 font-semibold uppercase tracking-wide">Lowest Entry Price</p>
                  <p className="text-lg font-bold text-brand-700 dark:text-brand-300 mt-1">
                    ₹{Math.min(...products.map(p => p.priceMin)).toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-3 text-center border border-emerald-100 dark:border-emerald-800">
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-300 font-semibold uppercase tracking-wide flex items-center justify-center gap-1">
                    <TrendingUp className="w-3 h-3" /> Best Margin Product
                  </p>
                  <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300 mt-1 leading-tight">
                    {products.sort((a, b) => ((b.marginMin + b.marginMax) / 2) - ((a.marginMin + a.marginMax) / 2))[0]?.name}
                  </p>
                  <p className="text-[10px] text-emerald-500 mt-0.5">
                    {products[0]?.marginMin}–{products[0]?.marginMax}% margin
                  </p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 text-center border border-amber-100 dark:border-amber-800">
                  <p className="text-[10px] text-amber-600 dark:text-amber-300 font-semibold uppercase tracking-wide">Premium High End</p>
                  <p className="text-lg font-bold text-amber-700 dark:text-amber-300 mt-1">
                    ₹{Math.max(...products.map(p => p.priceMax)).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
