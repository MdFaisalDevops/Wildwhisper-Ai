'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Headphones, ArrowLeft, Eye, Play } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DemoBirdProvider, GeminiBirdProvider } from '@/lib/ai/bird';
import { BirdIdentificationResult } from '@/lib/types';
import { storage } from '@/lib/storage';
import Link from 'next/link';

type State = 'idle' | 'listening' | 'reveal';

export default function MysterySoundPage() {
  const [state, setState] = useState<State>('idle');
  const [result, setResult] = useState<BirdIdentificationResult | null>(null);

  const startListening = async () => {
    setState('listening');
    try {
      const settings = await storage.getSettings();
      const provider = settings.useCloudAi 
        ? new GeminiBirdProvider() 
        : new DemoBirdProvider();
        
      const res = await provider.identify(new Blob());
      setResult(res);
    } catch (err) {
      console.error(err);
      alert("Failed to analyze sound.");
      setState('idle');
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-6 relative">
      <header className="flex items-center gap-4 py-4 mb-4">
        <Link href="/" className={buttonVariants({ variant: "ghost", size: "icon", className: "rounded-full" })}>
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold">Mystery Sound</h1>
      </header>

      {state === 'idle' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-8 text-center animate-in fade-in">
          <div className="w-32 h-32 rounded-full bg-purple-500/10 flex items-center justify-center">
            <Headphones className="w-12 h-12 text-purple-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Sound Hunter</h2>
            <p className="text-muted-foreground max-w-xs mx-auto">
              Record a sound, but try to find the source before the AI reveals the answer.
            </p>
          </div>
          <Button size="lg" onClick={startListening} className="w-full max-w-xs rounded-full h-14 bg-purple-600 hover:bg-purple-700">
            Start Challenge
          </Button>
        </div>
      )}

      {state === 'listening' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-8 text-center animate-in fade-in">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-purple-500">I heard something!</h2>
            
            <div className="space-y-2 text-xl font-medium opacity-80">
              <p>Listen again...</p>
              <p>Which direction did it come from?</p>
              <p>Look toward the trees.</p>
            </div>
          </div>
          
          <Button 
            size="lg" 
            onClick={() => setState('reveal')} 
            disabled={!result}
            className="w-full max-w-xs rounded-full h-14 mt-8 flex gap-2"
          >
            <Eye className="w-5 h-5" /> REVEAL ANSWER
          </Button>
        </div>
      )}

      {state === 'reveal' && result && (
        <div className="flex-1 flex flex-col gap-6 animate-in zoom-in-95 duration-500">
          <Card className="border-border/50 bg-card overflow-hidden">
            <div className="h-48 bg-purple-900/30 relative flex items-center justify-center overflow-hidden">
              {result.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={result.imageUrl} alt={result.name} className="absolute inset-0 object-cover w-full h-full opacity-80" />
              ) : (
                <Headphones className="w-16 h-16 text-purple-500/50" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            </div>
            <CardContent className="p-6 text-center -mt-10 relative z-10 bg-gradient-to-t from-card via-card to-transparent pt-10">
              <h2 className="text-3xl font-bold mb-2">{result.name}</h2>
              <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-purple-500/10 text-purple-500 font-medium text-sm mb-4">
                {result.confidence}% Match
              </div>
              
              {result.audioUrl && (
                <div className="w-full bg-muted/50 rounded-xl p-3 mb-4 flex items-center gap-3">
                  <audio controls src={result.audioUrl} className="w-full h-10" />
                </div>
              )}
              
              <p className="text-muted-foreground font-medium">{result.description}</p>
            </CardContent>
          </Card>

          <Card className="border-green-500/30 bg-green-500/5">
            <CardContent className="p-5 flex flex-col gap-4 text-center">
              <h3 className="font-bold text-green-600 dark:text-green-400">🌿 New mission unlocked</h3>
              <p className="text-sm">Find where this bird might be hiding.</p>
              <Link href={`/whisper?mission=mystery&duration=5`} className={buttonVariants({ className: "w-full rounded-full h-12 bg-green-600 hover:bg-green-700 text-white" })}>
                Start Mission
              </Link>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
