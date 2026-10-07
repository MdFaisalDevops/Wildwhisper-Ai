'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Webcam from 'react-webcam';
import { Camera, Image as ImageIcon, ArrowLeft, Loader2, Sparkles, MapPin, Info } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DemoVisionProvider, GeminiVisionProvider } from '@/lib/ai/vision';
import { VisionIdentificationResult } from '@/lib/types';
import Link from 'next/link';
import { storage } from '@/lib/storage';
import Image from 'next/image';

type State = 'camera' | 'processing' | 'result';

export default function CameraIdentifyPage() {
  const [state, setState] = useState<State>('camera');
  const [result, setResult] = useState<VisionIdentificationResult | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);
  
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      processImage();
    }
  }, [webcamRef]);

  const processImage = async () => {
    setState('processing');
    try {
      const settings = await storage.getSettings();
      const provider = settings.useCloudAi 
        ? new GeminiVisionProvider() 
        : new DemoVisionProvider();
        
      // If we had a real blob from the camera, we would pass it here
      // For now, if we have capturedImage (base64 data URI), we can convert it to a blob
      let imageBlob = new Blob();
      if (capturedImage && settings.useCloudAi) {
        const response = await fetch(capturedImage);
        imageBlob = await response.blob();
      }

      const res = await provider.identify(imageBlob);
      setResult(res);
      
      await storage.saveDiscovery({
        id: Math.random().toString(36).substring(7),
        name: res.name,
        category: res.category,
        confidence: res.confidence,
        date: new Date().toISOString(),
        notes: res.description
      });
      
      setState('result');
    } catch (err) {
      setState('camera');
      alert("Processing failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative bg-black">
      <header className="absolute top-0 left-0 right-0 z-10 flex items-center gap-4 p-6 bg-gradient-to-b from-black/80 to-transparent text-white pb-12">
        <Link href="/" className={buttonVariants({ variant: "ghost", size: "icon", className: "rounded-full text-white hover:bg-white/20" })}>
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold shadow-black drop-shadow-md">Identify Nature</h1>
      </header>

      {state === 'camera' && (
        <div className="flex-1 relative flex flex-col">
          <div className="flex-1 relative bg-black">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: "environment" }}
              className="w-full h-full object-cover"
            />
            {/* Guide frame overlay */}
            <div className="absolute inset-0 pointer-events-none border-[40px] border-black/40">
              <div className="w-full h-full border-2 border-white/50 rounded-lg relative">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-500 rounded-tl" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-500 rounded-tr" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-500 rounded-bl" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-500 rounded-br" />
              </div>
            </div>
          </div>
          <div className="bg-black p-8 pb-12 flex justify-center gap-8 items-center h-32">
            <Button variant="outline" size="icon" className="rounded-full w-12 h-12 border-white/20 bg-white/10 text-white hover:bg-white/20">
              <ImageIcon className="w-5 h-5" />
            </Button>
            <button 
              onClick={capture}
              className="w-20 h-20 rounded-full border-4 border-white/50 flex items-center justify-center p-1"
            >
              <div className="w-full h-full bg-white rounded-full transition-transform active:scale-90" />
            </button>
            <div className="w-12 h-12" /> {/* Spacer */}
          </div>
        </div>
      )}

      {state === 'processing' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center text-white p-6 bg-black">
          {capturedImage && (
            <div className="w-48 h-48 relative rounded-2xl overflow-hidden mb-4 opacity-50">
              <Image src={capturedImage} alt="Captured" fill className="object-cover" />
              <div className="absolute inset-0 bg-green-500/20 mix-blend-overlay" />
            </div>
          )}
          <Loader2 className="w-12 h-12 text-green-500 animate-spin" />
          <h2 className="text-xl font-medium">Analyzing Image...</h2>
          <Badge variant="outline" className="text-amber-500 border-amber-500/30 bg-amber-500/10">AI Processing</Badge>
        </div>
      )}

      {state === 'result' && result && (
        <div className="flex-1 flex flex-col gap-6 p-6 pt-24 bg-background animate-in fade-in slide-in-from-bottom-4 min-h-screen">
          <Badge variant="outline" className="w-fit text-amber-500 border-amber-500/30 bg-amber-500/10 self-center">AI Result</Badge>
          
          <Card className="border-border/50 bg-card overflow-hidden">
            <div className="h-48 relative bg-black">
              {capturedImage && <Image src={capturedImage} alt="Captured" fill className="object-cover" />}
            </div>
            <CardHeader className="text-center pt-6">
              <CardTitle className="text-3xl">{result.name}</CardTitle>
              <div className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-green-500 mt-2 capitalize">
                <Sparkles className="w-4 h-4" /> {result.category} • {result.confidence}% Match
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-muted-foreground">{result.description}</p>
              
              <div className="grid grid-cols-1 gap-3 mt-4">
                <div className="bg-accent/50 rounded-xl p-4 flex gap-3">
                  <div className="bg-background rounded-full p-2 h-fit">
                    <Info className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Fact</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{result.fact}</p>
                  </div>
                </div>
                <div className="bg-green-500/10 rounded-xl p-4 flex gap-3 border border-green-500/20">
                  <div className="bg-green-500/20 rounded-full p-2 h-fit">
                    <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400">Observation Tip</p>
                    <p className="text-sm text-green-600/80 dark:text-green-400/80 mt-0.5">{result.tip}</p>
                  </div>
                </div>
              </div>
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
