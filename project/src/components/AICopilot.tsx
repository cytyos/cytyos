import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, Sparkles, AlertTriangle, TrendingUp } from 'lucide-react';
import { useProjectStore } from '../stores/useProjectStore';
import { analyzeProject } from '../services/aiService';

export const AICopilot = () => {
  const [isOpen, setIsOpen] = useState(false); // Começa fechado, mas abre se houver alerta
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Histórico inicial
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string; type?: 'alert' | 'normal' }[]>([
    { role: 'assistant', content: "Hello! I'm watching your project metrics. I'll let you know if I see any risks or opportunities.", type: 'normal' }
  ]);

  const { metrics, land, blocks } = useProjectStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Refs para evitar spam de alertas (Debounce lógico)
  const lastAlertRef = useRef<'far' | 'margin' | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => { scrollToBottom(); }, [messages, isOpen]);

  // --- PROACTIVE WATCHERS (A Mágica) ---
  useEffect(() => {
    // 1. Watch for Zoning Violation (FAR)
    if (!metrics.isFarValid && lastAlertRef.current !== 'far') {
      const msg = `🚨 Critical Alert: You exceeded the allowed FAR (C.A.) of ${land.maxFar}. The project is currently illegal. Reduce building height or footprint immediately.`;
      addSystemMessage(msg, 'alert');
      lastAlertRef.current = 'far';
      setIsOpen(true); // Auto-open chat
    } 
    // Reset alert flag if fixed
    else if (metrics.isFarValid && lastAlertRef.current === 'far') {
      addSystemMessage("✅ Zoning issue resolved. Great job!", 'normal');
      lastAlertRef.current = null;
    }

    // 2. Watch for Low Margin (Financial Risk)
    if (metrics.margin < 15 && metrics.margin > 0 && lastAlertRef.current !== 'margin') {
      const msg = `📉 Financial Warning: Net Margin dropped to ${metrics.margin.toFixed(1)}%. Investors typically require >20%. Consider checking land cost or increasing saleable area.`;
      addSystemMessage(msg, 'alert');
      lastAlertRef.current = 'margin';
    }
    // Reset if recovered
    else if (metrics.margin >= 20 && lastAlertRef.current === 'margin') {
      addSystemMessage("🚀 Healthy Margin restored! Good work.", 'normal');
      lastAlertRef.current = null;
    }

  }, [metrics.isFarValid, metrics.margin]);

  const addSystemMessage = (text: string, type: 'alert' | 'normal' = 'normal') => {
    setMessages(prev => [...prev, { role: 'assistant', content: text, type }]);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg, type: 'normal' }]);
    setIsLoading(true);

    try {
      // Chama a IA real passando o histórico
      const cleanHistory = messages.map(m => ({ role: m.role, content: m.content }));
      const reply = await analyzeProject([...cleanHistory, { role: 'user', content: userMsg }], { metrics, land, blocks });
      
      setMessages(prev => [...prev, { role: 'assistant', content: reply || "No response.", type: 'normal' }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Connection error. Please check your internet or API Key.", type: 'alert' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto transition-all ${isOpen ? 'w-80 sm:w-96' : 'w-auto'}`}>
      
      {/* CHAT WINDOW */}
      {isOpen && (
        <div className="w-full bg-[#0f111a] border border-gray-700 rounded-2xl shadow-2xl overflow-hidden mb-4 flex flex-col animate-in slide-in-from-bottom-5 duration-300" style={{ height: '450px' }}>
          
          {/* Header */}
          <div className="p-3 bg-gradient-to-r from-blue-900 to-indigo-900 border-b border-gray-700 flex justify-between items-center">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Bot className="w-4 h-4" /> AI Copilot
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-gray-900/50">
            {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                        m.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : m.type === 'alert'
                            ? 'bg-red-900/40 text-red-200 border border-red-800 rounded-bl-none'
                            : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-bl-none'
                    }`}>
                        {m.type === 'alert' && <AlertTriangle className="w-3 h-3 mb-1 inline mr-1" />}
                        {m.content}
                    </div>
                </div>
            ))}
            {isLoading && (
                <div className="flex justify-start">
                    <div className="bg-gray-800 p-3 rounded-2xl rounded-bl-none border border-gray-700 flex gap-1">
                        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-100"></span>
                        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-200"></span>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-gray-800 border-t border-gray-700 flex gap-2">
            <input 
                className="flex-1 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 border border-gray-700 focus:border-blue-500 outline-none"
                placeholder="Ask for advice..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
                onClick={handleSend}
                disabled={isLoading}
                className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg disabled:opacity-50 transition-colors"
            >
                <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* FLOATING BUTTON (With Notification Badge) */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`relative p-4 rounded-full shadow-lg transition-all transform hover:scale-105 flex items-center gap-2 font-bold ${
            isOpen ? 'bg-gray-800 text-white' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
        {!isOpen && <span className="pr-1 text-sm hidden sm:inline">AI Copilot</span>}
        
        {/* Notification Dot if Alert exists */}
        {!isOpen && lastAlertRef.current && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-[#0f111a]"></span>
        )}
      </button>
    </div>
  );
};