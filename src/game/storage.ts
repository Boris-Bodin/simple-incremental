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
    const restored: GameState = { ...initialState(), ...parsed };
    return applyOfflineProgress(restored);
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
