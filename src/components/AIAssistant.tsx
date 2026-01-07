import React from 'react';
import { Sparkles, Bot, X } from 'lucide-react';
import { useAIStore } from '../stores/aiStore';

export const AIAssistant = () => {
  const { message, isVisible, isThinking, hideMessage } = useAIStore();

  if (!isVisible) return null;

  return (
    <div className="absolute top-24 left-1/2 -translate-x-1/2 z-40 w-full max-w-lg pointer-events-none animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="mx-4 bg-[#0f111a]/90 backdrop-blur-md border border-indigo-500/30 rounded-2xl shadow-[0_0_30px_rgba(99,102,241,0.2)] p-4 pointer-events-auto relative overflow-hidden">
        
        {/* Glow de Fundo */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-gradient-x" />

        <div className="flex items-start gap-4">
          {/* Avatar da IA */}
          <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/40 shrink-0">
            {isThinking ? (
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
            ) : (
              <Bot className="w-5 h-5 text-indigo-400" />
            )}
          </div>

          {/* Texto */}
          <div className="flex-1 pt-1">
            <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1 flex items-center gap-2">
              Cytyos Intelligence Core v2.0
              {isThinking && <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping" />}
            </h4>
            
            <p className="text-sm text-gray-200 leading-relaxed font-medium">
              {isThinking ? "Analisando dados geoespaciais e zoneamento..." : message}
            </p>
          </div>

          {/* Botão Fechar */}
          <button 
            onClick={hideMessage}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};