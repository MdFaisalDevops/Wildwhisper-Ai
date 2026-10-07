'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X, Play, Pause, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { storage } from '@/lib/storage';
import { Mission } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

function WhisperModeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const missionId = searchParams.get('mission');
  
  const [mission, setMission] = useState<Mission | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isActive, setIsActive] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    async function loadMission() {
      if (missionId === 'demo-1') {
        // Special case for audio demo
        const demoMission: Mission = {
          id: 'demo-1',
          title: 'Forest Listener',
          durationMinutes: 2,
          steps: ['Walk quietly for 2 minutes. Look toward the nearest tree canopy and listen for another bird call.'],
          completedSteps: 0,
          status: 'active',
          createdAt: new Date().toISOString()
        };
        setMission(demoMission);
        setTimeRemaining(demoMission.durationMinutes * 60);
        speak("Your mission has started. Put your phone away and walk quietly.");
      } else {
        const active = await storage.getActiveMission();
        if (active) {
          setMission(active);
          setTimeRemaining(active.durationMinutes * 60);
          speak("Your mission has started. Put your phone away.");
        } else if (missionId) {
          const missions = await storage.getMissions();
          const found = missions.find(m => m.id === missionId);
          if (found) {
            setMission(found);
            setTimeRemaining(found.durationMinutes * 60);
            speak("Your mission has started. Put your phone away.");
          }
        }
      }
    }
    loadMission();
  }, [missionId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(t => {
          if (t <= 1) {
            handleStepComplete();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
  };

  const handleStepComplete = () => {
    if (!mission) return;
    
    if (currentStepIndex < mission.steps.length - 1) {
      const nextStep = currentStepIndex + 1;
      setCurrentStepIndex(nextStep);
      speak(`Mission update. ${mission.steps[nextStep]}`);
      
      // Calculate remaining time slice
      const timeSlice = (mission.durationMinutes * 60) / mission.steps.length;
      setTimeRemaining(timeSlice);
    } else {
      speak("Mission complete. Excellent work out there.");
      finishMission();
    }
  };

  const finishMission = async () => {
    if (mission && mission.id !== 'demo-1') {
      await storage.saveMission({ ...mission, status: 'completed', completedSteps: mission.steps.length });
      
      const stats = await storage.getStats();
      await storage.updateStats({ 
        minutesOutside: stats.minutesOutside + mission.durationMinutes,
        streak: stats.streak === 0 ? 1 : stats.streak
      });
    }
    router.push('/');
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!mission) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;

  const currentInstruction = mission.steps[currentStepIndex];
  const progressPercent = ((currentStepIndex) / mission.steps.length) * 100;

  return (
    <div className="flex flex-col min-h-screen bg-black text-white relative overflow-hidden">
      {/* Immersive background */}
      <div className="absolute inset-0 bg-green-950/20 mix-blend-screen pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      <header className="flex justify-between items-center p-6 relative z-10">
        <Button variant="ghost" size="icon" className="text-white/50 hover:text-white rounded-full hover:bg-white/10" onClick={() => router.push('/')}>
          <X className="w-6 h-6" />
        </Button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center relative z-10">
        <div className="mb-12 animate-in slide-in-from-bottom-4 fade-in duration-1000">
          <p className="text-sm font-medium text-green-500/80 uppercase tracking-widest mb-4">
            Mission {currentStepIndex + 1} of {mission.steps.length}
          </p>
          <div className="text-7xl font-light font-mono tracking-tighter mb-8 tabular-nums">
            {formatTime(timeRemaining)}
          </div>
          <h2 className="text-3xl font-medium leading-tight max-w-sm mx-auto opacity-90 text-balance">
            {currentInstruction}
          </h2>
        </div>

        <div className="w-full max-w-xs space-y-8 animate-in fade-in duration-1000 delay-500">
          <div className="space-y-2">
            <Progress value={progressPercent} className="h-1 bg-white/10" />
            <div className="flex justify-between text-xs text-white/40 font-medium">
              <span>Start</span>
              <span>Finish</span>
            </div>
          </div>
          
          <div className="flex justify-center gap-6">
            <Button 
              size="icon" 
              variant="outline" 
              className="rounded-full w-16 h-16 border-white/20 bg-white/5 text-white hover:bg-white/10"
              onClick={() => setIsActive(!isActive)}
            >
              {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </Button>
            <Button 
              size="icon" 
              className="rounded-full w-16 h-16 bg-green-600 hover:bg-green-700 text-white"
              onClick={handleStepComplete}
            >
              <CheckCircle2 className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </main>

      <footer className="p-8 text-center relative z-10 pb-16">
        <p className="text-white/60 font-medium animate-pulse text-sm text-balance">
          📱 Your phone can go back into your pocket now.
        </p>
      </footer>
    </div>
  );
}

export default function WhisperModePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>}>
      <WhisperModeContent />
    </Suspense>
  );
}
