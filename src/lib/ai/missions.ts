import { Mission } from '../types';
import { storage } from '../storage';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface MissionGeneratorOptions {
  duration: number;
  activity: string;
  difficulty: string;
}

export interface MissionGeneratorProvider {
  generate(options: MissionGeneratorOptions): Promise<Mission>;
}

export class DemoMissionGenerator implements MissionGeneratorProvider {
  async generate(options: MissionGeneratorOptions): Promise<Mission> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      id: Math.random().toString(36).substring(7),
      title: 'Silent Observer',
      durationMinutes: options.duration,
      steps: [
        'Walk quietly for 5 minutes.',
        'Find two different leaf shapes.',
        'Listen for one bird call.',
        'Find something moving in the grass.',
        'Take one photo of something you normally wouldn\'t notice.'
      ],
      completedSteps: 0,
      status: 'active',
      createdAt: new Date().toISOString()
    };
  }
}

export class GeminiMissionGenerator implements MissionGeneratorProvider {
  async generate(options: MissionGeneratorOptions): Promise<Mission> {
    const settings = await storage.getSettings();
    if (!settings.geminiApiKey) {
      throw new Error("No Gemini API Key found");
    }

    const genAI = new GoogleGenerativeAI(settings.geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Design an outdoor nature mission for a user. The goal is to get them to explore nature and put their phone in their pocket.
      Parameters:
      - Time available: ${options.duration} minutes
      - Desired Activity: ${options.activity}
      - Difficulty: ${options.difficulty}

      Return the result strictly as a JSON object matching this TypeScript interface:
      {
        "title": string,
        "durationMinutes": number,
        "steps": string[]
      }
      Make the steps actionable and immersive (e.g., "Walk quietly for 5 minutes.", "Find a leaf that has fallen recently.", "Listen carefully and identify the direction of the nearest bird call."). Keep the number of steps between 3 and 6 depending on duration.
      Do not include any markdown formatting, backticks, or extra text. Just the raw JSON.
    `;

    const result = await model.generateContent(prompt);
    
    const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(text);
    
    return {
      id: Math.random().toString(36).substring(7),
      title: data.title,
      durationMinutes: data.durationMinutes,
      steps: data.steps,
      completedSteps: 0,
      status: 'active',
      createdAt: new Date().toISOString()
    };
  }
}
