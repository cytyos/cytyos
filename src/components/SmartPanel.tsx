import React, { useState, useEffect, useRef } from 'react';
import { useTranslation, Trans } from 'react-i18next'; // Import Trans
import * as turf from '@turf/turf';
import { useProjectStore, BlockUsage } from '../stores/useProjectStore';
import { useSettingsStore } from '../stores/settingsStore';
import { analyzeProject } from '../services/aiService';
import logoFull from '../assets/logo-full.png'; 
import { 
  Download, LayoutGrid, Calculator,
  Copy, Layers, ArrowRightFromLine, AlertTriangle, CheckCircle2,
  Scale, Edit2, Save, Upload, Sparkles, Bot, Send, X, Globe, ChevronDown, ChevronUp,
  Trash2, Coins, Settings, FileText, PenTool, MapPin 
} from 'lucide-react';

interface ChatMessage { role: 'user' | 'assistant'; content: string; }

type MobileState = 'min' | 'mid' | 'max';

export const SmartPanel = () => {
  const { t, i18n } = useTranslation();
  const { blocks, land, metrics, currency, setCurrency, updateBlock, removeBlock, duplicateBlock, updateLand, calculateMetrics, loadProject } = useProjectStore();
  
  const { setPaywallOpen, urbanContext, setUrbanContext, measurementSystem } = useSettingsStore();

  const [activeTab, setActiveTab] = useState<'editor' | 'financial' | 'settings'>('editor');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // --- UNIT CONVERSION FUNCTIONS (M/FT) ---
  const isImperial = measurementSystem === 'imperial';

  const fmtArea = (val: number) => {
    if (isImperial) return (val * 10.7639).toLocaleString('en-US', { maximumFractionDigits: 0 }) + ' ft²';
    return val.toLocaleString('en-US', { maximumFractionDigits: 0 }) + ' m²';
  };

  const fmtDist = (val: number) => {
    if (isImperial) return (val * 3.28084).toFixed(1) + ' ft';
    return val.toFixed(1) + ' m';
  };

  const changeLanguage = (lng: string) => { i18n.changeLanguage(lng); setIsLangMenuOpen(false); };
  const changeCurrency = (curr: string) => { setCurrency(curr); setIsCurrencyMenuOpen(false); };

  const cycleMobileState = () => {
    if (window.innerWidth >= 768) return; 
    if (mobileState === 'min') setMobileState('mid');
    else if (mobileState === 'mid') setMobileState('max');
    else setMobileState('min');
  };

  const getMobileHeightClass = () => {
    switch (mobileState) {
        case 'mid': return 'h-[50vh]'; 
        case 'max': return 'h-[95vh]'; 
        default: return 'h-28'; 
    }
  };

  const handleStartAnalysis = async () => {
    setIsChatOpen(true);
    if(window.innerWidth < 768) setMobileState('max'); 
    setIsAiLoading(true);
    try {
        const report = await analyzeProject([{ role: 'user', content: "Analyze my project." }], { metrics, land, blocks, currency }, i18n.language);
        setChatMessages([{ role: 'assistant', content: report || "No analysis generated." }]);
    } catch (e) { setChatMessages([{ role: 'assistant', content: "⚠️ Connection Error." }]); } finally { setIsAiLoading(false); }
  };

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
    const projectData = { version: '1.0', date: new Date().toISOString(), blocks, land, currency };
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `cytyos-project.json`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => { try { loadProject(JSON.parse(e.target?.result as string)); } catch (err) { alert("Error loading file"); } };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleSetbackChange = (blockId: string, newSetback: number) => {
    if (newSetback < 0) return;
    const block = blocks.find(b => b.id === blockId);
    if (!block || !land.geometry) return;
    try {
      const landPoly = turf.polygon(land.geometry.coordinates);
      const buffered = turf.buffer(landPoly, -newSetback, { units: 'meters' });
      if (buffered && buffered.geometry) {
        updateBlock(blockId, { setback: newSetback, coordinates: buffered.geometry.coordinates, baseArea: turf.area(buffered) });
      }
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
    <div 
        className={`
            fixed md:absolute 
            left-0 md:left-4 
            bottom-[40px] md:bottom-12 md:top-4 
            w-full md:w-96 
            flex flex-col 
            shadow-2xl overflow-hidden 
            rounded-t-3xl md:rounded-2xl 
            border-t md:border border-gray-800 
            bg-[#0f111a]/95 backdrop-blur-md z-[60]
            transition-all duration-500 cubic-bezier(0.32, 0.72, 0, 1)
            ${getMobileHeightClass()} md:h-auto md:max-h-[95vh]
        `}
    >
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />

      {/* HEADER */}
      <div className="p-4 bg-gradient-to-b from-gray-900 to-gray-900/50 border-b border-gray-800 shrink-0 relative cursor-pointer md:cursor-default" onClick={cycleMobileState}>
        
        <div className="md:hidden absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-700 rounded-full opacity-50"></div>

        <div className="flex justify-between items-center mb-3 mt-2 md:mt-0">
             <img src={logoFull} alt="Cytyos" className="h-8 w-auto object-contain transition-opacity hover:opacity-80" />
            
            <div className="flex gap-1 items-center" onClick={(e) => e.stopPropagation()}>
                <div className="relative">
                    <button onClick={() => { setIsCurrencyMenuOpen(!isCurrencyMenuOpen); setIsLangMenuOpen(false); }} className={`p-1.5 text-gray-400 hover:text-white rounded flex items-center gap-1 transition-colors ${isCurrencyMenuOpen ? 'bg-gray-800 text-white' : ''}`}>
                        <Coins className="w-4 h-4" /> <span className="text-[10px] uppercase font-bold">{currency}</span><ChevronDown className="w-3 h-3" />
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

                <div className="relative mr-2">
                    <button onClick={() => { setIsLangMenuOpen(!isLangMenuOpen); setIsCurrencyMenuOpen(false); }} className={`p-1.5 text-gray-400 hover:text-white rounded flex items-center gap-1 transition-colors ${isLangMenuOpen ? 'bg-gray-800 text-white' : ''}`}>
                        <Globe className="w-4 h-4" /> <span className="text-[10px] uppercase font-bold">{i18n.language.substring(0,2)}</span><ChevronDown className="w-3 h-3" />
                    </button>
                    {isLangMenuOpen && (
                        <div className="absolute right-0 top-full mt-2 w-32 bg-[#0f111a] border border-gray-700 rounded-lg shadow-xl z-[100]">
                            {['en','pt','es','fr','zh'].map(lang => <button key={lang} onClick={() => changeLanguage(lang)} className="block w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-gray-800 hover:text-white border-b border-gray-800 last:border-0 uppercase">{lang}</button>)}
                        </div>
                    )}
                </div>

                <button onClick={() => setActiveTab(activeTab === 'settings' ? 'editor' : 'settings')} className={`p-1.5 rounded transition-all ${activeTab === 'settings' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`} title="Settings & Context">
                    <Settings className="w-4 h-4" />
                </button>

                <button onClick={handleSaveProject} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded" title={t('header.save')}><Save className="w-4 h-4" /></button>
                <button onClick={() => fileInputRef.current?.click()} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded" title={t('header.load')}><Upload className="w-4 h-4" /></button>
                
                <button className="md:hidden p-1.5 text-gray-400" onClick={(e) => { e.stopPropagation(); cycleMobileState(); }}>
                    {mobileState === 'max' ? <ChevronDown className="w-4 h-4" /> : <Chevron