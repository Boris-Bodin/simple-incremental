import { describe, expect, it } from 'vitest';
import { initialState } from './engine';
import { exportSave, importSave } from './storage';
import type { GameState } from './types';

const encode = (value: unknown): string =>
  btoa(encodeURIComponent(JSON.stringify(value)));

describe('export/import save', () => {
  it('round-trips a full state', () => {
    const state: GameState = {
      ...initialState(),
      ore: 1234,
      oreThisRun: 5678,
      clicks: 9,
      generators: { apprentice: 5, 'auto-mine': 2 },
      upgrades: ['iron-pickaxe', 'shift-work'],
      prestigePoints: 3,
    };

    const restored = importSave(exportSave(state));

    expect(restored).not.toBeNull();
    expect(restored?.ore).toBe(1234);
    expect(restored?.generators).toEqual({ apprentice: 5, 'auto-mine': 2 });
    expect(restored?.upgrades).toEqual(['iron-pickaxe', 'shift-work']);
    expect(restored?.prestigePoints).toBe(3);
  });

  it('returns null for invalid input', () => {
    expect(importSave('')).toBeNull();
    expect(importSave('not-base64-@@@')).toBeNull();
    expect(importSave(encode(42))).toBeNull();
    expect(importSave(encode([1, 2, 3]))).toBeNull();
  });

  it('fills defaults for a partial save', () => {
    const restored = importSave(encode({ ore: 50 }));
    expect(restored?.ore).toBe(50);
    expect(restored?.generators).toEqual({});
    expect(restored?.upgrades).toEqual([]);
    expect(restored?.prestigePoints).toBe(0);
  });

  it('coerces invalid collection types to defaults', () => {
    const restored = importSave(encode({ ore: 5, generators: 'nope', upgrades: 'nope' }));
    expect(restored?.generators).toEqual({});
    expect(restored?.upgrades).toEqual([]);
  });
});
