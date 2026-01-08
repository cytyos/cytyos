import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Sparkles, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAIStore } from '../stores/aiStore';

export const AIAssistant = () => {
  const { t } = useTranslation();
  const { message, thinking, setMessage, setThinking } = useAIStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  // Ref to auto-scroll to bottom of chat
  const contentRef = useRef<HTMLDivElement>(null);

  // TRIGGER: Open immediately when "thinking" starts or a message arrives
  useEffect(() => {
    if (thinking || message) {
        setIsOpen(true);
        setIsMinimized(false);
    }
  }, [thinking, message]);

  // Auto-scroll effect
  useEffect(() => {
    if (contentRef.current) {
        contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [message, thinking, isOpen]);

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

        {/* Content Area */}
        {!isMinimized && (
            <div ref={contentRef} className="p-4 overflow-y-auto max-h-[400px] custom-scrollbar bg-[#0f111a]/50">
                
                {/* LOADING STATE - Shows immediately when thinking is true */}
                {thinking && (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4 fade-in">
                        <div className="relative">
                            <Sparkles className="w-8 h-8 text-indigo-400 animate-spin" />
                            <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full animate-pulse"></div>
                        </div>
                        <span className="text-xs text-indigo-300 font-mono animate-pulse tracking-wider">
                            ANALYZING TERRITORY...
                        </span>
                    </div>
                )}

                {/* MESSAGE STATE - Renders Markdown properly */}
                {!thinking && message && (
                    <div className="space-y-3 fade-in">
                        <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-xl p-4 text-sm text-gray-200 shadow-inner">
                            <ReactMarkdown 
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    // Forces Bold styling
                                    strong: ({node, ...props}) => <span className="font-bold text-indigo-300" {...props} />,
                                    // Forces Italic styling
                                    em: ({node, ...props}) => <span className="italic text-indigo-200" {...props} />,
                                    // Lists
                                    ul: ({node, ...props}) => <ul className="list-disc pl-5 my-2 space-y-1 text-gray-300" {...props} />,
                                    ol: ({node, ...props}) => <ol className="list-decimal pl-5 my-2 space-y-1 text-gray-300" {...props} />,
                                    li: ({node, ...props}) => <li className="pl-1" {...props} />,
                                    // Headings
                                    h1: ({node, ...props}) => <h3 className="text-lg font-bold text-white mt-4 mb-2 border-b border-indigo-500/30 pb-1" {...props} />,
                                    h2: ({node, ...props}) => <h4 className="text-base font-bold text-white mt-3 mb-2" {...props} />,
                                    h3: ({node, ...props}) => <h5 className="text-sm font-bold text-indigo-200 mt-2 mb-1" {...props} />,
                                    // Paragraphs
                                    p: ({node, ...props}) => <p className="leading-relaxed mb-3 last:mb-0" {...props} />,
                                    // Tables (Critical for financial data)
                                    table: ({node, ...props}) => <div className="overflow-x-auto my-3 rounded-lg border border-indigo-500/30"><table className="w-full text-xs text-left" {...props} /></div>,
                                    thead: ({node, ...props}) => <thead className="bg-indigo-500/20 text-indigo-100 uppercase font-semibold" {...props} />,
                                    th: ({node, ...props}) => <th className="px-3 py-2 border-b border-indigo-500/30 whitespace-nowrap" {...props} />,
                                    td: ({node, ...props}) => <td className="px-3 py-2 border-b border-indigo-500/10" {...props} />,
                                    tr: ({node, ...props}) => <tr className="hover:bg-white/5 transition-colors" {...props} />
                                }}
                            >
                                {message}
                            </ReactMarkdown>
                        </div>
                    </div>
                )}
            </div>
        )}
    </div>
  );
};