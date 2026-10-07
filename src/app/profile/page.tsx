'use client';

import { useState, useEffect } from 'react';
import { Settings, Shield, HardDrive, Smartphone, Key, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { storage, UserSettings } from '@/lib/storage';

export default function ProfilePage() {
  const [settings, setSettings] = useState<UserSettings>({
    geminiApiKey: '',
    useCloudAi: false,
    voiceGuidance: true,
    hapticFeedback: true
  });
  
  const [keyInput, setKeyInput] = useState('');

  useEffect(() => {
    storage.getSettings().then(s => {
      setSettings(s);
      setKeyInput(s.geminiApiKey);
    });
  }, []);

  const saveSettings = async (updates: Partial<UserSettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    await storage.saveSettings(newSettings);
  };

  const saveApiKey = async () => {
    await saveSettings({ geminiApiKey: keyInput, useCloudAi: !!keyInput });
    alert('API Key saved!');
  };

  return (
    <div className="flex flex-col min-h-screen p-6 pb-24 relative bg-background">
      <header className="pt-8 pb-6">
        <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-2xl mb-4 border border-primary/20">
          <Settings className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your offline AI companion.</p>
      </header>

      <div className="space-y-6">
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Key className="w-5 h-5 text-blue-500" />
              Cloud AI (Optional)
            </CardTitle>
            <CardDescription>Use Gemini for real nature identification.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Gemini API Key</label>
              <div className="flex gap-2">
                <input 
                  type="password" 
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder="AIzaSy..." 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Button onClick={saveApiKey} className="bg-blue-600 hover:bg-blue-700 text-white">Save</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Your key is stored locally on your device in IndexedDB. It is never sent to our servers. Get a free key from Google AI Studio.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <HardDrive className="w-5 h-5 text-green-500" />
              AI Models Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between items-center pb-2 border-b border-border/50">
              <span className="font-medium">Bird Identification</span>
              {settings.useCloudAi ? (
                <span className="text-blue-500 font-semibold bg-blue-500/10 px-2 py-1 rounded">Gemini</span>
              ) : (
                <span className="text-amber-500 font-semibold bg-amber-500/10 px-2 py-1 rounded">Demo</span>
              )}
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-border/50">
              <span className="font-medium">Vision Identification</span>
              {settings.useCloudAi ? (
                <span className="text-blue-500 font-semibold bg-blue-500/10 px-2 py-1 rounded">Gemini</span>
              ) : (
                <span className="text-amber-500 font-semibold bg-amber-500/10 px-2 py-1 rounded">Demo</span>
              )}
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Mission AI</span>
              {settings.useCloudAi ? (
                <span className="text-blue-500 font-semibold bg-blue-500/10 px-2 py-1 rounded">Gemini</span>
              ) : (
                <span className="text-amber-500 font-semibold bg-amber-500/10 px-2 py-1 rounded">Demo</span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Smartphone className="w-5 h-5 text-purple-500" />
              Device
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-sm">Voice Guidance</p>
                <p className="text-xs text-muted-foreground">Spoken mission instructions</p>
              </div>
              <button 
                className={`w-12 h-6 rounded-full transition-colors ${settings.voiceGuidance ? 'bg-green-500' : 'bg-muted'}`}
                onClick={() => saveSettings({ voiceGuidance: !settings.voiceGuidance })}
              >
                <div className={`w-5 h-5 bg-white rounded-full mx-0.5 transition-transform ${settings.voiceGuidance ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-sm">Haptic Feedback</p>
                <p className="text-xs text-muted-foreground">Vibrate on mission update</p>
              </div>
              <button 
                className={`w-12 h-6 rounded-full transition-colors ${settings.hapticFeedback ? 'bg-green-500' : 'bg-muted'}`}
                onClick={() => saveSettings({ hapticFeedback: !settings.hapticFeedback })}
              >
                <div className={`w-5 h-5 bg-white rounded-full mx-0.5 transition-transform ${settings.hapticFeedback ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
            <Button variant="destructive" className="w-full mt-4" onClick={() => {
              if (confirm('Clear all discoveries and missions?')) {
                indexedDB.deleteDatabase('keyval-store');
                window.location.reload();
              }
            }}>Clear Local Data</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
