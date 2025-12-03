
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Code, Download, Image as ImageIcon, FileArchive, ChevronDown, FileCode, RefreshCw, Sparkles, Sun, Moon, Grid } from 'lucide-react';
import { GeneratedSvg } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { refineSvg } from '../services/geminiService';
import JSZip from 'jszip';

interface SvgPreviewProps {
  data: GeneratedSvg | null;
  onUpdate: (newContent: string) => void;
}

type BgMode = 'dark' | 'light' | 'grid';

export const SvgPreview: React.FC<SvgPreviewProps> = ({ data, onUpdate }) => {
  const [copied, setCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [refinementPrompt, setRefinementPrompt] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [bgMode, setBgMode] = useState<BgMode>('grid');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  // Reset states when data changes (but not when refining in place)
  useEffect(() => {
    setCopied(false);
    setIsMenuOpen(false);
    setRefinementPrompt('');
  }, [data?.id]); // Only reset if the ID changes (new generation), not update

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!data) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(data.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refinementPrompt.trim() || isRefining) return;

    setIsRefining(true);
    try {
      const newContent = await refineSvg(data.content, refinementPrompt);
      onUpdate(newContent);
      setRefinementPrompt('');
    } catch (error) {
      console.error("Refinement failed", error);
      // Ideally show error toast
    } finally {
      setIsRefining(false);
    }
  };

  // Helper: Generate filename slug
  const getBaseFilename = () => {
    // Take first few words, remove non-alphanumeric, add timestamp for versioning
    const slug = data.prompt
      .slice(0, 30)
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    
    const version = new Date(data.timestamp).toISOString().split('T')[1].replace(/[:\.]/g, '').slice(0, 6);
    return `${slug || 'vector'}-v${version}`;
  };

  const triggerDownload = (href: string, filename: string) => {
    const link = document.createElement('a');
    link.href = href;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Format 1: SVG
  const handleDownloadSvg = () => {
    const blob = new Blob([data.content], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    triggerDownload(url, `${getBaseFilename()}.svg`);
    URL.revokeObjectURL(url);
    setIsMenuOpen(false);
  };

  // Format 2: PNG (Rasterize via Canvas)
  const generatePngBlob = (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const img = new Image();
      // Needed for some unicode char rendering in SVG to Canvas
      const svgBlob = new Blob([data.content], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        // Set high resolution for crisp PNG
        const scale = 2; 
        // Use ViewBox or default size
        const viewBox = data.content.match(/viewBox="([^"]+)"/);
        let width = 512;
        let height = 512;
        
        if (viewBox) {
           const parts = viewBox[1].split(' ').map(Number);
           if (parts.length === 4) {
             width = parts[2];
             height = parts[3];
           }
        }

        canvas.width = width * scale;
        canvas.height = height * scale;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.scale(scale, scale);
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            URL.revokeObjectURL(url);
            resolve(blob);
          }, 'image/png');
        } else {
          resolve(null);
        }
      };
      img.src = url;
    });
  };

  const handleDownloadPng = async () => {
    const blob = await generatePngBlob();
    if (blob) {
      const url = URL.createObjectURL(blob);
      triggerDownload(url, `${getBaseFilename()}.png`);
      URL.revokeObjectURL(url);
    }
    setIsMenuOpen(false);
  };

  // Format 3: ZIP (Bundle)
  const handleDownloadZip = async () => {
    const zip = new JSZip();
    const baseName = getBaseFilename();
    
    // Add SVG
    zip.file(`${baseName}.svg`, data.content);
    
    // Add PNG
    const pngBlob = await generatePngBlob();
    if (pngBlob) {
      zip.file(`${baseName}.png`, pngBlob);
    }

    // Generate Zip
    const zipContent = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipContent);
    triggerDownload(url, `${baseName}.zip`);
    URL.revokeObjectURL(url);
    setIsMenuOpen(false);
  };

  const getBgClass = () => {
    switch(bgMode) {
      case 'light': return 'bg-zinc-100';
      case 'dark': return 'bg-zinc-950';
      case 'grid': return "bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-zinc-950/50";
      default: return 'bg-zinc-950';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="bg-zinc-900/80 backdrop-blur border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 border-b border-white/10 bg-zinc-900/50 gap-4">
          <h3 className="text-sm font-medium text-zinc-300 truncate max-w-[200px]">
             {t.preview.resultTitle}: <span className="text-zinc-500">"{data.prompt}"</span>
          </h3>
          
          <div className="flex gap-2 items-center self-end sm:self-auto">
             {/* Background Toggles */}
             <div className="flex items-center bg-zinc-800 rounded-lg p-0.5 border border-zinc-700 mr-2">
                <button 
                  onClick={() => setBgMode('dark')}
                  className={`p-1.5 rounded-md transition-all ${bgMode === 'dark' ? 'bg-zinc-600 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
                  title={t.preview.bgDark}
                >
                  <Moon className="w-3 h-3" />
                </button>
                <button 
                  onClick={() => setBgMode('grid')}
                  className={`p-1.5 rounded-md transition-all ${bgMode === 'grid' ? 'bg-zinc-600 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
                  title={t.preview.bgGrid}
                >
                  <Grid className="w-3 h-3" />
                </button>
                <button 
                  onClick={() => setBgMode('light')}
                  className={`p-1.5 rounded-md transition-all ${bgMode === 'light' ? 'bg-zinc-200 text-zinc-900' : 'text-zinc-400 hover:text-zinc-200'}`}
                  title={t.preview.bgLight}
                >
                  <Sun className="w-3 h-3" />
                </button>
             </div>

            <button
              onClick={handleCopyCode}
              className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors group relative"
              title={t.preview.copyTooltip}
            >
              {copied ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <Code className="w-5 h-5" />}
            </button>
            
            {/* Export Dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-zinc-900 bg-white rounded-lg hover:bg-zinc-200 transition-colors active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">{t.preview.downloadButton}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-zinc-800 border border-zinc-600 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                  <button onClick={handleDownloadSvg} className="w-full text-left px-4 py-3 text-sm text-zinc-200 hover:bg-zinc-700 flex items-center gap-3 transition-colors border-b border-zinc-700/50">
                    <FileCode className="w-4 h-4 text-orange-400" />
                    {t.preview.downloadSvg}
                  </button>
                  <button onClick={handleDownloadPng} className="w-full text-left px-4 py-3 text-sm text-zinc-200 hover:bg-zinc-700 flex items-center gap-3 transition-colors border-b border-zinc-700/50">
                    <ImageIcon className="w-4 h-4 text-blue-400" />
                    {t.preview.downloadPng}
                  </button>
                  <button onClick={handleDownloadZip} className="w-full text-left px-4 py-3 text-sm text-zinc-200 hover:bg-zinc-700 flex items-center gap-3 transition-colors">
                    <FileArchive className="w-4 h-4 text-yellow-400" />
                    {t.preview.downloadZip}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className={`p-8 flex items-center justify-center min-h-[400px] transition-colors duration-300 ${getBgClass()}`}>
           {/* 
             Using dangerouslySetInnerHTML is intentional here as the content is generated by the LLM for the purpose of display.
           */}
          <div 
            ref={containerRef}
            className="w-full max-w-[512px] h-auto transition-all duration-500 transform hover:scale-[1.02] filter drop-shadow-2xl"
            dangerouslySetInnerHTML={{ __html: data.content }} 
          />
        </div>
        
        {/* Dialectical Aufhebung (Refinement) Section */}
        <div className="border-t border-white/10 bg-zinc-900 p-4">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">
             <Sparkles className="w-3 h-3 text-purple-400" /> {t.refine.label}
          </div>
          <form onSubmit={handleRefine} className="flex gap-2">
            <input
              type="text"
              value={refinementPrompt}
              onChange={(e) => setRefinementPrompt(e.target.value)}
              placeholder={t.refine.placeholder}
              disabled={isRefining}
              className="flex-1 bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-purple-500/50 transition-colors"
            />
            <button
              type="submit"
              disabled={!refinementPrompt.trim() || isRefining}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              {isRefining ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
              {isRefining ? t.refine.processing : t.refine.button}
            </button>
          </form>
        </div>
        
        {/* Metadata Footer */}
        <div className="px-4 py-2 bg-zinc-950 border-t border-white/5 flex justify-between text-xs text-zinc-600 font-mono">
           <span>ID: {getBaseFilename()}</span>
           <span>{t.preview.generatedBy}</span>
        </div>
      </div>
    </div>
  );
};
