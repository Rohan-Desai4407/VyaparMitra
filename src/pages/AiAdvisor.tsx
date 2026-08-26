import React, { useState } from "react";
import { useVyapar } from "../context/VyaparContext";
import PageMeta from "../components/common/PageMeta";
import ComponentCard from "../components/common/ComponentCard";

interface ChatMessage {
  sender: "user" | "ai";
  text: string;
  time: string;
}

export default function AiAdvisor() {
  const { input, financials, swot } = useVyapar();

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
        title="AI Business Advisor & SWOT | VyaparMitra"
        description="NLP-powered multilingual AI business assistant combined with structured SWOT and local risk analysis."
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Module 7 — AI Business Advisor & SWOT Matrix
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Multilingual AI analysis combining structured financial parameters and hyper-local economic data.
            </p>
          </div>
        </div>

        {/* SWOT Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Strengths */}
          <ComponentCard title="💪 Key Business Strengths">
            <ul className="space-y-2.5">
              {swot.strengths.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 rounded-xl bg-emerald-50/60 p-3 text-xs text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300"
                >
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </ComponentCard>

          {/* Weaknesses */}
          <ComponentCard title="⚠️ Operational Weaknesses">
            <ul className="space-y-2.5">
              {swot.weaknesses.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 rounded-xl bg-amber-50/60 p-3 text-xs text-amber-900 dark:bg-amber-950/30 dark:text-amber-300"
                >
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </ComponentCard>

          {/* Opportunities */}
          <ComponentCard title="🚀 Local Market Opportunities">
            <ul className="space-y-2.5">
              {swot.opportunities.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 rounded-xl bg-blue-50/60 p-3 text-xs text-blue-900 dark:bg-blue-950/30 dark:text-blue-300"
                >
                  <span className="text-blue-600 font-bold">★</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </ComponentCard>

          {/* Threats & Local Risks */}
          <ComponentCard title="🛑 Threats & Local Bottlenecks">
            <ul className="space-y-2.5">
              {swot.threats.concat(swot.localRisks).map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 rounded-xl bg-red-50/60 p-3 text-xs text-red-900 dark:bg-red-950/30 dark:text-red-300"
                >
                  <span className="text-red-500 font-bold">!</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </ComponentCard>
        </div>

        {/* NLP Multilingual AI Assistant Chat Window */}
        <ComponentCard title="🤖 Interactive AI Business Advisory Assistant">
          <div className="flex flex-col h-[400px]">
            {/* Message History */}
            <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-xl border border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/40">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xl rounded-2xl p-4 text-xs leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-brand-500 text-white rounded-br-none"
                        : "bg-white text-gray-900 shadow-sm border border-gray-200 dark:bg-gray-900 dark:text-white dark:border-gray-700 rounded-bl-none"
                    }`}
                  >
                    <div className="flex justify-between items-center gap-4 mb-1">
                      <span className="font-bold opacity-80">
                        {msg.sender === "user" ? "You (Entrepreneur)" : "VyaparMitra AI"}
                      </span>
                      <span className="text-[10px] opacity-60">{msg.time}</span>
                    </div>
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Suggested Prompts */}
            <div className="flex flex-wrap gap-2 py-3">
              <button
                type="button"
                onClick={() => setUserInputText("What are the biggest supply chain risks in my area?")}
                className="rounded-full bg-white border border-gray-200 px-3 py-1 text-xs text-gray-700 hover:border-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              >
                ❓ Ask about supply chain risks
              </button>
              <button
                type="button"
                onClick={() => setUserInputText("How does the 6-month moratorium work?")}
                className="rounded-full bg-white border border-gray-200 px-3 py-1 text-xs text-gray-700 hover:border-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              >
                ❓ How does moratorium work?
              </button>
              <button
                type="button"
                onClick={() => setUserInputText("What pricing per liter gives best profitability?")}
                className="rounded-full bg-white border border-gray-200 px-3 py-1 text-xs text-gray-700 hover:border-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
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
                className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
              <button
                type="submit"
                className="rounded-xl bg-brand-500 px-5 py-2.5 text-xs font-semibold text-white hover:bg-brand-600 transition"
              >
                Send →
              </button>
            </form>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
