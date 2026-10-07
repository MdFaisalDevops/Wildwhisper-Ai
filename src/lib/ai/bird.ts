import { BirdIdentificationResult } from '../types';
import { storage } from '../storage';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface BirdIdentifierProvider {
  identify(audioBlob: Blob): Promise<BirdIdentificationResult>;
}

export class DemoBirdProvider implements BirdIdentifierProvider {
  async identify(audioBlob: Blob): Promise<BirdIdentificationResult> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const demoBirds: BirdIdentificationResult[] = [
      {
        name: 'Indian Robin',
        confidence: 87,
        description: 'A small, lively bird commonly found around gardens, open woodland and urban areas.',
        habitat: 'Urban and semi-urban areas, scrublands.',
        behavior: 'Often seen hopping on the ground, flicking its tail up.',
        fact: 'The male has a distinctive white shoulder patch that is visible when it flies.',
        imageUrl: 'https://images.unsplash.com/photo-1552728089-571ebd6a45ad?auto=format&fit=crop&q=80&w=600',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_88c42a27aa.mp3'
      },
      {
        name: 'Red-vented Bulbul',
        confidence: 92,
        description: 'An active and noisy bird known for its distinctive red vent.',
        habitat: 'Dry scrub, open forest, plains and cultivated lands.',
        behavior: 'Highly vocal, often sits at the top of bushes or trees.',
        fact: 'It is included in the list of the world\'s 100 worst invasive alien species.',
        imageUrl: 'https://images.unsplash.com/photo-1620694563886-c3a808af2d24?auto=format&fit=crop&q=80&w=600',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3'
      },
      {
        name: 'Rose-ringed Parakeet',
        confidence: 95,
        description: 'A medium-sized parrot with bright green plumage.',
        habitat: 'Light timber, cultivated areas, and urban parks.',
        behavior: 'Forms large noisy roosts, especially in winter.',
        fact: 'Males develop a distinctive rose and black neck ring when they mature.',
        imageUrl: 'https://images.unsplash.com/photo-1579634937748-0d173ea61cb4?auto=format&fit=crop&q=80&w=600',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_82c2a0d9b4.mp3'
      },
      {
        name: 'Common Kingfisher',
        confidence: 89,
        description: 'A small, bright blue and orange bird that hunts near water.',
        habitat: 'Slow-flowing streams, rivers, and lakes.',
        behavior: 'Dives from a perch to catch small fish.',
        fact: 'It needs to eat about 60% of its body weight each day.',
        imageUrl: 'https://images.unsplash.com/photo-1550257850-e14b08dc67fb?auto=format&fit=crop&q=80&w=600',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/30/audio_55a29ed6d3.mp3'
      }
    ];

    // Pick a random bird
    const randomIndex = Math.floor(Math.random() * demoBirds.length);
    return demoBirds[randomIndex];
  }
}

export class GeminiBirdProvider implements BirdIdentifierProvider {
  async identify(audioBlob: Blob): Promise<BirdIdentificationResult> {
    const settings = await storage.getSettings();
    if (!settings.geminiApiKey) {
      throw new Error("No Gemini API Key found");
    }

    const genAI = new GoogleGenerativeAI(settings.geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const base64data = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.readAsDataURL(audioBlob);
    });

    const prompt = `
      Listen to this audio recording of a bird call. Identify the bird species.
      Return the result strictly as a JSON object matching this TypeScript interface:
      {
        "name": string,
        "confidence": number,
        "description": string,
        "habitat": string,
        "behavior": string,
        "fact": string
      }
      Do not include any markdown formatting, backticks, or extra text. Just the raw JSON.
    `;

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64data, mimeType: audioBlob.type || 'audio/webm' } }
    ]);
    
    const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text) as BirdIdentificationResult;
  }
}
