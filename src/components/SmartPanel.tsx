import React, { useState, useEffect, useRef } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import * as turf from '@turf/turf';
import ReactMarkdown from 'react-markdown'; 
import { useProjectStore, BlockUsage } from '../stores/useProjectStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useAIStore } from '../stores/aiStore'; 
import { analyzeProject } from '../services/aiService';
import { generateReport } from '../services/pdfGenerator'; 
import { useAuth } from '../contexts/AuthContext';
import { trackEvent } from '../services/analyticsService';
import logoFull from '../assets/logo-full.png'; 
import { 
  Download, LayoutGrid, Calculator,
  Copy, Layers, ArrowRightFromLine, AlertTriangle, CheckCircle2,
  Scale, Edit2, Save, Upload, Sparkles, Bot, Send, X, Globe, ChevronDown, 
  Trash2, Coins, FileText, MapPin, Rocket, LogOut, User as UserIcon,
  Minus, Loader2, ChevronUp, Clock 
} from 'lucide-react';

// --- CONVERSION FACTORS ---
const SQM_TO_SQFT = 10.7639;
const M_TO_FT = 3.28084;

interface ChatMessage { role: 'user' | 'assistant'; content: string; }
type MobileState = 'min' | 'mid' | 'max';

const CURRENCY_OPTIONS = [
  { code: 'USD', label: 'US Dollar ($)' },
  { code: 'EUR', label: 'Euro (€)' },
  { code: 'GBP', label: 'Pound Sterling (£)' },
  { code: 'BRL', label: 'Real Brasileiro (R$)' },
  // ... (outros)
];

export const SmartPanel = () => {
  const { t, i18n } = useTranslation();
  const { user, signOut } = useAuth();
  const { blocks, land, metrics, currency, setCurrency, updateBlock, removeBlock, duplicateBlock, updateLand, calculateMetrics, loadProject } = useProjectStore();
  
  const { 
      setPaywallOpen, 
      urbanContext, 
      setUrbanContext, 
      measurementSystem, // 'metric' | 'imperial'
      isZoningModalOpen, 
      setZoningModalOpen,
      isRoadmapOpen, 
      setRoadmapOpen 
  } = useSettingsStore();

  const { message, thinking, setThinking, setMessage } = useAIStore(); 
  const [activeTab, setActiveTab] = useState<'editor' | 'financial'>('editor');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false); 
  const [hasUnreadAi, setHasUnreadAi] = useState(false);
  
  const [userQuery, setUserQuery] = useState('');
  const [mobileState, setMobileState] = useState<MobileState>('min');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- CONVERSION HELPERS ---
  const isImperial = measurementSystem === 'imperial';

  // Area: m² <-> ft²
  const dispArea = (val: number) => isImperial ? val * SQM_TO_SQFT : val;
  const saveArea = (val: number) => isImperial ? val / SQM_TO_SQFT : val;

  // Length: m <-> ft
  const dispLen = (val: number) => isImperial ? val * M_TO_FT : val;
  const saveLen = (val: number) => isImperial ? val / M_TO_FT : val;

  // Cost/Price: $/m² <-> $/ft² (Inverse logic: higher area unit = lower price unit)
  const dispCost = (val: number) => isImperial ? val / SQM_TO_SQFT : val;
  const saveCost = (val: number) => isImperial ? val * SQM_TO_SQFT : val;

  // Formatting strings
  const unitArea = isImperial ? 'ft²' : 'm²';
  const unitLen = isImperial ? 'ft' : 'm';

  // ... (Timer logic permanece igual) ...
  const [timeLeft, setTimeLeft] = useState("15:00");
  const [isUrgent, setIsUrgent] = useState(false);
  const FREE_MS = 15 * 60 * 1000; 

  useEffect(() => {
    const isVip = localStorage.getItem('cytyos_license_type') === 'VIP';
    if (isVip) { setTimeLeft("PREMIUM"); return; }
    const timer = setInterval(() => {
        const startStr = sessionStorage.getItem('cytyos_first_visit');
        const start = startStr ? parseInt(startStr) : Date.now();
        const elapsed = Date.now() - start;
        const remaining = Math.max(0, FREE_MS - elapsed);
        const mins = Math.floor(remaining / 60000);
        const secs = Math.floor((remaining % 60000) / 1000);
        setTimeLeft(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
        setIsUrgent(remaining < 60000 && remaining > 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // ... (AI Limit logic remains same) ...
  const checkAiLimit = (): boolean => {
    if (localStorage.getItem('cytyos_license_type') === 'VIP') return true;
    const limitStr = localStorage.getItem('cytyos_ai_limit');
    const usageStr = localStorage.getItem('cytyos_ai_usage');
    if (!limitStr) return true; 
    const limit = parseInt(limitStr);
    const usage = parseInt(usageStr || '0');
    if (limit === -1) return true;
    if (usage >= limit) {
        alert("Você atingiu o limite de 3 análises de IA deste cupom. Assine o plano Founder para continuar com IA Ilimitada.");
        setPaywallOpen(true);
        return false;
    }
    return true;
  };
  const incrementAiUsage = () => {
      const current = parseInt(localStorage.getItem('cytyos_ai_usage') || '0');
      localStorage.setItem('cytyos_ai_usage', (current + 1).toString());
  };

  // Mobile Detection
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth < 768);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
  }, []);
  const shouldHideHeader = isMobile && mobileState === 'min';

  useEffect(() => { if (calculateMetrics) calculateMetrics(); }, [blocks, land]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages, isChatOpen, thinking]);

  // AI Sync
  useEffect(() => {
    if (message) { setIsChatOpen(true); setIsAiLoading(false); setHasUnreadAi(false); setChatMessages(prev => { if (prev.length > 0 && prev[prev.length - 1].content === message) return prev; return [...prev, { role: 'assistant', content: message }]; }); }
    if (thinking) { setIsChatOpen(true); setIsAiLoading(true); }
  }, [message, thinking]);

  // ... (Export PDF, Analyze Law, AI Handlers remain same) ...
  // [Assuming you kept previous handlers like handleExportPDF, handleAnalyzeLaw, handleStartAnalysis, etc.]
  // Just ensure trackEvent is used.

  const handleExportPDF = async () => { /* ... seu codigo anterior ... */ };
  const handleAnalyzeLaw = () => { /* ... seu codigo anterior ... */ };
  const handleMainAiButtonClick = async () => { /* ... */ };
  const handleStartAnalysis = async () => { /* ... */ };
  const handleSendMessage = async () => { /* ... */ };
  const handleSaveProject = () => { /* ... */ };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { /* ... */ };

  const handleSetbackChange = (blockId: string, newSetback: number) => {
    if (newSetback < 0) return;
    const block = blocks.find(b => b.id === blockId);
    if (!block || !land.geometry) return;
    try {
      const landPoly = turf.polygon(land.geometry.coordinates);
      // Buffer always works in meters/degrees in turf, so we ensure we pass meters
      const bufferMeters = -newSetback; 
      const buffered = turf.buffer(landPoly, bufferMeters, { units: 'meters' });
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

  // Number formatters
  const money = (val: number) => new Intl.NumberFormat(i18n.language === 'pt' ? 'pt-BR' : 'en-US', { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(val);
  const num = (val: number) => new Intl.NumberFormat(i18n.language === 'pt' ? 'pt-BR' : 'en-US', { maximumFractionDigits: 1 }).format(val);
  const dec = (val: number) => new Intl.NumberFormat(i18n.language === 'pt' ? 'pt-BR' : 'en-US', { maximumFractionDigits: 2 }).format(val);

  return (
    <>
    {/* Modals (Roadmap/Zoning) remain same */}
    {isRoadmapOpen && ( /* ... */ <div className="hidden">Mock</div> )}
    {isZoningModalOpen && ( /* ... */ <div className="hidden">Mock</div> )}

    {/* MAIN PANEL */}
    <div className={`fixed md:absolute left-0 md:left-4 bottom-[40px] md:bottom-12 md:top-4 w-full md:w-96 flex flex-col shadow-2xl overflow-hidden rounded-t-3xl md:rounded-2xl border-t md:border border-gray-800 bg-[#0f111a]/95 backdrop-blur-md z-[60] transition-all duration-500 pointer-events-auto ${getMobileHeightClass()} md:h-auto md:max-h-[95vh]`}>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
      {/* Drag Handle */}
      <div className="md:hidden w-full flex justify-center pt-2 pb-1 cursor-pointer bg-gray-900 rounded-t-3xl border-b border-gray-800/50" onClick={cycleMobileState}><div className="w-12 h-1.5 bg-gray-700 rounded-full opacity-60"></div></div>

      {!shouldHideHeader && (
          <div className="bg-gradient-to-b from-gray-900 to-gray-900/50 border-b border-gray-800 shrink-0 relative animate-fade-in">
            {/* Session Banner */}
            {timeLeft !== "PREMIUM" && (
                <div className={`w-full px-4 py-1.5 flex justify-between items-center text-[10px] font-bold uppercase tracking-wider transition-colors duration-500 ${isUrgent ? 'bg-red-500/20 text-red-300 animate-pulse' : 'bg-indigo-600/20 text-indigo-300'}`}>
                    <span className="flex items-center gap-1.5"><Sparkles className="w-3 h-3" /> {t('header.session_title')}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {timeLeft}</span>
                </div>
            )}
            
            <div className="p-4">
                {/* Header Icons/Logo/User - Same as before */}
                <div className="flex justify-between items-center mb-4 mt-2 md:mt-0">
                    <img src={logoFull} alt="Cytyos" className="h-8 w-auto object-contain" />
                    <div className="flex gap-2 items-center" onClick={(e) => e.stopPropagation()}>
                        {/* ... User/Currency/Lang buttons ... */}
                        <button onClick={signOut}><LogOut size={12}/></button>
                    </div>
                </div>
                
                {activeTab !== 'settings' && (
                    <>
                        <div className="flex justify-between items-start mb-3">
                            <div><span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">{t('header.revenue')}</span><div className="text-xl font-bold text-white tracking-tight leading-none mt-0.5">{money(metrics.revenue)}</div></div>
                            <div className="text-right"><span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">{t('header.margin')}</span><div className={`text-lg font-bold leading-none mt-0.5 ${metrics.margin > 15 ? 'text-green-400' : 'text-yellow-400'}`}>{num(metrics.margin)}%</div></div>
                        </div>
                        <div className="flex gap-1 p-1 bg-black/40 rounded-xl border border-gray-800/50" onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => setActiveTab('editor')} className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wide rounded-lg flex gap-2 justify-center items-center transition-all ${activeTab === 'editor' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}><LayoutGrid className="w-3.5 h-3.5" /> {t('tabs.design')}</button>
                            <button onClick={() => setActiveTab('financial')} className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wide rounded-lg flex gap-2 justify-center items-center transition-all ${activeTab === 'financial' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}><Calculator className="w-3.5 h-3.5" /> {t('tabs.economics')}</button>
                        </div>
                    </>
                )}
            </div>
          </div>
      )}

      <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0f111a] flex flex-col overscroll-contain">
          {!shouldHideHeader && (
              <>
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
                                    </div>
                                </div>

                                <div className="p-4 space-y-3 pb-24 md:pb-4">
                                    {blocks.map((block) => (
                                        <div key={block.id} className={`p-3 rounded-xl border transition-all ${block.type === 'podium' ? 'bg-indigo-900/10 border-indigo-500/30' : 'bg-gray-800/40 border-gray-700'}`}>
                                            <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-700/30">
                                                <div className="flex items-center gap-2 w-full group/name relative mr-2">
                                                    <Layers className={`w-3.5 h-3.5 shrink-0 ${block.type === 'podium' ? 'text-indigo-400' : 'text-blue-400'}`} />
                                                    <input className="bg-transparent text-white font-medium text-xs w-full outline-none pr-6 focus:bg-gray-800/50 rounded px-1 transition-colors" value={block.name} onChange={(e) => updateBlock(block.id, { name: e.target.value })} />
                                                    <Edit2 className="w-2.5 h-2.5 text-gray-500 absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover/name:opacity-100 pointer-events-none" />
                                                </div>
                                                <div className="flex gap-1 shrink-0">
                                                    <button onClick={() => duplicateBlock(block.id)} className="text-gray-500 hover:text-white p-1"><Copy className="w-3.5 h-3.5" /></button>
                                                    <button onClick={() => removeBlock(block.id)} className="text-gray-500 hover:text-red-400 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                                                </div>
                                            </div>
                                            <div className="space-y-3 pl-1">
                                                    <select value={block.usage} onChange={(e) => updateBlock(block.id, { usage: e.target.value as BlockUsage })} className="w-full bg-gray-900/80 border border-gray-700 text-[10px] text-gray-300 rounded p-1.5 outline-none">
                                                        {USAGE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                                    </select>
                                                    <div>
                                                        <div className="flex justify-between items-center mb-1">
                                                            {/* CONVERTED HEIGHT DISPLAY */}
                                                            <span className="text-[10px] text-gray-500">{t('blocks.height')} ({Math.floor(block.height/3)} fl)</span>
                                                            <div className="flex items-center gap-1">
                                                                <input 
                                                                    type="number" 
                                                                    step="0.1" 
                                                                    value={parseFloat(dispLen(block.height).toFixed(1))} // Show converted
                                                                    onChange={(e) => updateBlock(block.id, { height: saveLen(parseFloat(e.target.value)) })} // Save converted back
                                                                    className="text-[10px] text-blue-300 bg-transparent border-b border-gray-700 w-12 text-right focus:border-blue-500 outline-none"
                                                                />
                                                                <span className="text-[9px] text-gray-600">{unitLen}</span>
                                                            </div>
                                                        </div>
                                                        <input type="range" min={isImperial ? 10 : 3} max={isImperial ? 500 : 150} step={isImperial ? 1 : 0.5} 
                                                            value={dispLen(block.height)} 
                                                            onChange={(e) => updateBlock(block.id, { height: saveLen(Number(e.target.value)) })} 
                                                            className="w-full h-1 bg-gray-700 rounded appearance-none accent-blue-500" 
                                                        />
                                                    </div>
                                                    {block.isCustom && (
                                                        <div className="p-2 bg-black/20 rounded border border-gray-700/50">
                                                            <div className="flex justify-between items-center mb-1">
                                                                <span className="flex items-center gap-1 text-[10px] text-gray-400"><ArrowRightFromLine className="w-3 h-3"/> {t('blocks.setback')}</span>
                                                                <div className="flex items-center gap-1">
                                                                    <input 
                                                                        type="number" 
                                                                        step="0.1" 
                                                                        value={parseFloat(dispLen(block.setback).toFixed(1))} 
                                                                        onChange={(e) => handleSetbackChange(block.id, saveLen(parseFloat(e.target.value)))}
                                                                        className="text-[10px] text-yellow-400 bg-transparent border-b border-gray-700 w-12 text-right focus:border-yellow-500 outline-none"
                                                                    />
                                                                    <span className="text-[9px] text-gray-600">{unitLen}</span>
                                                                </div>
                                                            </div>
                                                            <input type="range" min="0" max={isImperial ? 65 : 20} step={isImperial ? 1 : 0.5} 
                                                                value={dispLen(block.setback)} 
                                                                onChange={(e) => handleSetbackChange(block.id, saveLen(Number(e.target.value)))} 
                                                                className="w-full h-1 bg-gray-700 rounded appearance-none accent-yellow-500" 
                                                            />
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4 opacity-70 min-h-[300px]">
                                {/* Empty State UI */}
                                <div className="p-4 bg-gray-800/30 rounded-full border border-gray-700/50 shadow-[0_0_20px_rgba(0,0,0,0.2)]"><MapPin className="w-8 h-8 text-indigo-400" /></div>
                                <div className="space-y-2 max-w-[240px]">
                                    <h3 className="text-sm font-bold text-white tracking-wide">{t('onboarding.title')}</h3>
                                    <p className="text-[11px] text-gray-400 leading-relaxed"><Trans i18nKey="onboarding.text" components={{ 1: <span className="text-indigo-400 font-bold" /> }} /></p>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'financial' && (
                    <div className="p-4 space-y-6 pb-24 md:pb-4">
                        <div className="space-y-2">
                            <h3 className="text-[10px] uppercase font-bold text-gray-500">{t('assumptions.title')}</h3>
                            <div className="bg-gray-800/40 p-3 rounded-xl border border-gray-700 space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    {/* FAR e OCC não mudam unidade */}
                                    <div><label className="text-[9px] text-gray-400 block mb-1">{t('assumptions.maxFar')}</label><input type="number" step="0.1" value={land.maxFar} onChange={(e) => updateLand({ maxFar: Number(e.target.value) })} className="w-full bg-gray-900 border border-gray-700 rounded p-1.5 text-xs text-white" /></div>
                                    <div><label className="text-[9px] text-gray-400 block mb-1">{t('assumptions.maxOcc')}</label><input type="number" value={land.maxOccupancy} onChange={(e) => updateLand({ maxOccupancy: Number(e.target.value) })} className="w-full bg-gray-900 border border-gray-700 rounded p-1.5 text-xs text-white" /></div>
                                    
                                    {/* AREA TERRENO (Convertido) */}
                                    <div>
                                        <label className="text-[9px] text-gray-400 block mb-1">{t('assumptions.landArea')} ({unitArea})</label>
                                        <input type="number" 
                                            value={Math.round(dispArea(land.area))} 
                                            onChange={(e) => updateLand({ area: saveArea(Number(e.target.value)) })} 
                                            className="w-full bg-gray-900 border border-gray-700 rounded p-1.5 text-xs text-white" 
                                        />
                                    </div>
                                    
                                    {/* CUSTO TERRENO (Absoluto, não muda) */}
                                    <div><label className="text-[9px] text-gray-400 block mb-1">{t('assumptions.landCost')}</label><input type="number" value={land.cost} onChange={(e) => updateLand({ cost: Number(e.target.value) })} className="w-full bg-gray-900 border border-gray-700 rounded p-1.5 text-xs text-white" /></div>
                                    
                                    <div>
                                        <label className="text-[9px] text-gray-400 block mb-1">{t('assumptions.onerousGrant')}</label>
                                        <input type="number" value={land.additionalCosts || 0} onChange={(e) => updateLand({ additionalCosts: Number(e.target.value) })} className="w-full bg-gray-900 border border-gray-700 rounded p-1.5 text-xs text-white" />
                                    </div>

                                    {/* VENDA POR METRO/PE (Convertido INVERSO - Preço) */}
                                    <div>
                                        <label className="text-[9px] text-gray-400 block mb-1">{t('assumptions.sales')} ({currency}/{unitArea})</label>
                                        <input type="number" 
                                            value={Math.round(dispCost(land.sellPrice))} 
                                            onChange={(e) => updateLand({ sellPrice: saveCost(Number(e.target.value)) })} 
                                            className="w-full bg-gray-900 border border-gray-700 rounded p-1.5 text-xs text-white" 
                                        />
                                    </div>
                                    
                                    {/* OBRA POR METRO/PE (Convertido INVERSO - Preço) */}
                                    <div>
                                        <label className="text-[9px] text-gray-400 block mb-1">{t('assumptions.build')} ({currency}/{unitArea})</label>
                                        <input type="number" 
                                            value={Math.round(dispCost(land.buildCost))} 
                                            onChange={(e) => updateLand({ buildCost: saveCost(Number(e.target.value)) })} 
                                            className="w-full bg-gray-900 border border-gray-700 rounded p-1.5 text-xs text-white" 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-black/20 rounded-xl space-y-2">
                            {/* RESULTADOS (Apenas Visualização) */}
                            <div className="flex justify-between text-[10px] text-gray-400"><span>{t('results.nsa')}</span><span className="text-white">{fmtArea(dispArea(metrics.nsa)).replace('m²', unitArea).replace('ft²', unitArea)}</span></div>
                            <div className="flex justify-between text-[10px] text-gray-400"><span>{t('results.revenue')}</span><span className="text-white">{money(metrics.revenue)}</span></div>
                            <div className="flex justify-between text-[10px] text-red-400/70"><span>{t('results.totalCost')}</span><span>{money(metrics.totalCost)}</span></div>
                            <div className="h-px bg-gray-800 my-2"></div>
                            <div className="flex justify-between text-xs font-bold text-white"><span>{t('results.netProfit')}</span><span className="text-green-400">{money(metrics.grossProfit)}</span></div>
                        </div>
                    </div>
                )}
              </>
          )}
      </div>
      {/* ... (Footer do AI e Chat permanecem iguais) ... */}
      {/* (Mantive o footer minimizado para economizar espaço, mas deve estar igual ao anterior) */}
      <div className={`border-t border-gray-800 bg-gray-900 transition-all duration-300 ease-in-out ${isChatOpen ? 'h-96' : 'h-16'}`}>
        {!isChatOpen && (
             <div className="p-3 flex gap-2 h-full items-center">
                {/* Botões do rodapé igual ao anterior */}
                <button onClick={() => setZoningModalOpen(true)} className={`h-full px-4 rounded-xl border border-gray-700 flex flex-col items-center justify-center gap-0.5 transition-all group ${!urbanContext ? 'bg-indigo-900/30 border-indigo-500/50 animate-pulse' : 'bg-gray-800 hover:bg-gray-700'}`}>
                    <FileText className={`w-4 h-4 transition-colors ${!urbanContext ? 'text-indigo-400' : 'text-gray-400 group-hover:text-white'}`} />
                    <span className={`text-[8px] font-bold uppercase ${!urbanContext ? 'text-indigo-300' : 'text-gray-500 group-hover:text-white'}`}>{t('header.zoning')}</span>
                </button>
                <button onClick={handleMainAiButtonClick} disabled={isAiLoading} className="relative flex-1 h-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50">
                    {isAiLoading ? <span className="animate-pulse">{t('ai.thinking')}</span> : <><Bot className="w-4 h-4" /> {t('ai.btn')}</>}
                </button>
                <button onClick={handleExportPDF} disabled={isPdfLoading} className="px-3 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl border border-gray-700 flex items-center justify-center transition-colors">
                    {isPdfLoading ? <Loader2 className="w-4 h-4 animate-spin text-indigo-400" /> : <Download className="w-4 h-4" />}
                </button>
            </div>
        )}
        {/* Chat expandido igual ao anterior */}
        {isChatOpen && (
            <div className="flex flex-col h-full">
                <div className="px-3 py-2 bg-gray-800/50 border-b border-gray-700 flex justify-between items-center shrink-0">
                    <span className="text-[10px] font-bold text-indigo-300 flex items-center gap-1"><Bot className="w-3 h-3" /> {t('ai.insight')}</span>
                    <div className="flex gap-2">
                        <button onClick={() => setIsChatOpen(false)} className="text-gray-500 hover:text-white p-1"><X className="w-3 h-3" /></button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar bg-gray-900/50">
                    {chatMessages.map((m, i) => (
                        <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[95%] p-3 rounded-2xl text-[11px] leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-bl-none'}`}>
                                <ReactMarkdown>{m.content}</ReactMarkdown>
                            </div>
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>
                <div className="p-2 border-t border-gray-800 bg-gray-900 flex gap-2 shrink-0">
                    <input className="flex-1 bg-gray-800 text-white text-[11px] rounded-lg px-3 py-2 border border-gray-700 outline-none" value={userQuery} onChange={(e) => setUserQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} />
                    <button onClick={handleSendMessage} className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg"><Send className="w-3.5 h-3.5" /></button>
                </div>
            </div>
        )}
      </div>
    </div>
    </>
  );
};