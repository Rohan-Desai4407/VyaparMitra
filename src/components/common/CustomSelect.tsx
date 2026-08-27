import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
  disabled = false,
  required = false,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = options.find((o) => o.value === value);
  const filtered = search
    ? options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open && searchRef.current) {
      searchRef.current.focus();
    }
  }, [open]);

  const handleSelect = (optValue: string) => {
    onChange(optValue);
    setOpen(false);
    setSearch("");
  };

  return (
    <div ref={ref} className="relative w-full">
      {/* Hidden native select for form validation */}
      {required && (
        <select
          required
          value={value}
          onChange={() => {}}
          tabIndex={-1}
          aria-hidden="true"
          className="absolute inset-0 opacity-0 w-full h-full pointer-events-none"
        >
          <option value="" />
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      )}

      {/* Trigger button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        className={`
          group relative w-full flex items-center justify-between gap-2
          rounded-xl border px-4 py-2.5 text-sm text-left
          transition-all duration-200 outline-none
          ${disabled
            ? "cursor-not-allowed opacity-50 bg-gray-100 border-gray-200 text-gray-400 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-500"
            : open
              ? "border-brand-500 ring-2 ring-brand-500/20 bg-white dark:bg-gray-800 shadow-md"
              : "border-gray-200 bg-white hover:border-brand-400 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:hover:border-brand-500"
          }
        `}
      >
        <span className={selected ? "text-gray-900 dark:text-white font-medium" : "text-gray-400 dark:text-gray-500"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDownIcon
          className={`h-4 w-4 flex-shrink-0 transition-transform duration-200
            ${open ? "rotate-180 text-brand-500" : "text-gray-400 dark:text-gray-500"}
          `}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="
          absolute z-50 mt-1.5 w-full overflow-hidden
          rounded-xl border border-gray-200 bg-white shadow-xl
          dark:border-gray-700 dark:bg-gray-800
          animate-in fade-in-0 zoom-in-95 duration-100
        ">
          {/* Search box (only show if > 8 options) */}
          {options.length > 8 && (
            <div className="p-2 border-b border-gray-100 dark:border-gray-700">
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="
                  w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm
                  text-gray-900 placeholder-gray-400 outline-none
                  focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20
                  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500
                "
              />
            </div>
          )}

          {/* Options list */}
          <ul className="dropdown-scroll max-h-52 overflow-y-auto py-1">
            {/* Placeholder option */}
            <li
              onClick={() => handleSelect("")}
              className={`
                flex items-center px-4 py-2.5 text-sm cursor-pointer transition-colors
                ${!value
                  ? "bg-brand-50 text-brand-700 font-semibold dark:bg-brand-900/30 dark:text-brand-300"
                  : "text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                }
              `}
            >
              {placeholder}
            </li>

            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-sm text-center text-gray-400 dark:text-gray-500">
                No results found
              </li>
            ) : (
              filtered.map((opt) => (
                <li
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={`
                    flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer transition-colors
                    ${opt.value === value
                      ? "bg-brand-50 text-brand-700 font-semibold dark:bg-brand-900/30 dark:text-brand-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    }
                  `}
                >
                  <span>{opt.label}</span>
                  {opt.value === value && (
                    <svg className="h-4 w-4 text-brand-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
