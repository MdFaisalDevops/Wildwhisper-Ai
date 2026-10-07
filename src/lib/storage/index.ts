import { get, set } from 'idb-keyval';
import { Discovery, Mission } from '../types';

const DISCOVERIES_KEY = 'ww_discoveries';
const MISSIONS_KEY = 'ww_missions';
const STATS_KEY = 'ww_stats';
const SETTINGS_KEY = 'ww_settings';

export interface UserSettings {
  geminiApiKey: string;
  useCloudAi: boolean;
  voiceGuidance: boolean;
  hapticFeedback: boolean;
}

export interface UserStats {
  minutesOutside: number;
  streak: number;
  lastActive: string;
}

export const storage = {
  async getDiscoveries(): Promise<Discovery[]> {
    return (await get(DISCOVERIES_KEY)) || [];
  },
  
  async saveDiscovery(discovery: Discovery): Promise<void> {
    const current = await this.getDiscoveries();
    await set(DISCOVERIES_KEY, [discovery, ...current]);
  },
  
  async getMissions(): Promise<Mission[]> {
    return (await get(MISSIONS_KEY)) || [];
  },
  
  async saveMission(mission: Mission): Promise<void> {
    const current = await this.getMissions();
    const updated = current.filter(m => m.id !== mission.id);
    await set(MISSIONS_KEY, [mission, ...updated]);
  },
  
  async getActiveMission(): Promise<Mission | undefined> {
    const missions = await this.getMissions();
    return missions.find(m => m.status === 'active');
  },
  
  async getStats(): Promise<UserStats> {
    return (await get(STATS_KEY)) || { minutesOutside: 0, streak: 0, lastActive: new Date().toISOString() };
  },
  
  async updateStats(partial: Partial<UserStats>): Promise<void> {
    const current = await this.getStats();
    await set(STATS_KEY, { ...current, ...partial });
  },
  
  async getSettings(): Promise<UserSettings> {
    return (await get(SETTINGS_KEY)) || { 
      geminiApiKey: '', 
      useCloudAi: false,
      voiceGuidance: true,
      hapticFeedback: true
    };
  },
  
  async saveSettings(partial: Partial<UserSettings>): Promise<void> {
    const current = await this.getSettings();
    await set(SETTINGS_KEY, { ...current, ...partial });
  }
};
