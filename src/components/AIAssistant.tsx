import React, { useState, useEffect } from 'react';
import { Bot, X, Sparkles, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown'; // <--- New Import
import remarkGfm from 'remark-gfm';       // <--- New Import
import { useAIStore } from '../stores/aiStore';

export const AIAssistant = () => {
  const { t } = useTranslation();
  const { message, thinking, setMessage, setThinking } = useAIStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Auto-open when AI has something to say
  useEffect(() => {
    if (message || thinking) {
        setIsOpen(true);
        setIsMinimized(false);
    }
  }, [message, thinking]);

  if (!isOpen && !thinking) return null;

  return (
    <div className={`fixed z-[90] transition-all duration-300 ease-in-out shadow-2xl ${isMinimized ? 'bottom-4 right-4 w-12 h-12 rounded-full' : 'bottom-20 right-4 w-80 md:w-96 rounded-2xl'} bg-[#0f111a] border border-indigo-500/30 backdrop-blur-md flex flex-col overflow-hidden`}>
        
        {/* Header */}
        <div 
            className="p-3 bg-gradient-to-r from-indigo-900/80 to-[#0f111a] border-b border-indigo-500/20 flex justify-between items-center cursor-pointer"
            onClick={() => setIsMinimized(!isMinimized)}
        >
            <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-500 rounded-lg">
                    <Bot className="w-4 h-4 text-white" />
                </div>
                {!isMinimized && <span className="text-xs font-bold text-white tracking-wide">{t('ai.insight')}</span>}
            </div>
            <div className="flex items-center gap-1">
                <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} className="p-1 hover:bg-white/10 rounded">
                    <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${isMinimized ? 'rotate-180' : ''}`} />
                </button>
                {!isMinimized && (
                    <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); setMessage(''); setThinking(false); }} className="p-1 hover:bg-red-500/20 hover:text-red-400 rounded transition-colors">
                        <X className="w-3 h-3" />
                    </button>
                )}
            </div>
        </div>

        {/* Content */}
        {!isMinimized && (
            <div className="p-4 overflow-y-auto max-h-[300px] custom-scrollbar">
                {thinking ? (
                    <div className="flex flex-col items-center justify-center py-6 space-y-3">
                        <Sparkles className="w-6 h-6 text-indigo-400 animate-spin" />
                        <span className="text-xs text-indigo-300 font-mono animate-pulse">{t('ai.thinking')}</span>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-xl p-3 text-xs text-gray-200">
                            {/* React Markdown renders the bold text and tables properly */}
                            <ReactMarkdown 
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    // Custom styling for tables within the chat
                                    table: ({node, ...props}) => <table className="w-full border-collapse my-2" {...props} />,
                                    th: ({node, ...props}) => <th className="border border-indigo-500/30 bg-indigo-500/20 p-1 text-left" {...props} />,
                                    td: ({node, ...props}) => <td className="border border-indigo-500/30 p-1" {...props} />,
                                    strong: ({node, ...props}) => <strong className="text-indigo-300 font-bold" {...props} />,
                                    ul: ({node, ...props}) => <ul className="list-disc pl-4 space-y-1" {...props} />,
                                    li: ({node, ...props}) => <li className="marker:text-indigo-500" {...props} />
                                }}
                            >
                                {message || "Olá! Desenhe um terreno no mapa para que eu possa analisar o zoneamento."}
                            </ReactMarkdown>
                        </div>
                    </div>
                )}
            </div>
        )}
    </div>
  );
};