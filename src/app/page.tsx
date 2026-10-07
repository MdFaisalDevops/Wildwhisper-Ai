'use client';

import Link from "next/link";
import { Mic, Camera, Compass, Headphones, Award, Leaf } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { storage, UserStats } from "@/lib/storage";

export default function Home() {
  const [stats, setStats] = useState<UserStats>({ minutesOutside: 0, streak: 0, lastActive: '' });
  const [discoveriesCount, setDiscoveriesCount] = useState(0);

  useEffect(() => {
    storage.getStats().then(setStats);
    storage.getDiscoveries().then(d => setDiscoveriesCount(d.length));
  }, []);

  return (
    <div className="flex flex-col min-h-screen relative p-6">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-green-900/20 to-transparent -z-10 pointer-events-none" />
      
      <header className="pt-8 pb-6">
        <div className="inline-flex items-center justify-center p-2 bg-green-500/10 rounded-2xl mb-4 border border-green-500/20">
          <Leaf className="w-6 h-6 text-green-500" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">WildWhisper</h1>
        <p className="text-xl text-muted-foreground font-medium mb-1">Listen. Look. Discover.</p>
        <p className="text-sm text-muted-foreground/80">An offline AI nature companion that helps you explore the world beyond your screen.</p>
      </header>

      <section className="mb-8">
        <Card className="bg-card/50 backdrop-blur border-border/50 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
          <CardContent className="p-5 flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-semibold text-green-500 uppercase tracking-wider">AI Ready Offline</span>
            </div>
            
            <div className="flex justify-between items-end">
              <div>
                <p className="text-3xl font-bold">{stats.minutesOutside}</p>
                <p className="text-sm text-muted-foreground">minutes outside</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold flex items-center justify-end gap-1">
                  {discoveriesCount} <span className="text-base font-normal text-muted-foreground">found</span>
                </p>
                <p className="text-sm font-bold text-amber-500 flex items-center justify-end gap-1">
                  🔥 {stats.streak}-day streak
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="flex flex-col gap-4 mb-8 flex-1">
        <Link href="/identify/audio" className={buttonVariants({ size: "lg", className: "w-full h-18 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 text-white shadow-xl shadow-green-900/20 flex justify-start px-6 gap-5 transition-transform active:scale-95" })}>
          <div className="bg-white/20 p-2.5 rounded-full shadow-inner">
            <Mic className="w-6 h-6" />
          </div>
          <div className="flex flex-col items-start py-1">
            <span className="font-bold text-lg leading-tight">Identify Bird Sound</span>
            <span className="text-xs font-medium text-white/80">Record & discover instantly</span>
          </div>
        </Link>

        <Link href="/identify/camera" className={buttonVariants({ variant: "outline", size: "lg", className: "w-full h-18 rounded-2xl border-emerald-500/30 bg-card/60 hover:bg-emerald-500/10 flex justify-start px-6 gap-5 shadow-lg shadow-black/5 transition-transform active:scale-95" })}>
          <div className="bg-emerald-500/20 p-2.5 rounded-full text-emerald-500">
            <Camera className="w-6 h-6" />
          </div>
          <div className="flex flex-col items-start py-1">
            <span className="font-bold text-lg leading-tight">Identify Nature</span>
            <span className="text-xs font-medium text-muted-foreground">Scan plants, insects & more</span>
          </div>
        </Link>

        <Link href="/explore" className={buttonVariants({ variant: "outline", size: "lg", className: "w-full h-18 rounded-2xl border-blue-500/30 bg-card/60 hover:bg-blue-500/10 flex justify-start px-6 gap-5 shadow-lg shadow-black/5 transition-transform active:scale-95" })}>
          <div className="bg-blue-500/20 p-2.5 rounded-full text-blue-500">
            <Compass className="w-6 h-6" />
          </div>
          <div className="flex flex-col items-start py-1">
            <span className="font-bold text-lg leading-tight">Start Exploration</span>
            <span className="text-xs font-medium text-muted-foreground">AI-guided outdoor missions</span>
          </div>
        </Link>
      </section>

      <section className="grid grid-cols-2 gap-4 pb-4">
        <Link href="/mystery" className="flex flex-col items-center justify-center p-5 rounded-2xl bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-all shadow-sm active:scale-95 gap-3 text-center group">
          <Headphones className="w-7 h-7 text-purple-500 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-bold text-purple-600 dark:text-purple-400">Mystery Sound</span>
        </Link>
        <Link href="/badges" className="flex flex-col items-center justify-center p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-all shadow-sm active:scale-95 gap-3 text-center group">
          <Award className="w-7 h-7 text-amber-500 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-bold text-amber-600 dark:text-amber-400">Badges</span>
        </Link>
      </section>
    </div>
  );
}
