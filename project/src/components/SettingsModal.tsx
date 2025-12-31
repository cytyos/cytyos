import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings } from 'lucide-react';
import { useSettingsStore, Currency, Language } from '../stores/settingsStore';
import { currencySymbolMap } from '../stores/settingsStore';
import { useTranslation } from '../utils/i18n';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const currencyOptions: { code: Currency; label: string }[] = [
  { code: 'BRL', label: 'Brazilian Real' },
  { code: 'USD', label: 'US Dollar' },
  { code: 'EUR', label: 'Euro' },
  { code: 'GBP', label: 'British Pound' },
  { code: 'CNY', label: 'Chinese Yuan' },
  { code: 'JPY', label: 'Japanese Yen' },
];

const languageOptions: { code: Language; label: string; flag: string }[] = [
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
];

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { currency, unitSystem, language, setCurrency, setUnitSystem, setLanguage } = useSettingsStore();
  const t = useTranslation(language);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10001] w-[calc(100%-2rem)] max-w-2xl max-h-[90vh] bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white">{t('settings')}</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="flex-1 p-8 space-y-8 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  {t('currency')}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {currencyOptions.map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => setCurrency(curr.code)}
                      className={`px-3 py-3 rounded-lg border-2 transition-all ${
                        currency === curr.code
                          ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                          : 'border-slate-700 bg-slate-800/50 text-gray-400 hover:border-slate-600'
                      }`}
                    >
                      <div className="font-semibold text-sm">{curr.code}</div>
                      <div className="text-xs opacity-75">
                        {currencySymbolMap[curr.code]}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  {t('unit_system')}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(['metric', 'imperial'] as const).map((unit) => (
                    <button
                      key={unit}
                      onClick={() => setUnitSystem(unit)}
                      className={`px-4 py-3 rounded-lg border-2 transition-all ${
                        unitSystem === unit
                          ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                          : 'border-slate-700 bg-slate-800/50 text-gray-400 hover:border-slate-600'
                      }`}
                    >
                      <div className="font-semibold capitalize">{t(unit)}</div>
                      <div className="text-xs opacity-75">
                        {unit === 'metric' ? 'm², m' : 'ft², ft'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  {t('language')}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {languageOptions.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`px-4 py-3 rounded-lg border-2 transition-all ${
                        language === lang.code
                          ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                          : 'border-slate-700 bg-slate-800/50 text-gray-400 hover:border-slate-600'
                      }`}
                    >
                      <div className="font-semibold flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span className="text-sm">{lang.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-700 bg-slate-800/50">
              <button
                onClick={onClose}
                className="w-full px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium rounded-lg transition-all"
              >
                {t('save_settings')}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
