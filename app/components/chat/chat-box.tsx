"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPaperPlane, FaCircle, FaClock } from "react-icons/fa";
import { useState, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { useTheme } from "./../../context/theme";
import { useChat } from "./chat-context";
import { IoIosFlash } from "react-icons/io";

interface Model {
  status: 'online' | 'offline' | 'slow' | string;
  id: string;
  nome: string;
  responseTime?: number;
  lastChecked?: string;
}

interface ChatMessage {
  type: 'question' | 'answer';
  content: string;
  model?: string;
}

//const MAX_TITLE_LENGTH = 40;

export default function ChatArea() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const {
    chatHistory,
    setChatHistory,
    //currentChatId,
    //startNewChat
  } = useChat();
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);

  // carrega os modelos
  useEffect(() => {
    const loadModels = async () => {
      try {
        const response = await fetch("/api/models", { method: "GET" });
        const data = await response.json();

        if (data.modelos) {
          setModels(data.modelos);
          const geminiModel = data.modelos.find((m: Model) =>
            m.id.toLowerCase().includes('gemini') ||
            m.nome.toLowerCase().includes('gemini')
          );
          setSelectedModel(geminiModel?.id || data.modelos[0]?.id || "");
        }
      } catch (error) {
        console.error("Failed to load models", error);
      }
    };

    loadModels();
  }, []);

  const testSelectedModel = useCallback(async () => {
    if (!selectedModel) return;

    try {
      const response = await fetch(`/api/models?modelId=${selectedModel}`);
      if (!response.ok) throw new Error("Failed to test model");

      const data = await response.json() as {
        status: string;
        responseTime: number;
      };

      setModels(prev => prev.map(model =>
        model.id === selectedModel ? {
          ...model,
          status: data.status,
          responseTime: data.responseTime,
          lastChecked: new Date().toISOString()
        } : model
      ));
    } catch (error) {
      console.error("Failed to test model", error);
      setModels(prev => prev.map(model =>
        model.id === selectedModel ? {
          ...model,
          status: 'offline',
          lastChecked: new Date().toISOString()
        } : model
      ));
    }
  }, [selectedModel]);

  useEffect(() => {
    if (selectedModel) {
      testSelectedModel();
    }
  }, [selectedModel, testSelectedModel]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage || loading) return;

    setLoading(true);
    setError(null);

    const newQuestion: ChatMessage = {
      type: "question",
      content: trimmedMessage
    };
    // @ts-expect-error - ignore type mismatch
    setChatHistory(prev => [...prev, newQuestion]);
    setMessage("");

    try {
      const response = await fetch("/api/models", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
         },
        body: JSON.stringify({
          pergunta: trimmedMessage,
          modelo: selectedModel,
          conversationId: Date.now()
        })
      });

      if (!response.ok) throw new Error(response.statusText);

      const data = await response.json();
      const newAnswer: ChatMessage = {
        type: "answer",
        content: data.resposta,
        model: selectedModel
      };
      // @ts-expect-error - ignore type mismatch
      setChatHistory(prev => [...prev, newAnswer]);

    } catch (error: unknown) {
      console.error("API Error:", error);
      let errorMessage = "Error getting response. Please try again.";

      if (error instanceof Error && error.message.includes("Failed to fetch")) {
        errorMessage = "Model is offline. Try again later.";
      }

      const errorMsg: ChatMessage = {
        type: "answer",
        content: "Sorry, there was an error. Please try with another AI model."
      };
      // @ts-expect-error - ignore type mismatch
      setChatHistory(prev => [...prev, errorMsg]);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (modelId: string) => {
    const model = models.find(m => m.id === modelId);
    if (!model) return 'text-gray-500';

    switch (model.status) {
      case 'online': return 'text-green-500';
      case 'offline': return 'text-red-500';
      case 'slow': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusText = (modelId: string) => {
    const model = models.find(m => m.id === modelId);
    if (!model) return 'Unknown';

    switch (model.status) {
      case 'online': return 'Online';
      case 'offline': return 'Offline';
      case 'slow': return 'Slow';
      default: return 'Unknown';
    }
  };

  const getModelName = (id: string | undefined) => {
    if (!id) return "DeepSeek"; // Nome padrão quando não há modelo especificado
    return models.find(m => m.id === id)?.nome || "DeepSeek";
  };

  const getModelTagStyle = (modelId: string | undefined) => {
    // Se não houver modelId ou for undefined, usa o estilo do DeepSeek
    if (!modelId) return "bg-gradient-to-r from-green-600 to-emerald-500 text-white";

    switch (modelId.toLowerCase()) {
      case 'gemini':
        return "bg-gradient-to-r from-blue-500 to-purple-600 text-white";
      case 'deepseek':
      default:  // Caso padrão (incluindo quando modelId é undefined)
        return "bg-gradient-to-r from-green-600 to-emerald-500 text-white";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className={`SectionTwo flex-1 flex flex-col gap-1 rounded-2xl border h-full ${isDark ? "bg-black border-gray-800/50" : "bg-white border-gray-300"
        }`}
    >
      {/* Top Bar with Model Selection */}
      <div
        className={`px-4 p-2 h-12 border-b rounded-t-2xl flex flex-col lg:flex-row justify-between items-center gap-4 ${isDark ? "bg-gray-950 border-gray-800" : "bg-gray-100 border-gray-300"
          }`}
      >
        <div className="flex items-center gap-2">
          <label className={`${isDark ? "text-white" : "text-black"} text-sm font-bold`}>
            Select AI Model
          </label>
          <select
            className={`px-3 py-1 rounded-xl border ${isDark
              ? "bg-[#1b1b1b] text-white border-gray-700"
              : "bg-white text-black border-gray-400"
              }`}
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={loading || chatHistory.length > 0}
          >
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="model-status-and-velocity flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FaCircle className={`text-xs ${getStatusColor(selectedModel)}`} />
            <span className={`${isDark ? "text-white" : "text-black"} text-sm`}>
              {getStatusText(selectedModel)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FaClock className="text-xs text-gray-400" />
            <span className={`${isDark ? "text-white" : "text-black"} text-sm`}>
              {models.find(m => m.id === selectedModel)?.responseTime ?
                `${models.find(m => m.id === selectedModel)?.responseTime}ms` : '--'}
            </span>
          </div>
          <button
            onClick={testSelectedModel}
            className="flex items-center text-xs bg-[var(--bg-green)] hover:bg-white hover:text-black px-2 py-1 rounded-lg transition-colors"
            title="Test connection"
            disabled={loading}
          >
            <IoIosFlash />Speed Test
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div
        className={`flex-1 rounded-2xl p-4 overflow-y-auto ${isDark ? "bg-black text-white" : "bg-white text-black"
          }`}
      >
        <AnimatePresence>
          {chatHistory.length > 0 ? (
            <div className="space-y-4">
              {chatHistory.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.type === 'question' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-xl p-3 ${msg.type === 'question'
                    ? 'bg-[#1aec33] text-black'
                    : isDark
                      ? 'bg-gray-800 text-white'
                      : 'bg-gray-200 text-black'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <p className="text-[12px]">
                        {msg.type === "question" ? "Você" : msg.model ? getModelName(msg.model) : "Unknown"}
                      </p>
                      {msg.type === 'answer' && (
                        <span
                          className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${getModelTagStyle(
                            msg.model
                          )}`}
                        >
                          {getModelName(msg.model || '')}
                        </span>
                      )}
                    </div>

                    <ReactMarkdown
                      components={{
                        p: ({ ...props }) => <p className="text-current leading-relaxed mb-3" {...props} />,
                        h2: ({ ...props }) => <h2 className="text-lg font-bold mb-3" {...props} />,
                        h3: ({ ...props }) => <h3 className="text-base font-semibold" {...props} />,
                        ul: ({ ...props }) => <ul className="list-disc pl-6 space-y-2" {...props} />,
                        ol: ({ ...props }) => <ol className="list-decimal pl-6 space-y-2" {...props} />,
                        li: ({ ...props }) => <li className="my-1 leading-relaxed" {...props} />,
                        a: ({ ...props }) => (
                          <a
                            className={`${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'} underline`}
                            target="_blank"
                            rel="noopener noreferrer"
                            {...props}
                          />
                        ),
                        strong: ({ ...props }) => <strong className="font-semibold" {...props} />,
                        em: ({ ...props }) => <em className="italic" {...props} />,
                        code: ({ ...props }) => (
                          <code className={`rounded px-1 py-0.5 text-[12px] font-mono ${isDark ? 'bg-gray-700' : 'bg-gray-300'
                            }`} {...props} />
                        ),
                        pre: ({ ...props }) => (
                          <pre className={`p-3 rounded-md overflow-x-auto my-3 ${isDark ? 'bg-gray-800 text-gray-100' : 'bg-gray-200 text-gray-800'
                            }`} {...props} />
                        ),
                      }}
                      remarkPlugins={[remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </motion.div>
              ))}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className={`rounded-xl p-3 max-w-[80%] ${isDark ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'
                    }`}
                  >
                    <div className="text-xs font-bold mb-1">
                      {getModelName(selectedModel)}
                    </div>
                    <div className="flex gap-2">
                      <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-gray-400' : 'bg-gray-500'
                        } animate-bounce`}></div>
                      <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-gray-400' : 'bg-gray-500'
                        } animate-bounce delay-75`}></div>
                      <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-gray-400' : 'bg-gray-500'
                        } animate-bounce delay-150`}></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`h-full flex flex-col items-center justify-center ${isDark ? "text-gray-400" : "text-gray-500"
                }`}
            >
              <div className="text-xl font-bold mb-2">Start a new conversation</div>
              <div>Type your message below to begin</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className={`rounded-2xl p-2 flex items-center gap-4 border shadow-lg ${isDark
          ? "bg-[#1b1b1b] border-gray-800/50"
          : "bg-gray-100 border-gray-300"
          }`}
      >
        <motion.div
          className="flex-1 justify-center relative"
          transition={{ type: "spring", stiffness: 400 }}
        >
          <textarea
            className={`w-full rounded-xl p-2 pr-12 resize-none focus:outline-none transition-all duration-200 placeholder-gray-500 ${isDark
              ? "bg-gray-900/50 border-2 border-gray-700 text-white focus:border-[#44ff1f]/50 focus:ring-2 focus:ring-[#44ff1f]/20"
              : "bg-white border-2 border-gray-300 text-black focus:border-[#44ff1f]/50 focus:ring-2 focus:ring-[#44ff1f]/20"
              }`}
            rows={1}
            style={{ minHeight: '50px', maxHeight: '200px' }}
            placeholder="Ask me anything..."
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            disabled={loading}
          />
          {message && (
            <motion.button
              type="button"
              onClick={() => setMessage('')}
              className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              aria-label="Clear message"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          )}
        </motion.div>

        <motion.button
          type="submit"
          disabled={loading || !message.trim()}
          className="bg-[#1aec33] text-black font-bold p-3 rounded-xl hover:bg-white 
            active:scale-95 disabled:cursor-not-allowed
            transition-all duration-150 relative overflow-hidden"
          whileHover={!loading && message.trim() ? { scale: 1.05 } : {}}
          whileTap={!loading && message.trim() ? { scale: 0.95 } : {}}
          aria-label="Send message"
        >
          {loading ? (
            <div className="w-6 h-6 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-black rounded-full animate-spin border-t-transparent"></div>
            </div>
          ) : (
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
            >
              <FaPaperPlane className="w-5 h-5" />
            </motion.div>
          )}
          {!loading && (
            <motion.span
              className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity"
              whileHover={{ opacity: 0.1 }}
            />
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}