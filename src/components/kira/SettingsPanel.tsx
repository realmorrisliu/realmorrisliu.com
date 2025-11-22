import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Check, Key, Sparkles, Zap, Globe, Clock } from 'lucide-react';
import { useSchedule } from '../../context/ScheduleContext';

interface SettingsPanelProps {
  onClose: () => void;
  className?: string;
}

type Provider = 'openai' | 'google' | 'openrouter';

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose, className = '' }) => {
  const { state, updatePreferences } = useSchedule();
  const { preferences } = state;

  const [provider, setProvider] = useState<Provider>('openai');
  const [openaiKey, setOpenaiKey] = useState('');
  const [googleKey, setGoogleKey] = useState('');
  const [openrouterKey, setOpenrouterKey] = useState('');
  const [saved, setSaved] = useState(false);

  // Local state for working hours to avoid jitter
  const [startHour, setStartHour] = useState(preferences?.workingHours?.start || 9);
  const [endHour, setEndHour] = useState(preferences?.workingHours?.end || 17);

  useEffect(() => {
    setProvider((localStorage.getItem('kira_provider') as Provider) || 'openai');
    setOpenaiKey(localStorage.getItem('kira_openai_key') || '');
    setGoogleKey(localStorage.getItem('kira_google_key') || '');
    setOpenrouterKey(localStorage.getItem('kira_openrouter_key') || '');
    
    if (preferences?.workingHours) {
        setStartHour(preferences.workingHours.start);
        setEndHour(preferences.workingHours.end);
    }
  }, [preferences]);

  const handleSave = () => {
    localStorage.setItem('kira_provider', provider);
    localStorage.setItem('kira_openai_key', openaiKey);
    localStorage.setItem('kira_google_key', googleKey);
    localStorage.setItem('kira_openrouter_key', openrouterKey);
    
    updatePreferences({ workingHours: { start: Number(startHour), end: Number(endHour) } });
    
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    
    // Trigger a custom event so other components can update
    window.dispatchEvent(new Event('kira-settings-updated'));
  };

  const providers = [
    {
      id: 'openai' as Provider,
      name: 'OpenAI',
      icon: Zap,
      description: 'Standard choice. Reliable and fast.',
      key: openaiKey,
      setKey: setOpenaiKey,
      placeholder: 'sk-...'
    },
    {
      id: 'google' as Provider,
      name: 'Google Gemini',
      icon: Sparkles,
      description: 'Large context window. Good for analysis.',
      key: googleKey,
      setKey: setGoogleKey,
      placeholder: 'AIza...'
    },
    {
      id: 'openrouter' as Provider,
      name: 'OpenRouter',
      icon: Globe,
      description: 'Access Claude 3.5, Llama 3, and more.',
      key: openrouterKey,
      setKey: setOpenrouterKey,
      placeholder: 'sk-or-...'
    }
  ];

  return (
    <div className={`relative flex h-full w-full flex-col overflow-hidden bg-white/40 backdrop-blur-xl dark:bg-black/40 ${className}`}>
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between px-8 py-6">
        <div className="flex items-center gap-3">
            <button 
                onClick={onClose}
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-black/5 text-black/40 transition-all hover:bg-black/10 hover:text-black/80 dark:bg-white/5 dark:text-white/40 dark:hover:bg-white/10 dark:hover:text-white/80"
            >
                <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
            </button>
            <h2 className="text-lg font-semibold tracking-tight text-black/80 dark:text-white/80">Settings</h2>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
        <div className="space-y-8">
            
            {/* Section: AI Provider */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-black/40 dark:text-white/40">AI Provider</label>
                    <span className="text-[10px] font-medium text-black/30 dark:text-white/30">Select one to configure</span>
                </div>
                
                <div className="space-y-3">
                    {providers.map((p) => {
                        const isSelected = provider === p.id;
                        const Icon = p.icon;
                        
                        return (
                            <motion.div
                                key={p.id}
                                layout
                                onClick={() => setProvider(p.id)}
                                className={`relative cursor-pointer overflow-hidden rounded-2xl border transition-all duration-500 ${
                                    isSelected 
                                    ? 'border-black/5 bg-gradient-to-br from-white/80 to-white/40 shadow-xl shadow-black/5 ring-1 ring-black/5 dark:border-white/10 dark:from-white/10 dark:to-white/5 dark:shadow-black/20 dark:ring-white/10' 
                                    : 'border-transparent bg-white/20 hover:bg-white/40 dark:bg-white/5 dark:hover:bg-white/10'
                                }`}
                            >
                                <div className="flex items-center gap-4 p-4">
                                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-sm transition-colors duration-300 ${
                                        isSelected 
                                        ? 'bg-black text-white dark:bg-white dark:text-black' 
                                        : 'bg-white/50 text-black/40 dark:bg-white/5 dark:text-white/40'
                                    }`}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={`text-[15px] font-semibold tracking-tight transition-colors duration-300 ${isSelected ? 'text-black dark:text-white' : 'text-black/60 dark:text-white/60'}`}>
                                            {p.name}
                                        </h3>
                                        <p className="text-xs font-medium text-black/40 dark:text-white/40">
                                            {p.description}
                                        </p>
                                    </div>
                                    {isSelected && (
                                        <motion.div 
                                            initial={{ scale: 0, opacity: 0 }} 
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                            className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white shadow-sm"
                                        >
                                            <Check className="h-3.5 w-3.5" />
                                        </motion.div>
                                    )}
                                </div>

                                <AnimatePresence>
                                    {isSelected && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <div className="border-t border-black/5 bg-black/[0.02] p-4 dark:border-white/5 dark:bg-white/[0.02]">
                                                <label className="mb-2 flex items-center gap-2 text-xs font-semibold text-black/50 dark:text-white/50">
                                                    <Key className="h-3.5 w-3.5" />
                                                    API Key
                                                </label>
                                                <div className="relative group">
                                                    <input 
                                                        type="password" 
                                                        value={p.key}
                                                        onChange={(e) => p.setKey(e.target.value)}
                                                        placeholder={p.placeholder}
                                                        className="w-full rounded-xl border border-transparent bg-black/5 px-4 py-3 text-sm font-medium text-black/80 outline-none transition-all placeholder:text-black/20 focus:border-purple-500/20 focus:bg-white focus:shadow-sm focus:ring-4 focus:ring-purple-500/10 dark:bg-white/5 dark:text-white/80 dark:placeholder:text-white/20 dark:focus:border-purple-400/20 dark:focus:bg-black/40 dark:focus:ring-purple-400/10"
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </div>
                                                <p className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-black/30 dark:text-white/30">
                                                    <span className="block h-1 w-1 rounded-full bg-green-500/50" />
                                                    Stored securely on your device
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Section: Schedule & Preferences */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-black/40 dark:text-white/40">Schedule & Preferences</label>
                </div>
                
                <div className="rounded-2xl border border-black/5 bg-white/20 p-5 dark:border-white/5 dark:bg-white/5">
                    <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/5 text-black/40 dark:bg-white/5 dark:text-white/40">
                            <Clock className="h-5 w-5" />
                        </div>
                        <div className="flex-1 space-y-4">
                            <div>
                                <h3 className="text-sm font-semibold text-black/80 dark:text-white/80">Working Hours</h3>
                                <p className="text-xs text-black/40 dark:text-white/40">
                                    Define your active day. The calendar grid will adjust to show this range.
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-medium uppercase tracking-wider text-black/30 dark:text-white/30">Start</label>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            min="0" 
                                            max="23"
                                            value={startHour}
                                            onChange={(e) => setStartHour(Number(e.target.value))}
                                            className="w-20 rounded-xl border border-transparent bg-black/5 px-3 py-2 text-center text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-black/5 dark:bg-white/5 dark:focus:bg-black/40 dark:focus:ring-white/10"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-black/30 dark:text-white/30">AM</span>
                                    </div>
                                </div>
                                <div className="h-px w-4 bg-black/10 dark:bg-white/10" />
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-medium uppercase tracking-wider text-black/30 dark:text-white/30">End</label>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            min="0" 
                                            max="23"
                                            value={endHour}
                                            onChange={(e) => setEndHour(Number(e.target.value))}
                                            className="w-20 rounded-xl border border-transparent bg-black/5 px-3 py-2 text-center text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-black/5 dark:bg-white/5 dark:focus:bg-black/40 dark:focus:ring-white/10"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-black/30 dark:text-white/30">PM</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="pt-4">
                <button 
                    onClick={handleSave}
                    className="group relative flex w-full items-center justify-center gap-2 rounded-2xl bg-black py-4 text-sm font-semibold text-white shadow-xl transition-all hover:bg-black/90 hover:shadow-2xl active:scale-[0.98] dark:bg-white dark:text-black dark:hover:bg-white/90"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        {saved ? <Check className="h-4 w-4" /> : 'Save Configuration'}
                    </span>
                    {/* Subtle glow effect */}
                    <div className="absolute inset-0 -z-10 rounded-2xl bg-purple-500/20 blur-xl opacity-0 transition-opacity group-hover:opacity-100 dark:bg-purple-400/20" />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
