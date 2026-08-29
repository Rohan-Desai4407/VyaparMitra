import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useVyapar } from "../context/VyaparContext";
import PageMeta from "../components/common/PageMeta";
import { aiAdvisorService } from "../services/aiAdvisorService";

interface ChatMessage {
  sender: "user" | "ai";
  text: string;
  time: string;
}

export default function AiAdvisor() {
  const { t } = useTranslation();
  const { input, financials } = useVyapar();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "ai",
      text: t("advisor.greeting", {
        village: input.village,
        block: input.block,
        district: input.district,
        category: input.category,
        margin: input.marginCapital.toLocaleString("en-IN"),
        schemeName: financials.scheme.name,
        maxLoan: financials.maxLoanAmount.toLocaleString("en-IN")
      }),
      time: "Just now",
    },
  ]);

  const [userInputText, setUserInputText] = useState("");

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInputText.trim()) return;

    const userText = userInputText;
    const userMsg: ChatMessage = {
      sender: "user",
      text: userText,
      time: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setUserInputText("");

    try {
      // Build brief chat history
      const historyStr = messages.slice(-4).map(m => `${m.sender}: ${m.text}`).join("\n");
      const responseText = await aiAdvisorService.generateChatResponse(input, userText, historyStr);
      
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: responseText,
          time: "Just now",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "I am currently experiencing connection issues. Please try again later.",
          time: "Just now",
        },
      ]);
    }
  };

  return (
    <>
      <PageMeta
        title={`${t("advisor.pageTitle")} | VyaparMitra`}
        description={t("advisor.pageDesc")}
      />

      <div className="space-y-6 stagger-slide-up">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t("advisor.pageTitle")}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("advisor.pageDesc")}
            </p>
          </div>
        </div>

        {/* Full Page Chat Interface */}
        <div className="flex h-[calc(100vh-200px)] gap-6">
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 dark:border-gray-800 p-4 bg-gray-50/50 dark:bg-gray-900">
              <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                🤖 {t("advisor.pageTitle")}
              </h2>
            </div>
            
            {/* Message History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 stagger-slide-up">
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
                        {msg.sender === "user" ? "You" : "VyaparMitra AI"}
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
                  onClick={() => setUserInputText(t("advisor.prompt1"))}
                  className="rounded-full bg-white border border-gray-200 px-3 py-1 text-xs text-gray-700 hover:border-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 transition"
                >
                  ❓ {t("advisor.prompt1")}
                </button>
                <button
                  type="button"
                  onClick={() => setUserInputText(t("advisor.prompt2"))}
                  className="rounded-full bg-white border border-gray-200 px-3 py-1 text-xs text-gray-700 hover:border-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 transition"
                >
                  ❓ {t("advisor.prompt2")}
                </button>
                <button
                  type="button"
                  onClick={() => setUserInputText(t("advisor.prompt3"))}
                  className="rounded-full bg-white border border-gray-200 px-3 py-1 text-xs text-gray-700 hover:border-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 transition"
                >
                  ❓ {t("advisor.prompt3")}
                </button>
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={userInputText}
                  onChange={(e) => setUserInputText(e.target.value)}
                  placeholder={t("advisor.chatPlaceholder")}
                  className="flex-1 rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-600 transition shadow-sm"
                >
                  {t("advisor.send")} →
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


