import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Loader2 } from 'lucide-react';
import { useMap } from '../contexts/MapContext';
import { useSettingsStore } from '../stores/settingsStore';
import { useTranslation } from '../utils/i18n';
import { fetchAIResponse } from '../services/aiService';
import { calculatePolygonArea, applySetback } from '../utils/geoUtils';
import * as turf from '@turf/turf';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { language, isPaywallOpen } = useSettingsStore();
  const t = useTranslation(language);

  const {
    terrainArea,
    terrainGeometry,
    volumetriaBlocks,
    coefficientCA,
  } = useMap();

  const hasApiKey = Boolean(import.meta.env.VITE_OPENAI_API_KEY);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const calculateBlockAreas = () => {
    if (!terrainGeometry) return [];

    let currentGeometry = terrainGeometry;
    const blockAreas: Array<{ id: string; name: string; height: number; setback: number; area: number }> = [];

    for (let i = 0; i < volumetriaBlocks.length; i++) {
      const block = volumetriaBlocks[i];

      if (block.setback > 0) {
        const setbackGeometry = applySetback(currentGeometry, block.setback);
        if (setbackGeometry) {
          currentGeometry = setbackGeometry;
        }
      }

      const area = calculatePolygonArea(currentGeometry);
      blockAreas.push({
        id: block.id,
        name: block.name,
        height: block.height,
        setback: block.setback,
        area: area,
      });
    }

    return blockAreas;
  };

  const calculateTotalBuiltArea = () => {
    const blockAreas = calculateBlockAreas();
    return blockAreas.reduce((sum, block) => sum + block.area, 0);
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: Message = {
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue('');
    setIsTyping(true);

    try {
      const blockAreas = calculateBlockAreas();
      const totalBuiltArea = calculateTotalBuiltArea();
      const currentFar = terrainArea > 0 ? totalBuiltArea / terrainArea : 0;

      const context = {
        landArea: terrainArea,
        totalBuiltArea: totalBuiltArea,
        blocks: blockAreas,
        zoning: {
          farLimit: coefficientCA,
          currentFar: currentFar,
        },
      };

      const aiResponseText = await fetchAIResponse(
        updatedMessages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        context,
        language
      );

      const assistantMessage: Message = {
        role: 'assistant',
        content: aiResponseText,
        timestamp: new Date(),
      };

      setMessages([...updatedMessages, assistantMessage]);

      const hasLicense = localStorage.getItem('cytyos-license');
      if (!hasLicense) {
        setTimeout(() => {
          useSettingsStore.getState().setPaywallOpen(true);
        }, 2000);
      }
    } catch (error) {
      console.error('❌ Chat Error (Unexpected):', error);

      const errorMessage: Message = {
        role: 'assistant',
        content: language === 'en'
          ? '⚠️ Unexpected error processing your message. Please try again.\n\nIf the problem persists, open the Console (F12) for more details.'
          : '⚠️ Erro inesperado ao processar sua mensagem. Por favor, tente novamente.\n\nSe o problema persistir, abra o Console (F12) para mais detalhes.',
        timestamp: new Date(),
      };

      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-[9999] w-96 h-[500px] bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div
                    className={`absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900 ${
                      hasApiKey ? 'bg-green-500' : 'bg-orange-500'
                    }`}
                    title={hasApiKey ? 'OpenAI Conectado' : 'Modo Local'}
                  />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{t('chat_title')}</h3>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    {hasApiKey ? (
                      <>
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        {t('smart_mode')}
                      </>
                    ) : (
                      <>
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                        {t('local_offline')}
                      </>
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <Bot className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-white font-semibold mb-2">{t('chat_welcome')}</h4>
                  <p className="text-sm text-gray-400 mb-4">
                    {t('chat_greeting')}
                  </p>
                  <div className="space-y-2 text-xs text-left">
                    {language === 'en' ? (
                      <>
                        <button
                          onClick={() => setInputValue('How can I improve this project?')}
                          className="w-full p-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg text-gray-300 transition-colors text-left"
                        >
                          How can I improve this project?
                        </button>
                        <button
                          onClick={() => setInputValue('What is the unused building potential?')}
                          className="w-full p-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg text-gray-300 transition-colors text-left"
                        >
                          What is the unused building potential?
                        </button>
                        <button
                          onClick={() => setInputValue('Is this project financially viable?')}
                          className="w-full p-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg text-gray-300 transition-colors text-left"
                        >
                          Is this project financially viable?
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setInputValue('Como posso melhorar esse projeto?')}
                          className="w-full p-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg text-gray-300 transition-colors text-left"
                        >
                          Como posso melhorar esse projeto?
                        </button>
                        <button
                          onClick={() => setInputValue('Qual o potencial construtivo não utilizado?')}
                          className="w-full p-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg text-gray-300 transition-colors text-left"
                        >
                          Qual o potencial construtivo não utilizado?
                        </button>
                        <button
                          onClick={() => setInputValue('Este projeto é financeiramente viável?')}
                          className="w-full p-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg text-gray-300 transition-colors text-left"
                        >
                          Este projeto é financeiramente viável?
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                        : 'bg-slate-800 text-gray-200'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-60 mt-2">
                      {message.timestamp.toLocaleTimeString(language === 'en' ? 'en-US' : 'pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 rounded-2xl px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                      <span className="text-sm text-gray-400">{t('chat_thinking')}</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-slate-700">
              <div className="flex items-center space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isPaywallOpen ? t('chat_placeholder_locked') : t('chat_placeholder')}
                  disabled={isTyping || isPaywallOpen}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition-colors disabled:opacity-50"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isTyping || isPaywallOpen}
                  className="p-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[9999] w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-full shadow-2xl shadow-cyan-500/30 flex items-center justify-center transition-all transform hover:scale-110 active:scale-95"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Bot className="w-6 h-6" />
      </motion.button>
    </>
  );
}
