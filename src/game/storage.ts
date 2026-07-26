import { OFFLINE_CAP_SECONDS, OFFLINE_MIN_SECONDS } from './config';
import { initialState, tick } from './engine';
import type { GameState } from './types';

const STORAGE_KEY = 'simple-incremental:save:v1';

export interface OfflineProgress {
  earned: number;
  seconds: number;
}

export interface LoadResult {
  state: GameState;
  offline: OfflineProgress | null;
}

export function loadState(): LoadResult {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { state: initialState(), offline: null };
    const parsed = JSON.parse(raw) as Partial<GameState>;
    return applyOfflineProgress(normalize(parsed));
  } catch {
    return { state: initialState(), offline: null };
  }
}

export function saveState(state: GameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, lastSeen: Date.now() }));
  } catch {
    // Storage unavailable (private mode, blocked in iframe): fail silently.
  }
}

export function clearSave(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function exportSave(state: GameState): string {
  return btoa(encodeURIComponent(JSON.stringify(state)));
}

export function importSave(raw: string): GameState | null {
  try {
    const json = decodeURIComponent(atob(raw.trim()));
    const parsed = JSON.parse(json) as unknown;
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return null;
    }
    return sanitize(parsed as Partial<GameState>);
  } catch {
    return null;
  }
}

function normalize(parsed: Partial<GameState>): GameState {
  const base = initialState();
  const generators =
    typeof parsed.generators === 'object' && parsed.generators !== null
      ? parsed.generators
      : {};
  const stats =
    typeof parsed.stats === 'object' && parsed.stats !== null
      ? { ...base.stats, ...parsed.stats }
      : base.stats;
  const talents =
    typeof parsed.talents === 'object' && parsed.talents !== null ? parsed.talents : {};
  return {
    ...base,
    ...parsed,
    generators,
    upgrades: Array.isArray(parsed.upgrades) ? parsed.upgrades : [],
    achievements: Array.isArray(parsed.achievements) ? parsed.achievements : [],
    stats,
    crystals: typeof parsed.crystals === 'number' ? parsed.crystals : 0,
    ingots: typeof parsed.ingots === 'number' ? parsed.ingots : 0,
    shards: typeof parsed.shards === 'number' ? parsed.shards : 0,
    alloys: typeof parsed.alloys === 'number' ? parsed.alloys : 0,
    talents,
    activeBoosts: [],
    unlockedAutomations: Array.isArray(parsed.unlockedAutomations)
      ? parsed.unlockedAutomations
      : [],
    automationOn:
      typeof parsed.automationOn === 'object' && parsed.automationOn !== null
        ? parsed.automationOn
        : {},
    lastClaimDay: typeof parsed.lastClaimDay === 'string' ? parsed.lastClaimDay : '',
    loginStreak: typeof parsed.loginStreak === 'number' ? parsed.loginStreak : 0,
    dayStart:
      typeof parsed.dayStart === 'object' && parsed.dayStart !== null
        ? { ...base.dayStart, ...parsed.dayStart }
        : base.dayStart,
    dailyChallengesDone: Array.isArray(parsed.dailyChallengesDone)
      ? parsed.dailyChallengesDone
      : [],
    activeChallenge: typeof parsed.activeChallenge === 'string' ? parsed.activeChallenge : null,
    completedChallenges: Array.isArray(parsed.completedChallenges)
      ? parsed.completedChallenges
      : [],
  };
}

function sanitize(parsed: Partial<GameState>): GameState {
  return { ...normalize(parsed), lastSeen: Date.now() };
}

function applyOfflineProgress(state: GameState): LoadResult {
  const elapsedSeconds = (Date.now() - state.lastSeen) / 1000;
  if (!Number.isFinite(elapsedSeconds) || elapsedSeconds <= 0) {
    return { state: { ...state, lastSeen: Date.now() }, offline: null };
  }
  const capped = Math.min(elapsedSeconds, OFFLINE_CAP_SECONDS);
  const advanced: GameState = { ...tick(state, capped), lastSeen: Date.now() };
  const earned = advanced.ore - state.ore;
  const offline =
    earned > 0 && capped >= OFFLINE_MIN_SECONDS ? { earned, seconds: capped } : null;
  return { state: advanced, offline };
}
