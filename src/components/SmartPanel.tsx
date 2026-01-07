import React, { useState, useEffect, useRef } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import * as turf from '@turf/turf';
import { useProjectStore, BlockUsage } from '../stores/useProjectStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useAIStore } from '../stores/aiStore'; // Import AI Store
import { analyzeProject } from '../services/aiService';
import logoFull from '../assets/logo-full.png'; 
import { 
  Download, LayoutGrid, Calculator,
  Copy, Layers, ArrowRightFromLine, AlertTriangle, CheckCircle2,
  Scale, Edit2, Save, Upload, Sparkles, Bot, Send, X, Globe, ChevronDown, 
  Trash2, Coins, FileText, MapPin, Rocket, Check 
} from 'lucide-react';

interface ChatMessage { role: 'user' | 'assistant'; content: string; }

type MobileState = 'min' | 'mid' | 'max';

export const SmartPanel = () => {
  const { t, i18n } = useTranslation();
  const { blocks, land, metrics, currency, setCurrency, updateBlock, removeBlock, duplicateBlock, updateLand, calculateMetrics, loadProject } = useProjectStore();
  
  // Stores
  const { 
      setPaywallOpen, 
      urbanContext, 
      setUrbanContext, 
      measurementSystem,
      isZoningModalOpen, 
      setZoningModalOpen,
      isRoadmapOpen,
      setRoadmapOpen
  } = useSettingsStore();

  // AI Store Hook
  const { setThinking, setMessage } = useAIStore();

  const [activeTab, setActiveTab] = useState<'editor' | 'financial'>('editor');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // UI States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [userQuery, setUserQuery] = useState('');
  
  const [mobileState, setMobileState] = useState<MobileState>('min');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (calculateMetrics) calculateMetrics(); }, [blocks, land]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages, isChatOpen]);

  // --- LOGIC: ANALYZE ZONING TEXT ---
  const handleAnalyzeLaw = () => {
      setZoningModalOpen(false); 
      setIsChatOpen(true);        
      setIsAiLoading(true);

      const farRegex = /(?:far|c\.?a\.?|coeficiente)[^0-9]*(\d+(\.\d+)?)/i;
      const occRegex = /(?:occupancy|t\.?o\.?|taxa)[^0-9]*(\d+(\.\d+)?)/i;
      const farMatch = urbanContext.match(farRegex);
      const occMatch = urbanContext.match(occRegex);

      let detectedFar = land.maxFar;
      let detectedOcc = land.maxOccupancy;
      let foundSomething = false;

      if (farMatch && farMatch[1]) {
          detectedFar = parseFloat(farMatch[1]);
          foundSomething = true;
      }
      if (occMatch && occMatch[1]) {
          let val = parseFloat(occMatch[1]);
          if (val <= 1 && val > 0) val = val * 100; 
          detectedOcc = val;
          foundSomething = true;
      }

      setTimeout(() => {
          if (foundSomething) {
              updateLand({ maxFar: detectedFar, maxOccupancy: detectedOcc });
              setChatMessages(prev => [...prev, { role: 'assistant', content: t('zoning.ai_success', { text: urbanContext.substring(0, 20) + '...', far: detectedFar, occ: detectedOcc }) }]);
          } else {
              setChatMessages(prev => [...prev, { role: 'assistant', content: "I analyzed the text but couldn't strictly identify numbers. Try format: 'CA: 4.0' or 'TO: 70%'." }]);
          }
          setIsAiLoading(false);
      }, 1500);
  };

  const isImperial = measurementSystem === 'imperial';
  const fmtDist = (val: number) => isImperial ? (val * 3.28084).toFixed(1) + ' ft' : val.toFixed(1) + ' m';
  const changeLanguage = (lng: string) => { i18n.changeLanguage(lng); setIsLangMenuOpen(false); };
  const changeCurrency = (curr: string) => { setCurrency(curr); setIsCurrencyMenuOpen(false); };
  const cycleMobileState = () => { if (window.innerWidth < 768) setMobileState(prev => prev === 'min' ? 'mid' : prev === 'mid' ? 'max' : 'min'); };
  const getMobileHeightClass = () => mobileState === 'mid' ? 'h-[50vh]' : mobileState === 'max' ? 'h-[95vh]' : 'h-28';
  
  // --- AI ANALYSIS (Connected to Global Bubble) ---
  const handleStartAnalysis = async () => {
    // Uses the Global AI Store (Bubble) instead of internal chat
    setThinking(true);
    try {
        const report = await analyzeProject([{ role: 'user', content: "Analyze my project." }], { metrics, land, blocks, currency }, i18n.language);
        setMessage(report); // Display in the "Bubble"
    } catch (e) { 
        setMessage("⚠️ Connection Error."); 
    }
  };

  // Internal chat handler (optional use)
  const handleSendMessage = async () => {
    if (!userQuery.trim()) return;
    const newMsg: ChatMessage = { role: 'user', content: userQuery };
    const updatedHistory = [...chatMessages, newMsg];
    setChatMessages(updatedHistory);
    setUserQuery('');
    setIsAiLoading(true);
    try {
        const reply = await analyzeProject(updatedHistory, { metrics, land, blocks, currency }, i18n.language);
        setChatMessages(prev => [...prev, { role: 'assistant', content: reply || "Error." }]);
    } catch (e) { setChatMessages(prev => [...prev, { role: 'assistant', content: "⚠️ Error." }]); } finally { setIsAiLoading(false); }
  };

  const handleSaveProject = () => {
    const data = JSON.stringify({ version: '1.0', date: new Date().toISOString(), blocks, land, currency }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `cytyos-project.json`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { try { loadProject(JSON.parse(ev.target?.result as string)); } catch (err) { alert("Error loading file"); } };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleSetbackChange = (blockId: string, newSetback: number) => {
    if (newSetback < 0) return;
    const block = blocks.find(b => b.id === blockId);
    if (!block || !land.geometry) return;
    try {
      const landPoly = turf.polygon(land.geometry.coordinates);
      const buffered = turf.buffer(landPoly, -newSetback, { units: 'meters' });
      if (buffered && buffered.geometry) updateBlock(blockId, { setback: newSetback, coordinates: buffered.geometry.coordinates, baseArea: turf.area(buffered) });
    } catch (e) { console.error(e); }
  };

  const USAGE_OPTIONS: { value: BlockUsage; label: string }[] = [
    { value: 'residential', label: t('usage.residential') },
    { value: 'corporate', label: t('usage.corporate') },
    { value: 'retail', label: t('usage.retail') },
    { value: 'hotel', label: t('usage.hotel') },
    { value: 'parking', label: t('usage.parking') },
    { value: 'amenities', label: t('usage.amenities') },
  ];

  const money = (val: number) => new Intl.NumberFormat(i18n.language === 'pt' ? 'pt-BR' : 'en-US', { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(val);
  const num = (val: number) => new Intl.NumberFormat(i18n.language === 'pt' ? 'pt-BR' : 'en-US', { maximumFractionDigits: 1 }).format(val);
  const dec = (val: number) => new Intl.NumberFormat(i18n.language === 'pt' ? 'pt-BR' : 'en-US', { maximumFractionDigits: 2 }).format(val);

  return (
    <>
    {/* --- ROADMAP MODAL --- */}
    {isRoadmapOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="w-full max-w-5xl bg-[#0f111a] border border-gray-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-gray-800 flex justify-between items-start bg-gradient-to-r from-gray-900 to-[#0f111a]">
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                            <Rocket className="w-6 h-6 text-indigo-500" /> {t('roadmap.title')}
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">{t('roadmap.subtitle')}</p>
                    </div>
                    <button onClick={() => setRoadmapOpen(false)} className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full text-white transition-colors"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Columns (Simplified for brevity, same content) */}
                        <div className="bg-gray-800/30 rounded-2xl p-5 border border-green-500/20 relative group hover:border-green-500/40 transition-colors">
                             <h3 className="text-green-400 font-bold uppercase text-xs mb-1">Live Now</h3>
                             <h4 className="text-xl font-bold text-white mb-4">{t('roadmap.col1.title')}</h4>
                        </div>
                        <div className="bg-gradient-to-b from-indigo-900/20 to-gray-900/50 rounded-2xl p-5 border border-indigo-500/50 relative">
                             <h3 className="text-indigo-400 font-bold uppercase text-xs mb-1">Coming Soon</h3>
                             <h4 className="text-xl font-bold text-white mb-4">{t('roadmap.col2.title')}</h4>
                        </div>
                         <div className="bg-gray-800/30 rounded-2xl p-5 border border-purple-500/20 relative group hover:border-purple-500/40 transition-colors">
                             <h3 className="text-purple-400 font-bold uppercase text-xs mb-1">Future</h3>
                             <h4 className="text-xl font-bold text-white mb-4">{t('roadmap.col3.title')}</h4>
                        </div>
                    </div>
                </div>
                <div className="p-6 border-t border-gray-800 bg-gray-900/80 flex justify-center">
                    <button onClick={() => setPaywallOpen(true)} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg transition-transform hover:scale-105">{t('roadmap.cta')}</button>
                </div>
            </div>
        </div>
    )}

    {/* --- ZONING MODAL --- */}
    {isZoningModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-[#0f111a] border border-gray-700 w-full max-w-lg rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                    <h3 className="text-white font-bold flex items-center gap-2"><FileText className="w-5 h-5 text-indigo-400" /> {t('zoning.title')}</h3>
                    <button onClick={() => setZoningModalOpen(false)} className="text-gray-400 hover:text-white p-1 rounded-full"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-4 bg-[#0f111a]">
                    <textarea value={urbanContext} onChange={(e) => setUrbanContext(e.target.value)} placeholder={t('zoning.placeholder')} className="w-full h-48 bg-gray-900/50 border border-gray-700 rounded-xl p-4 text-sm text-white placeholder-gray-500 focus:border-indigo-500 outline-none resize-none" />
                </div>
                <div className="p-4 border-t border-gray-800 bg-gray-900/50 flex justify-end">
                    <button onClick={handleAnalyzeLaw} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-xl font-bold text-sm flex items-center gap-2"><Sparkles className="w-4 h-4" /> {t('zoning.analyze_btn')}</button>
                </div>
            </div>
        </div>
    )}

    {/* --- MAIN PANEL (Updated with pointer-events-auto) --- */}
    <div className={`fixed md:absolute left-0 md:left-4 bottom-[40px] md:bottom-12 md:top-4 w-full md:w-96 flex flex-col shadow-2xl overflow-hidden rounded-t-3xl md:rounded-2xl border-t md:border border-gray-800 bg-[#0f111a]/95 backdrop-blur-md z-[60] transition-all duration-500 pointer-events-auto ${getMobileHeightClass()} md:h-auto md:max-h-[95vh]`}>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />

      {/* HEADER */}
      <div className="p-4 bg-gradient-to-b from-gray-900 to-gray-900/50 border-b border-gray-800 shrink-0 relative cursor-pointer md:cursor-default" onClick={cycleMobileState}>
        <div className="md:hidden absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-700 rounded-full opacity-50"></div>

        <div className="flex justify-between items-center mb-4 mt-2 md:mt-0">
             <img src={logoFull} alt="Cytyos" className="h-8 w-auto object-contain transition-opacity hover:opacity-80" />
            
            <div className="flex gap-2 items-center" onClick={(e) => e.stopPropagation()}>
                
                {/* --- CURRENCY SELECTOR --- */}
                <div className="relative">
                    <button onClick={() => { setIsCurrencyMenuOpen(!isCurrencyMenuOpen); setIsLangMenuOpen(false); }} className={`p-1.5 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg flex items-center gap-1 transition-colors border border-gray-700 ${isCurrencyMenuOpen ? 'bg-gray-700 text-white' : ''}`}>
                        <Coins className="w-4 h-4" /> <span className="text-[10px] uppercase font-bold">{currency}</span>
                    </button>
                    {isCurrencyMenuOpen && (
                        <div className="absolute right-0 top-full mt-2 w-32 bg-[#0f111a] border border-gray-700 rounded-lg shadow-xl z-[100] max-h-64 overflow-y-auto custom-scrollbar">
                             <div className="px-3 py-1.5 text-[9px] font-bold text-gray-500 uppercase tracking-wider">{t('currency.main')}</div>
                             {['USD', 'BRL', 'EUR'].map(c => <button key={c} onClick={() => changeCurrency(c)} className="block w-full text-left px-3 py-1.5 text-xs text-white hover:bg-gray-800 border-b border-gray-800/50 font-bold">{c}</button>)}
                             <div className="px-3 py-1.5 text-[9px] font-bold text-gray-500 uppercase tracking-wider mt-1">{t('currency.latam')}</div>
                             {['MXN', 'ARS', 'CLP', 'COP', 'UYU'].map(c => <button key={c} onClick={() => changeCurrency(c)} className="block w-full text-left px-3 py-1.5 text-xs text-gray-300 hover:text-white hover:bg-gray-800 border-b border-gray-800/50">{c}</button>)}
                        </div>
                    )}
                </div>

                {/* --- LANGUAGE SELECTOR --- */}
                <div className="relative">
                    <button onClick={() => { setIsLangMenuOpen(!isLangMenuOpen); setIsCurrencyMenuOpen(false); }} className="p-1.5 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg flex items-center gap-1 transition-colors border border-gray-700">
                        <Globe className="w-4 h-4" /> <span className="text-[10px] uppercase font-bold">{i18n.language.substring(0,2)}</span>
                    </button>
                    {isLangMenuOpen && (
                        <div className="absolute right-0 top-full mt-2 w-32 bg-[#0f111a] border border-gray-700 rounded-lg shadow-xl z-[100]">
                            {['en','pt','es','fr','zh'].map(lang => <button key={lang} onClick={() => changeLanguage(lang)} className="block w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-gray-800 hover:text-white border-b border-gray-800 last:border-0 uppercase">{lang}</button>)}
                        </div>
                    )}
                </div>

                <div className="flex gap-1">
                    <button onClick={handleSaveProject} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded" title={t('header.save')}><Save className="w-4 h-4" /></button>
                    <button onClick={() => fileInputRef.current?.click()} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded" title={t('header.load')}><Upload className="w-4 h-4" /></button>
                </div>
            </div>
        </div>
        
        {activeTab !== 'settings' && (
            <>
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">{t('header.revenue')}</span>
                        <div className="text-xl font-bold text-white tracking-tight leading-none mt-0.5">{money(metrics.revenue)}</div>
                    </div>
                    <div className="text-right">
                        <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">{t('header.margin')}</span>
                        <div className={`text-lg font-bold leading-none mt-0.5 ${metrics.margin > 15 ? 'text-green-400' : 'text-yellow-400'}`}>{num(metrics.margin)}%</div>
                    </div>
                </div>
                <div className="flex gap-1 p-1 bg-black/40 rounded-xl border border-gray-800/50" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => setActiveTab('editor')} className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wide rounded-lg flex gap-2 justify-center items-center transition-all ${activeTab === 'editor' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}><LayoutGrid className="w-3.5 h-3.5" /> {t('tabs.design')}</button>
                    <button onClick={() => setActiveTab('financial')} className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wide rounded-lg flex gap-2 justify-center items-center transition-all ${activeTab === 'financial' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}><Calculator className="w-3.5 h-3.5" /> {t('tabs.economics')}</button>
                </div>
            </>
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0f111a] flex flex-col">
          {activeTab === 'editor' && (
            <>
                {blocks.length > 0 ? (
                    <>
                        <div className="px-4 py-3 bg-[#0f111a] border-b border-gray-800 shrink-0 shadow-md z-10">
                            <div className="bg-gray-800/30 p-3 rounded-xl border border-gray-700/50 space-y-3">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-[10px] uppercase font-bold text-gray-500 flex items-center gap-1"><Scale className="w-3 h-3" /> {t('compliance.title')}</h3>
                                    {metrics.isFarValid && metrics.isOccupancyValid ? <span className="text-[10px] text-green-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> {t('compliance.legal')}</span> : <span className="text-[10px] text-red-400 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> {t('compliance.violation')}</span>}
                                </div>
                                <div>
                                    <div className="flex justify-between text-[10px] mb-1"><span className="text-gray-400">{t('compliance.far')}</span><span className={metrics.isFarValid ? 'text-white' : 'text-red-400 font-bold'}>{dec(metrics.far)} / {dec(land.maxFar)}</span></div>
                                    <div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden"><div className={`h-full rounded-full ${metrics.isFarValid ? 'bg-blue-500' : 'bg-red-500'}`} style={{ width: `${Math.min((metrics.far / land.maxFar) * 100, 100)}%` }} /></div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-[10px] mb-1"><span className="text-gray-400">{t('compliance.occ')}</span><span className={metrics.isOccupancyValid ? 'text-white' : 'text-red-400 font-bold'}>{num(metrics.occupancy)}% / {num(land.maxOccupancy)}%</span></div>
                                    <div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden"><div className={`h-full rounded-full ${metrics.isOccupancyValid ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${Math.min((metrics.occupancy / land.maxOccupancy) * 100, 100)}%` }} /></div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 space-y-3 pb-24 md:pb-4">
                            {blocks.map((block) => (
                                <div key={block.id} className={`p-3 rounded-xl border transition-all ${block.type === 'podium' ? 'bg-indigo-900/10 border-indigo-500/30' : 'bg-gray-800/40 border-gray-700'}`}>
                                    <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-700/30">
                                        <div className="flex items-center gap-2 w-full group/name relative mr-2">
                                            <Layers className={`w-3.5 h-3.5 shrink-0 ${block.type === 'podium' ? 'text-indigo-400' : 'text-blue-400'}`} />
                                            <input className="bg-transparent text-white font-medium text-xs w-full outline-none pr-6 focus:bg-gray-800/50 rounded px-1 transition-colors" value={block.name} onChange={(e) => updateBlock(block.id, { name: e.target.value })} />
                                            <Edit2 className="w-2.5 h-2.5 text-gray-500 absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover/name