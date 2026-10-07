'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Compass, Clock, Activity, ArrowRight, Mountain, Trees, Bird, Camera as CameraIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DemoMissionGenerator, GeminiMissionGenerator } from '@/lib/ai/missions';
import { storage } from '@/lib/storage';

export default function ExplorePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [duration, setDuration] = useState(20);
  const [activity, setActivity] = useState('Walk');
  const [difficulty, setDifficulty] = useState('Easy');
  const [generating, setGenerating] = useState(false);

  const generateMission = async () => {
    setGenerating(true);
    try {
      const settings = await storage.getSettings();
      const generator = settings.useCloudAi 
        ? new GeminiMissionGenerator() 
        : new DemoMissionGenerator();
        
      const mission = await generator.generate({ duration, activity, difficulty });
      await storage.saveMission(mission);
      router.push(`/whisper?mission=${mission.id}&duration=${duration}`);
    } catch (error) {
      console.error(error);
      alert("Failed to generate mission. If using Cloud AI, check your API key.");
      setGenerating(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-6 pb-24 relative">
      <header className="pt-8 pb-6">
        <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-2xl mb-4 border border-primary/20">
          <Compass className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Create Mission</h1>
        <p className="text-muted-foreground">Let AI design your outdoor experience.</p>
      </header>

      {step === 1 && (
        <div className="flex-1 flex flex-col gap-8 animate-in fade-in slide-in-from-right-4">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" /> How much time do you have?
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {[10, 20, 30, 60].map((mins) => (
                <Card 
                  key={mins}
                  className={`cursor-pointer transition-all duration-300 border-2 ${duration === mins ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20 scale-105 z-10' : 'border-border/50 hover:border-blue-500/50 hover:bg-accent/50'}`}
                  onClick={() => setDuration(mins)}
                >
                  <CardContent className={`p-5 text-center font-bold ${duration === mins ? 'text-blue-500' : ''}`}>
                    {mins} min
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <Button size="lg" className="w-full mt-auto mb-4 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20 font-bold" onClick={() => setStep(2)}>
            Next Step <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="flex-1 flex flex-col gap-8 animate-in fade-in slide-in-from-right-4">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5 text-muted-foreground" /> What do you want to do?
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Walk', icon: Activity },
                { name: 'Relax', icon: Trees },
                { name: 'Birdwatch', icon: Bird },
                { name: 'Photography', icon: CameraIcon }
              ].map((act) => {
                const Icon = act.icon;
                return (
                  <Card 
                    key={act.name}
                    className={`cursor-pointer transition-all duration-300 border-2 ${activity === act.name ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/20 scale-105 z-10' : 'border-border/50 hover:border-emerald-500/50 hover:bg-accent/50'}`}
                    onClick={() => setActivity(act.name)}
                  >
                    <CardContent className={`p-4 flex flex-col items-center justify-center gap-2 font-bold ${activity === act.name ? 'text-emerald-500' : ''}`}>
                      <Icon className={`w-8 h-8 mb-1 transition-colors ${activity === act.name ? 'text-emerald-500' : 'text-muted-foreground'}`} />
                      {act.name}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
          <div className="flex gap-3 mt-auto mb-4">
            <Button size="lg" variant="outline" className="h-14 rounded-full px-6 font-bold border-2" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button size="lg" className="flex-1 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/20 font-bold" onClick={() => setStep(3)}>
              Next Step <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex-1 flex flex-col gap-8 animate-in fade-in slide-in-from-right-4">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Mountain className="w-5 h-5 text-muted-foreground" /> Select difficulty
            </h2>
            <div className="flex flex-col gap-3">
              {['Easy', 'Moderate', 'Adventure'].map((diff) => (
                <Card 
                  key={diff}
                  className={`cursor-pointer transition-all duration-300 border-2 ${difficulty === diff ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/20 scale-105 z-10' : 'border-border/50 hover:border-amber-500/50 hover:bg-accent/50'}`}
                  onClick={() => setDifficulty(diff)}
                >
                  <CardContent className={`p-5 font-bold flex items-center justify-between ${difficulty === diff ? 'text-amber-500' : ''}`}>
                    {diff}
                    {difficulty === diff && <Mountain className="w-5 h-5" />}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div className="flex gap-3 mt-auto mb-4">
            <Button size="lg" variant="outline" className="h-14 rounded-full px-6 font-bold border-2" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button 
              size="lg" 
              className="flex-1 h-14 rounded-full bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 text-white shadow-xl shadow-green-900/20 font-bold text-lg" 
              onClick={generateMission}
              disabled={generating}
            >
              {generating ? 'Generating...' : 'Start Mission'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
