import { OFFLINE_CAP_SECONDS } from './config';
import { initialState, tick } from './engine';
import type { GameState } from './types';

const STORAGE_KEY = 'simple-incremental:save:v1';

export function loadState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState();
    const parsed = JSON.parse(raw) as Partial<GameState>;
    const restored: GameState = { ...initialState(), ...parsed };
    return applyOfflineProgress(restored);
  } catch {
    return initialState();
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

function applyOfflineProgress(state: GameState): GameState {
  const elapsedSeconds = (Date.now() - state.lastSeen) / 1000;
  if (!Number.isFinite(elapsedSeconds) || elapsedSeconds <= 0) return state;
  const capped = Math.min(elapsedSeconds, OFFLINE_CAP_SECONDS);
  return { ...tick(state, capped), lastSeen: Date.now() };
}
