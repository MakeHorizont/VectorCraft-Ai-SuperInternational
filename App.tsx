
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { InputSection } from './components/InputSection';
import { SvgPreview } from './components/SvgPreview';
import { Header } from './components/Header';
import { ProductionLog } from './components/ProductionLog';
import { generateSvgFromPrompt } from './services/geminiService';
import { GeneratedSvg, GenerationStatus, ApiError, GenerationOptions } from './types';
import { AlertCircle, Globe, ChevronRight } from 'lucide-react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { languages, LanguageCode } from './languages/index';

const HISTORY_KEY = 'vectorcraft_history_v1';

// --- Welcome / Language Selection Screen ---
const WelcomeScreen: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  const { setLanguage, currentLanguage } = useLanguage();
  const [hasStoredLang, setHasStoredLang] = useState(false);

  // If a language was restored from localstorage by the provider, we might want to skip this screen.
  // But for now, let's allow the user to confirm or change. 
  // Alternatively, we could auto-skip in AppLayout. 

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code);
    onStart();
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full z-10 space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-purple-500/20 mb-4">
             <Globe className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">VectorCraft AI</h1>
          <p className="text-zinc-400">Select your language / Выберите язык</p>
        </div>

        <div className="grid gap-3">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className="group flex items-center justify-between w-full p-4 rounded-xl bg-zinc-900/50 border border-white/10 hover:bg-zinc-800 hover:border-white/20 hover:scale-[1.02] transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{lang.flag}</span>
                <span className="text-lg font-medium text-zinc-200 group-hover:text-white transition-colors">
                  {lang.label}
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-indigo-400 transition-colors" />
            </button>
          ))}
        </div>
        
        <div className="text-center pt-8">
           <p className="text-xs text-zinc-600 uppercase tracking-widest font-mono">System Ready v1.1</p>
        </div>
      </div>
    </div>
  );
};

// --- Main App Content ---
const AppContent: React.FC = () => {
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [currentSvg, setCurrentSvg] = useState<GeneratedSvg | null>(null);
  const [history, setHistory] = useState<GeneratedSvg[]>([]);
  const [error, setError] = useState<ApiError | null>(null);
  const { t } = useLanguage();

  // Load History on Mount
  useEffect(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history");
      }
    }
  }, []);

  // Save History on Update
  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const handleGenerate = async (options: GenerationOptions) => {
    setStatus(GenerationStatus.LOADING);
    setError(null);
    setCurrentSvg(null);

    try {
      const svgContent = await generateSvgFromPrompt(options);
      
      const newSvg: GeneratedSvg = {
        id: crypto.randomUUID(),
        content: svgContent,
        prompt: options.prompt,
        timestamp: Date.now()
      };
      
      setCurrentSvg(newSvg);
      // Add to history (newest first)
      setHistory(prev => [newSvg, ...prev].slice(0, 50)); // Keep last 50
      setStatus(GenerationStatus.SUCCESS);
    } catch (err: any) {
      setStatus(GenerationStatus.ERROR);
      setError({
        message: t.errors.generationFailed,
        details: err.message || t.errors.defaultDetails
      });
    }
  };

  // Handler for Dialectical Aufhebung (Update existing SVG)
  const handleUpdateSvg = (newContent: string) => {
    if (currentSvg) {
      const updatedSvg = {
        ...currentSvg,
        content: newContent,
        timestamp: Date.now() // Update version
      };
      setCurrentSvg(updatedSvg);
      // We also add the refined version to history as a new node in the spiral
      setHistory(prev => [updatedSvg, ...prev].slice(0, 50));
    }
  };

  const restoreFromHistory = (item: GeneratedSvg) => {
    setCurrentSvg(item);
    setStatus(GenerationStatus.SUCCESS);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteFromHistory = (id: string) => {
    setHistory(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30 animate-in fade-in duration-700">      
      <Header />
      <main className="pb-20 pt-8">
        <InputSection onGenerate={handleGenerate} status={status} />
        
        {status === GenerationStatus.ERROR && error && (
          <div className="max-w-3xl mx-auto mt-8 px-4">
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3 text-red-200">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-400">{error.message}</h4>
                <p className="text-sm text-red-300/70 mt-1">{error.details}</p>
              </div>
            </div>
          </div>
        )}

        {/* Current Workspace */}
        {status === GenerationStatus.SUCCESS && currentSvg && (
          <SvgPreview 
            data={currentSvg} 
            onUpdate={handleUpdateSvg}
          />
        )}
        
        {/* Empty State / Placeholder */}
        {status === GenerationStatus.IDLE && (
          <div className="max-w-2xl mx-auto mt-16 text-center px-4 opacity-50 pointer-events-none select-none">
             <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-zinc-900/50 border border-white/5 mb-4">
                <svg className="w-12 h-12 text-zinc-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                   <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                   <circle cx="8.5" cy="8.5" r="1.5" />
                   <polyline points="21 15 16 10 5 21" />
                </svg>
             </div>
             <p className="text-zinc-600 text-sm">{t.preview.emptyStateDesc}</p>
          </div>
        )}

        {/* Production Log (History) */}
        <ProductionLog 
          history={history} 
          onRestore={restoreFromHistory} 
          onDelete={deleteFromHistory} 
          onClear={() => setHistory([])}
        />

      </main>
    </div>
  );
};

// --- Root Layout Manager ---
const AppLayout: React.FC = () => {
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState(false);
  
  // We can verify if language is already in storage to potentially skip welcome,
  // but for now, let's keep the explicit check to ensure proper context.
  // Actually, let's check localStorage inside the provider logic, but here we decide UI.
  // To make it persistent, we check if the user has visited before.
  
  useEffect(() => {
    const visited = localStorage.getItem('vectorcraft_visited');
    if (visited) {
      setHasSelectedLanguage(true);
    }
  }, []);

  const handleStart = () => {
    localStorage.setItem('vectorcraft_visited', 'true');
    setHasSelectedLanguage(true);
  };

  if (!hasSelectedLanguage) {
    return <WelcomeScreen onStart={handleStart} />;
  }

  return <AppContent />;
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppLayout />
    </LanguageProvider>
  );
};

export default App;
