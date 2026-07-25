import type {
  AchievementDef,
  AutomationDef,
  EraDef,
  GameState,
  GeneratorDef,
  Meteo,
  TalentDef,
  UpgradeDef,
} from './types';

export const ERAS: EraDef[] = [
  { name: 'Stone Age', fromIndex: 0 },
  { name: 'Industrial Age', fromIndex: 2 },
  { name: 'Atomic Age', fromIndex: 5 },
  { name: 'Cosmic Age', fromIndex: 8 },
  { name: 'Dimensional Age', fromIndex: 10 },
];

export const COST_GROWTH = 1.15;
export const PRESTIGE_BONUS_PER_POINT = 0.02;
export const PRESTIGE_ORE_PER_POINT = 1_000_000;
export const OFFLINE_CAP_SECONDS = 8 * 3600;
export const OFFLINE_MIN_SECONDS = 60;

export const CRIT_CHANCE = 0.1;
export const CRIT_MULTIPLIER = 7;
export const ACHIEVEMENT_BONUS = 0.01;

export const ASCENSION_GEMS_PER_CRYSTAL = 50;
export const CRYSTAL_BONUS = 0.1;

export const REFINE_BASE_COST = 1000;
export const REFINE_GROWTH = 1.8;
export const INGOT_BONUS = 0.05;

export const FRENZY_MULTIPLIER = 3;
export const FRENZY_DURATION_MS = 60_000;
export const FRENZY_COOLDOWN_MS = 600_000;

export const GOLDEN_MULTIPLIER = 7;
export const GOLDEN_DURATION_MS = 20_000;
export const GOLDEN_MIN_INTERVAL_MS = 60_000;
export const GOLDEN_MAX_INTERVAL_MS = 150_000;

export const CAVEIN_MALUS = 0.5;
export const CAVEIN_DURATION_MS = 20_000;
export const EVENT_MIN_INTERVAL_MS = 90_000;
export const EVENT_MAX_INTERVAL_MS = 210_000;
export const EVENT_PROMPT_MS = 10_000;

export const DAILY_STREAK_STEP = 0.1;
export const DAILY_STREAK_CAP = 7;
export const DAILY_BOOST_DURATION_MS = 5 * 60_000;

export const TALENTS: TalentDef[] = [
  {
    id: 'deep-veins',
    name: 'Deep veins',
    description: '+2% global production per level.',
    maxLevel: 50,
    baseCost: 1,
    costGrowth: 1.5,
    effect: { kind: 'global', perLevel: 0.02 },
  },
  {
    id: 'sharp-strikes',
    name: 'Sharp strikes',
    description: '+20% click power per level.',
    maxLevel: 20,
    baseCost: 2,
    costGrowth: 1.6,
    effect: { kind: 'click', perLevel: 0.2 },
  },
  {
    id: 'prospector',
    name: "Prospector's eye",
    description: '+1% critical chance per level.',
    maxLevel: 20,
    baseCost: 3,
    costGrowth: 1.7,
    effect: { kind: 'crit', perLevel: 0.01 },
  },
  {
    id: 'overdrive',
    name: 'Overdrive',
    description: '+5% global production per level.',
    maxLevel: 30,
    baseCost: 4,
    costGrowth: 1.7,
    effect: { kind: 'global', perLevel: 0.05 },
  },
];

export const TALENTS_BY_ID: Record<string, TalentDef> = Object.fromEntries(
  TALENTS.map((t) => [t.id, t]),
);

export const AUTOMATIONS: AutomationDef[] = [
  {
    id: 'auto-click',
    name: 'Auto-miner',
    description: 'Swings the pickaxe for you every tick.',
    cost: 5,
  },
  {
    id: 'auto-buy-gen',
    name: 'Generator autobuyer',
    description: 'Buys the most cost-effective generator you can afford.',
    cost: 15,
  },
  {
    id: 'auto-buy-upg',
    name: 'Upgrade autobuyer',
    description: 'Buys the next affordable upgrade automatically.',
    cost: 25,
  },
  {
    id: 'auto-prestige',
    name: 'Auto-prestige',
    description: 'Resets automatically as soon as a gem is available.',
    cost: 60,
  },
];

export const AUTOMATIONS_BY_ID: Record<string, AutomationDef> = Object.fromEntries(
  AUTOMATIONS.map((a) => [a.id, a]),
);

export const METEO_POOL: Meteo[] = [
  { id: 'clear', label: 'Clear skies', description: 'A calm day in the mine.', multiplier: 1 },
  { id: 'rich', label: 'Rich seams', description: 'The ore runs generous today.', multiplier: 1.2 },
  { id: 'rush', label: 'Ore rush', description: 'Everything is booming!', multiplier: 1.5 },
  { id: 'humid', label: 'Humid tunnels', description: 'The damp slows the drills.', multiplier: 0.9 },
];

const ownsAnyGenerator = (state: GameState): boolean =>
  Object.values(state.generators).some((count) => count > 0);

const ownsAtLeast = (state: GameState, amount: number): boolean =>
  Object.values(state.generators).some((count) => count >= amount);

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
  {
    id: 'dyson-extractor',
    name: 'Dyson extractor',
    description: 'Sips raw energy straight from a star.',
    baseCost: 3_500_000_000_000,
    baseProduction: 9_500_000,
  },
  {
    id: 'black-hole-drill',
    name: 'Black hole drill',
    description: 'Bends spacetime to crush matter into ore.',
    baseCost: 60_000_000_000_000,
    baseProduction: 58_000_000,
  },
  {
    id: 'quantum-replicator',
    name: 'Quantum replicator',
    description: 'Copies ore across parallel states.',
    baseCost: 1_000_000_000_000_000,
    baseProduction: 350_000_000,
  },
  {
    id: 'galaxy-harvester',
    name: 'Galaxy harvester',
    description: 'Reaps whole galaxies for their metal.',
    baseCost: 18_000_000_000_000_000,
    baseProduction: 2_100_000_000,
  },
  {
    id: 'reality-miner',
    name: 'Reality miner',
    description: 'Mines the fabric of reality itself.',
    baseCost: 300_000_000_000_000_000,
    baseProduction: 13_000_000_000,
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
  {
    id: 'stellar-siphon',
    name: 'Stellar siphon',
    description: 'Dyson extractors produce 2× more.',
    cost: 30_000_000_000_000,
    effect: { kind: 'generator', generatorId: 'dyson-extractor', multiplier: 2 },
  },
  {
    id: 'event-horizon',
    name: 'Event horizon',
    description: 'Black hole drills produce 2× more.',
    cost: 600_000_000_000_000,
    effect: { kind: 'generator', generatorId: 'black-hole-drill', multiplier: 2 },
  },
  {
    id: 'many-worlds',
    name: 'Many-worlds theory',
    description: 'Doubles global production.',
    cost: 5_000_000_000_000_000,
    effect: { kind: 'global', multiplier: 2 },
  },
  {
    id: 'cosmic-charter',
    name: 'Cosmic charter',
    description: 'Galaxy harvesters produce 2× more.',
    cost: 200_000_000_000_000_000,
    effect: { kind: 'generator', generatorId: 'galaxy-harvester', multiplier: 2 },
  },
  {
    id: 'omega-protocol',
    name: 'Omega protocol',
    description: 'Doubles global production.',
    cost: 5_000_000_000_000_000_000,
    effect: { kind: 'global', multiplier: 2 },
  },
];

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'first-strike',
    name: 'First strike',
    description: 'Mine ore for the first time.',
    condition: (s) => s.stats.clicks >= 1,
  },
  {
    id: 'clicker',
    name: 'Getting the hang of it',
    description: 'Mine manually 100 times.',
    condition: (s) => s.stats.clicks >= 100,
  },
  {
    id: 'first-hire',
    name: 'First hire',
    description: 'Own your first generator.',
    condition: ownsAnyGenerator,
  },
  {
    id: 'assembly-line',
    name: 'Assembly line',
    description: 'Own 10 of a single generator.',
    condition: (s) => ownsAtLeast(s, 10),
  },
  {
    id: 'ore-1k',
    name: 'Small fortune',
    description: 'Earn 1K ore in total.',
    condition: (s) => s.stats.ore >= 1_000,
  },
  {
    id: 'ore-1m',
    name: 'Ore baron',
    description: 'Earn 1M ore in total.',
    condition: (s) => s.stats.ore >= 1_000_000,
  },
  {
    id: 'ore-1b',
    name: 'Planetary wealth',
    description: 'Earn 1B ore in total.',
    condition: (s) => s.stats.ore >= 1_000_000_000,
  },
  {
    id: 'lucky-strike',
    name: 'Lucky strike',
    description: 'Land 50 critical hits.',
    condition: (s) => s.stats.criticals >= 50,
  },
  {
    id: 'first-prestige',
    name: 'Fresh start',
    description: 'Prestige for the first time.',
    condition: (s) => s.stats.prestiges >= 1,
  },
  {
    id: 'reborn',
    name: 'Reborn',
    description: 'Prestige 10 times.',
    condition: (s) => s.stats.prestiges >= 10,
  },
];

export const GENERATORS_BY_ID: Record<string, GeneratorDef> = Object.fromEntries(
  GENERATORS.map((g) => [g.id, g]),
);

export const UPGRADES_BY_ID: Record<string, UpgradeDef> = Object.fromEntries(
  UPGRADES.map((u) => [u.id, u]),
);
