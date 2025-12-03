
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { PenTool, Sparkles, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { languages } from '../languages/index';

export const Header: React.FC = () => {
  const { t, currentLanguage, setLanguage } = useLanguage();

  return (
    <header className="w-full py-4 px-4 border-b border-white/10 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg shadow-purple-500/20">
            <PenTool className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">{t.header.title}</h1>
            <p className="text-xs text-zinc-400 font-medium flex items-center gap-1">
              {t.header.subtitle} <Sparkles className="w-3 h-3 text-amber-400" />
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800 border border-zinc-700 text-sm text-zinc-200 hover:bg-zinc-700 transition-colors">
              <span>{languages.find(l => l.code === currentLanguage)?.flag}</span>
              <span className="hidden sm:inline">{languages.find(l => l.code === currentLanguage)?.label}</span>
              <ChevronDown className="w-3 h-3 text-zinc-500" />
            </button>
            
            <div className="absolute right-0 mt-2 w-32 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-zinc-800 transition-colors flex items-center gap-2
                    ${currentLanguage === lang.code ? 'text-white bg-zinc-800/50' : 'text-zinc-400'}`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
