import type { Notation } from './format';

export type JuiceLevel = 'off' | 'sober' | 'max';
export type ThemePreference = 'auto' | 'light' | 'dark';

export interface Settings {
  juice: JuiceLevel;
  sound: boolean;
  notation: Notation;
  theme: ThemePreference;
}

const SETTINGS_KEY = 'simple-incremental:settings:v1';

export function defaultSettings(): Settings {
  return { juice: 'max', sound: false, notation: 'short', theme: 'auto' };
}

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return defaultSettings();
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return { ...defaultSettings(), ...parsed };
  } catch {
    return defaultSettings();
  }
}

export function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Storage unavailable (private mode, blocked in iframe): fail silently.
  }
}
