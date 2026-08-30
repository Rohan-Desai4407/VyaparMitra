import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Dropdown } from '../../components/ui/dropdown/Dropdown';
import { useVyapar } from '../../context/VyaparContext';
import { projectExpenseApiService, ExpenseItem } from '../../services/projectExpenseApiService';
import { Factory, Wallet, ClipboardList, ChevronDown, CheckCircle2, Circle, Trash2, Plus, ChevronUp } from 'lucide-react';

export default function ProjectExpense({ overrideInput }: { overrideInput?: any } = {}) {
  const context = useVyapar();
  const input = overrideInput || context.input;
  const { updateProjectCost } = context;
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [scale, setScale] = useState('MEDIUM');
  const [error, setError] = useState<string | null>(null);
  const [templateExists, setTemplateExists] = useState(true);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    loadData();
  }, [input.categoryId, scale]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      setTemplateExists(true);
      const catId = input.categoryId || 'mock-1'; // Fallback to mock-1 so it has something
      const locationStr = [input.village, input.block, input.district, input.state].filter(Boolean).join(', ');
      const templates = await projectExpenseApiService.getTemplates(catId, scale, locationStr, input.marginCapital, input.category);
      
      if (templates?.data?.items && templates.data.items.length > 0) {
        const items = templates.data.items.map((t: any) => ({
          category: t.category,
          itemName: t.itemName,
          description: t.description,
          quantity: t.quantity || 1,
          unit: t.unit || 'unit',
          unitPrice: t.basePrice || 0,
          amount: (t.quantity || 1) * (t.basePrice || 0),
          pricingSource: 'REGIONAL_BENCHMARK',
          isOptional: !t.isRequired
        }));
        setExpenses(items);
        recalculate(items);
      } else {
        setTemplateExists(false);
        setExpenses([]);
      }
    } catch (err: any) {
      if (err.message && err.message.includes('404')) {
          setTemplateExists(false);
      } else {
          setError(err.message || 'Unable to load project cost data.');
      }
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  const recalculate = (items: ExpenseItem[]) => {
    const total = items.reduce((sum, item) => sum + item.amount, 0);
    updateProjectCost(total);
  };

  const handleAddCustom = (category: string) => {
    const newItem = {
      category,
      itemName: '',
      quantity: 1,
      unit: 'unit',
      unitPrice: 0,
      amount: 0,
      pricingSource: 'User Input',
      isOptional: true,
      isCustom: true
    };
    const newExp = [...expenses, newItem];
    setExpenses(newExp);
    recalculate(newExp);
  };

  const handleRemove = (index: number) => {
    const newExp = expenses.filter((_, i) => i !== index);
    setExpenses(newExp);
    recalculate(newExp);
  };

  const handleUpdate = (index: number, field: string, value: any) => {
    const newExp = [...expenses];
    newExp[index] = { ...newExp[index], [field]: value };
    if (field === 'quantity' || field === 'unitPrice') {
      newExp[index].amount = Number(newExp[index].quantity) * Number(newExp[index].unitPrice);
    }
    setExpenses(newExp);
    recalculate(newExp);
  };

  const totalCost = useMemo(() => expenses.reduce((s, i) => s + i.amount, 0), [expenses]);

  if (loading) return <div className="p-8">Loading templates...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 uppercase tracking-wide text-gray-900 dark:text-white">Project Expense & Cost Breakdown</h1>
      
      <div className="bg-white dark:bg-gray-800 dark:border-gray-700 p-4 rounded shadow mb-6 flex flex-col gap-2">
        <div className="flex gap-8">
            <div>
              <span className="text-gray-500 dark:text-gray-400 dark:text-gray-500 font-semibold">Business:</span> 
              <span className="font-bold text-gray-800 dark:text-gray-100 ml-2">{input.category || 'Not Selected'}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-gray-500 dark:text-gray-400 dark:text-gray-500 font-semibold">Scale:</span>
              <div className="relative" ref={dropdownRef}>
                <button type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center justify-between w-32 px-3 py-1.5 bg-white dark:bg-gray-800 dark:border-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 dark:bg-gray-700/50 focus:outline-none"
                >
                  <span className="capitalize">{scale.toLowerCase()}</span>
                  <svg className={`w-4 h-4 text-gray-500 dark:text-gray-400 dark:text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <Dropdown
                  isOpen={dropdownOpen}
                  onClose={() => setDropdownOpen(false)}
                  className="absolute left-0 mt-1 w-32 rounded-md bg-white dark:bg-gray-800 dark:border-gray-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 border border-gray-200 dark:border-gray-700"
                >
                  <div className="py-1">
                    {['SMALL', 'MEDIUM', 'LARGE'].map((option) => (
                      <button type="button"
                        key={option}
                        onClick={() => {
                          setScale(option);
                          setDropdownOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${scale === option ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 dark:bg-gray-700/50'}`}
                      >
                        <span className="capitalize">{option.toLowerCase()}</span>
                      </button>
                    ))}
                  </div>
                </Dropdown>
              </div>
            </div>
        </div>
        <div className="mt-2 text-sm">
            <span className="text-gray-500 dark:text-gray-400 dark:text-gray-500 font-semibold">Location: </span>
            <span className="text-gray-700 dark:text-gray-200">{input.village}, {input.block}, {input.district}, {input.state}</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded mb-6 flex justify-between items-center">
            <span>{error}</span>
            <button type="button" onClick={loadData} className="px-3 py-1 bg-red-100 rounded hover:bg-red-200">Retry</button>
        </div>
      )}

      {!templateExists && !error ? (
        <div className="bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 p-6 rounded-lg text-center shadow mb-6 border border-yellow-200 dark:border-yellow-800/50">
            <h2 className="text-lg font-bold mb-2">Cost template is being prepared for this business category.</h2>
            <p className="text-sm mb-4">We are gathering the official benchmarks for {input.category} ({scale}).</p>
            <button type="button" className="bg-yellow-600 dark:bg-yellow-700 text-white px-4 py-2 rounded shadow hover:bg-yellow-700 dark:hover:bg-yellow-600 transition">
                Use manual benchmark calculation
            </button>
        </div>
      ) : (
        <>
            <div className="border-b-2 border-dashed border-gray-300 dark:border-gray-600 mb-6"></div>

            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/50 p-6 rounded-lg text-center mb-6 shadow-sm">
                <h2 className="text-gray-600 dark:text-gray-300 text-lg font-bold tracking-wide">TOTAL FEASIBLE PROJECT COST</h2>
                <div className="text-4xl font-extrabold text-blue-800 dark:text-blue-400 mt-2 mb-2">
                &#8377;{totalCost.toLocaleString('en-IN')}
                </div>
                <div className="flex justify-center gap-4 text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 font-medium">
                    <span>Data: <span className="text-blue-700 dark:text-blue-400">Regional Benchmark</span></span>
                    <span>Last Updated: <span className="text-blue-700 dark:text-blue-400">30 Aug 2026</span></span>
                </div>
                <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                    * Benchmark estimates are indicative and should be verified with local suppliers before investment or loan submission.
                </div>
            </div>

            <div className="border-b-2 border-dashed border-gray-300 dark:border-gray-600 mb-6"></div>

            <div className="space-y-6">
                {['CAPEX', 'WORKING_CAPITAL', 'CONTINGENCY'].map(cat => {
                const catItems = expenses.filter(e => e.category === cat);
                if (catItems.length === 0) return null;
                
                const catConfig: Record<string, { icon: React.ReactNode; label: string; sublabel: string; gradient: string; iconBg: string; textColor: string; borderColor: string }> = {
                  CAPEX: {
                    icon: <Factory className="w-5 h-5" />,
                    label: 'Capital Expenditure',
                    sublabel: 'Machinery, Equipment & One-time Setup Costs',
                    gradient: 'from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30',
                    iconBg: 'bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400',
                    textColor: 'text-violet-700 dark:text-violet-400',
                    borderColor: 'border-violet-200 dark:border-violet-800/50',
                  },
                  WORKING_CAPITAL: {
                    icon: <Wallet className="w-5 h-5" />,
                    label: 'Working Capital',
                    sublabel: 'Rent, Electricity, Raw Materials & Operations',
                    gradient: 'from-blue-50 to-sky-50 dark:from-blue-950/30 dark:to-sky-950/30',
                    iconBg: 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400',
                    textColor: 'text-blue-700 dark:text-blue-400',
                    borderColor: 'border-blue-200 dark:border-blue-800/50',
                  },
                  CONTINGENCY: {
                    icon: <ClipboardList className="w-5 h-5" />,
                    label: 'Licenses & Contingency',
                    sublabel: 'Registrations, Marketing & Buffer Expenses',
                    gradient: 'from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30',
                    iconBg: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400',
                    textColor: 'text-emerald-700 dark:text-emerald-400',
                    borderColor: 'border-emerald-200 dark:border-emerald-800/50',
                  },
                };
                const cfg = catConfig[cat];
                const subtotal = catItems.reduce((s, i) => s + i.amount, 0);

                return (
                    <div key={cat} className={`rounded-xl border ${cfg.borderColor} overflow-hidden shadow-sm`}>
                    {/* Section Header */}
                    <div className={`bg-gradient-to-r ${cfg.gradient} px-5 py-4 flex items-center justify-between border-b ${cfg.borderColor}`}>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${cfg.iconBg}`}>
                            {cfg.icon}
                          </div>
                          <div>
                            <div className={`font-bold text-sm ${cfg.textColor}`}>{cfg.label}</div>
                            <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{cfg.sublabel}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wide font-semibold">Subtotal</div>
                          <div className={`text-lg font-extrabold ${cfg.textColor}`}>&#8377;{subtotal.toLocaleString('en-IN')}</div>
                        </div>
                    </div>
                    <div className="p-4">
                        <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="text-gray-500 dark:text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-700">
                            <th className="pb-2 w-2/5 font-semibold">Item Name</th>
                            <th className="pb-2 font-semibold">Qty</th>
                            <th className="pb-2 font-semibold">Unit Price</th>
                            <th className="pb-2 font-semibold text-right">Amount</th>
                            <th className="pb-2 w-8"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {catItems.map((item, idx) => {
                              const index = expenses.indexOf(item);
                              return (
                              <tr key={idx} className="border-b border-gray-50 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                  <td className="py-3">
                                      {item.isCustom ? (
                                          <input type="text" placeholder="Expense Name" className="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm text-gray-700 dark:text-gray-200 font-semibold bg-transparent dark:bg-gray-700"
                                              value={item.itemName}
                                              onChange={(e) => handleUpdate(index, 'itemName', e.target.value)}
                                          />
                                      ) : (
                                          <div>
                                            <div className="font-semibold text-gray-800 dark:text-gray-100">{item.itemName}</div>
                                            {item.description && <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{item.description}</div>}
                                          </div>
                                      )}
                                      <div className="mt-1">
                                        {item.isOptional ? (
                                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-[10px] font-semibold">
                                            <Circle className="w-2.5 h-2.5" /> Optional
                                          </span>
                                        ) : (
                                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-semibold">
                                            <CheckCircle2 className="w-2.5 h-2.5" /> Required
                                          </span>
                                        )}
                                      </div>
                                  </td>
                                  <td className="py-3">
                                  <div className="flex items-center gap-1">
                                  <input type="number" className="w-14 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-gray-700 dark:text-gray-200 bg-transparent dark:bg-gray-700"
                                      value={item.quantity}
                                      onChange={(e) => handleUpdate(index, 'quantity', e.target.value)}
                                  />
                                  <UnitSelector value={item.unit} onChange={(val) => handleUpdate(index, "unit", val)} />
                                  </div>
                                  </td>
                                  <td className="py-3">
                                  &#8377;<input type="number" className="w-24 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 ml-1 text-gray-700 dark:text-gray-200 bg-transparent dark:bg-gray-700"
                                      value={item.unitPrice}
                                      onChange={(e) => handleUpdate(index, 'unitPrice', e.target.value)}
                                  />
                                  </td>
                                  <td className="py-3 font-bold text-gray-700 dark:text-gray-200 text-right">
                                  &#8377;{item.amount.toLocaleString('en-IN')}
                                  </td>
                                  <td className="py-3 pl-2 text-right">
                                      {item.isCustom && (
                                          <button type="button" onClick={() => handleRemove(index)} className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors" title="Remove custom expense">
                                              <Trash2 className="w-4 h-4" />
                                          </button>
                                      )}
                                  </td>
                              </tr>
                              );
                            })}
                            <tr>
                                <td colSpan={5} className="pt-3 pb-1">
                                    <button type="button" 
                                        onClick={() => handleAddCustom(cat)}
                                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg border border-dashed border-blue-300 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        Add Custom Expense
                                    </button>
                                </td>
                            </tr>
                            <tr className="bg-gray-50/50 dark:bg-gray-700/30">
                                <td colSpan={3} className="py-3 font-bold text-gray-700 dark:text-gray-200 text-right pr-4">Subtotal</td>
                                <td className="py-3 font-bold text-blue-700 dark:text-blue-400 text-right">&#8377;{subtotal.toLocaleString('en-IN')}</td>
                                <td></td>
                            </tr>
                        </tbody>
                        </table>
                    </div>
                    </div>
                );
                })}
            </div>
        </>
      )}
    </div>
  );
}



const UNITS = ['unit', 'pcs', 'heads', 'bags', 'kg', 'tons', 'litres', 'months', 'Lump sum'];

function UnitSelector({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      <button type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-20 px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none transition-colors"
      >
        <span className="truncate">{value}</span>
        <svg className={`w-3 h-3 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <Dropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="absolute left-0 mt-1 w-32 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 border border-gray-200 dark:border-gray-700 max-h-48 overflow-y-auto"
      >
        <div className="py-1">
          {UNITS.map((opt) => (
            <button type="button"
              key={opt}
              onClick={() => { onChange(opt); setIsOpen(false); }}
              className={`block w-full text-left px-3 py-1.5 text-xs ${value === opt ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            >
              {opt}
            </button>
          ))}
        </div>
      </Dropdown>
    </div>
  );
}

