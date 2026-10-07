import { VisionIdentificationResult } from '../types';
import { storage } from '../storage';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface VisionIdentifierProvider {
  identify(imageBlob: Blob): Promise<VisionIdentificationResult>;
}

export class DemoVisionProvider implements VisionIdentifierProvider {
  async identify(imageBlob: Blob): Promise<VisionIdentificationResult> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      name: 'Neem Tree',
      category: 'tree',
      confidence: 94,
      description: 'A tree in the mahogany family Meliaceae.',
      fact: 'Neem leaves have been used traditionally for their antibacterial properties.',
      tip: 'Look closely at the leaf edges, they are typically serrated.'
    };
  }
}

export class GeminiVisionProvider implements VisionIdentifierProvider {
  async identify(imageBlob: Blob): Promise<VisionIdentificationResult> {
    const settings = await storage.getSettings();
    if (!settings.geminiApiKey) {
      throw new Error("No Gemini API Key found");
    }

    const genAI = new GoogleGenerativeAI(settings.geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Convert blob to base64
    const base64data = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.readAsDataURL(imageBlob);
    });

    const prompt = `
      Identify the plant, animal, bird, insect, or nature object in this image.
      Return the result strictly as a JSON object matching this TypeScript interface:
      {
        "name": string,
        "category": "bird" | "plant" | "insect" | "tree" | "flower" | "other",
        "confidence": number,
        "description": string,
        "fact": string,
        "tip": string
      }
      Do not include any markdown formatting, backticks, or extra text. Just the raw JSON.
    `;

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64data, mimeType: imageBlob.type || 'image/jpeg' } }
    ]);
    
    const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text) as VisionIdentificationResult;
  }
}
