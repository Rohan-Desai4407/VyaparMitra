import React from 'react';
import { useTranslation } from 'react-i18next';
import PageMeta from '../components/common/PageMeta';
import { 
  Building2, 
  LineChart, 
  FileText, 
  Calculator, 
  Lightbulb, 
  ShieldCheck, 
  Globe, 
  Target,
  ArrowRight
} from 'lucide-react';

export default function About() {
  const { t } = useTranslation();

  const features = [
    {
      title: "Business Assessment",
      description: "Evaluate your business idea's viability with our smart evaluation engine that analyzes your capital, location, and industry.",
      icon: <Building2 className="w-6 h-6 text-brand-500" />,
      color: "bg-brand-50 border-brand-100 dark:bg-brand-900/20 dark:border-brand-800"
    },
    {
      title: "Market Analysis",
      description: "Get real-time insights into local consumer demographics, competitor density, and pricing strategies in your chosen area.",
      icon: <LineChart className="w-6 h-6 text-blue-500" />,
      color: "bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800"
    },
    {
      title: "Scheme Router",
      description: "Our proprietary algorithm matches your profile with 100+ state and central government subsidy schemes to maximize your funding.",
      icon: <Target className="w-6 h-6 text-emerald-500" />,
      color: "bg-emerald-50 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800"
    },
    {
      title: "Financial Planner & Calculator",
      description: "Plan your expenses, calculate EMIs, generate repayment schedules, and estimate working capital requirements instantly.",
      icon: <Calculator className="w-6 h-6 text-purple-500" />,
      color: "bg-purple-50 border-purple-100 dark:bg-purple-900/20 dark:border-purple-800"
    },
    {
      title: "AI Business Advisor",
      description: "Chat with our intelligent AI advisor for personalized SWOT analysis, risk mitigation strategies, and growth planning.",
      icon: <Lightbulb className="w-6 h-6 text-amber-500" />,
      color: "bg-amber-50 border-amber-100 dark:bg-amber-900/20 dark:border-amber-800"
    },
    {
      title: "Feasibility Report",
      description: "Generate bank-ready, comprehensive feasibility reports for loan approvals and DIC submissions with a single click.",
      icon: <FileText className="w-6 h-6 text-rose-500" />,
      color: "bg-rose-50 border-rose-100 dark:bg-rose-900/20 dark:border-rose-800"
    }
  ];

  return (
    <>
      <PageMeta
        title="About Us | VyaparMitra"
        description="Learn more about VyaparMitra and our mission to empower entrepreneurs."
      />

      <div className="mx-auto max-w-6xl space-y-12 pb-10 stagger-slide-up">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white px-8 py-16 sm:px-16 sm:py-24 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-[0.03] dark:opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-brand-50/50 to-transparent dark:from-brand-950/20"></div>
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl dark:text-white">
              Empowering India's Next Generation of <span className="text-brand-600 dark:text-brand-400">Entrepreneurs</span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed dark:text-gray-300">
              VyaparMitra is a comprehensive AI-driven platform designed to guide aspiring business owners through every step of their entrepreneurial journey from ideation and market research to financial planning and securing government subsidies.
            </p>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900 transition-all hover:shadow-md">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400">
                <Globe className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              To democratize access to business intelligence, financial tools, and government resources, ensuring that anyone with a viable idea has the roadmap and support needed to turn it into a successful, sustainable enterprise.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900 transition-all hover:shadow-md">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Vision</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              To become the standard digital companion for MSMEs across India, fostering a thriving ecosystem of innovation, economic growth, and self-reliance at the grassroots level.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Everything You Need to Succeed</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Our platform offers a complete suite of professional tools designed to de-risk your business launch and optimize your growth strategy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="group relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-brand-300 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-brand-700">
                <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl border ${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
