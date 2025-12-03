
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Send, Loader2, Wand2, Upload, X, Globe, Link as LinkIcon, Palette, Clipboard, Settings, PlayCircle, FileCode, Layers, Maximize, AlertCircle } from 'lucide-react';
import { GenerationStatus, GenerationOptions, ReferenceImage, GenerationMode, ResolutionConfig } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface InputSectionProps {
  onGenerate: (options: GenerationOptions) => void;
  status: GenerationStatus;
}

const DEFAULT_RESOLUTION: ResolutionConfig = { width: 512, height: 512, isCustom: false };

export const InputSection: React.FC<InputSectionProps> = ({ onGenerate, status }) => {
  // Tabs: 'create' or 'transform'
  const [mode, setMode] = useState<GenerationMode>('create');

  // Inputs
  const [prompt, setPrompt] = useState(''); // Object description (Create) or Changes (Transform)
  const [sourceSvg, setSourceSvg] = useState(''); // Only for Transform
  const [stylePrompt, setStylePrompt] = useState(''); 
  const [animationPrompt, setAnimationPrompt] = useState(''); // New: Tech specs
  
  // Resolution
  const [resolution, setResolution] = useState<ResolutionConfig>(DEFAULT_RESOLUTION);

  // Common
  const [urls, setUrls] = useState('');
  const [useSearch, setUseSearch] = useState(false);
  const [images, setImages] = useState<ReferenceImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true); 
  const [pasteError, setPasteError] = useState(false);

  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const svgInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && status !== GenerationStatus.LOADING) {
      const urlList = urls.split('\n').map(u => u.trim()).filter(u => u.length > 0);
      onGenerate({
        mode,
        prompt: prompt.trim(),
        stylePrompt: stylePrompt.trim(),
        animationPrompt: animationPrompt.trim(),
        sourceSvg: mode === 'transform' ? sourceSvg : undefined,
        images,
        urls: urlList,
        useSearch,
        resolution
      });
    }
  }, [mode, prompt, stylePrompt, animationPrompt, sourceSvg, images, urls, useSearch, resolution, status, onGenerate]);

  const processImages = useCallback((fileList: File[]) => {
    let hasProcessed = false;
    fileList.forEach(file => {
      // CRITICAL FIX: Gemini API does not support image/svg+xml as a media part.
      // We must exclude it from the images array to prevent 400 errors.
      if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) return;

      if (!file.type.startsWith('image/')) return;
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        const newImage: ReferenceImage = {
          id: crypto.randomUUID(),
          data: base64String,
          mimeType: file.type
        };
        setImages(prev => [...prev, newImage]);
        setIsExpanded(true); 
      };
      reader.readAsDataURL(file);
      hasProcessed = true;
    });
    if (hasProcessed) setIsExpanded(true);
  }, []);

  const processSvgFile = useCallback((file: File) => {
    if (!file.name.endsWith('.svg') && file.type !== 'image/svg+xml') return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setSourceSvg(e.target.result as string);
        setIsExpanded(true);
      }
    };
    reader.readAsText(file);
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processImages(Array.from(e.target.files));
    }
  };

  const handleSvgFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSvgFile(e.target.files[0]);
    }
  };

  // Paste Handling
  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      // Allow pasting text into inputs normally
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
      
      if (e.clipboardData) {
        if (e.clipboardData.files.length > 0) {
           e.preventDefault();
           processImages(Array.from(e.clipboardData.files));
        }
      }
    };
    window.addEventListener('paste', handleGlobalPaste);
    return () => window.removeEventListener('paste', handleGlobalPaste);
  }, [processImages]);

  const handlePasteClick = async () => {
    try {
      setPasteError(false);
      // Check for browser support first
      if (!navigator.clipboard || !navigator.clipboard.read) {
        throw new Error("Clipboard API not supported");
      }

      const clipboardItems = await navigator.clipboard.read();
      const files: File[] = [];
      for (const item of clipboardItems) {
        const imageTypes = item.types.filter(type => type.startsWith('image/'));
        for (const type of imageTypes) {
          const blob = await item.getType(type);
          files.push(new File([blob], "pasted-image", { type }));
        }
      }
      if (files.length > 0) {
        processImages(files);
      } else {
        // No images found, maybe text? Just hint user.
        setPasteError(true);
        setTimeout(() => setPasteError(false), 3000);
      }
    } catch (err) {
      // Squelch the console error to prevent user alarm. 
      // This is expected in restricted iframes or without explicit permissions.
      // console.debug("Clipboard read failed (expected in some envs):", err); 
      
      // Trigger the fallback UI state
      setPasteError(true);
      setTimeout(() => setPasteError(false), 3000);
    }
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const imageFiles: File[] = [];
    const svgFiles: File[] = [];

    Array.from(e.dataTransfer.files).forEach((f: File) => {
       if (f.name.endsWith('.svg') || f.type === 'image/svg+xml') svgFiles.push(f);
       else if (f.type.startsWith('image/')) imageFiles.push(f);
    });

    if (imageFiles.length > 0) processImages(imageFiles);
    // If we are in transform mode, dropping an SVG automatically sets it as source
    if (svgFiles.length > 0 && mode === 'transform') processSvgFile(svgFiles[0]);
  };

  const removeImage = (id: string) => { setImages(prev => prev.filter(img => img.id !== id)); };
  const isLoading = status === GenerationStatus.LOADING;

  const handleResolutionChange = (val: string) => {
    if (val === 'custom') {
      setResolution({ ...resolution, isCustom: true });
    } else {
      const [w, h] = val.split('x').map(Number);
      setResolution({ width: w, height: h, isCustom: false });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400 mb-3">
          {mode === 'create' ? t.hero.title : t.hero.titleTransform}
        </h2>
        <p className="text-zinc-400 text-lg">
          {mode === 'create' ? t.hero.subtitle : t.hero.subtitleTransform}
        </p>
      </div>

      {/* Mode Tabs */}
      <div className="flex justify-center mb-6">
        <div className="bg-zinc-900/80 p-1 rounded-xl border border-white/10 flex gap-1">
          <button
            onClick={() => setMode('create')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === 'create' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' 
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {t.tabs.create}
          </button>
          <button
            onClick={() => setMode('transform')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === 'transform' 
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/25' 
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {t.tabs.transform}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative group">
           <div className={`absolute -inset-0.5 bg-gradient-to-r rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur-lg 
             ${mode === 'create' ? 'from-indigo-500 via-purple-500 to-pink-500' : 'from-amber-500 via-orange-500 to-red-500'}`}>
           </div>
           <div className="relative bg-zinc-900 rounded-xl border border-white/10 shadow-2xl overflow-hidden">
              
              {/* --- TRANSFORM MODE SPECIFIC: Source SVG Input --- */}
              {mode === 'transform' && (
                <div className="p-4 border-b border-white/10 bg-zinc-900/80">
                   <label className="flex items-center justify-between text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">
                      <div className="flex items-center gap-2">
                        <FileCode className="w-3 h-3 text-amber-400" /> {t.inputs.sourceSvgLabel}
                      </div>
                      <button 
                        type="button" 
                        onClick={() => svgInputRef.current?.click()}
                        className="text-[10px] bg-zinc-800 px-2 py-1 rounded hover:bg-zinc-700 text-zinc-300"
                      >
                        Upload File
                      </button>
                      <input 
                        type="file" 
                        ref={svgInputRef} 
                        className="hidden" 
                        accept=".svg,image/svg+xml"
                        onChange={handleSvgFileSelect}
                      />
                   </label>
                   <textarea
                     value={sourceSvg}
                     onChange={(e) => setSourceSvg(e.target.value)}
                     placeholder={t.inputs.sourceSvgPlaceholder}
                     rows={4}
                     className="w-full bg-zinc-950/50 rounded-lg border border-white/5 outline-none p-3 text-xs font-mono text-zinc-300 placeholder-zinc-700 resize-none focus:border-amber-500/30 transition-colors"
                     disabled={isLoading}
                   />
                </div>
              )}

              {/* --- Main Prompt --- */}
              <div className="p-4 border-b border-white/5">
                 <label className="flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <Wand2 className="w-3 h-3" /> {mode === 'create' ? t.inputs.objectLabel : t.inputs.transformLabel}
                 </label>
                 <textarea
                   value={prompt}
                   onChange={(e) => setPrompt(e.target.value)}
                   placeholder={mode === 'create' ? t.inputs.objectPlaceholder : t.inputs.transformPlaceholder}
                   rows={2}
                   className="w-full bg-transparent border-none outline-none text-white placeholder-zinc-600 text-lg resize-none"
                   disabled={isLoading}
                 />
              </div>

              {/* --- Style Prompt --- */}
              <div className="p-4 bg-zinc-900/50 border-b border-white/5">
                 <label className="flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <Palette className="w-3 h-3" /> {t.inputs.styleLabel}
                 </label>
                 <input
                   value={stylePrompt}
                   onChange={(e) => setStylePrompt(e.target.value)}
                   placeholder={t.inputs.stylePlaceholder}
                   className="w-full bg-transparent border-none outline-none text-zinc-200 placeholder-zinc-600 text-base"
                   disabled={isLoading}
                 />
              </div>

              {/* --- New: Animation / Tech Specs --- */}
              <div className="p-4 bg-zinc-900/30">
                 <label className="flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <PlayCircle className="w-3 h-3" /> {t.inputs.techLabel}
                 </label>
                 <input
                   value={animationPrompt}
                   onChange={(e) => setAnimationPrompt(e.target.value)}
                   placeholder={t.inputs.techPlaceholder}
                   className="w-full bg-transparent border-none outline-none text-zinc-200 placeholder-zinc-600 text-base"
                   disabled={isLoading}
                 />
              </div>

              {/* Attached Reference Images Preview */}
              {images.length > 0 && (
                <div className="px-4 py-3 bg-zinc-950/30 flex flex-wrap gap-2 border-t border-white/5">
                  {images.map(img => (
                    <div key={img.id} className="relative group/img w-16 h-16 rounded-md overflow-hidden border border-white/20">
                      <img src={`data:${img.mimeType};base64,${img.data}`} alt="Ref" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(img.id)}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Bottom Toolbar */}
              <div className="bg-zinc-950/50 px-3 py-3 flex items-center justify-between border-t border-white/10">
                 <button
                   type="button"
                   onClick={() => setIsExpanded(!isExpanded)}
                   className={`px-3 py-1.5 rounded-lg transition-colors text-xs font-medium flex items-center gap-2 ${isExpanded ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}`}
                 >
                   {isExpanded ? t.inputs.hideOptions : t.inputs.addOptions}
                 </button>

                 <button
                  type="submit"
                  disabled={!prompt.trim() || isLoading}
                  className={`
                    flex items-center justify-center gap-2 px-8 py-2 rounded-lg font-semibold transition-all duration-200
                    ${!prompt.trim() || isLoading 
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                      : mode === 'create' 
                        ? 'bg-white text-zinc-950 hover:bg-zinc-200 shadow-lg shadow-white/10'
                        : 'bg-amber-500 text-zinc-950 hover:bg-amber-400 shadow-lg shadow-amber-500/10'
                    }
                  `}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>{mode === 'create' ? t.inputs.generateButton : t.inputs.transformButton}</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
           </div>
        </div>

        {/* Expanded Options Panel */}
        {isExpanded && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300 space-y-4">
            
            <div className="flex flex-col md:flex-row gap-4">
               {/* 1. Reference Files (Common) */}
               <div 
                  className={`
                    flex-1 border-2 border-dashed rounded-xl p-4 transition-all duration-200 relative flex flex-col justify-center
                    ${isDragging ? 'border-indigo-500 bg-indigo-500/10' : 'border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900/50'}
                  `}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    accept="image/*" 
                    multiple 
                    onChange={handleFileSelect}
                  />
                  <div className="flex flex-col items-center gap-2 text-zinc-400 text-center">
                    <div className="flex gap-2">
                       <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center hover:text-white transition-colors">
                          <Upload className="w-5 h-5 mb-1" />
                          <span className="text-xs">Upload Images</span>
                       </button>
                       <div className="w-px h-8 bg-zinc-700 mx-2"></div>
                       <button 
                         onClick={handlePasteClick} 
                         className={`flex flex-col items-center transition-colors relative ${pasteError ? 'text-amber-500' : 'hover:text-white'}`}
                         title="Attempt to read clipboard"
                        >
                          {pasteError ? (
                             <AlertCircle className="w-5 h-5 mb-1 animate-pulse" />
                          ) : (
                             <Clipboard className="w-5 h-5 mb-1" />
                          )}
                          <span className={`text-xs ${pasteError ? 'font-bold' : ''}`}>
                             {pasteError ? "Use Ctrl+V" : t.inputs.pasteLabel}
                          </span>
                       </button>
                    </div>
                  </div>
               </div>

               {/* 2. Resolution Settings */}
               <div className="md:w-64 bg-zinc-900/50 border border-white/10 rounded-xl p-4">
                   <div className="flex items-center gap-2 text-zinc-400 mb-3 text-xs font-bold uppercase tracking-wider">
                      <Maximize className="w-3 h-3" /> {t.inputs.resolutionLabel}
                   </div>
                   <div className="space-y-2">
                      <select 
                        className="w-full bg-zinc-950 border border-white/10 rounded-lg p-2 text-sm text-zinc-300 outline-none"
                        value={resolution.isCustom ? 'custom' : `${resolution.width}x${resolution.height}`}
                        onChange={(e) => handleResolutionChange(e.target.value)}
                      >
                         <option value="512x512">512 x 512 (Default)</option>
                         <option value="800x600">800 x 600 (Landscape)</option>
                         <option value="1024x1024">1024 x 1024 (HD Square)</option>
                         <option value="1920x1080">1920 x 1080 (FHD)</option>
                         <option value="custom">{t.inputs.customRes}...</option>
                      </select>
                      
                      {resolution.isCustom && (
                        <div className="flex gap-2 animate-in fade-in">
                           <input 
                             type="number" 
                             value={resolution.width}
                             onChange={(e) => setResolution({ ...resolution, width: Number(e.target.value) })}
                             className="w-1/2 bg-zinc-950 border border-white/10 rounded-lg p-2 text-sm text-zinc-300 outline-none" 
                             placeholder="W"
                           />
                           <input 
                             type="number" 
                             value={resolution.height}
                             onChange={(e) => setResolution({ ...resolution, height: Number(e.target.value) })}
                             className="w-1/2 bg-zinc-950 border border-white/10 rounded-lg p-2 text-sm text-zinc-300 outline-none" 
                             placeholder="H"
                           />
                        </div>
                      )}
                   </div>
               </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
               {/* URL Input */}
               <div className="flex-1 bg-zinc-900/50 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-zinc-400 mb-2 text-xs font-bold uppercase tracking-wider">
                     <LinkIcon className="w-3 h-3" /> {t.inputs.urlsLabel}
                  </div>
                  <textarea 
                    className="w-full bg-zinc-950/50 rounded-lg border border-white/5 outline-none p-2 text-xs text-zinc-300 placeholder-zinc-600 resize-none"
                    placeholder={t.inputs.urlsPlaceholder}
                    rows={2}
                    value={urls}
                    onChange={(e) => setUrls(e.target.value)}
                  />
               </div>

               {/* Search Toggle */}
               <div className="md:w-64 bg-zinc-900/50 border border-white/10 rounded-xl p-4 flex flex-col justify-center">
                  <label className="flex items-center justify-between cursor-pointer group w-full">
                     <div className="flex items-center gap-2">
                        <Globe className="w-3 h-3 text-zinc-400" />
                        <span className="text-sm text-zinc-300 group-hover:text-white transition-colors font-medium">{t.inputs.searchLabel}</span>
                     </div>
                     <div className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${useSearch ? 'bg-indigo-600' : 'bg-zinc-700'}`}>
                        <input 
                          type="checkbox" 
                          className="hidden" 
                          checked={useSearch}
                          onChange={(e) => setUseSearch(e.target.checked)}
                        />
                        <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${useSearch ? 'translate-x-5' : ''}`}></div>
                     </div>
                  </label>
               </div>
            </div>
          </div>
        )}
      </form>
      
      {/* Quick suggestions (Only for Create mode) */}
      {!isExpanded && mode === 'create' && (
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {Object.values(t.suggestions).map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setPrompt(suggestion)}
              className="px-4 py-2 text-xs font-medium text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-full hover:bg-zinc-800 hover:text-white hover:border-zinc-600 transition-all"
              disabled={isLoading}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
