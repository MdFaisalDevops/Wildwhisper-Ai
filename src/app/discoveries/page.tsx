'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Leaf, Bird as BirdIcon, Bug, Flower, Search, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { storage } from '@/lib/storage';
import { Discovery } from '@/lib/types';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DiscoveriesPage() {
  const [discoveries, setDiscoveries] = useState<Discovery[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    storage.getDiscoveries().then(setDiscoveries);
  }, []);

  const getIcon = (category: string) => {
    switch (category) {
      case 'bird': return <BirdIcon className="w-5 h-5 text-blue-500" />;
      case 'plant': 
      case 'tree':
      case 'flower': return <Leaf className="w-5 h-5 text-green-500" />;
      case 'insect': return <Bug className="w-5 h-5 text-amber-500" />;
      default: return <Flower className="w-5 h-5 text-pink-500" />;
    }
  };

  const filtered = filter === 'all' 
    ? discoveries 
    : discoveries.filter(d => 
        filter === 'plants' ? ['plant', 'tree', 'flower'].includes(d.category) : d.category === filter
      );

  return (
    <div className="flex flex-col min-h-screen p-6 pb-24 relative">
      <header className="pt-8 pb-4">
        <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-2xl mb-4 border border-primary/20">
          <BookOpen className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">My Discoveries</h1>
        <p className="text-muted-foreground">{discoveries.length} observations in nature.</p>
      </header>

      <Tabs defaultValue="all" className="w-full mb-6" onValueChange={setFilter}>
        <TabsList className="grid w-full grid-cols-4 bg-muted/50 p-1 rounded-full h-12">
          <TabsTrigger value="all" className="rounded-full text-xs">All</TabsTrigger>
          <TabsTrigger value="bird" className="rounded-full text-xs">Birds</TabsTrigger>
          <TabsTrigger value="plants" className="rounded-full text-xs">Plants</TabsTrigger>
          <TabsTrigger value="insect" className="rounded-full text-xs">Insects</TabsTrigger>
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50 pb-20">
          <Search className="w-12 h-12 mb-4" />
          <p>No discoveries found.</p>
          <p className="text-sm">Head outside and start exploring!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map(discovery => (
            <Card key={discovery.id} className="border-border/50 bg-card/50 overflow-hidden hover:bg-accent/50 transition-colors">
              <CardContent className="p-4 flex gap-4 items-start">
                <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center border shrink-0">
                  {getIcon(discovery.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold truncate pr-2">{discovery.name}</h3>
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
                      {discovery.confidence}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {new Date(discovery.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  {discovery.notes && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{discovery.notes}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
