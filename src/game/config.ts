import type { GeneratorDef, UpgradeDef } from './types';

export const COST_GROWTH = 1.15;
export const PRESTIGE_BONUS_PER_POINT = 0.02;
export const PRESTIGE_ORE_PER_POINT = 1_000_000;
export const OFFLINE_CAP_SECONDS = 8 * 3600;
export const OFFLINE_MIN_SECONDS = 60;

export const GENERATORS: GeneratorDef[] = [
  {
    id: 'apprentice',
    name: 'Apprentice miner',
    description: 'Chips away at the rock with bare hands.',
    baseCost: 15,
    baseProduction: 0.1,
  },
  {
    id: 'hand-drill',
    name: 'Hand drill',
    description: 'A bit of mechanics to spare the arms.',
    baseCost: 120,
    baseProduction: 1,
  },
  {
    id: 'electric-drill',
    name: 'Electric drill',
    description: 'The current does most of the work.',
    baseCost: 1_300,
    baseProduction: 8,
  },
  {
    id: 'excavator',
    name: 'Excavator',
    description: 'Rips out whole blocks of ore.',
    baseCost: 14_000,
    baseProduction: 47,
  },
  {
    id: 'laser-drill',
    name: 'Laser drill',
    description: 'Vaporizes stone with precision.',
    baseCost: 200_000,
    baseProduction: 260,
  },
  {
    id: 'auto-mine',
    name: 'Automated mine',
    description: 'A fleet of robots that never sleeps.',
    baseCost: 3_300_000,
    baseProduction: 1_400,
  },
  {
    id: 'quantum-bore',
    name: 'Quantum bore',
    description: 'Tunnels through matter at the atomic scale.',
    baseCost: 50_000_000,
    baseProduction: 7_800,
  },
  {
    id: 'magma-extractor',
    name: 'Magma extractor',
    description: 'Siphons molten ore straight from the mantle.',
    baseCost: 700_000_000,
    baseProduction: 44_000,
  },
  {
    id: 'asteroid-rig',
    name: 'Asteroid rig',
    description: 'Harvests metal-rich rocks in orbit.',
    baseCost: 12_000_000_000,
    baseProduction: 260_000,
  },
  {
    id: 'planetary-cruncher',
    name: 'Planetary cruncher',
    description: 'Grinds entire dead worlds into ore.',
    baseCost: 200_000_000_000,
    baseProduction: 1_600_000,
  },
];

export const UPGRADES: UpgradeDef[] = [
  {
    id: 'iron-pickaxe',
    name: 'Iron pickaxe',
    description: 'Doubles manual mining power.',
    cost: 100,
    effect: { kind: 'click', multiplier: 2 },
  },
  {
    id: 'steel-pickaxe',
    name: 'Steel pickaxe',
    description: 'Doubles manual mining power again.',
    cost: 1_500,
    effect: { kind: 'click', multiplier: 2 },
  },
  {
    id: 'sharp-drills',
    name: 'Sharpened bits',
    description: 'Electric drills produce 2× more.',
    cost: 8_000,
    effect: { kind: 'generator', generatorId: 'electric-drill', multiplier: 2 },
  },
  {
    id: 'shift-work',
    name: 'Shift work',
    description: '+25% global production.',
    cost: 25_000,
    effect: { kind: 'global', multiplier: 1.25 },
  },
  {
    id: 'diamond-pickaxe',
    name: 'Diamond pickaxe',
    description: 'Triples manual mining power.',
    cost: 90_000,
    effect: { kind: 'click', multiplier: 3 },
  },
  {
    id: 'reinforced-excavators',
    name: 'Reinforced excavators',
    description: 'Excavators produce 2× more.',
    cost: 250_000,
    effect: { kind: 'generator', generatorId: 'excavator', multiplier: 2 },
  },
  {
    id: 'automation-ai',
    name: 'Management AI',
    description: '+50% global production.',
    cost: 2_500_000,
    effect: { kind: 'global', multiplier: 1.5 },
  },
  {
    id: 'focused-lasers',
    name: 'Focused lasers',
    description: 'Laser drills produce 2× more.',
    cost: 3_000_000,
    effect: { kind: 'generator', generatorId: 'laser-drill', multiplier: 2 },
  },
  {
    id: 'obsidian-pickaxe',
    name: 'Obsidian pickaxe',
    description: 'Triples manual mining power.',
    cost: 8_000_000,
    effect: { kind: 'click', multiplier: 3 },
  },
  {
    id: 'robot-swarm',
    name: 'Robot swarm',
    description: 'Automated mines produce 2× more.',
    cost: 30_000_000,
    effect: { kind: 'generator', generatorId: 'auto-mine', multiplier: 2 },
  },
  {
    id: 'logistics-network',
    name: 'Logistics network',
    description: '+50% global production.',
    cost: 80_000_000,
    effect: { kind: 'global', multiplier: 1.5 },
  },
  {
    id: 'reinforced-bores',
    name: 'Reinforced bores',
    description: 'Quantum bores produce 2× more.',
    cost: 500_000_000,
    effect: { kind: 'generator', generatorId: 'quantum-bore', multiplier: 2 },
  },
  {
    id: 'fusion-power',
    name: 'Fusion power',
    description: 'Doubles global production.',
    cost: 8_000_000_000,
    effect: { kind: 'global', multiplier: 2 },
  },
  {
    id: 'geothermal-mastery',
    name: 'Geothermal mastery',
    description: 'Magma extractors produce 2× more.',
    cost: 20_000_000_000,
    effect: { kind: 'generator', generatorId: 'magma-extractor', multiplier: 2 },
  },
  {
    id: 'drill-arrays',
    name: 'Orbital drill arrays',
    description: 'Asteroid rigs produce 2× more.',
    cost: 150_000_000_000,
    effect: { kind: 'generator', generatorId: 'asteroid-rig', multiplier: 2 },
  },
  {
    id: 'galactic-charter',
    name: 'Galactic charter',
    description: 'Doubles global production.',
    cost: 2_000_000_000_000,
    effect: { kind: 'global', multiplier: 2 },
  },
];

export const GENERATORS_BY_ID: Record<string, GeneratorDef> = Object.fromEntries(
  GENERATORS.map((g) => [g.id, g]),
);

export const UPGRADES_BY_ID: Record<string, UpgradeDef> = Object.fromEntries(
  UPGRADES.map((u) => [u.id, u]),
);
