*This is a submission for the [Hacktoberfest Open-Source AI Challenge Week 1: Touch Grass](https://dev.to/challenges/hacktoberfest-week1-2026-10-05)*

## What I Built

**WildWhisper AI** is an offline-first, gamified nature companion designed with one core philosophy: **AI should reduce screen time, not increase it.**

Most AI apps today demand your constant visual attention, trapping you in chat interfaces or dashboards. WildWhisper flips this paradigm by acting as your pocket-sized nature guide. It encourages users—especially tech-addicted individuals and young explorers—to get outside, listen, and observe. 

Here is how it works:
- **Audio & Vision Identification:** Users can record bird calls or take photos of plants/insects to instantly identify them via AI. 
- **Whisper Mode:** Once a mission is generated, the app instructs you to lock your screen and put the phone in your pocket. Using the Web Speech API and Haptic feedback, it periodically "whispers" instructions (e.g., "Walk quietly for 2 minutes and listen for rustling leaves") without requiring you to look at the screen.
- **Mystery Sounds & Gamification:** A built-in discovery journal and offline badge system reward actual physical exploration over endless scrolling.

## Demo

🌿 **Live Application:** [wildwhisper-ai.vercel.app](https://wildwhisper-ai.vercel.app/)

*(Note: WildWhisper features a "Bring Your Own Key" architecture. To use live Gemini AI inference instead of the built-in offline Demo mode, click the Profile icon and enter your free Gemini API Key!)*

## Code

{% github MdFaisalDevops/Wildwhisper-Ai %}

## How I Built It

WildWhisper was built for absolute resilience and speed using a modern web stack:
- **Framework:** Next.js 16 (App Router) combined with Tailwind CSS for glassmorphism aesthetics.
- **Local-First Storage:** I used `idb-keyval` (IndexedDB) to ensure the Discovery Journal and Badges work perfectly without an internet connection.
- **AI Integration (Google Gemini):** For real-time inference, I integrated the `@google/generative-ai` SDK using `gemini-1.5-flash`. The AI powers three core components:
  1. **Vision AI:** Analyzes camera frames to identify local flora and fauna.
  2. **Audio AI:** Analyzes recorded nature sounds (birds, frogs) to classify the species.
  3. **Mission Generator:** An LLM agent that takes the user's available time and desired difficulty to generate hyper-contextual outdoor "missions" (e.g., "Find a leaf that has fallen recently").
- **Web APIs:** Utilized `MediaRecorder` for audio capture, `react-webcam` for vision capture, and the `SpeechSynthesis` API for screen-free guidance.

## Why Does Open Innovation Matter?

Open innovation is the backbone of this project. Building a local-first, privacy-respecting app requires architecture where the user controls their data. By designing a system that can eventually drop in open-weight models (like Transformers.js running locally in the browser) or allow users to bring their own API keys (BYOK), we remove the dependency on centralized, closed, and paid APIs. 

In the context of the "Touch Grass" theme, open innovation means giving users the tools to explore nature without being tracked, monitored, or monetized by large corporations.

## My Agent Session

This project was built iteratively with the help of Google's Antigravity AI coding agent. The agent handled bootstrapping the complex UI components, implementing the IndexedDB persistence layer, and wiring up the hybrid AI providers seamlessly.

## Prize Categories

- **Google AI:** For deep integration of the Gemini 1.5 Flash model for multi-modal (Audio/Vision) identification and dynamic text generation (Missions).
