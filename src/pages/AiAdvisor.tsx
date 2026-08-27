import React, { useState } from "react";
import { useVyapar } from "../context/VyaparContext";
import PageMeta from "../components/common/PageMeta";

interface ChatMessage {
  sender: "user" | "ai";
  text: string;
  time: string;
}

export default function AiAdvisor() {
  const { input, financials } = useVyapar();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "ai",
      text: `Namaste! I am your VyaparMitra AI Advisor. I have evaluated your proposed ${input.category} business in ${input.village}, ${input.block} (${input.district}). Based on your margin capital of ₹${input.marginCapital.toLocaleString("en-IN")}, you are auto-routed to the ${financials.scheme.name} with maximum financing of ₹${financials.maxLoanAmount.toLocaleString("en-IN")}. How can I assist your feasibility strategy today?`,
      time: "Just now",
    },
  ]);

  const [userInputText, setUserInputText] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInputText.trim()) return;

    const userMsg: ChatMessage = {
      sender: "user",
      text: userInputText,
      time: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setUserInputText("");

    // Simulate AI response based on PRD module logic
    setTimeout(() => {
      let responseText = "";
      const lower = userInputText.toLowerCase();

      if (lower.includes("risk") || lower.includes("threat") || lower.includes("problem")) {
        responseText = `In ${input.block} block, local risks for ${input.category} include seasonal feed price increases during summer and dependency on single milk collection hubs. We recommend installing a small solar power backup unit and forming direct B2B tie-ups with regional highway dhabas to mitigate cash flow risks.`;
      } else if (lower.includes("loan") || lower.includes("scheme") || lower.includes("bank")) {
        responseText = `You qualify for the ${financials.scheme.name} offering 90% agency financing (₹${financials.maxLoanAmount.toLocaleString("en-IN")}) at ${financials.scheme.interestRate}% interest per annum. You also get a ${financials.scheme.moratoriumMonths}-month moratorium grace period before principal repayments begin!`;
      } else if (lower.includes("price") || lower.includes("market") || lower.includes("competitor")) {
        responseText = `Based on regional purchasing power in ${input.district}, your recommended pricing per unit gives a 15-20% margin above local production cost. Competitor density is currently Moderate (4 nearby registered units within 10 km).`;
      } else {
        responseText = `Based on your available capital of ₹${input.marginCapital.toLocaleString("en-IN")}, your overall viability score is 84/100 (Highly Viable). Your 6-month moratorium period allows you to establish smooth supply operations before full EMI repayments start.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: responseText,
          time: "Just now",
        },
      ]);
    }, 800);
  };

  return (
    <>
      <PageMeta
        title="AI Business Assistant | VyaparMitra"
        description="NLP-powered multilingual AI business assistant."
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              AI Business Assistant
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Multilingual interactive AI assistant for your feasibility strategy.
            </p>
          </div>
        </div>


        {/* Full Page Chat Interface */}
        <div className="flex h-[calc(100vh-200px)] gap-6">
          {/* History Sidebar */}
          <div className="w-64 hidden md:flex flex-col flex-shrink-0 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
            <button 
              className="w-full flex items-center justify-center gap-2 bg-brand-50 text-brand-600 hover:bg-brand-100 dark:bg-brand-900/30 dark:text-brand-400 dark:hover:bg-brand-900/50 p-2.5 rounded-xl font-bold mb-6 transition"
              onClick={() => setMessages([{
                sender: "ai",
                text: "Namaste! I am your VyaparMitra AI Advisor. How can I assist your new business strategy today?",
                time: "Just now",
              }])}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              New Chat
            </button>

            <div className="flex-1 overflow-y-auto">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">Today</div>
              <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-sm cursor-pointer mb-1 truncate font-medium">
                Business Feasibility 
              </div>
              <div className="px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-400 rounded-lg text-sm cursor-pointer mb-6 truncate transition">
                Loan Repayment Clarification
              </div>

              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">Previous 7 Days</div>
              <div className="px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-400 rounded-lg text-sm cursor-pointer mb-1 truncate transition">
                Competitor Analysis
              </div>
              <div className="px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-400 rounded-lg text-sm cursor-pointer mb-1 truncate transition">
                Govt Scheme Subsidies
              </div>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 dark:border-gray-800 p-4 bg-gray-50/50 dark:bg-gray-900">
              <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                🤖 Interactive AI Business Advisory Assistant
              </h2>
            </div>
            
            {/* Message History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-2xl rounded-2xl p-4 text-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-brand-500 text-white rounded-br-none"
                        : "bg-gray-50 text-gray-900 shadow-sm border border-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-700 rounded-bl-none"
                    }`}
                  >
                    <div className="flex justify-between items-center gap-4 mb-2">
                      <span className="font-bold opacity-80 text-xs">
                        {msg.sender === "user" ? "You (Entrepreneur)" : "VyaparMitra AI"}
                      </span>
                      <span className="text-[10px] opacity-60">{msg.time}</span>
                    </div>
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
              {/* Suggested Prompts */}
              <div className="flex flex-wrap gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setUserInputText("What are the biggest supply chain risks in my area?")}
                  className="rounded-full bg-white border border-gray-200 px-3 py-1 text-xs text-gray-700 hover:border-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 transition"
                >
                  ❓ Ask about supply chain risks
                </button>
                <button
                  type="button"
                  onClick={() => setUserInputText("How does the 6-month moratorium work?")}
                  className="rounded-full bg-white border border-gray-200 px-3 py-1 text-xs text-gray-700 hover:border-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 transition"
                >
                  ❓ How does moratorium work?
                </button>
                <button
                  type="button"
                  onClick={() => setUserInputText("What pricing per liter gives best profitability?")}
                  className="rounded-full bg-white border border-gray-200 px-3 py-1 text-xs text-gray-700 hover:border-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 transition"
                >
                  ❓ Recommended pricing guidance
                </button>
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={userInputText}
                  onChange={(e) => setUserInputText(e.target.value)}
                  placeholder="Ask VyaparMitra AI a question about your business plan in Hindi, English, etc..."
                  className="flex-1 rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-600 transition shadow-sm"
                >
                  Send →
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
