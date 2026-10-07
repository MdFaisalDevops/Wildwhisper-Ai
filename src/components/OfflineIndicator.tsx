'use client';

import { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { cn } from '@/lib/utils';

export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Check initial state
    setIsOffline(!navigator.onLine);

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className={cn(
      "fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-1.5 text-xs font-medium text-white transition-colors",
      isOffline ? "bg-amber-600" : "bg-green-600"
    )}>
      {isOffline ? (
        <span className="flex items-center gap-2"><WifiOff className="w-3 h-3" /> Offline Mode (AI Ready)</span>
      ) : (
        <span className="flex items-center gap-2"><Wifi className="w-3 h-3" /> Online</span>
      )}
    </div>
  );
}
