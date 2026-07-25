import {
  COST_GROWTH,
  GENERATORS,
  GENERATORS_BY_ID,
  PRESTIGE_BONUS_PER_POINT,
  PRESTIGE_ORE_PER_POINT,
  UPGRADES_BY_ID,
} from './config';
import type { GameState } from './types';

export function initialState(): GameState {
  return {
    ore: 0,
    oreThisRun: 0,
    clicks: 0,
    generators: {},
    upgrades: [],
    prestigePoints: 0,
    lastSeen: Date.now(),
  };
}

export function ownedOf(state: GameState, generatorId: string): number {
  return state.generators[generatorId] ?? 0;
}

export function hasUpgrade(state: GameState, upgradeId: string): boolean {
  return state.upgrades.includes(upgradeId);
}

export function globalMultiplier(state: GameState): number {
  const fromPrestige = 1 + state.prestigePoints * PRESTIGE_BONUS_PER_POINT;
  const fromUpgrades = state.upgrades.reduce((acc, id) => {
    const effect = UPGRADES_BY_ID[id]?.effect;
    return effect?.kind === 'global' ? acc * effect.multiplier : acc;
  }, 1);
  return fromPrestige * fromUpgrades;
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

export function canAffordUpgrade(state: GameState, upgradeId: string): boolean {
  const def = UPGRADES_BY_ID[upgradeId];
  return !!def && !hasUpgrade(state, upgradeId) && state.ore >= def.cost;
}

function gain(state: GameState, amount: number): GameState {
  return { ...state, ore: state.ore + amount, oreThisRun: state.oreThisRun + amount };
}

export function mine(state: GameState): GameState {
  const next = gain(state, clickPower(state));
  return { ...next, clicks: next.clicks + 1 };
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

export function buyUpgrade(state: GameState, upgradeId: string): GameState {
  if (!canAffordUpgrade(state, upgradeId)) return state;
  const def = UPGRADES_BY_ID[upgradeId];
  return {
    ...state,
    ore: state.ore - def.cost,
    upgrades: [...state.upgrades, upgradeId],
  };
}

export function tick(state: GameState, deltaSeconds: number): GameState {
  if (deltaSeconds <= 0) return state;
  const produced = productionPerSecond(state) * deltaSeconds;
  return produced > 0 ? gain(state, produced) : state;
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
  return { ...initialState(), prestigePoints: state.prestigePoints + gained };
}
