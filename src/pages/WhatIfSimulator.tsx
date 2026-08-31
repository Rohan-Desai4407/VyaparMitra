import { useState, useMemo, useEffect } from "react";
import { calculateSimulation, fetchAiAnalysis } from "../services/simulationApi";
import { useVyapar } from "../context/VyaparContext";
import { useTranslation } from "react-i18next";
import PageMeta from "../components/common/PageMeta";
import ComponentCard from "../components/common/ComponentCard";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import {
  Sliders,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Zap,
  RotateCcw,
  Target,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  HelpCircle
} from "lucide-react";

export default function WhatIfSimulator() {
  const { t } = useTranslation();
  const { input, financials } = useVyapar();

  // Slider State
  const [volumeChangePct, setVolumeChangePct] = useState<number>(0);
  const [priceChangePct, setPriceChangePct] = useState<number>(0);
  const [rawMaterialCostChangePct, setRawMaterialCostChangePct] = useState<number>(0);
  const [opexChangePct, setOpexChangePct] = useState<number>(0);
  const [interestRateShift, setInterestRateShift] = useState<number>(0);

  // Active Scenario Preset
  const [activePreset, setActivePreset] = useState<"base" | "optimistic" | "inflation" | "slump">("base");
  const [isResetting, setIsResetting] = useState(false);

  // Handle Scenario Presets
  const applyPreset = (preset: "base" | "optimistic" | "inflation" | "slump") => {
    if (preset === "base") {
      setIsResetting(true);
      setTimeout(() => setIsResetting(false), 500);
    }
    setActivePreset(preset);
    switch (preset) {
      case "base":
        setVolumeChangePct(0);
        setPriceChangePct(0);
        setRawMaterialCostChangePct(0);
        setOpexChangePct(0);
        setInterestRateShift(0);
        break;
      case "optimistic":
        setVolumeChangePct(25);
        setPriceChangePct(5);
        setRawMaterialCostChangePct(-5);
        setOpexChangePct(0);
        setInterestRateShift(-0.5);
        break;
      case "inflation":
        setVolumeChangePct(0);
        setPriceChangePct(2);
        setRawMaterialCostChangePct(20);
        setOpexChangePct(15);
        setInterestRateShift(1.5);
        break;
      case "slump":
        setVolumeChangePct(-30);
        setPriceChangePct(-5);
        setRawMaterialCostChangePct(10);
        setOpexChangePct(5);
        setInterestRateShift(2.0);
        break;
    }
  };

  const handleCustomChange = (setter: (val: number) => void, val: number) => {
    setter(val);
    setActivePreset("base"); // Switch indicator if manual edit occurs
  };

  
  // --- DYNAMIC API INTEGRATION ---
  const [simData, setSimData] = useState<any>(null);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    const payload = {
      userId: 'mock-user-1',
      assessmentId: 'mock-assessment-1',
      projectCost: financials.projectCost || 1000000,
      marginCapital: input.marginCapital || 100000,
      salesVolumeChange: volumeChangePct,
      sellingPriceChange: priceChangePct,
      rawMaterialCostChange: rawMaterialCostChangePct,
      opexChange: opexChangePct,
      interestRateChange: interestRateShift,
      schemeId: (financials?.scheme as any)?.id || (financials?.scheme as any)?.code
    };
    
    const timer = setTimeout(() => {
      calculateSimulation(payload).then(data => {
        setSimData(data);
      }).catch(err => console.error(err));
    }, 300);
    return () => clearTimeout(timer);
  }, [
    volumeChangePct, 
    priceChangePct, 
    rawMaterialCostChangePct, 
    opexChangePct, 
    interestRateShift,
    financials.projectCost,
    input.marginCapital,
    (financials?.scheme as any)?.id,
    (financials?.scheme as any)?.code
  ]);

  const handleRefreshAi = () => {
    if (!simData) return;
    setIsAiLoading(true);
    fetchAiAnalysis(simData, input.category || 'General').then(data => {
      setAiAnalysis(data);
    }).catch(err => console.error(err))
      .finally(() => setIsAiLoading(false));
  };

  const simMonthlyRevenue = simData?.monthlyRevenue || 0;
  const simMonthlyEmi = simData?.emi || 0;
  const simTotalExpenses = simData?.totalExpenses || 0;
  const simNetProfit = simData?.operatingProfit || 0;
  const simNetMarginPct = simData?.profitMargin || 0;
  const simRawMaterialCost = Math.round(simTotalExpenses * 0.45);
  const simOpex = Math.round(simTotalExpenses * 0.20);
  const breakEvenUnits = simData?.breakEvenUnits || 0;

  const simPricePerUnit = Math.round(60 * (1 + priceChangePct / 100));
  const baseMonthlyUnits = Math.round(((financials?.projectCost || 1000000) * 0.25) / 60) || 1000;
  const simMonthlyUnits = Math.round(baseMonthlyUnits * (1 + volumeChangePct / 100));
  const breakEvenRevenue = breakEvenUnits * simPricePerUnit;

  const baseMonthlyRevenue = baseMonthlyUnits * 60;
  const baseRawMaterialCost = Math.round(baseMonthlyRevenue * 0.45);
  const baseOpex = Math.round(baseMonthlyRevenue * 0.20);
  const baseMonthlyEmi = financials?.monthlyEmi || 2800;

  const effectiveInterestRate = Math.max(1, (financials?.scheme?.interestRate || 12) + interestRateShift);



  const healthScore = simData?.stressScore || 0;
  const riskRating = simData?.riskLevel || 'MODERATE_RISK';
  const dscr = simData?.dscr || 0;

  // 12-Month Projections for Cashflow Chart
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const cashFlowSeries = useMemo(() => {
    let runningCash = 0;
    const monthlyNetArray: number[] = [];
    const cumulativeArray: number[] = [];

    months.forEach((_, idx) => {
      const seasonal = 1 + Math.sin((idx / 12) * 2 * Math.PI) * 0.08;
      const mRev = Math.round(simMonthlyRevenue * seasonal);
      const mExp = Math.round(simTotalExpenses * (0.95 + (seasonal - 1) * 0.5));
      const net = mRev - mExp;
      runningCash += net;
      monthlyNetArray.push(net);
      cumulativeArray.push(runningCash);
    });

    return [
      { name: "Monthly Net Cash Flow (₹)", data: monthlyNetArray },
      { name: "Cumulative Surplus (₹)", data: cumulativeArray },
    ];
  }, [simMonthlyRevenue, simTotalExpenses]);

  const cashFlowChartOptions: ApexOptions = {
    chart: {
      type: "area",
      height: 310,
      toolbar: { show: false },
      fontFamily: "Inter, sans-serif",
    },
    colors: ["#10B981", "#3B82F6"],
    stroke: { curve: "smooth", width: 2 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
      },
    },
    dataLabels: { enabled: false },
    xaxis: { categories: months },
    yaxis: {
      labels: {
        formatter: (val) => `₹${(val / 1000).toFixed(0)}k`,
      },
    },
    tooltip: {
      y: { formatter: (val) => `₹${val.toLocaleString('en-IN')}` },
    },
    grid: { borderColor: "#F3F4F6" },
  };

  // Modern Donut Chart Data
  const donutSegments = [
    { label: "Raw Materials", value: Math.max(0, simRawMaterialCost), color: "#EF4444", lightColor: "#FEE2E2", darkColor: "#dc2626" },
    { label: "OpEx & Labor",  value: Math.max(0, simOpex),            color: "#F59E0B", lightColor: "#FEF3C7", darkColor: "#d97706" },
    { label: "Loan EMI",      value: Math.max(0, simMonthlyEmi),      color: "#6366F1", lightColor: "#E0E7FF", darkColor: "#4f46e5" },
    { label: "Net Profit",    value: Math.max(0, simNetProfit),       color: "#10B981", lightColor: "#D1FAE5", darkColor: "#059669" },
  ];

  return (
    <>
      <PageMeta
        title={`${t("whatif.pageTitle", "What-if Financial Simulator")} | VyaparMitra`}
        description={t(
          "whatif.pageDesc",
          "Stress-test your business model under varying market conditions, cost spikes, and price adjustments."
        )}
      />

      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400">
                <Sliders className="h-5 w-5" />
              </span>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t("whatif.pageTitle", "What-if Financial Simulator")}
              </h1>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Simulating for <span className="font-semibold text-gray-800 dark:text-gray-200">{input.category}</span> in{" "}
              <span className="font-semibold text-gray-800 dark:text-gray-200">{input.village}, {input.block}</span> (Margin Capital: ₹{input.marginCapital.toLocaleString('en-IN')})
            </p>
          </div>

          <button
            onClick={() => applyPreset("base")}
            disabled={isResetting}
            title="Reset to Base Case"
            className="rounded-xl border border-gray-200 bg-white p-2.5 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <RotateCcw className={`h-4 w-4 ${isResetting ? 'animate-spin text-brand-500' : ''}`} />
          </button>
        </div>

        {/* Quick Scenario Preset Selector */}
        <ComponentCard title={t("whatif.presetTitle", "Quick Scenario Presets")}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <button
              onClick={() => applyPreset("base")}
              className={`flex flex-col rounded-xl border p-4 text-left transition-all ${
                activePreset === "base"
                  ? "border-brand-500 bg-brand-50/50 dark:border-brand-500 dark:bg-brand-950/30 ring-2 ring-brand-500/20"
                  : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-800 dark:bg-gray-800/40 dark:hover:border-gray-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-900 dark:text-white">Base Case</span>
                <CheckCircle2 className={`h-4 w-4 ${activePreset === "base" ? "text-brand-500" : "text-gray-300"}`} />
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Current feasibility baseline parameters.</p>
            </button>

            <button
              onClick={() => applyPreset("optimistic")}
              className={`flex flex-col rounded-xl border p-4 text-left transition-all ${
                activePreset === "optimistic"
                  ? "border-emerald-500 bg-emerald-50/50 dark:border-emerald-500 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20"
                  : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-800 dark:bg-gray-800/40 dark:hover:border-gray-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Optimistic Growth</span>
                <ArrowUpRight className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">+25% sales volume, +5% selling price.</p>
            </button>

            <button
              onClick={() => applyPreset("inflation")}
              className={`flex flex-col rounded-xl border p-4 text-left transition-all ${
                activePreset === "inflation"
                  ? "border-amber-500 bg-amber-50/50 dark:border-amber-500 dark:bg-amber-950/30 ring-2 ring-amber-500/20"
                  : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-800 dark:bg-gray-800/40 dark:hover:border-gray-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-amber-700 dark:text-amber-400">Cost Spike</span>
                <TrendingUp className="h-4 w-4 text-amber-500" />
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">+20% raw material, +15% opex costs.</p>
            </button>

            <button
              onClick={() => applyPreset("slump")}
              className={`flex flex-col rounded-xl border p-4 text-left transition-all ${
                activePreset === "slump"
                  ? "border-red-500 bg-red-50/50 dark:border-red-500 dark:bg-red-950/30 ring-2 ring-red-500/20"
                  : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-800 dark:bg-gray-800/40 dark:hover:border-gray-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-red-700 dark:text-red-400">Demand Slump / Stress</span>
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">-30% volume, +2% interest rate hike.</p>
            </button>
          </div>
        </ComponentCard>

        {/* Dynamic Parameter Sliders Grid */}
        <ComponentCard title={t("whatif.controlsTitle", "Interactive Sensitivity Controls")}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Sales Volume Slider */}
            <div className="space-y-2 rounded-xl bg-gray-50/70 p-4 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-center text-xs font-semibold">
                <label className="text-gray-700 dark:text-gray-300 flex items-center gap-1">
                  Sales Volume Change
                </label>
                <span className={`font-bold ${volumeChangePct > 0 ? "text-emerald-600" : volumeChangePct < 0 ? "text-red-600" : "text-gray-600"}`}>
                  {volumeChangePct > 0 ? `+${volumeChangePct}%` : `${volumeChangePct}%`}
                </span>
              </div>
              <input
                type="range"
                min="-50"
                max="100"
                step="5"
                value={volumeChangePct}
                onChange={(e) => handleCustomChange(setVolumeChangePct, Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-brand-500 dark:bg-gray-700"
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>-50% Slump</span>
                <span>Base (1,000 units)</span>
                <span>+100% Demand</span>
              </div>
            </div>

            {/* Selling Price Slider */}
            <div className="space-y-2 rounded-xl bg-gray-50/70 p-4 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-center text-xs font-semibold">
                <label className="text-gray-700 dark:text-gray-300">Selling Price Adjustment</label>
                <span className={`font-bold ${priceChangePct > 0 ? "text-emerald-600" : priceChangePct < 0 ? "text-red-600" : "text-gray-600"}`}>
                  {priceChangePct > 0 ? `+${priceChangePct}%` : `${priceChangePct}%`} (₹{simPricePerUnit}/unit)
                </span>
              </div>
              <input
                type="range"
                min="-30"
                max="50"
                step="2"
                value={priceChangePct}
                onChange={(e) => handleCustomChange(setPriceChangePct, Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-brand-500 dark:bg-gray-700"
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>-30% Discount</span>
                <span>Base (₹60)</span>
                <span>+50% Premium</span>
              </div>
            </div>

            {/* Raw Material Cost Slider */}
            <div className="space-y-2 rounded-xl bg-gray-50/70 p-4 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-center text-xs font-semibold">
                <label className="text-gray-700 dark:text-gray-300">Raw Material Sourcing Cost</label>
                <span className={`font-bold ${rawMaterialCostChangePct > 0 ? "text-red-600" : rawMaterialCostChangePct < 0 ? "text-emerald-600" : "text-gray-600"}`}>
                  {rawMaterialCostChangePct > 0 ? `+${rawMaterialCostChangePct}%` : `${rawMaterialCostChangePct}%`}
                </span>
              </div>
              <input
                type="range"
                min="-30"
                max="80"
                step="5"
                value={rawMaterialCostChangePct}
                onChange={(e) => handleCustomChange(setRawMaterialCostChangePct, Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-amber-500 dark:bg-gray-700"
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>-30% Savings</span>
                <span>Base</span>
                <span>+80% Inflation</span>
              </div>
            </div>

            {/* OpEx & Labor Slider */}
            <div className="space-y-2 rounded-xl bg-gray-50/70 p-4 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-center text-xs font-semibold">
                <label className="text-gray-700 dark:text-gray-300">Operational Expenses (OpEx)</label>
                <span className={`font-bold ${opexChangePct > 0 ? "text-red-600" : opexChangePct < 0 ? "text-emerald-600" : "text-gray-600"}`}>
                  {opexChangePct > 0 ? `+${opexChangePct}%` : `${opexChangePct}%`}
                </span>
              </div>
              <input
                type="range"
                min="-30"
                max="60"
                step="5"
                value={opexChangePct}
                onChange={(e) => handleCustomChange(setOpexChangePct, Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-amber-500 dark:bg-gray-700"
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>-30% Efficient</span>
                <span>Base</span>
                <span>+60% Overhead</span>
              </div>
            </div>

            {/* Bank Interest Rate Shift Slider */}
            <div className="space-y-2 rounded-xl bg-gray-50/70 p-4 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-center text-xs font-semibold">
                <label className="text-gray-700 dark:text-gray-300">Bank Interest Rate Shift</label>
                <span className={`font-bold ${interestRateShift > 0 ? "text-red-600" : interestRateShift < 0 ? "text-emerald-600" : "text-gray-600"}`}>
                  {interestRateShift > 0 ? `+${interestRateShift}%` : `${interestRateShift}%`} ({effectiveInterestRate.toFixed(1)}% p.a.)
                </span>
              </div>
              <input
                type="range"
                min="-3.0"
                max="4.0"
                step="0.25"
                value={interestRateShift}
                onChange={(e) => handleCustomChange(setInterestRateShift, Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-indigo-500 dark:bg-gray-700"
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>-3% Subsidized</span>
                <span>Base ({financials.scheme.interestRate}%)</span>
                <span>+4% Hike</span>
              </div>
            </div>

            {/* Summary Benchmark Pill */}
            <div className="flex flex-col justify-center rounded-xl bg-brand-50/50 p-4 dark:bg-brand-950/30 border border-brand-100 dark:border-brand-900">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-800 dark:text-brand-300">
                <Zap className="h-4 w-4 text-brand-500" />
                Active Scheme Baseline
              </div>
              <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                Scheme: <span className="font-semibold">{financials.scheme.name}</span> (Tenure: {financials.scheme.tenureYears} yrs)
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Total Loan: <span className="font-semibold">₹{financials.maxLoanAmount.toLocaleString('en-IN')}</span> (90% Financing)
              </p>
            </div>
          </div>
        </ComponentCard>

        {/* Key Simulated Outputs KPI Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Net Profit Card */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-800/40">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Est. Net Monthly Profit</span>
            <p className={`mt-2 text-2xl font-black ${simNetProfit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
              ₹{simNetProfit.toLocaleString('en-IN')}
            </p>
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
              <span>Base: ₹{baseMonthlyRevenue - (baseRawMaterialCost + baseOpex + baseMonthlyEmi)}</span>
              <span className={`font-semibold ${simNetMarginPct >= 15 ? "text-emerald-600" : simNetMarginPct > 0 ? "text-amber-600" : "text-red-600"}`}>
                {simNetMarginPct}% Margin
              </span>
            </div>
          </div>

          {/* Break Even Units Card */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-800/40">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center justify-between">
              Break-Even Threshold
              <Target className="h-4 w-4 text-brand-500" />
            </span>
            <p className="mt-2 text-2xl font-black text-gray-900 dark:text-white">
              {breakEvenUnits.toLocaleString('en-IN')} <span className="text-sm font-normal text-gray-500">units/mo</span>
            </p>
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
              <span>Req. Revenue:</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">₹{breakEvenRevenue.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Monthly EMI Card */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-800/40">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Simulated Monthly EMI</span>
            <p className="mt-2 text-2xl font-black text-indigo-600 dark:text-indigo-400">
              ₹{simMonthlyEmi.toLocaleString('en-IN')}
            </p>
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
              <span>Interest Rate:</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">{effectiveInterestRate.toFixed(1)}% p.a.</span>
            </div>
          </div>

          {/* Health Score / Stress Gauge Card */}
          <div className={`rounded-xl border p-5 shadow-sm ${
            riskRating === "LOW_RISK"
              ? "border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/50 dark:bg-emerald-950/20"
              : riskRating === "MODERATE_RISK"
              ? "border-amber-200 bg-amber-50/40 dark:border-amber-900/50 dark:bg-amber-950/20"
              : "border-red-200 bg-red-50/40 dark:border-red-900/50 dark:bg-red-950/20"
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Financial Stress Score</span>
              {riskRating === "LOW_RISK" ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : (
                <ShieldAlert className="h-4 w-4 text-amber-500" />
              )}
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-gray-900 dark:text-white">{healthScore}</span>
              <span className="text-xs text-gray-500">/ 100</span>
            </div>
            <div className="mt-2 text-xs font-bold uppercase tracking-wide">
              <span className={riskRating === "LOW_RISK" ? "text-emerald-700 dark:text-emerald-400" : riskRating === "MODERATE_RISK" ? "text-amber-700 dark:text-amber-400" : "text-red-700 dark:text-red-400"}>
                {riskRating.replace("_", " ")}
              </span>
              <span className="ml-2 font-normal text-gray-500">(DSCR: {dscr}x)</span>
            </div>
          </div>
        </div>

        {/* Visual Charts Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Area Chart: 12-Month Net Cash Flow Trajectory */}
          <div className="lg:col-span-8">
            <ComponentCard title={t("whatif.cashflowChartTitle", "12-Month Net Cash Flow & Cumulative Runway")}>
              <div className="pt-2">
                <Chart options={cashFlowChartOptions} series={cashFlowSeries} type="area" height={310} />
              </div>
            </ComponentCard>
          </div>

          {/* Donut Chart: Cost & Margin Breakdown */}
          <div className="lg:col-span-4">
            <ComponentCard title={t("whatif.costBreakdownTitle", "Monthly Cost & Profit Structure")}>
              <ModernDonutChart
                segments={donutSegments}
                centerLabel="Est. Revenue"
                centerValue={`₹${simMonthlyRevenue.toLocaleString('en-IN')}`}
              />
            </ComponentCard>
          </div>
        </div>

        {/* AI Simulation & Risk Advisory Insights */}
        <ComponentCard title={t("whatif.aiInsightsTitle", "AI Simulation & Risk Advisory Insights")}>
          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
              <div className="mt-0.5 shrink-0">
                {simNetProfit > 0 ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                )}
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Scenario Viability Verdict: {simNetProfit > 0 ? "Viable Operating Model" : "Loss Making Scenario"}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  {simNetProfit > 0
                    ? `Under this scenario, your proposed unit generates a net monthly surplus of ₹${simNetProfit.toLocaleString('en-IN')} (${simNetMarginPct}% net margin) after serving ₹${simMonthlyEmi.toLocaleString('en-IN')} in loan EMI commitments.`
                    : `Under this scenario, total monthly costs (₹${simTotalExpenses.toLocaleString('en-IN')}) exceed projected monthly revenue (₹${simMonthlyRevenue.toLocaleString('en-IN')}) resulting in a net monthly loss of ₹${Math.abs(simNetProfit).toLocaleString('en-IN')}.`}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="rounded-xl border border-brand-100 bg-brand-50/40 p-4 dark:border-brand-900/50 dark:bg-brand-950/20">
                <h5 className="text-xs font-bold text-brand-800 dark:text-brand-300 flex items-center gap-1.5 mb-2">
                  <TrendingUp className="h-4 w-4" /> Operational Recommendations
                </h5>
                <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300 list-disc pl-4">
                  <li>
                    {simMonthlyUnits < breakEvenUnits
                      ? `Increase sales efforts to reach at least ${breakEvenUnits} units per month.`
                      : `Current volume (${simMonthlyUnits} units) is above break-even (${breakEvenUnits} units) with a ${Math.round(((simMonthlyUnits - breakEvenUnits) / breakEvenUnits) * 100)}% safety buffer.`}
                  </li>
                  <li>
                    {rawMaterialCostChangePct > 10
                      ? "Raw material price spikes severely impact margins. Explore group procurement via local co-operatives."
                      : "Sourcing costs remain manageable. Lock in quarterly pricing agreements with trusted suppliers."}
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4 dark:border-indigo-900/50 dark:bg-indigo-950/20">
                <h5 className="text-xs font-bold text-indigo-800 dark:text-indigo-300 flex items-center gap-1.5 mb-2">
                  <HelpCircle className="h-4 w-4" /> Financial & Debt Mitigation
                </h5>
                <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300 list-disc pl-4">
                  <li>
                    Debt Service Coverage Ratio (DSCR) is <span className="font-semibold">{dscr}x</span>. Bank lenders typically require a minimum of 1.20x.
                  </li>
                  <li>
                    Moratorium period ({financials.scheme.moratoriumMonths} months) offers immediate breathing room before principal repayments commence.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </ComponentCard>

        {/* Data Sources / Calculation Basis */}
        <ComponentCard title={
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-brand-600" />
            <span>Calculation Basis</span>
          </div>
        }>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <span className="block text-xs text-gray-500 mb-1">Project Cost</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">Project Expense Plan</span>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <span className="block text-xs text-gray-500 mb-1">Loan & Interest</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">Selected Scheme</span>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <span className="block text-xs text-gray-500 mb-1">Revenue Assumptions</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">Business Assessment</span>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <span className="block text-xs text-gray-500 mb-1">AI Insights</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">Gemini</span>
            </div>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}

// --- Modern Custom SVG Donut Chart ---
interface DonutSegment {
  label: string;
  value: number;
  color: string;
  lightColor: string;
  darkColor: string;
}

function ModernDonutChart({
  segments,
  centerLabel,
  centerValue,
}: {
  segments: DonutSegment[];
  centerLabel: string;
  centerValue: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const total = segments.reduce((s, g) => s + g.value, 0);
  if (total === 0) return (
    <div className="flex items-center justify-center h-48 text-gray-400 text-sm">No data to display</div>
  );

  const SIZE = 220, cx = 110, cy = 110, R = 82, ri = 50, GAP = 0.025;
  let cumAngle = -Math.PI / 2;

  const arcs = segments.map((seg, i) => {
    const fraction = seg.value / total;
    const angle = fraction * 2 * Math.PI - GAP;
    const sa = cumAngle + GAP / 2, ea = sa + angle;
    cumAngle += fraction * 2 * Math.PI;
    const la = angle > Math.PI ? 1 : 0;
    const mid = sa + angle / 2;
    const d = [
      `M ${cx + R * Math.cos(sa)} ${cy + R * Math.sin(sa)}`,
      `A ${R} ${R} 0 ${la} 1 ${cx + R * Math.cos(ea)} ${cy + R * Math.sin(ea)}`,
      `L ${cx + ri * Math.cos(ea)} ${cy + ri * Math.sin(ea)}`,
      `A ${ri} ${ri} 0 ${la} 0 ${cx + ri * Math.cos(sa)} ${cy + ri * Math.sin(sa)}`,
      "Z",
    ].join(" ");
    return { ...seg, d, mid, fraction, index: i };
  });

  return (
    <div className="flex flex-col items-center gap-4 py-2">
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="drop-shadow-sm">
        {arcs.map((a) => (
          <path key={a.index} d={a.d} fill={a.color} stroke="white" strokeWidth="1.5"
            transform={hovered === a.index ? `translate(${Math.cos(a.mid)*5} ${Math.sin(a.mid)*5})` : undefined}
            style={{ transition: "transform 0.2s ease", cursor: "pointer" }}
            onMouseEnter={() => setHovered(a.index)} onMouseLeave={() => setHovered(null)} />
        ))}
        {arcs.map((a) => a.fraction > 0.07 && (
          <text key={`l${a.index}`} x={cx+(R-16)*Math.cos(a.mid)} y={cy+(R-16)*Math.sin(a.mid)}
            textAnchor="middle" dominantBaseline="middle" fontSize="9" fontWeight="700" fill="white"
            style={{ pointerEvents:"none" }}>{(a.fraction*100).toFixed(0)}%</text>
        ))}
        <circle cx={cx} cy={cy} r={ri-4} fill="white" stroke="#F1F5F9" strokeWidth="1" />
        <text x={cx} y={cy-10} textAnchor="middle" fontSize="9" fill="#94A3B8" fontWeight="600" letterSpacing="0.08em">{centerLabel.toUpperCase()}</text>
        <text x={cx} y={cy+7} textAnchor="middle" fontSize="13" fill="#0F172A" fontWeight="800">{hovered !== null ? `₹${arcs[hovered].value.toLocaleString('en-IN')}` : centerValue}</text>
        {hovered !== null && (<text x={cx} y={cy+22} textAnchor="middle" fontSize="8" fill={arcs[hovered].color} fontWeight="700">{arcs[hovered].label}</text>)}
      </svg>

      <div className="grid grid-cols-2 gap-x-6 gap-y-2 w-full px-2">
        {segments.map((seg, i) => {
          const pct = total > 0 ? ((seg.value / total) * 100).toFixed(1) : "0";
          return (
            <div key={i} className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${hovered === i ? "bg-gray-50 dark:bg-gray-800" : ""}`}
              onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
              <span className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color, boxShadow: `0 0 4px ${seg.color}80` }} />
              <div className="min-w-0">
                <div className="text-[10px] font-semibold text-gray-700 dark:text-gray-200 truncate">{seg.label}</div>
                <div className="text-[10px] text-gray-400">{`₹${seg.value.toLocaleString('en-IN')} `}<span style={{ color: seg.color }}>{pct}%</span></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="w-full px-2">
        <div className="flex justify-between text-[10px] text-gray-400 mb-1">
          <span className="font-semibold uppercase tracking-wide">Cost Distribution</span>
          <span className="font-bold text-gray-600 dark:text-gray-300">Total ₹{total.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
          {segments.map((seg, i) => (
            <div key={i} className="h-full transition-all duration-300"
              style={{ width: `${(seg.value/total)*100}%`, backgroundColor: seg.color, opacity: hovered===null||hovered===i ? 1 : 0.35 }} />
          ))}
        </div>
      </div>
    </div>
  );
}
