import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import * as turf from '@turf/turf';
import { useProjectStore, BlockUsage } from '../stores/useProjectStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useMapStore } from '../stores/mapStore'; // Added MapStore
import { analyzeProject } from '../services/aiService';
import logoImage from '../assets/logo.png';
import { 
  Download, LayoutGrid, Calculator,
  Copy, Layers, ArrowRightFromLine, AlertTriangle, CheckCircle2,
  Scale, Edit2, Save, Upload, Sparkles, Bot, Send, X, Globe, ChevronDown, ChevronUp,
  Trash2, Coins, Settings, FileText, Search // Added Search Icon
} from 'lucide-react';

interface ChatMessage { role: 'user' | 'assistant'; content: string; }
interface SearchResult { id: string; place_name: string; center: [number, number]; }

// Types for mobile drawer state
type MobileState = 'min' | 'mid' | 'max';

export const SmartPanel = () => {
  const { t, i18n } = useTranslation();
  const { blocks, land, metrics, currency, setCurrency, updateBlock, removeBlock, duplicateBlock, updateLand, calculateMetrics, loadProject } = useProjectStore();
  
  // Stores
  const { setPaywallOpen, urbanContext, setUrbanContext, measurementSystem } = useSettingsStore();
  const { setFlyToCoords } = useMapStore(); // To control the map flyTo

  const [activeTab, setActiveTab] = useState<'editor' | 'financial' | 'settings'>('editor');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // UI States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [userQuery, setUserQuery] = useState('');
  
  // Search States (New)
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Mobile State
  const [mobileState, setMobileState] = useState<MobileState>('min');

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (calculateMetrics) calculateMetrics(); }, [blocks, land]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages, isChatOpen]);

  // --- SEARCH LOGIC (Mapbox Geocoding) ---
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length < 3) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setIsSearching(true);
      try {
        const token = import.meta.env.VITE_MAPBOX_TOKEN;
        // Search specifically for addresses and POIs
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${token}&types=address,poi&limit=5`
        );
        const data = await response.json();
        
        if (data.features) {
          setSearchResults(data.features.map((f: any) => ({
            id: f.id,
            place_name: f.place_name,
            center: f.center
          })));
          setShowResults(true);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSelectLocation = (result: SearchResult) => {
    setFlyToCoords(result.center); // Tell the map to fly there
    setSearchQuery(result.place_name); // Fill input with full name
    setShowResults(false); // Hide dropdown
  };

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
            bottom-0 md:bottom-4 md:top-4 
            w-full md:w-96 
            flex flex-col 
            shadow-2xl overflow-hidden 
            rounded-t-3xl md:rounded-2xl 
            border-t md:border border-gray-800 
            bg-[#0f111a]/95 backdrop-blur-md z-50
            transition-all duration-500 cubic-bezier(0.32, 0.72, 0, 1)
            ${getMobileHeightClass()} md:h-auto md:max-h-[95vh]
        `}
    >
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />

      {/* HEADER */}
      <div className="p-4 bg-gradient-to-b from-gray-900 to-gray-900/50 border-b border-gray-800 shrink-0 relative cursor-pointer md:cursor-default" onClick={cycleMobileState}>
        
        <div className="md:hidden absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-700 rounded-full opacity-50"></div>

        <div className="flex justify-between items-center mb-3 mt-2 md:mt-0">
             <img src={logoImage} alt="Cytyos" className="h-6 w-auto object-contain transition-opacity hover:opacity-80" />
            
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
                    {mobileState === 'max' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </button>
            </div>
        </div>
        
        {activeTab !== 'settings' && (
            <>
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <span className="text-[10px] text-gray-500 uppercase font-bold">{t('header.revenue')}</span>
                        <div className="text-xl font-bold text-white tracking-tight">{money(metrics.revenue)}</div>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] text-gray-500 uppercase font-bold">{t('header.margin')}</span>
                        <div className={`text-lg font-bold ${metrics.margin > 15 ? 'text-green-400' : 'text-yellow-400'}`}>{num(metrics.margin)}%</div>
                    </div>
                </div>
                <div className="flex gap-1 p-1 bg-black/40 rounded-lg border border-gray-800/50" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => setActiveTab('editor')} className={`flex-1 py-2 text-xs font-semibold rounded-md flex gap-2 justify-center items-center transition-all ${activeTab === 'editor' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}><LayoutGrid className="w-3.5 h-3.5" /> {t('tabs.design')}</button>
                    <button onClick={() => setActiveTab('financial')} className={`flex-1 py-2 text-xs font-semibold rounded-md flex gap-2 justify-center items-center transition-all ${activeTab === 'financial' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}><Calculator className="w-3.5 h-3.5" /> {t('tabs.economics')}</button>
                </div>
            </>
        )}
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0f111a]">
          
          {/* Settings */}
          {activeTab === 'settings' && (
              <div className="p-4 space-y-4">
                  <div className="space-y-2 flex-1 flex flex-col">
                      <h3 className="text-xs font-bold text-white flex items-center gap-2"><FileText className="w-3.5 h-3.5 text-blue-400"/> Urban Context / Laws</h3>
                      <p className="text-[10px] text-gray-400">Paste zoning laws here. AI will use this.</p>
                      <textarea 
                        value={urbanContext}
                        onChange={(e) => setUrbanContext(e.target.value)}
                        placeholder="Ex: Zona ZM, Max FAR 4.0, Max Height 28m..."
                        className="w-full h-48 bg-gray-900 border border-gray-700 rounded-lg p-3 text-xs text-gray-300 focus:border-blue-500 outline-none resize-none leading-relaxed"
                      />
                  </div>
              </div>
          )}

          {/* Editor */}
          {activeTab === 'editor' && (
            <>
                {/* --- ADDRESS SEARCH BAR (NEW) --- */}
                <div className="px-4 pt-4 relative z-50">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-3.5 w-3.5 text-gray-500" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-9 pr-3 py-2 border border-gray-700 rounded-lg leading-5 bg-gray-800 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-gray-900 focus:border-blue-500 text-xs transition duration-150 ease-in-out"
                            placeholder="Search location (Miami, FL)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => { if(searchResults.length > 0) setShowResults(true); }}
                        />
                        {isSearching && (
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                <span className="h-3 w-3 rounded-full border-2 border-t-transparent border-blue-500 animate-spin"></span>
                            </div>
                        )}
                        
                        {/* SEARCH RESULTS DROPDOWN */}
                        {showResults && searchResults.length > 0 && (
                            <ul className="absolute w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl max-h-48 overflow-auto z-50">
                                {searchResults.map((result) => (
                                    <li 
                                        key={result.id}
                                        onClick={() => handleSelectLocation(result)}
                                        className="px-3 py-2 hover:bg-gray-700 cursor-pointer text-xs text-gray-200 border-b border-gray-700/50 last:border-0"
                                    >
                                        <div className="font-medium text-white truncate">{result.place_name.split(',')[0]}</div>
                                        <div className="text-[10px] text-gray-500 truncate">{result.place_name}</div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

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
                                <div className="flex items-center gap-2 w-full group/name">
                                    <Layers className={`w-3.5 h-3.5 ${block.type === 'podium' ? 'text-indigo-400' : 'text-blue-400'}`} />
                                    <input className="bg-transparent text-white font-medium text-xs w-full outline-none" value={block.name} onChange={(e) => updateBlock(block.id, { name: e.target.value })} />
                                    <Edit2 className="w-2.5 h-2.5 text-gray-600 absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover/name:opacity-100 pointer-events-none" />
                                </div>
                                <div className="flex gap-1">
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
                                        <span className="text-[10px] text-gray-500">{t('blocks.height')} ({Math.floor(block.height/3)} fl)</span>
                                        <span className="text-[10px] text-blue-300">{fmtDist(block.height)}</span>
                                    </div>
                                    <input type="range" min="3" max="150" step="1" value={block.height} onChange={(e) => updateBlock(block.id, { height: Number(e.target.value) })} className="w-full h-1 bg-gray-700 rounded appearance-none accent-blue-500" />
                                </div>
                                {block.isCustom && (
                                    <div className="p-2 bg-black/20 rounded border border-gray-700/50">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="flex items-center gap-1 text-[10px] text-gray-400"><ArrowRightFromLine className="w-3 h-3"/> {t('blocks.setback')}</span>
                                            <span className="text-[10px] text-yellow-400">{fmtDist(block.setback)}</span>
                                        </div>
                                        <input type="range" min="0" max="20" step="0.1" value={block.setback} onChange={(e) => handleSetbackChange(block.id, Number(e.target.value))} className="w-full h-1 bg-gray-700 rounded appearance-none accent-yellow-500" />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </>
          )}

          {/* Financial */}
          {activeTab === 'financial' && (
             <div className="p-4 space-y-6 pb-24 md:pb-4">
                <div className="space-y-2">
                    <h3 className="text-[10px] uppercase font-bold text-gray-500">{t('assumptions.title')}</h3>
                    <div className="bg-gray-800/40 p-3 rounded-xl border border-gray-700 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div><label className="text-[9px] text-gray-400 block mb-1">{t('assumptions.landArea')}</label><input type="number" value={land.area} onChange={(e) => updateLand({ area: Number(e.target.value) })} className="w-full bg-gray-900 border border-gray-700 rounded p-1.5 text-xs text-white" /></div>
                            <div><label className="text-[9px] text-gray-400 block mb-1">{t('assumptions.landCost')}</label><input type="number" value={land.cost} onChange={(e) => updateLand({ cost: Number(e.target.value) })} className="w-full bg-gray-900 border border-gray-700 rounded p-1.5 text-xs text-white" /></div>
                            <div><label className="text-[9px] text-gray-400 block mb-1">{t('assumptions.sales')}</label><input type="number" value={land.sellPrice} onChange={(e) => updateLand({ sellPrice: Number(e.target.value) })} className="w-full bg-gray-900 border border-gray-700 rounded p-1.5 text-xs text-white" /></div>
                            <div><label className="text-[9px] text-gray-400 block mb-1">{t('assumptions.build')}</label><input type="number" value={land.buildCost} onChange={(e) => updateLand({ buildCost: Number(e.target.value) })} className="w-full bg-gray-900 border border-gray-700 rounded p-1.5 text-xs text-white" /></div>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-black/20 rounded-xl space-y-2">
                    <div className="flex justify-between text-[10px] text-gray-400"><span>{t('results.nsa')}</span><span className="text-white">{fmtArea(metrics.nsa)}</span></div>
                    <div className="flex justify-between text-[10px] text-gray-400"><span>{t('results.revenue')}</span><span className="text-white">{money(metrics.revenue)}</span></div>
                    <div className="flex justify-between text-[10px] text-red-400/70"><span>{t('results.totalCost')}</span><span>{money(metrics.totalCost)}</span></div>
                    <div className="h-px bg-gray-800 my-2"></div>
                    <div className="flex justify-between text-xs font-bold text-white"><span>{t('results.netProfit')}</span><span className="text-green-400">{money(metrics.grossProfit)}</span></div>
                </div>
            </div>
          )}
      </div>

      {/* CHATBOT FOOTER */}
      <div className={`border-t border-gray-800 bg-gray-900 transition-all duration-300 ease-in-out ${isChatOpen ? 'h-72' : 'h-16'}`}>
        {!isChatOpen && (
             <div className="p-3 flex gap-2 h-full items-center">
                <button onClick={handleStartAnalysis} disabled={isAiLoading} className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50">
                    {isAiLoading ? <span className="animate-pulse">{t('ai.thinking')}</span> : <><Sparkles className="w-4 h-4" /> {t('ai.btn')}</>}
                </button>
                <button onClick={() => setPaywallOpen(true)} className="px-3 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl border border-gray-700 flex items-center justify-center"><Download className="w-4 h-4" /></button>
            </div>
        )}

        {isChatOpen && (
            <div className="flex flex-col h-full">
                <div className="px-3 py-2 bg-gray-800/50 border-b border-gray-700 flex justify-between items-center shrink-0">
                    <span className="text-[10px] font-bold text-indigo-300 flex items-center gap-1"><Bot className="w-3 h-3" /> {t('ai.insight')}</span>
                    <button onClick={() => setIsChatOpen(false)} className="text-gray-500 hover:text-white p-1"><X className="w-3 h-3" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar bg-gray-900/50">
                    {chatMessages.map((m, i) => (
                        <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[90%] p-2.5 rounded-2xl text-[11px] leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-bl-none'}`}>{m.content}</div>
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>
                <div className="p-2 border-t border-gray-800 bg-gray-900 flex gap-2 shrink-0">
                    <input className="flex-1 bg-gray-800 text-white text-[11px] rounded-lg px-3 py-2 border border-gray-700 focus:border-blue-500 outline-none placeholder-gray-500" placeholder={t('ai.placeholder')} value={userQuery} onChange={(e) => setUserQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} />
                    <button onClick={handleSendMessage} disabled={isAiLoading || !userQuery.trim()} className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg disabled:opacity-50 transition-colors"><Send className="w-3.5 h-3.5" /></button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};