import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { useVyapar } from "../context/VyaparContext";
import PageMeta from "../components/common/PageMeta";
import { aiAdvisorService } from "../services/aiAdvisorService";
import { Bot, Mic, MicOff, Volume2, Square, Plus, PanelLeftClose, PanelLeftOpen, MessageSquare, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ChatMessage {
  sender: "user" | "ai";
  text: string;
  time: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: number;
}

export default function AiAdvisor() {
  const { t } = useTranslation();
  const location = useLocation();
  const { input, financials } = useVyapar();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem("vyaparmitra_chat_sessions");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse chat sessions");
      }
    }
    
    // Check old history migration
    const oldHistory = localStorage.getItem("vyaparmitra_chat_history");
    if (oldHistory) {
      try {
        const parsed = JSON.parse(oldHistory);
        return [{
          id: Date.now().toString(),
          title: t("advisor.previousChat"),
          messages: parsed,
          updatedAt: Date.now()
        }];
      } catch(e) {}
    }
    return [];
  });

  const [activeSessionId, setActiveSessionId] = useState<string | null>(
    sessions.length > 0 ? sessions[0].id : null
  );

  const [isListening, setIsListening] = useState(false);
  const [speakingMsgIdx, setSpeakingMsgIdx] = useState<number | null>(null);
  const [userInputText, setUserInputText] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sessions, activeSessionId, isAiTyping]);

  const activeSession = sessions.find(s => s.id === activeSessionId);
  const activeMessages = activeSession?.messages || [];

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("vyaparmitra_chat_sessions", JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    if (location.state?.initialQuery) {
      setUserInputText(location.state.initialQuery);
      if (!activeSessionId) {
        handleNewChat();
      }
    }
  }, [location.state]);

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: t("advisor.newChat"),
      messages: [
        {
          sender: "ai",
          text: t("advisor.greeting", {
            village: input.village,
            block: input.block,
            district: input.district,
            category: input.category,
            margin: input.marginCapital.toLocaleString('en-IN'),
            schemeName: financials.scheme.name,
            maxLoan: financials.maxLoanAmount.toLocaleString('en-IN')
          }),
          time: "Just now",
        }
      ],
      updatedAt: Date.now()
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newSession.id);
  };

  // Auto-start new chat if none exists
  useEffect(() => {
    if (sessions.length === 0) {
      handleNewChat();
    }
  }, []);

  const updateActiveSession = (newMessages: ChatMessage[], newTitle?: string) => {
    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        return {
          ...s,
          messages: newMessages,
          title: newTitle || s.title,
          updatedAt: Date.now()
        };
      }
      return s;
    }).sort((a, b) => b.updatedAt - a.updatedAt));
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInputText.trim() || !activeSessionId) return;

    const userText = userInputText;
    const userMsg: ChatMessage = {
      sender: "user",
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...activeMessages, userMsg];
    
    let newTitle = activeSession?.title;
    if (activeMessages.length <= 1) {
       newTitle = userText.length > 25 ? userText.substring(0, 25) + "..." : userText;
    }
    
    updateActiveSession(updatedMessages, newTitle);
    setUserInputText("");

    setIsAiTyping(true);
    try {
      const historyStr = updatedMessages.slice(-4).map(m => `${m.sender}: ${m.text}`).join("\n");
      const responseText = await aiAdvisorService.generateChatResponse(input, userText, historyStr);
      
      updateActiveSession([
        ...updatedMessages,
        {
          sender: "ai",
          text: responseText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (error) {
      updateActiveSession([
        ...updatedMessages,
        {
          sender: "ai",
          text: t("advisor.connectionIssue"),
          time: "Just now",
        },
      ]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(t("advisor.voiceNotSupported"));
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    const langMap: Record<string, string> = { "Hindi": "hi-IN", "Gujarati": "gu-IN", "English": "en-US" };
    recognition.lang = langMap[input.language] || "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = async (event: any) => {
      setIsListening(false);
      const transcript = event.results[0][0].transcript;
      
      if (input.language !== "English") {
         setUserInputText(t("advisor.translating"));
         const englishText = await aiAdvisorService.translateText(transcript, "English");
         setUserInputText(englishText);
      } else {
         setUserInputText((prev) => prev + (prev ? " " : "") + transcript);
      }
    };
    
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    
    try {
      recognition.start();
    } catch(e) {}
  };

  const handleSpeak = async (msg: ChatMessage, idx: number) => {
    if (speakingMsgIdx === idx) {
      window.speechSynthesis.cancel();
      setSpeakingMsgIdx(null);
      return;
    }
    
    window.speechSynthesis.cancel();
    setSpeakingMsgIdx(idx);

    let textToSpeak = msg.text.replace(/[*#_]/g, ''); 
    if (input.language !== "English") {
       textToSpeak = await aiAdvisorService.translateText(textToSpeak, input.language);
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    const langMap: Record<string, string> = { "Hindi": "hi-IN", "Gujarati": "gu-IN", "English": "en-US" };
    utterance.lang = langMap[input.language] || "en-US";

    utterance.onend = () => setSpeakingMsgIdx(null);
    utterance.onerror = () => setSpeakingMsgIdx(null);

    window.speechSynthesis.speak(utterance);
  };

  const handleDeleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newSessions = sessions.filter(s => s.id !== id);
    setSessions(newSessions);
    if (activeSessionId === id) {
       setActiveSessionId(newSessions.length > 0 ? newSessions[0].id : null);
    }
  };

  return (
    <>
      <PageMeta title={`${t("advisor.pageTitle")} | VyaparMitra`} description={t("advisor.pageDesc")} />

      <div className="space-y-4 stagger-slide-up h-[calc(100vh-110px)] flex flex-col">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                title="Toggle Sidebar"
              >
                {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
              </button>
              {t("advisor.pageTitle")}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 pl-8">
              {t("advisor.pageDesc")}
            </p>
          </div>
        </div>

        {/* Full Page Chat Interface */}
        <div className="flex flex-1 h-[calc(100vh-110px)] gap-4 overflow-hidden relative">
          
          {/* Internal Sidebar */}
          <div className={`transition-all duration-300 ease-in-out flex flex-col bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden ${isSidebarOpen ? 'w-64 opacity-100 mr-2' : 'w-0 opacity-0 border-0'}`}>
            <div className="p-3">
              <button 
                onClick={handleNewChat}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:hover:bg-brand-900/50 dark:text-brand-300 transition font-medium text-sm"
              >
                <Plus className="w-4 h-4" /> New Chat
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-1">
               <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t("advisor.recent")}</div>
               {sessions.map(s => (
                 <div 
                   key={s.id}
                   onClick={() => setActiveSessionId(s.id)}
                   className={`group flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition text-sm ${activeSessionId === s.id ? 'bg-gray-100 dark:bg-gray-800 font-medium text-gray-900 dark:text-white' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-400'}`}
                 >
                   <div className="flex items-center gap-2 truncate pr-2">
                     <MessageSquare className="w-4 h-4 shrink-0 opacity-70" />
                     <span className="truncate">{s.title}</span>
                   </div>
                   <button 
                     onClick={(e) => handleDeleteSession(e, s.id)}
                     className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition"
                   >
                     <Trash2 className="w-3.5 h-3.5" />
                   </button>
                 </div>
               ))}
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden relative">
            {!activeSessionId ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500 gap-4">
                 <Bot className="w-12 h-12 text-gray-300" />
                 <p>{t("advisor.startNewChat")}</p>
              </div>
            ) : (
              <>
                {/* Message History */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                  {activeMessages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-3xl rounded-2xl p-4 text-sm leading-relaxed ${msg.sender === "user" ? "bg-brand-500 text-white rounded-br-none" : "bg-gray-50 text-gray-900 shadow-sm border border-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-700 rounded-bl-none"}`}>
                        <div className="flex justify-between items-center gap-4 mb-2">
                          <span className="font-bold opacity-80 text-xs">
                            {msg.sender === "user" ? t("advisor.you") : t("advisor.aiName")}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] opacity-60">{msg.time}</span>
                            {msg.sender === "ai" && (
                              <button onClick={() => handleSpeak(msg, idx)} className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition" title="Listen to response">
                                {speakingMsgIdx === idx ? <Square className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" /> : <Volume2 className="w-3.5 h-3.5 opacity-80" />}
                              </button>
                            )}
                          </div>
                        </div>
                        <div className={`prose-sm max-w-none ${msg.sender === 'user' ? 'text-white' : '[&_strong]:font-bold [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mt-3 [&_h3]:mb-1 [&_ul]:list-disc [&_ul]:ml-4 [&_ul]:space-y-1 [&_p]:mb-2 [&_ol]:list-decimal [&_ol]:ml-4'}`}>
                          <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isAiTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-50 text-gray-900 shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 rounded-2xl rounded-bl-none p-4 max-w-3xl">
                        <div className="flex items-center gap-1.5 h-5">
                          <div className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <button type="button" onClick={() => setUserInputText(t("advisor.prompt1"))} className="rounded-full bg-white border border-gray-200 px-3 py-1 text-xs text-gray-700 hover:border-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 transition">❓ {t("advisor.prompt1")}</button>
                    <button type="button" onClick={() => setUserInputText(t("advisor.prompt2"))} className="rounded-full bg-white border border-gray-200 px-3 py-1 text-xs text-gray-700 hover:border-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 transition">❓ {t("advisor.prompt2")}</button>
                    <button type="button" onClick={() => setUserInputText(t("advisor.prompt3"))} className="rounded-full bg-white border border-gray-200 px-3 py-1 text-xs text-gray-700 hover:border-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 transition">❓ {t("advisor.prompt3")}</button>
                  </div>

                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <button type="button" onClick={toggleListening} title={t("advisor.voiceTyping")} className={`rounded-xl border ${isListening ? 'border-red-500 bg-red-50 text-red-600 animate-pulse' : 'border-gray-300 bg-white text-gray-500'} px-3 py-3 text-sm hover:bg-gray-50 transition shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400`}>
                      {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                    </button>
                    <input type="text" value={userInputText} onChange={(e) => setUserInputText(e.target.value)} placeholder={t("advisor.chatPlaceholder")} className="flex-1 rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                    <button type="submit" disabled={isAiTyping} className={`rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition shadow-sm ${isAiTyping ? 'opacity-50 cursor-not-allowed' : 'hover:bg-brand-600'}`}>{t("advisor.send")} →</button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
