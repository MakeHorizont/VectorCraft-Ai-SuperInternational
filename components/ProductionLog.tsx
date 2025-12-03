
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { GeneratedSvg } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { History, Trash2, RotateCcw } from 'lucide-react';

interface ProductionLogProps {
  history: GeneratedSvg[];
  onRestore: (item: GeneratedSvg) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

export const ProductionLog: React.FC<ProductionLogProps> = ({ history, onRestore, onDelete, onClear }) => {
  const { t } = useLanguage();

  if (history.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700 mb-20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-zinc-400 font-medium flex items-center gap-2 text-sm uppercase tracking-wider">
          <History className="w-4 h-4" /> {t.history.title}
        </h3>
        <button 
          onClick={onClear}
          className="text-xs text-red-400 hover:text-red-300 transition-colors"
        >
          {t.history.clearAll}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {history.map((item) => (
          <div 
            key={item.id} 
            className="bg-zinc-900/50 border border-white/5 rounded-xl p-3 hover:bg-zinc-800/50 hover:border-white/10 transition-all group"
          >
            <div className="flex justify-between items-start gap-2 mb-2">
              <p className="text-zinc-300 text-sm font-medium line-clamp-2 leading-tight">
                {item.prompt}
              </p>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                className="text-zinc-600 hover:text-red-400 transition-colors p-1"
                title={t.history.delete}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="flex justify-between items-end mt-2">
               <span className="text-[10px] text-zinc-600 font-mono">
                 {new Date(item.timestamp).toLocaleTimeString()}
               </span>
               <button
                 onClick={() => onRestore(item)}
                 className="flex items-center gap-1.5 px-2 py-1 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300 rounded text-xs transition-colors font-medium"
               >
                 <RotateCcw className="w-3 h-3" /> {t.history.restore}
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
