# 🌿 WildWhisper AI

> **Listen. Look. Discover.**

🌿 **Live Application:** [wildwhisper-ai.vercel.app](https://wildwhisper-ai.vercel.app/)

WildWhisper is an offline-first AI nature companion that helps users identify birds and nature, then encourages them to physically explore the outdoors. Built for the **Touch Grass** hackathon theme.

The core philosophy of WildWhisper AI is: **AI should reduce screen time, not increase it.**

## 🌟 Features

- **Audio Bird Identification**: Use your microphone to listen to bird calls. The AI analyzes the audio and identifies the species, returning rich data, images, and sample sounds.
- **Nature Camera**: Point your camera at a plant, tree, or insect to identify it instantly.
- **Whisper Mode**: An immersive, screen-darkening mode that guides you through outdoor missions using Haptic feedback and Voice Guidance, encouraging you to put your phone in your pocket.
- **AI Mission Explorer**: Generates dynamic, contextual outdoor missions based on your time available, desired activity, and difficulty.
- **Mystery Sound Game**: A gamified experience that plays a random bird sound and challenges you to discover its origin before revealing the AI result.
- **Local-First & Offline**: Utilizes IndexedDB for complete offline storage of your Discovery Journal and badges.
- **Hybrid AI Architecture**: 
  - **Live Gemini API Integration**: Enter your Gemini API key in settings for real, live inference.
  - **Rich Demo Mode**: If no API key is provided, the app falls back to a rich offline Demo mode featuring diverse bird species, real imagery, and audio samples.

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4 & Glassmorphism design
- **Components:** shadcn/ui & Lucide Icons
- **Storage:** `idb-keyval` (IndexedDB)
- **AI Integration:** Google Gemini API (`gemini-1.5-flash`)
- **Web APIs:** Web Speech API, MediaRecorder, navigator.vibrate

## 🛠️ Getting Started

First, install the dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🔐 Setup Real AI

To use the live Gemini AI for real-time identification:
1. Go to the **Profile/Settings** tab in the app.
2. Paste your free Google Gemini API Key.
3. The app will immediately switch to **Gemini Live** mode. (Keys are stored locally in your browser via IndexedDB and never sent to our servers).

## 🏆 Hackathon Submission

This project was built for the [Hacktoberfest Open-Source AI Challenge Week 1: Touch Grass](https://dev.to/challenges/hacktoberfest-week1-2026-10-05). 
Targeting the **Google AI** prize category for deep multi-modal integration of the Gemini 1.5 Flash model!

---
*Built with ❤️ for the Touch Grass Hackathon.*
