'use client';

import { ArrowLeft, Award, Bird, Leaf, Headphones, Navigation, Sun, TreePine, Bug } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import Link from 'next/link';

export default function BadgesPage() {
  const badges = [
    { name: 'First Bird', description: 'Identify your first bird call.', icon: Bird, unlocked: true, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Plant Explorer', description: 'Identify 5 different plants.', icon: Leaf, unlocked: true, color: 'text-green-500', bg: 'bg-green-500/10' },
    { name: 'Sound Hunter', description: 'Complete a Mystery Sound challenge.', icon: Headphones, unlocked: false, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { name: 'Trail Walker', description: 'Spend 60 minutes outside.', icon: Navigation, unlocked: false, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { name: 'Early Explorer', description: 'Complete a mission before 9 AM.', icon: Sun, unlocked: false, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { name: 'Tree Whisperer', description: 'Identify a tree.', icon: TreePine, unlocked: true, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { name: 'Wildlife Spotter', description: 'Identify an insect.', icon: Bug, unlocked: false, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="flex flex-col min-h-screen p-6 pb-24 relative">
      <header className="flex items-center gap-4 py-4 mb-4">
        <Link href="/" className={buttonVariants({ variant: "ghost", size: "icon", className: "rounded-full" })}>
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold">Badges</h1>
      </header>

      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-4 bg-amber-500/10 rounded-full mb-4 border border-amber-500/20">
          <Award className="w-12 h-12 text-amber-500" />
        </div>
        <h2 className="text-2xl font-bold">Nature Explorer</h2>
        <p className="text-muted-foreground">3 / {badges.length} badges unlocked</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {badges.map(badge => {
          const Icon = badge.icon;
          return (
            <Card key={badge.name} className={`overflow-hidden transition-all ${badge.unlocked ? 'border-primary/30 bg-card/80' : 'opacity-60 bg-muted/30 grayscale'}`}>
              <CardContent className="p-4 flex flex-col items-center text-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${badge.unlocked ? badge.bg : 'bg-muted'}`}>
                  <Icon className={`w-6 h-6 ${badge.unlocked ? badge.color : 'text-muted-foreground'}`} />
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-1">{badge.name}</h3>
                  <p className="text-xs text-muted-foreground leading-tight">{badge.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
