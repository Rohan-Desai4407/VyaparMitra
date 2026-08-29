import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { supportedLanguages, setAppLanguage } from "../../i18n";
import { Dropdown } from "../ui/dropdown/Dropdown";

export const LanguageSelector: React.FC<{ variant?: "header" | "auth" }> = ({ variant = "header" }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLangCode = i18n.language ? i18n.language.split("-")[0] : "en";
  const currentLang = supportedLanguages.find((l) => l.code === currentLangCode) || supportedLanguages[0];

  const handleLanguageChange = (code: string) => {
    setAppLanguage(code);
    setIsOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {variant === "auth" ? (
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Select Language"
          className="flex items-center gap-2 bg-white dark:bg-gray-900 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm"
        >
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
              d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
            />
          </svg>
          <span>{currentLang.nativeName} ({currentLang.name})</span>
          <span className={`text-[10px] text-gray-400 dark:text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}>▼</span>
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Select Language"
          className="relative flex items-center justify-center gap-1.5 px-3 text-gray-700 transition-colors bg-white border border-gray-200 rounded-full hover:bg-gray-100 hover:text-gray-900 h-11 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
        >
          <svg
            className="w-5 h-5 text-gray-500 dark:text-gray-400 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
              d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
            />
          </svg>
          <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline-block">
            {currentLang.code}
          </span>
          <svg
            className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}

      <Dropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="absolute right-0 mt-2 flex w-56 flex-col rounded-2xl border border-gray-200 bg-white p-2 shadow-theme-lg dark:border-gray-800 dark:bg-gray-900 z-50 max-h-80 overflow-y-auto custom-scrollbar"
      >
        <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 text-[11px] font-bold uppercase tracking-wider text-gray-400">
          Select Language / भाषा चुनें
        </div>
        <div className="py-1 space-y-0.5">
          {supportedLanguages.map((lang) => {
            const isSelected = currentLangCode === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`flex w-full items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  isSelected
                    ? "bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
              >
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold leading-tight">{lang.nativeName}</span>
                  <span className="text-[10px] text-gray-400">{lang.name}</span>
                </div>
                {isSelected && (
                  <span className="text-brand-600 dark:text-brand-400 font-bold">✓</span>
                )}
              </button>
            );
          })}
        </div>
      </Dropdown>
    </div>
  );
};
