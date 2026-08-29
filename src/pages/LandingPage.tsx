import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { 
  Menu, X, ArrowRight, ShieldCheck, MapPin, BarChart3, 
  Globe, Sparkles, TrendingUp, CheckCircle, ArrowUpRight, 
  DollarSign, Award, FileText
} from "lucide-react";
import { LanguageSelector } from "../components/common/LanguageSelector";
import { ThemeToggleButton } from "../components/common/ThemeToggleButton";

export default function LandingPage() {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login state
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Smooth scroll handler
  const handleScroll = (id: string) => {
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Language pill helper
  const languagesList = [
    { code: "en", name: "English", nativeName: "English" },
    { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
    { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
    { code: "mr", name: "Marathi", nativeName: "मराठी" },
    { code: "bn", name: "Bengali", nativeName: "বাংলা" },
    { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
    { code: "te", name: "Telugu", nativeName: "తెలుగు" },
    { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
    { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
    { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ" }
  ];

  return (
    <div className="min-h-screen bg-[#fcfbfa] text-gray-900 font-sans antialiased transition-colors duration-300 dark:bg-gray-950 dark:text-gray-100 selection:bg-emerald-500 selection:text-white">
      
      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/95 backdrop-blur-md dark:border-gray-800/80 dark:bg-gray-950/95 transition-all">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2.5">
                <div className="flex items-center justify-center p-1 rounded-xl bg-white shadow-sm border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
                  <img
                    src="/images/logo/vyapar-mitra-logo.png"
                    alt="VyaparMitra Logo"
                    className="w-8 h-8 object-contain rounded-md"
                  />
                </div>
                <span className="text-lg font-extrabold text-gray-900 dark:text-white tracking-tight">
                  Vyapar<span className="text-emerald-600 dark:text-emerald-400 font-semibold">Mitra</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              {[
                { key: "home", label: t("landing.navHome"), id: "hero" },
                { key: "features", label: t("landing.navFeatures"), id: "features" },
                { key: "how-it-works", label: t("landing.navHowItWorks"), id: "how-it-works" },
                { key: "about", label: t("landing.navAbout"), id: "about" },
                { key: "benefits", label: t("landing.navBenefits"), id: "benefits" }
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleScroll(item.id)}
                  className="text-sm font-semibold text-gray-600 hover:text-[#0A4222] dark:text-gray-400 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <LanguageSelector variant="header" />
              <ThemeToggleButton />

              {isLoggedIn ? (
                <>
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center justify-center rounded-xl bg-[#0A4222] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-green-900 transition dark:bg-emerald-600 dark:hover:bg-emerald-700"
                  >
                    {t("landing.dashboard")}
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/signin"
                    className="px-3.5 py-2.5 text-xs font-bold text-gray-700 hover:text-[#0A4222] dark:text-gray-300 dark:hover:text-white transition-colors"
                  >
                    {t("landing.login")}
                  </Link>
                  <Link
                    to="/signup"
                    className="inline-flex items-center justify-center rounded-xl bg-[#0A4222] px-4.5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-green-900 transition dark:bg-emerald-600 dark:hover:bg-emerald-700"
                  >
                    {t("landing.getStarted")}
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggleButton />
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white transition"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state. */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 dark:border-gray-900 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md px-4 py-4 space-y-3">
            <div className="space-y-1">
              {[
                { key: "home", label: t("landing.navHome"), id: "hero" },
                { key: "features", label: t("landing.navFeatures"), id: "features" },
                { key: "how-it-works", label: t("landing.navHowItWorks"), id: "how-it-works" },
                { key: "about", label: t("landing.navAbout"), id: "about" },
                { key: "benefits", label: t("landing.navBenefits"), id: "benefits" }
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleScroll(item.id)}
                  className="block w-full text-left px-3 py-2 text-base font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="border-t border-gray-100 dark:border-gray-900 pt-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Select Language</span>
              <LanguageSelector variant="auth" />
            </div>

            <div className="pt-2 flex flex-col gap-2">
              {isLoggedIn ? (
                <Link
                  to="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full flex justify-center py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#0A4222] hover:bg-green-900 transition dark:bg-emerald-600 dark:hover:bg-emerald-700"
                >
                  {t("landing.dashboard")}
                </Link>
              ) : (
                <>
                  <Link
                    to="/signin"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full flex justify-center py-3 px-4 border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition"
                  >
                    {t("landing.login")}
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full flex justify-center py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#0A4222] hover:bg-green-900 transition dark:bg-emerald-600 dark:hover:bg-emerald-700"
                  >
                    {t("landing.getStarted")}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO SECTION ── */}
      <section id="hero" className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden bg-gradient-to-b from-[#f6f3eb]/45 to-transparent dark:from-[#0A4222]/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Info Column */}
            <div className="lg:col-span-7 space-y-6 lg:pr-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/30">
                <Sparkles className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 tracking-wide uppercase">
                  Empowering Rural Entrepreneurs
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-gray-900 dark:text-white leading-[1.12] tracking-tight">
                {t("landing.heroMainHeading")}
              </h1>

              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-medium max-w-2xl">
                {t("landing.heroSubText")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  to={isLoggedIn ? "/dashboard" : "/signup"}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#0A4222] px-6 py-4 text-sm font-bold text-white shadow-lg hover:bg-green-900 transition-all hover:-translate-y-0.5 dark:bg-emerald-600 dark:hover:bg-emerald-700"
                >
                  {t("landing.getStarted")}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <button
                  onClick={() => handleScroll("features")}
                  className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-4 text-sm font-bold text-gray-700 ring-1 ring-inset ring-gray-200 shadow-sm hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-300 dark:ring-gray-800 dark:hover:bg-gray-800 transition-all"
                >
                  {t("landing.exploreFeatures")}
                </button>
              </div>
            </div>

            {/* Right Visual Graphic Column */}
            <div className="lg:col-span-5 relative w-full flex justify-center items-center">
              <div className="relative w-full max-w-[420px] aspect-square rounded-[2.5rem] bg-gradient-to-tr from-emerald-500/10 to-[#0A4222]/5 dark:from-emerald-500/20 dark:to-transparent p-6 border border-emerald-500/10 shadow-2xl flex items-center justify-center">
                
                {/* Embedded CSS dashboard visualization card */}
                <div className="w-full bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-2xl p-5 space-y-5 relative overflow-hidden">
                  
                  {/* Decorative glowing orb */}
                  <div className="absolute top-0 right-0 h-32 w-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                  {/* Header info */}
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Business Feasibility</div>
                        <div className="text-sm font-extrabold text-gray-900 dark:text-white">Dairy & Livestock Unit</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 text-[10px] font-bold">
                      92% Viable
                    </span>
                  </div>

                  {/* Micro dashboard layout */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100/50 dark:border-gray-800/50">
                      <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Initial Capital</div>
                      <div className="text-base font-extrabold text-[#0A4222] dark:text-emerald-400 mt-0.5">₹25,000</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100/50 dark:border-gray-800/50">
                      <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Est. Monthly Profit</div>
                      <div className="text-base font-extrabold text-gray-900 dark:text-white mt-0.5">₹18,400</div>
                    </div>
                  </div>

                  {/* Local market gauge */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1"><MapPin className="h-3 w-3" /> Local Market Demand</span>
                      <span className="text-emerald-600 dark:text-emerald-400">Very High</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                      <div className="w-[85%] h-full rounded-full bg-gradient-to-r from-emerald-500 to-[#0A4222] dark:from-emerald-400 dark:to-emerald-600" />
                    </div>
                  </div>

                  {/* AI assistant prompt tooltip preview */}
                  <div className="p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-500/10 flex gap-2">
                    <Sparkles className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] font-medium text-gray-600 dark:text-gray-300 leading-normal">
                      &quot;VyaparMitra AI: Apply for the Term Loan Scheme to fund your cattle storage shed with an 8.0% interest rate.&quot;
                    </p>
                  </div>
                </div>

                {/* Floating tags */}
                <div className="absolute -bottom-4 -left-4 p-3 rounded-2xl bg-white dark:bg-gray-900 shadow-xl border border-gray-100 dark:border-gray-800 flex items-center gap-2 hover:scale-105 transition duration-300">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  <span className="text-[11px] font-bold">100% Verified Schemes</span>
                </div>

                <div className="absolute -top-4 -right-4 p-3 rounded-2xl bg-white dark:bg-gray-900 shadow-xl border border-gray-100 dark:border-gray-800 flex items-center gap-2 hover:scale-105 transition duration-300">
                  <Globe className="h-5 w-5 text-emerald-500" />
                  <span className="text-[11px] font-bold">10+ Regional Languages</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── TRUST / VALUE STRIP ── */}
      <section className="py-10 border-y border-gray-200/80 bg-gray-50/50 dark:border-gray-900 dark:bg-gray-950/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <h2 className="text-sm font-extrabold uppercase tracking-widest text-[#0A4222] dark:text-emerald-400 shrink-0 text-center lg:text-left">
              {t("landing.stripHeading")}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-5xl">
              {[
                { icon: Sparkles, label: t("landing.cardAiGuidance") },
                { icon: MapPin, label: t("landing.cardLocalInsights") },
                { icon: BarChart3, label: t("landing.cardFinancialPlanning") },
                { icon: Globe, label: t("landing.cardLanguageSupport") }
              ].map((card, idx) => (
                <div key={idx} className="flex items-center gap-2.5 justify-center lg:justify-start">
                  <div className="p-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm shrink-0">
                    <card.icon className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200 tracking-tight">{card.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT IS VYAPARMITRA? ── */}
      <section id="about" className="py-20 lg:py-28 bg-[#fcfbfa] dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Visual Column */}
            <div className="lg:col-span-5 order-2 lg:order-1 flex justify-center">
              <div className="relative w-full max-w-[380px] aspect-video rounded-3xl bg-emerald-50 dark:bg-gray-900/60 p-4 border border-gray-100 dark:border-gray-800 shadow-lg flex items-center justify-center">
                
                {/* Visual grid illustration for local demand analysis */}
                <div className="grid grid-cols-3 gap-2.5 w-full">
                  {[
                    { label: "Opportunities", score: "High", color: "bg-emerald-500" },
                    { label: "Competition", score: "Moderate", color: "bg-amber-500" },
                    { label: "Margins", score: "Viable", color: "bg-emerald-500" },
                    { label: "Village Index", score: "Grade A", color: "bg-emerald-500" },
                    { label: "Risk Factor", score: "Low-Risk", color: "bg-emerald-500" },
                    { label: "Schemes", score: "Routed", color: "bg-emerald-500" }
                  ].map((grid, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm text-center space-y-1">
                      <div className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">{grid.label}</div>
                      <div className="text-xs font-bold text-gray-900 dark:text-white">{grid.score}</div>
                      <div className="flex justify-center pt-1">
                        <div className={`h-1.5 w-5 rounded-full ${grid.color}`} />
                      </div>
                    </div>
                  ))}
                </div>
                
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
              <div className="h-1.5 w-16 bg-emerald-600 dark:bg-emerald-400 rounded-full" />
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                {t("landing.aboutHeading")}
              </h2>
              <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                {t("landing.aboutDesc")}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {[
                  "Personalized Business Roadmap",
                  "Auto-Routed Government Schemes",
                  "LGD-Directory Village Integration",
                  "Instant EMI & Return Forecasts"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── KEY FEATURES ── */}
      <section id="features" className="py-20 lg:py-28 border-t border-gray-200/80 bg-gray-50/30 dark:border-gray-900 dark:bg-gray-950/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
              Comprehensive Platform Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {t("landing.featuresHeading")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Sparkles,
                title: t("landing.cardAdvisorTitle"),
                desc: t("landing.cardAdvisorDesc")
              },
              {
                icon: MapPin,
                title: t("landing.cardInsightsTitle"),
                desc: t("landing.cardInsightsDesc")
              },
              {
                icon: BarChart3,
                title: t("landing.cardFinancialTitle"),
                desc: t("landing.cardFinancialDesc")
              },
              {
                icon: DollarSign,
                title: t("landing.cardAnalysisTitle"),
                desc: t("landing.cardAnalysisDesc")
              },
              {
                icon: Award,
                title: t("landing.cardSchemeTitle"),
                desc: t("landing.cardSchemeDesc")
              },
              {
                icon: TrendingUp,
                title: t("landing.cardGrowthTitle"),
                desc: t("landing.cardGrowthDesc")
              },
              {
                icon: Globe,
                title: t("landing.cardLanguageTitle"),
                desc: t("landing.cardLanguageDesc")
              },
              {
                icon: FileText,
                title: t("landing.cardPlanTitle"),
                desc: t("landing.cardPlanDesc")
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-150 dark:border-gray-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-300 flex flex-col space-y-4"
              >
                <div className="p-3 w-fit rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-extrabold text-gray-900 dark:text-white tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-20 lg:py-28 bg-[#fcfbfa] dark:bg-gray-950 border-t border-gray-200/80 dark:border-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-20">
            <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
              Onboarding Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {t("landing.howItWorksHeading")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-10 left-[12%] right-[12%] h-0.5 border-t border-dashed border-gray-200 dark:border-gray-800 z-0" />

            {[
              {
                step: "01",
                title: t("landing.step1Title"),
                desc: t("landing.step1Desc")
              },
              {
                step: "02",
                title: t("landing.step2Title"),
                desc: t("landing.step2Desc")
              },
              {
                step: "03",
                title: t("landing.step3Title"),
                desc: t("landing.step3Desc")
              },
              {
                step: "04",
                title: t("landing.step4Title"),
                desc: t("landing.step4Desc")
              }
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center md:items-start text-center md:text-left space-y-4 relative z-10">
                <div className="h-14 w-14 rounded-2xl bg-white border-2 border-emerald-500 text-emerald-700 dark:bg-gray-900 dark:text-emerald-400 font-extrabold flex items-center justify-center text-lg shadow-md hover:scale-110 transition duration-300">
                  {step.step}
                </div>
                <h3 className="text-base font-extrabold text-gray-900 dark:text-white leading-snug tracking-tight">
                  {step.title.replace(`${step.step} – `, "")}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HYPER-LOCAL INTELLIGENCE SECTION ── */}
      <section className="py-20 lg:py-28 border-t border-gray-200/80 bg-gray-50/30 dark:border-gray-900 dark:bg-gray-950/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Content Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/30">
                <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 tracking-wide uppercase">
                  Location-Specific Logic
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                {t("landing.hyperLocalHeading")}
              </h2>
              <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                {t("landing.hyperLocalDesc")}
              </p>
              <div className="space-y-3.5">
                {[
                  "Consumer Base estimation within 5-10km radius",
                  "Identification of active local competitors and competitor density",
                  "Identification of local supply bottlenecks and risks (e.g. power, monsoons)",
                  "Pricing recommendations aligned with village purchasing power"
                ].map((point, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start">
                    <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-700 dark:text-gray-300 font-bold">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Column */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-[440px] aspect-video rounded-3xl bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 shadow-xl overflow-hidden p-6 space-y-4">
                
                {/* Visual map/local business ecosystem container */}
                <div className="h-full w-full flex flex-col justify-between">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-gray-500 dark:text-gray-400 uppercase tracking-wider text-[10px]">Active Ecosystem</span>
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Globe className="h-3.5 w-3.5" /> GPS Active
                    </span>
                  </div>
                  
                  {/* Dynamic map graphic */}
                  <div className="flex-1 relative my-3 rounded-2xl bg-gray-50 dark:bg-gray-950/60 border border-gray-100 dark:border-gray-800 flex items-center justify-center overflow-hidden">
                    
                    {/* Ring graphics */}
                    <div className="absolute h-32 w-32 rounded-full border border-dashed border-emerald-500/20 animate-pulse" />
                    <div className="absolute h-48 w-48 rounded-full border border-dashed border-emerald-500/10" />

                    {/* Nodes representing local businesses */}
                    <div className="absolute top-8 left-12 p-1.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="text-[9px] font-bold text-gray-500">Retailer</span>
                    </div>

                    <div className="absolute bottom-6 right-16 p-1.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="text-[9px] font-bold text-gray-500">Sweet Shop</span>
                    </div>

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-2xl bg-emerald-600 text-white shadow-lg flex flex-col items-center gap-0.5">
                      <MapPin className="h-4 w-4" />
                      <span className="text-[8px] font-extrabold uppercase">Your Project</span>
                    </div>
                  </div>

                  <div className="flex gap-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest justify-center">
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> High Opportunity</span>
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> Moderate Competition</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── FINANCIAL ASSISTANCE SECTION ── */}
      <section className="py-20 lg:py-28 bg-[#fcfbfa] dark:bg-gray-950 border-t border-gray-200/80 dark:border-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual Column */}
            <div className="lg:col-span-6 order-2 lg:order-1 flex justify-center">
              <div className="relative w-full max-w-[420px] bg-white dark:bg-gray-900 rounded-3xl border border-gray-155 dark:border-gray-800 shadow-xl p-5 space-y-4">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Financial Forecast Snapshot</div>
                <div className="space-y-2">
                  {[
                    { label: t("landing.itemInvestment"), value: "₹2,50,000" },
                    { label: t("landing.itemExpenses"), value: "₹8,500 / mo" },
                    { label: t("landing.itemRevenue"), value: "₹26,900 / mo" },
                    { label: t("landing.itemProfitability"), value: "7.36% ROI" },
                    { label: t("landing.itemBreakEven"), value: "4 Months" },
                    { label: t("landing.itemGuidance"), value: "NABARD Subsidy Available" }
                  ].map((finance, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2.5 px-3.5 rounded-xl bg-gray-50 dark:bg-gray-850 border border-gray-100/50 dark:border-gray-800/50 text-xs font-semibold text-gray-800 dark:text-gray-200">
                      <span>{finance.label}</span>
                      <span className="font-extrabold text-[#0A4222] dark:text-emerald-400">{finance.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/30">
                <BarChart3 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 tracking-wide uppercase">
                  No Guesswork Required
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                {t("landing.financeHeading")}
              </h2>
              <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                Estimate setup cost, project feasibility, and break-even points instantly. Avoid costly mistakes by verifying business capital viability under official NABARD or government loan schemes prior to launching.
              </p>
              
              <div className="flex gap-4">
                <Link
                  to={isLoggedIn ? "/dashboard" : "/signup"}
                  className="inline-flex items-center justify-center gap-1 px-5 py-3 rounded-xl bg-[#0A4222] text-xs font-bold text-white shadow-md hover:bg-green-900 transition dark:bg-emerald-600 dark:hover:bg-emerald-700"
                >
                  Open Calculator
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── REGIONAL LANGUAGE SECTION ── */}
      <section className="py-20 lg:py-28 border-t border-gray-200/80 bg-[#f6f5f2] dark:border-gray-900 dark:bg-gray-950/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-14">
            <span className="text-xs font-extrabold text-[#0A4222] dark:text-emerald-400 uppercase tracking-widest">
              Digital Inclusion
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {t("landing.langHeading")}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold">
              {t("landing.langSubText")}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3.5 max-w-3xl mx-auto">
            {languagesList.map((lang) => {
              const isActive = i18n.language && i18n.language.startsWith(lang.code);
              return (
                <button
                  key={lang.code}
                  onClick={() => {
                    i18n.changeLanguage(lang.code);
                    localStorage.setItem("vyaparmitra_language", lang.code);
                    localStorage.setItem("i18nextLng", lang.code);
                  }}
                  className={`px-5 py-3 rounded-full text-sm font-bold border transition shadow-sm hover:scale-105 ${
                    isActive
                      ? "bg-[#0A4222] border-[#0A4222] text-white dark:bg-emerald-600 dark:border-emerald-600"
                      : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
                  }`}
                >
                  <div className="flex flex-col text-center">
                    <span className="text-sm font-bold">{lang.nativeName}</span>
                    <span className="text-[9px] opacity-75">{lang.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── WHY VYAPARMITRA? ── */}
      <section id="benefits" className="py-20 lg:py-28 border-t border-gray-200/80 bg-white dark:border-gray-900 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Header Column */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                Compare The Advantage
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                {t("landing.whyHeading")}
              </h2>
              <p className="text-base text-gray-500 dark:text-gray-400 font-medium max-w-md">
                A custom-built advisor focused strictly on rural and hyper-local viability, compared to generic standard startup planning models.
              </p>
            </div>

            {/* List Column */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  t("landing.benefit1"),
                  t("landing.benefit2"),
                  t("landing.benefit3"),
                  t("landing.benefit4"),
                  t("landing.benefit5"),
                  t("landing.benefit6"),
                  t("landing.benefit7"),
                  t("landing.benefit8")
                ].map((benefit, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-150 dark:border-gray-800 flex items-center gap-3 shadow-xs hover:border-emerald-500/30 dark:hover:border-emerald-500/30 transition duration-300"
                  >
                    <div className="p-1 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-bold text-gray-800 dark:text-gray-200 leading-snug">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── CALL TO ACTION ── */}
      <section className="py-20 bg-gradient-to-tr from-[#0A4222] to-[#042813] text-white relative overflow-hidden dark:from-emerald-950 dark:to-gray-950">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent pointer-events-none" />
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">
            {t("landing.ctaHeading")}
          </h2>
          <p className="text-base sm:text-lg text-emerald-100 font-medium max-w-2xl mx-auto leading-relaxed">
            {t("landing.ctaSubText")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              to={isLoggedIn ? "/dashboard" : "/signup"}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 text-sm font-bold text-[#0A4222] shadow-xl hover:bg-gray-50 transition-all hover:-translate-y-0.5"
            >
              {t("landing.getStarted")}
              <ArrowRight className="h-4 w-4" />
            </Link>
            {!isLoggedIn && (
              <Link
                to="/signin"
                className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-6 py-4 text-sm font-bold text-white shadow-sm hover:bg-white/20 transition-all"
              >
                {t("landing.login")}
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-gray-200/80 bg-white pt-16 pb-10 dark:border-gray-900 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-10 pb-12 border-b border-gray-100 dark:border-gray-900">
            
            {/* Brand description */}
            <div className="md:col-span-2 space-y-4">
              <Link to="/" className="flex items-center gap-2.5">
                <div className="flex items-center justify-center p-1 rounded-xl bg-white shadow-xs border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
                  <img
                    src="/images/logo/vyapar-mitra-logo.png"
                    alt="VyaparMitra Logo"
                    className="w-8 h-8 object-contain rounded-md"
                  />
                </div>
                <span className="text-base font-extrabold text-gray-900 dark:text-white">
                  Vyapar<span className="text-emerald-600 dark:text-emerald-400">Mitra</span>
                </span>
              </Link>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">
                {t("landing.footerDesc")}
              </p>
            </div>

            {/* Product */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t("landing.footerProduct")}</h3>
              <ul className="space-y-2">
                {["Features", "How It Works", "Benefits"].map((item, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => handleScroll(item.toLowerCase().replace(" ", "-"))}
                      className="text-xs font-semibold text-gray-600 hover:text-[#0A4222] dark:text-gray-400 dark:hover:text-white transition"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t("landing.footerCompany")}</h3>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => handleScroll("about")} className="text-xs font-semibold text-gray-600 hover:text-[#0A4222] dark:text-gray-400 dark:hover:text-white transition">
                    About
                  </button>
                </li>
                <li><a href="#" className="text-xs font-semibold text-gray-600 hover:text-[#0A4222] dark:text-gray-400 dark:hover:text-white transition">Contact</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t("landing.footerResources")}</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-xs font-semibold text-gray-600 hover:text-[#0A4222] dark:text-gray-400 dark:hover:text-white transition">{t("landing.footerHelp")}</a></li>
                <li><a href="#" className="text-xs font-semibold text-gray-600 hover:text-[#0A4222] dark:text-gray-400 dark:hover:text-white transition">{t("landing.footerFaqs")}</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t("landing.footerLegal")}</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-xs font-semibold text-gray-600 hover:text-[#0A4222] dark:text-gray-400 dark:hover:text-white transition">{t("landing.footerPrivacyPolicy")}</a></li>
                <li><a href="#" className="text-xs font-semibold text-gray-600 hover:text-[#0A4222] dark:text-gray-400 dark:hover:text-white transition">{t("landing.footerTermsAndConditions")}</a></li>
              </ul>
            </div>

          </div>

          {/* Copyright and Languages */}
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 gap-4">
            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 tracking-wide">
              {t("landing.footerCopyright")}
            </span>
            <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              {languagesList.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => i18n.changeLanguage(lang.code)}
                  className="hover:text-emerald-600 transition"
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
