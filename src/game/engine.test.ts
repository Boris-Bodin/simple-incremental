import { describe, expect, it } from 'vitest';
import { ACHIEVEMENT_BONUS, CRIT_MULTIPLIER, PRESTIGE_ORE_PER_POINT } from './config';
import {
  achievementMultiplier,
  activateBoost,
  activeBoostMultiplier,
  ascensionGain,
  canAscend,
  crystalMultiplier,
  doAscension,
  bestAffordableGeneratorId,
  bestBuyGeneratorId,
  buyTalent,
  canBuyTalent,
  canUnlockAutomation,
  isAutomationOn,
  runAutomation,
  toggleAutomation,
  unlockAutomation,
  canClaimDaily,
  claimDaily,
  critChance,
  respecTalents,
  talentClickMultiplier,
  talentCost,
  talentLevel,
  talentPointsSpent,
  buyGenerator,
  buyGeneratorBulk,
  buyUpgrade,
  bulkCost,
  canAffordGenerator,
  canAffordUpgrade,
  canPrestige,
  clickPower,
  doPrestige,
  expireBoosts,
  generatorCost,
  generatorProduction,
  globalMultiplier,
  grantAchievements,
  hasUpgrade,
  initialState,
  maxAffordable,
  mine,
  mineCritical,
  newlyUnlockedAchievements,
  ownedOf,
  prestigeGain,
  productionAddedBy,
  productionPerSecond,
  tick,
} from './engine';
import type { Boost } from './types';
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

  it('grows with global talents', () => {
    expect(globalMultiplier(withState({ talents: { 'deep-veins': 5 } }))).toBeCloseTo(1.1);
  });

  it('stacks global upgrades multiplicatively with talents', () => {
    const s = withState({ talents: { 'deep-veins': 5 }, upgrades: ['shift-work'] });
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

  it('tracks lifetime ore and clicks', () => {
    const s = mine(mine(initialState()));
    expect(s.stats.ore).toBe(2);
    expect(s.stats.clicks).toBe(2);
  });
});

describe('mineCritical', () => {
  it('multiplies the click gain and counts the critical', () => {
    const s = mineCritical(initialState());
    expect(s.ore).toBe(CRIT_MULTIPLIER);
    expect(s.clicks).toBe(1);
    expect(s.stats.criticals).toBe(1);
    expect(s.stats.clicks).toBe(1);
  });
});

describe('achievements', () => {
  it('unlocks achievements whose condition is met', () => {
    const s = withState({ stats: { ore: 0, clicks: 1, criticals: 0, prestiges: 0, ascensions: 0 } });
    expect(newlyUnlockedAchievements(s)).toContain('first-strike');
  });

  it('does not re-report already unlocked achievements', () => {
    const s = withState({
      stats: { ore: 0, clicks: 1, criticals: 0, prestiges: 0, ascensions: 0 },
      achievements: ['first-strike'],
    });
    expect(newlyUnlockedAchievements(s)).not.toContain('first-strike');
  });

  it('grants new achievements without duplicates', () => {
    const s = grantAchievements(withState({ achievements: ['first-strike'] }), [
      'first-strike',
      'clicker',
    ]);
    expect(s.achievements).toEqual(['first-strike', 'clicker']);
  });

  it('scales the global multiplier by unlocked count', () => {
    const s = withState({ achievements: ['first-strike', 'clicker'] });
    expect(achievementMultiplier(s)).toBeCloseTo(1 + 2 * ACHIEVEMENT_BONUS);
    expect(globalMultiplier(s)).toBeCloseTo(1 + 2 * ACHIEVEMENT_BONUS);
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

describe('bulkCost', () => {
  it('equals the single cost for one unit', () => {
    const s = withState({ ore: 1000 });
    expect(bulkCost(s, 'apprentice', 1)).toBe(generatorCost(s, 'apprentice'));
  });

  it('sums successive unit costs like buying one at a time', () => {
    const s = withState({ ore: 1_000_000 });
    let simulated = s;
    let expected = 0;
    for (let i = 0; i < 3; i++) {
      expected += generatorCost(simulated, 'apprentice');
      simulated = buyGenerator({ ...simulated, ore: Infinity }, 'apprentice');
    }
    expect(bulkCost(s, 'apprentice', 3)).toBe(expected);
  });

  it('is 0 for a non-positive count', () => {
    expect(bulkCost(withState({}), 'apprentice', 0)).toBe(0);
  });
});

describe('maxAffordable', () => {
  it('returns how many units the ore can buy', () => {
    const s = withState({ ore: 15 });
    expect(maxAffordable(s, 'apprentice')).toBe(1);
  });

  it('accounts for the rising cost curve', () => {
    const three = bulkCost(withState({}), 'apprentice', 3);
    const four = bulkCost(withState({}), 'apprentice', 4);
    expect(maxAffordable(withState({ ore: three }), 'apprentice')).toBe(3);
    expect(maxAffordable(withState({ ore: four - 1 }), 'apprentice')).toBe(3);
  });

  it('is 0 when nothing is affordable', () => {
    expect(maxAffordable(withState({ ore: 14 }), 'apprentice')).toBe(0);
  });
});

describe('buyGeneratorBulk', () => {
  it('buys the requested count and deducts the bulk cost', () => {
    const s = withState({ ore: 1_000_000 });
    const cost = bulkCost(s, 'apprentice', 10);
    const after = buyGeneratorBulk(s, 'apprentice', 10);
    expect(ownedOf(after, 'apprentice')).toBe(10);
    expect(after.ore).toBe(1_000_000 - cost);
  });

  it('caps the purchase at what is affordable', () => {
    const s = withState({ ore: 15 });
    const after = buyGeneratorBulk(s, 'apprentice', 10);
    expect(ownedOf(after, 'apprentice')).toBe(1);
    expect(after.ore).toBe(0);
  });

  it('is a no-op when nothing is affordable', () => {
    const before = withState({ ore: 14 });
    expect(buyGeneratorBulk(before, 'apprentice', 10)).toBe(before);
  });

  it('does not mutate the input state', () => {
    const before = withState({ ore: 1000 });
    buyGeneratorBulk(before, 'apprentice', 10);
    expect(before.ore).toBe(1000);
    expect(ownedOf(before, 'apprentice')).toBe(0);
  });
});

describe('productionAddedBy', () => {
  it('is the marginal production of one more unit', () => {
    const s = withState({ generators: { 'electric-drill': 5 }, upgrades: ['sharp-drills'] });
    const before = generatorProduction(s, 'electric-drill');
    const after = generatorProduction(buyGenerator({ ...s, ore: Infinity }, 'electric-drill'), 'electric-drill');
    expect(productionAddedBy(s, 'electric-drill')).toBeCloseTo(after - before);
  });
});

describe('bestBuyGeneratorId', () => {
  it('picks the generator with the best production-per-ore ratio', () => {
    const s = withState({ ore: 1000 });
    const best = bestBuyGeneratorId(s);
    const ratio = (id: string) => productionAddedBy(s, id) / generatorCost(s, id);
    expect(best).not.toBeNull();
    expect(ratio(best as string)).toBeGreaterThanOrEqual(ratio('apprentice'));
    expect(ratio(best as string)).toBeGreaterThanOrEqual(ratio('planetary-cruncher'));
  });
});

const boost = (overrides: Partial<Boost> = {}): Boost => ({
  id: 'test',
  label: 'Test',
  multiplier: 2,
  expiresAt: 10_000,
  ...overrides,
});

describe('boosts', () => {
  it('activateBoost appends a boost', () => {
    const s = activateBoost(initialState(), boost());
    expect(s.activeBoosts).toHaveLength(1);
  });

  it('activeBoostMultiplier multiplies all active boosts', () => {
    const s = withState({ activeBoosts: [boost({ multiplier: 3 }), boost({ multiplier: 2 })] });
    expect(activeBoostMultiplier(s)).toBe(6);
  });

  it('folds boosts into the global multiplier', () => {
    const s = withState({ activeBoosts: [boost({ multiplier: 3 })] });
    expect(globalMultiplier(s)).toBeCloseTo(3);
  });

  it('expireBoosts drops boosts past their expiry', () => {
    const s = withState({
      activeBoosts: [boost({ id: 'old', expiresAt: 500 }), boost({ id: 'live', expiresAt: 5000 })],
    });
    const after = expireBoosts(s, 1000);
    expect(after.activeBoosts.map((b) => b.id)).toEqual(['live']);
  });

  it('expireBoosts keeps the same reference when nothing expires', () => {
    const s = withState({ activeBoosts: [boost({ expiresAt: 5000 })] });
    expect(expireBoosts(s, 1000)).toBe(s);
  });
});

describe('talents', () => {
  it('costs baseCost for the first level and grows per level', () => {
    const s = initialState();
    expect(talentCost(s, 'deep-veins')).toBe(1);
    expect(talentCost(withState({ talents: { 'deep-veins': 1 } }), 'deep-veins')).toBe(
      Math.ceil(1 * 1.5),
    );
  });

  it('buys a talent and deducts prestige points', () => {
    const s = buyTalent(withState({ prestigePoints: 5 }), 'sharp-strikes');
    expect(talentLevel(s, 'sharp-strikes')).toBe(1);
    expect(s.prestigePoints).toBe(3);
  });

  it('cannot buy without enough points', () => {
    const before = withState({ prestigePoints: 1 });
    expect(canBuyTalent(before, 'sharp-strikes')).toBe(false);
    expect(buyTalent(before, 'sharp-strikes')).toBe(before);
  });

  it('cannot buy beyond max level', () => {
    const maxed = withState({ prestigePoints: 1e9, talents: { prospector: 20 } });
    expect(canBuyTalent(maxed, 'prospector')).toBe(false);
  });

  it('applies click and crit talents', () => {
    expect(talentClickMultiplier(withState({ talents: { 'sharp-strikes': 2 } }))).toBeCloseTo(1.4);
    expect(critChance(withState({ talents: { prospector: 5 } }))).toBeCloseTo(0.15);
  });

  it('respec refunds all spent points and clears talents', () => {
    const invested = buyTalent(buyTalent(withState({ prestigePoints: 10 }), 'deep-veins'), 'deep-veins');
    const spent = talentPointsSpent(invested);
    const refunded = respecTalents(invested);
    expect(refunded.talents).toEqual({});
    expect(refunded.prestigePoints).toBe(invested.prestigePoints + spent);
  });
});

describe('ascension', () => {
  it('needs enough gems (held + spent) to earn a crystal', () => {
    expect(ascensionGain(withState({ prestigePoints: 49 }))).toBe(0);
    expect(ascensionGain(withState({ prestigePoints: 50 }))).toBe(1);
    expect(canAscend(withState({ prestigePoints: 50 }))).toBe(true);
  });

  it('counts gems already spent on talents', () => {
    const invested = buyTalent(withState({ prestigePoints: 50 }), 'sharp-strikes');
    expect(ascensionGain(invested)).toBe(1);
  });

  it('grants crystals and wipes the prestige era while keeping meta', () => {
    const before = withState({
      prestigePoints: 200,
      talents: { 'deep-veins': 3 },
      generators: { apprentice: 10 },
      achievements: ['first-strike'],
      crystals: 1,
    });
    const after = doAscension(before);
    expect(after.crystals).toBe(1 + ascensionGain(before));
    expect(after.prestigePoints).toBe(0);
    expect(after.talents).toEqual({});
    expect(after.generators).toEqual({});
    expect(after.achievements).toEqual(['first-strike']);
    expect(after.stats.ascensions).toBe(1);
  });

  it('is a no-op below the first crystal', () => {
    const before = withState({ prestigePoints: 10 });
    expect(doAscension(before)).toBe(before);
  });

  it('folds crystals into the global multiplier', () => {
    expect(crystalMultiplier(withState({ crystals: 3 }))).toBeCloseTo(1.3);
    expect(globalMultiplier(withState({ crystals: 3 }))).toBeCloseTo(1.3);
  });
});

describe('automation', () => {
  it('unlocks an automation for gems and turns it on', () => {
    const s = unlockAutomation(withState({ prestigePoints: 10 }), 'auto-click');
    expect(s.prestigePoints).toBe(5);
    expect(isAutomationOn(s, 'auto-click')).toBe(true);
  });

  it('cannot unlock without enough gems', () => {
    const before = withState({ prestigePoints: 1 });
    expect(canUnlockAutomation(before, 'auto-click')).toBe(false);
    expect(unlockAutomation(before, 'auto-click')).toBe(before);
  });

  it('toggles an unlocked automation off and on', () => {
    const unlocked = unlockAutomation(withState({ prestigePoints: 10 }), 'auto-click');
    const off = toggleAutomation(unlocked, 'auto-click');
    expect(isAutomationOn(off, 'auto-click')).toBe(false);
    expect(isAutomationOn(toggleAutomation(off, 'auto-click'), 'auto-click')).toBe(true);
  });

  it('bestAffordableGeneratorId ignores what you cannot afford', () => {
    expect(bestAffordableGeneratorId(withState({ ore: 0 }))).toBeNull();
    expect(bestAffordableGeneratorId(withState({ ore: 20 }))).toBe('apprentice');
  });

  it('auto-click mines each run when enabled', () => {
    const s = unlockAutomation(withState({ prestigePoints: 10 }), 'auto-click');
    const after = runAutomation(s);
    expect(after.clicks).toBe(1);
    expect(after.ore).toBeGreaterThan(s.ore);
  });

  it('auto-buy-gen buys an affordable generator when enabled', () => {
    const s = unlockAutomation(withState({ prestigePoints: 100, ore: 15 }), 'auto-buy-gen');
    const after = runAutomation(s);
    expect(ownedOf(after, 'apprentice')).toBe(1);
  });

  it('does nothing when automations are disabled', () => {
    const s = withState({ ore: 1e6 });
    expect(runAutomation(s)).toBe(s);
  });
});

describe('daily reward', () => {
  const day1 = Date.parse('2026-07-25T12:00:00Z');
  const day2 = Date.parse('2026-07-26T12:00:00Z');
  const day4 = Date.parse('2026-07-28T12:00:00Z');

  it('starts a streak and grants a boost on first claim', () => {
    const s = claimDaily(initialState(), day1);
    expect(s.loginStreak).toBe(1);
    expect(s.lastClaimDay).toBe('2026-07-25');
    expect(s.activeBoosts).toHaveLength(1);
  });

  it('is a no-op when already claimed today', () => {
    const once = claimDaily(initialState(), day1);
    expect(claimDaily(once, day1)).toBe(once);
    expect(canClaimDaily(once, day1)).toBe(false);
  });

  it('increments the streak on a consecutive day', () => {
    const s = claimDaily(claimDaily(initialState(), day1), day2);
    expect(s.loginStreak).toBe(2);
  });

  it('resets the streak after a missed day', () => {
    const s = claimDaily(claimDaily(initialState(), day1), day4);
    expect(s.loginStreak).toBe(1);
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

  it('applies an active boost to production', () => {
    const s = tick(withState({ generators: { 'auto-mine': 1 }, activeBoosts: [boost({ multiplier: 2, expiresAt: 100_000 })] }), 2, 1000);
    expect(s.ore).toBeCloseTo(5600);
  });

  it('prunes expired boosts before producing', () => {
    const s = tick(withState({ generators: { 'auto-mine': 1 }, activeBoosts: [boost({ multiplier: 2, expiresAt: 500 })] }), 2, 1000);
    expect(s.ore).toBeCloseTo(2800);
    expect(s.activeBoosts).toHaveLength(0);
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

  it('preserves lifetime stats and achievements and counts the prestige', () => {
    const before = withState({
      oreThisRun: 4 * PRESTIGE_ORE_PER_POINT,
      stats: { ore: 9999, clicks: 42, criticals: 3, prestiges: 1, ascensions: 0 },
      achievements: ['first-strike'],
    });
    const after = doPrestige(before);
    expect(after.stats.ore).toBe(9999);
    expect(after.stats.prestiges).toBe(2);
    expect(after.achievements).toEqual(['first-strike']);
  });
});
