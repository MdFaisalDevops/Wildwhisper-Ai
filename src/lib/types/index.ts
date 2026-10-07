export type SpeciesCategory = 'bird' | 'plant' | 'insect' | 'tree' | 'flower' | 'other';

export interface Discovery {
  id: string;
  name: string;
  category: SpeciesCategory;
  confidence: number;
  date: string;
  image?: string;
  location?: { lat: number; lng: number };
  notes?: string;
  missionId?: string;
}

export interface Mission {
  id: string;
  title: string;
  durationMinutes: number;
  steps: string[];
  completedSteps: number;
  status: 'active' | 'completed' | 'abandoned';
  createdAt: string;
}

export interface BirdIdentificationResult {
  name: string;
  confidence: number;
  description: string;
  habitat: string;
  behavior: string;
  fact: string;
  imageUrl?: string;
  audioUrl?: string;
}

export interface VisionIdentificationResult {
  name: string;
  category: SpeciesCategory;
  confidence: number;
  description: string;
  fact: string;
  tip: string;
}
