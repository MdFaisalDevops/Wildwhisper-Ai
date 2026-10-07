'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, Square, Loader2, ArrowLeft, Info, MapPin, Leaf } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DemoBirdProvider, GeminiBirdProvider } from '@/lib/ai/bird';
import { BirdIdentificationResult } from '@/lib/types';
import Link from 'next/link';
import { storage } from '@/lib/storage';

type State = 'idle' | 'recording' | 'processing' | 'result';

export default function AudioIdentifyPage() {
  const [state, setState] = useState<State>('idle');
  const [result, setResult] = useState<BirdIdentificationResult | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (state === 'recording') {
      timerRef.current = setInterval(() => {
        setRecordingTime(t => t + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingTime(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state]);

  const startRecording = async () => {
    try {
      // Request mic permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setState('recording');
      
      // Auto stop after 5 seconds for demo
      setTimeout(() => {
        if (state !== 'result') stopRecording();
      }, 5000);
    } catch (err) {
      alert("Microphone permission is required.");
    }
  };

  const stopRecording = async () => {
    setState('processing');
    
    try {
      const settings = await storage.getSettings();
      const provider = settings.useCloudAi 
        ? new GeminiBirdProvider() 
        : new DemoBirdProvider();
        
      // Mock blob or actual blob if we had one
      const res = await provider.identify(new Blob());
      setResult(res);
      
      // Save discovery
      await storage.saveDiscovery({
        id: Math.random().toString(36).substring(7),
        name: res.name,
        category: 'bird',
        confidence: res.confidence,
        date: new Date().toISOString(),
        notes: res.description
      });
      
      setState('result');
    } catch (err) {
      console.error(err);
      setState('idle');
      alert("Processing failed. If using Cloud AI, check your API key.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-6 relative">
      <header className="flex items-center gap-4 py-4 mb-4">
        <Link href="/" className={buttonVariants({ variant: "ghost", size: "icon", className: "rounded-full" })}>
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold">Identify Bird Sound</h1>
      </header>

      {state === 'idle' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-8 text-center">
          <div className="w-32 h-32 rounded-full bg-green-500/10 flex items-center justify-center">
            <Mic className="w-12 h-12 text-green-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Listen to Nature</h2>
            <p className="text-muted-foreground max-w-xs mx-auto">
              Record a bird call for 5-10 seconds to identify the species around you.
            </p>
          </div>
          <Button size="lg" onClick={startRecording} className="w-full max-w-xs rounded-full h-14 text-base bg-green-600 hover:bg-green-700">
            Start Recording
          </Button>
        </div>
      )}

      {state === 'recording' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-8 text-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-red-500/20 flex items-center justify-center animate-pulse">
              <div className="w-24 h-24 rounded-full bg-red-500/40 flex items-center justify-center animate-ping">
                <Mic className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-mono mb-2">
              00:{recordingTime.toString().padStart(2, '0')}
            </h2>
            <p className="text-muted-foreground">Listening...</p>
          </div>
          <Button size="lg" variant="destructive" onClick={stopRecording} className="w-full max-w-xs rounded-full h-14 text-base flex gap-2">
            <Square className="w-4 h-4 fill-current" /> Stop Recording
          </Button>
        </div>
      )}

      {state === 'processing' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center">
          <Loader2 className="w-12 h-12 text-green-500 animate-spin" />
          <h2 className="text-xl font-medium">Analyzing Audio...</h2>
          <Badge variant="outline" className="text-amber-500 border-amber-500/30 bg-amber-500/10">AI Processing</Badge>
        </div>
      )}

      {state === 'result' && result && (
        <div className="flex-1 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4">
          <Badge variant="outline" className="w-fit text-amber-500 border-amber-500/30 bg-amber-500/10 self-center">AI Result</Badge>
          
          <Card className="border-border/50 bg-card overflow-hidden">
            <div className="h-48 relative bg-black flex items-center justify-center overflow-hidden">
              {result.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={result.imageUrl} alt={result.name} className="object-cover w-full h-full opacity-80" />
              ) : (
                <Mic className="w-12 h-12 text-green-500/50" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              
              <div className="absolute bottom-4 left-0 right-0 px-6">
                <CardTitle className="text-3xl text-white shadow-sm drop-shadow-md">{result.name}</CardTitle>
                <div className="inline-flex items-center justify-center gap-1.5 text-sm font-bold text-green-400 mt-1 drop-shadow-md">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  {result.confidence}% Match
                </div>
              </div>
            </div>
            
            <CardContent className="space-y-4 pt-6">
              {result.audioUrl && (
                <div className="w-full bg-muted/50 rounded-xl p-3 flex items-center gap-3">
                  <audio controls src={result.audioUrl} className="w-full h-10" />
                </div>
              )}
              <p className="text-center text-muted-foreground font-medium">{result.description}</p>
              
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-accent/50 rounded-xl p-3">
                  <MapPin className="w-4 h-4 mb-1 text-muted-foreground" />
                  <p className="text-xs font-semibold">Habitat</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{result.habitat}</p>
                </div>
                <div className="bg-accent/50 rounded-xl p-3">
                  <Info className="w-4 h-4 mb-1 text-muted-foreground" />
                  <p className="text-xs font-semibold">Fact</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{result.fact}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-500/30 bg-green-500/5">
            <CardContent className="p-5 flex flex-col gap-4 text-center">
              <div>
                <h3 className="font-bold flex items-center justify-center gap-2 mb-2">
                  <Leaf className="w-4 h-4 text-green-500" /> Your next mission
                </h3>
                <p className="text-sm">Walk quietly for 2 minutes. Look toward the nearest tree canopy and listen for another bird call.</p>
              </div>
              <Link href={`/whisper?mission=demo-1&duration=2`} className={buttonVariants({ className: "w-full rounded-full h-12 bg-green-600 hover:bg-green-700 text-white" })}>
                Start Mission
              </Link>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function Badge({ children, className, ...props }: any) {
  return <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`} {...props}>{children}</div>;
}
