'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Bot } from 'lucide-react';
import { storage } from '@/lib/storage';

export function AiStatusIndicator() {
  const [useCloudAi, setUseCloudAi] = useState(false);

  useEffect(() => {
    // Check initial state
    storage.getSettings().then(s => setUseCloudAi(s.useCloudAi));
    
    // Listen for storage changes if in same window, or we can just poll/check on focus
    const handleFocus = () => {
      storage.getSettings().then(s => setUseCloudAi(s.useCloudAi));
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  return (
    <div className={`fixed top-0 right-0 z-50 flex items-center justify-center px-3 py-1.5 m-2 rounded-full text-xs font-bold shadow-lg backdrop-blur-md border transition-all ${
      useCloudAi 
        ? "bg-blue-500/20 border-blue-500/50 text-blue-400 shadow-blue-900/20" 
        : "bg-amber-500/20 border-amber-500/50 text-amber-500 shadow-amber-900/20"
    }`}>
      {useCloudAi ? (
        <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 fill-blue-500" /> Gemini Live</span>
      ) : (
        <span className="flex items-center gap-1.5"><Bot className="w-3.5 h-3.5" /> Demo AI</span>
      )}
    </div>
  );
}
