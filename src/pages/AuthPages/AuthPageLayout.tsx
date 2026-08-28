import React from "react";
import GridShape from "../../components/common/GridShape";
import { Link } from "react-router";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        {children}
        <div className="items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid">
          <div className="relative flex items-center justify-center z-1">
            {/* <!-- ===== Common Grid Shape Start ===== --> */}
            <GridShape />
            <div className="flex flex-col items-center max-w-xs text-center">
              <Link to="/" className="flex flex-col items-center mb-4">
                <img
                  src="/images/logo/vyapar-mitra-icon.png"
                  alt="VyaparMitra Logo"
                  className="w-20 h-20 object-contain mx-auto drop-shadow-lg bg-white/10 rounded-full p-1 mb-2"
                />
              </Link>
              <h2 className="text-2xl font-bold text-white mb-1">
                Vyapar<span className="text-emerald-400">Mitra</span>
              </h2>
              <p className="text-xs font-medium text-emerald-300 tracking-wider uppercase mb-2">
                Plan • Grow • Prosper
              </p>
              <p className="text-center text-xs text-gray-300 dark:text-white/60">
                AI-Powered Hyper-Local Business Feasibility & Scheme Router
              </p>
            </div>
          </div>
        </div>
        <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}
