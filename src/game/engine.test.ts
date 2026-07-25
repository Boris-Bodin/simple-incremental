import { describe, expect, it } from 'vitest';
import { PRESTIGE_ORE_PER_POINT } from './config';
import {
  buyGenerator,
  buyUpgrade,
  canAffordGenerator,
  canAffordUpgrade,
  canPrestige,
  clickPower,
  doPrestige,
  generatorCost,
  generatorProduction,
  globalMultiplier,
  hasUpgrade,
  initialState,
  mine,
  ownedOf,
  prestigeGain,
  productionPerSecond,
  tick,
} from './engine';
import type { GameState } from './types';

const withState = (overrides: Partial<GameState>): GameState => ({
  ...initialState(),
  ...overrides,
});

describe('initialState', () => {
  it('starts empty', () => {
    const s = initialState();
    expect(s.ore).toBe(0);
    expect(s.oreThisRun).toBe(0);
    expect(s.clicks).toBe(0);
    expect(s.generators).toEqual({});
    expect(s.upgrades).toEqual([]);
    expect(s.prestigePoints).toBe(0);
  });
});

describe('ownedOf / hasUpgrade', () => {
  it('reads generator counts and upgrade ownership', () => {
    const s = withState({ generators: { apprentice: 3 }, upgrades: ['iron-pickaxe'] });
    expect(ownedOf(s, 'apprentice')).toBe(3);
    expect(ownedOf(s, 'unknown')).toBe(0);
    expect(hasUpgrade(s, 'iron-pickaxe')).toBe(true);
    expect(hasUpgrade(s, 'steel-pickaxe')).toBe(false);
  });
});

describe('globalMultiplier', () => {
  it('is 1 on a fresh state', () => {
    expect(globalMultiplier(initialState())).toBe(1);
  });

  it('grows +2% per prestige point', () => {
    expect(globalMultiplier(withState({ prestigePoints: 5 }))).toBeCloseTo(1.1);
  });

  it('stacks global upgrades multiplicatively with prestige', () => {
    const s = withState({ prestigePoints: 5, upgrades: ['shift-work'] });
    expect(globalMultiplier(s)).toBeCloseTo(1.1 * 1.25);
  });
});

describe('clickPower', () => {
  it('is 1 by default', () => {
    expect(clickPower(initialState())).toBe(1);
  });

  it('applies click upgrades and the global multiplier', () => {
    const s = withState({ upgrades: ['iron-pickaxe', 'shift-work'] });
    expect(clickPower(s)).toBeCloseTo(2 * 1.25);
  });
});

describe('generatorProduction', () => {
  it('multiplies owned count, base output, upgrade and global', () => {
    const s = withState({
      generators: { 'electric-drill': 5 },
      upgrades: ['sharp-drills'],
    });
    expect(generatorProduction(s, 'electric-drill')).toBeCloseTo(5 * 8 * 2);
  });

  it('is 0 for an unowned generator', () => {
    expect(generatorProduction(initialState(), 'excavator')).toBe(0);
  });
});

describe('productionPerSecond', () => {
  it('sums all generators', () => {
    const s = withState({ generators: { apprentice: 10, 'auto-mine': 1 } });
    expect(productionPerSecond(s)).toBeCloseTo(10 * 0.1 + 1 * 1400);
  });
});

describe('generatorCost', () => {
  it('is the base cost for the first unit', () => {
    expect(generatorCost(initialState(), 'apprentice')).toBe(15);
  });

  it('grows by 1.15x per owned unit (rounded up)', () => {
    const s = withState({ generators: { apprentice: 1 } });
    expect(generatorCost(s, 'apprentice')).toBe(Math.ceil(15 * 1.15));
  });
});

describe('canAfford', () => {
  it('checks generator affordability', () => {
    expect(canAffordGenerator(withState({ ore: 15 }), 'apprentice')).toBe(true);
    expect(canAffordGenerator(withState({ ore: 14 }), 'apprentice')).toBe(false);
  });

  it('checks upgrade affordability and ownership', () => {
    expect(canAffordUpgrade(withState({ ore: 100 }), 'iron-pickaxe')).toBe(true);
    expect(canAffordUpgrade(withState({ ore: 99 }), 'iron-pickaxe')).toBe(false);
    const owned = withState({ ore: 100, upgrades: ['iron-pickaxe'] });
    expect(canAffordUpgrade(owned, 'iron-pickaxe')).toBe(false);
  });
});

describe('mine', () => {
  it('adds click power and counts the click', () => {
    const s = mine(initialState());
    expect(s.ore).toBe(1);
    expect(s.oreThisRun).toBe(1);
    expect(s.clicks).toBe(1);
  });

  it('does not mutate the input state', () => {
    const before = initialState();
    mine(before);
    expect(before.ore).toBe(0);
    expect(before.clicks).toBe(0);
  });
});

describe('buyGenerator', () => {
  it('deducts the cost and increments the count', () => {
    const s = buyGenerator(withState({ ore: 20 }), 'apprentice');
    expect(s.ore).toBe(5);
    expect(ownedOf(s, 'apprentice')).toBe(1);
  });

  it('is a no-op when unaffordable', () => {
    const before = withState({ ore: 10 });
    const after = buyGenerator(before, 'apprentice');
    expect(after).toBe(before);
  });

  it('does not mutate the input state', () => {
    const before = withState({ ore: 20 });
    buyGenerator(before, 'apprentice');
    expect(before.ore).toBe(20);
    expect(ownedOf(before, 'apprentice')).toBe(0);
  });
});

describe('buyUpgrade', () => {
  it('deducts the cost and records the upgrade', () => {
    const s = buyUpgrade(withState({ ore: 150 }), 'iron-pickaxe');
    expect(s.ore).toBe(50);
    expect(hasUpgrade(s, 'iron-pickaxe')).toBe(true);
  });

  it('is a no-op when already owned', () => {
    const before = withState({ ore: 1000, upgrades: ['iron-pickaxe'] });
    expect(buyUpgrade(before, 'iron-pickaxe')).toBe(before);
  });

  it('is a no-op when unaffordable', () => {
    const before = withState({ ore: 1 });
    expect(buyUpgrade(before, 'iron-pickaxe')).toBe(before);
  });
});

describe('tick', () => {
  it('accumulates production over time', () => {
    const s = tick(withState({ generators: { 'auto-mine': 1 } }), 2);
    expect(s.ore).toBeCloseTo(2800);
    expect(s.oreThisRun).toBeCloseTo(2800);
  });

  it('ignores non-positive deltas', () => {
    const before = withState({ generators: { 'auto-mine': 1 } });
    expect(tick(before, 0)).toBe(before);
    expect(tick(before, -5)).toBe(before);
  });
});

describe('prestige', () => {
  it('gains floor(sqrt(oreThisRun / threshold)) points', () => {
    expect(prestigeGain(withState({ oreThisRun: 0 }))).toBe(0);
    expect(prestigeGain(withState({ oreThisRun: PRESTIGE_ORE_PER_POINT }))).toBe(1);
    expect(prestigeGain(withState({ oreThisRun: 5 * PRESTIGE_ORE_PER_POINT }))).toBe(2);
  });

  it('is only available above the first threshold', () => {
    expect(canPrestige(withState({ oreThisRun: PRESTIGE_ORE_PER_POINT - 1 }))).toBe(false);
    expect(canPrestige(withState({ oreThisRun: PRESTIGE_ORE_PER_POINT }))).toBe(true);
  });

  it('adds gained points and resets the run', () => {
    const before = withState({
      ore: 5000,
      oreThisRun: 4 * PRESTIGE_ORE_PER_POINT,
      prestigePoints: 3,
      generators: { apprentice: 10 },
      upgrades: ['iron-pickaxe'],
    });
    const after = doPrestige(before);
    expect(after.prestigePoints).toBe(5);
    expect(after.ore).toBe(0);
    expect(after.oreThisRun).toBe(0);
    expect(after.generators).toEqual({});
    expect(after.upgrades).toEqual([]);
  });

  it('is a no-op below the first threshold', () => {
    const before = withState({ oreThisRun: PRESTIGE_ORE_PER_POINT - 1 });
    expect(doPrestige(before)).toBe(before);
  });
});
