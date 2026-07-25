import {
  ACHIEVEMENT_BONUS,
  ACHIEVEMENTS,
  COST_GROWTH,
  CRIT_MULTIPLIER,
  DAILY_BOOST_DURATION_MS,
  DAILY_STREAK_CAP,
  DAILY_STREAK_STEP,
  GENERATORS,
  GENERATORS_BY_ID,
  PRESTIGE_BONUS_PER_POINT,
  PRESTIGE_ORE_PER_POINT,
  UPGRADES_BY_ID,
} from './config';
import { dayKey, isNextDay } from './daily';
import type { GameState } from './types';

export function initialState(): GameState {
  return {
    ore: 0,
    oreThisRun: 0,
    clicks: 0,
    generators: {},
    upgrades: [],
    prestigePoints: 0,
    stats: { ore: 0, clicks: 0, criticals: 0, prestiges: 0 },
    achievements: [],
    activeBoosts: [],
    lastClaimDay: '',
    loginStreak: 0,
    lastSeen: Date.now(),
  };
}

export function ownedOf(state: GameState, generatorId: string): number {
  return state.generators[generatorId] ?? 0;
}

export function hasUpgrade(state: GameState, upgradeId: string): boolean {
  return state.upgrades.includes(upgradeId);
}

export function achievementMultiplier(state: GameState): number {
  return 1 + state.achievements.length * ACHIEVEMENT_BONUS;
}

export function activeBoostMultiplier(state: GameState): number {
  return state.activeBoosts.reduce((acc, boost) => acc * boost.multiplier, 1);
}

export function globalMultiplier(state: GameState): number {
  const fromPrestige = 1 + state.prestigePoints * PRESTIGE_BONUS_PER_POINT;
  const fromUpgrades = state.upgrades.reduce((acc, id) => {
    const effect = UPGRADES_BY_ID[id]?.effect;
    return effect?.kind === 'global' ? acc * effect.multiplier : acc;
  }, 1);
  return fromPrestige * fromUpgrades * achievementMultiplier(state) * activeBoostMultiplier(state);
}

export function activateBoost(state: GameState, boost: GameState['activeBoosts'][number]): GameState {
  return { ...state, activeBoosts: [...state.activeBoosts, boost] };
}

export function expireBoosts(state: GameState, now: number): GameState {
  const kept = state.activeBoosts.filter((boost) => boost.expiresAt > now);
  return kept.length === state.activeBoosts.length ? state : { ...state, activeBoosts: kept };
}

export function canClaimDaily(state: GameState, now = Date.now()): boolean {
  return state.lastClaimDay !== dayKey(now);
}

export function claimDaily(state: GameState, now = Date.now()): GameState {
  const key = dayKey(now);
  if (state.lastClaimDay === key) return state;
  const streak = isNextDay(state.lastClaimDay, key) ? state.loginStreak + 1 : 1;
  const multiplier = 1 + Math.min(streak, DAILY_STREAK_CAP) * DAILY_STREAK_STEP;
  return activateBoost({ ...state, lastClaimDay: key, loginStreak: streak }, {
    id: `daily-${key}`,
    label: 'Daily reward',
    multiplier,
    expiresAt: now + DAILY_BOOST_DURATION_MS,
  });
}

export function clickPower(state: GameState): number {
  const fromUpgrades = state.upgrades.reduce((acc, id) => {
    const effect = UPGRADES_BY_ID[id]?.effect;
    return effect?.kind === 'click' ? acc * effect.multiplier : acc;
  }, 1);
  return fromUpgrades * globalMultiplier(state);
}

function generatorMultiplier(state: GameState, generatorId: string): number {
  return state.upgrades.reduce((acc, id) => {
    const effect = UPGRADES_BY_ID[id]?.effect;
    return effect?.kind === 'generator' && effect.generatorId === generatorId
      ? acc * effect.multiplier
      : acc;
  }, 1);
}

export function generatorProduction(state: GameState, generatorId: string): number {
  const def = GENERATORS_BY_ID[generatorId];
  if (!def) return 0;
  return (
    ownedOf(state, generatorId) *
    def.baseProduction *
    generatorMultiplier(state, generatorId) *
    globalMultiplier(state)
  );
}

export function productionPerSecond(state: GameState): number {
  return GENERATORS.reduce((acc, def) => acc + generatorProduction(state, def.id), 0);
}

export function generatorCost(state: GameState, generatorId: string): number {
  const def = GENERATORS_BY_ID[generatorId];
  if (!def) return Infinity;
  return Math.ceil(def.baseCost * COST_GROWTH ** ownedOf(state, generatorId));
}

export function canAffordGenerator(state: GameState, generatorId: string): boolean {
  return state.ore >= generatorCost(state, generatorId);
}

export function bulkCost(state: GameState, generatorId: string, count: number): number {
  const def = GENERATORS_BY_ID[generatorId];
  if (!def || count <= 0) return def ? 0 : Infinity;
  const owned = ownedOf(state, generatorId);
  let total = 0;
  for (let i = 0; i < count; i++) {
    total += Math.ceil(def.baseCost * COST_GROWTH ** (owned + i));
  }
  return total;
}

export function maxAffordable(state: GameState, generatorId: string): number {
  const def = GENERATORS_BY_ID[generatorId];
  if (!def) return 0;
  const owned = ownedOf(state, generatorId);
  let count = 0;
  let spent = 0;
  for (;;) {
    const next = spent + Math.ceil(def.baseCost * COST_GROWTH ** (owned + count));
    if (next > state.ore) return count;
    spent = next;
    count += 1;
  }
}

export function productionAddedBy(state: GameState, generatorId: string): number {
  const def = GENERATORS_BY_ID[generatorId];
  if (!def) return 0;
  return def.baseProduction * generatorMultiplier(state, generatorId) * globalMultiplier(state);
}

export function bestBuyGeneratorId(state: GameState): string | null {
  let bestId: string | null = null;
  let bestRatio = -Infinity;
  for (const def of GENERATORS) {
    const ratio = productionAddedBy(state, def.id) / generatorCost(state, def.id);
    if (ratio > bestRatio) {
      bestRatio = ratio;
      bestId = def.id;
    }
  }
  return bestId;
}

export function canAffordUpgrade(state: GameState, upgradeId: string): boolean {
  const def = UPGRADES_BY_ID[upgradeId];
  return !!def && !hasUpgrade(state, upgradeId) && state.ore >= def.cost;
}

function gain(state: GameState, amount: number): GameState {
  return {
    ...state,
    ore: state.ore + amount,
    oreThisRun: state.oreThisRun + amount,
    stats: { ...state.stats, ore: state.stats.ore + amount },
  };
}

function registerClick(state: GameState, critical: boolean): GameState {
  return {
    ...state,
    clicks: state.clicks + 1,
    stats: {
      ...state.stats,
      clicks: state.stats.clicks + 1,
      criticals: state.stats.criticals + (critical ? 1 : 0),
    },
  };
}

export function mine(state: GameState): GameState {
  return registerClick(gain(state, clickPower(state)), false);
}

export function mineCritical(state: GameState): GameState {
  return registerClick(gain(state, clickPower(state) * CRIT_MULTIPLIER), true);
}

export function newlyUnlockedAchievements(state: GameState): string[] {
  return ACHIEVEMENTS.filter(
    (def) => !state.achievements.includes(def.id) && def.condition(state),
  ).map((def) => def.id);
}

export function grantAchievements(state: GameState, ids: string[]): GameState {
  const added = ids.filter((id) => !state.achievements.includes(id));
  if (added.length === 0) return state;
  return { ...state, achievements: [...state.achievements, ...added] };
}

export function buyGenerator(state: GameState, generatorId: string): GameState {
  if (!canAffordGenerator(state, generatorId)) return state;
  const cost = generatorCost(state, generatorId);
  return {
    ...state,
    ore: state.ore - cost,
    generators: {
      ...state.generators,
      [generatorId]: ownedOf(state, generatorId) + 1,
    },
  };
}

export function buyGeneratorBulk(
  state: GameState,
  generatorId: string,
  count: number,
): GameState {
  const affordable = maxAffordable(state, generatorId);
  const toBuy = Math.min(count, affordable);
  if (toBuy <= 0) return state;
  const cost = bulkCost(state, generatorId, toBuy);
  return {
    ...state,
    ore: state.ore - cost,
    generators: {
      ...state.generators,
      [generatorId]: ownedOf(state, generatorId) + toBuy,
    },
  };
}

export function buyUpgrade(state: GameState, upgradeId: string): GameState {
  if (!canAffordUpgrade(state, upgradeId)) return state;
  const def = UPGRADES_BY_ID[upgradeId];
  return {
    ...state,
    ore: state.ore - def.cost,
    upgrades: [...state.upgrades, upgradeId],
  };
}

export function tick(state: GameState, deltaSeconds: number, now = Date.now()): GameState {
  if (deltaSeconds <= 0) return state;
  const pruned = expireBoosts(state, now);
  const produced = productionPerSecond(pruned) * deltaSeconds;
  return produced > 0 ? gain(pruned, produced) : pruned;
}

export function prestigeGain(state: GameState): number {
  return Math.floor(Math.sqrt(state.oreThisRun / PRESTIGE_ORE_PER_POINT));
}

export function canPrestige(state: GameState): boolean {
  return prestigeGain(state) >= 1;
}

export function doPrestige(state: GameState): GameState {
  const gained = prestigeGain(state);
  if (gained < 1) return state;
  return {
    ...initialState(),
    prestigePoints: state.prestigePoints + gained,
    stats: { ...state.stats, prestiges: state.stats.prestiges + 1 },
    achievements: state.achievements,
    lastClaimDay: state.lastClaimDay,
    loginStreak: state.loginStreak,
  };
}
