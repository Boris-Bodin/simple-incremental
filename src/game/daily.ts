import { METEO_POOL } from './config';
import type { Meteo } from './types';

const DAY_MS = 86_400_000;

export function dayKey(now: number = Date.now()): string {
  return new Date(now).toISOString().slice(0, 10);
}

export function isNextDay(previous: string, current: string): boolean {
  const prev = Date.parse(`${previous}T00:00:00Z`);
  const curr = Date.parse(`${current}T00:00:00Z`);
  return Number.isFinite(prev) && Number.isFinite(curr) && curr - prev === DAY_MS;
}

export function endOfDay(now: number = Date.now()): number {
  return Date.parse(`${dayKey(now)}T00:00:00Z`) + DAY_MS;
}

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function dailyMeteo(key: string = dayKey()): Meteo {
  return METEO_POOL[hash(key) % METEO_POOL.length];
}
