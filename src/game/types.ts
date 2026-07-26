export interface GeneratorDef {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  baseProduction: number;
}

export type UpgradeEffect =
  | { kind: 'click'; multiplier: number }
  | { kind: 'global'; multiplier: number }
  | { kind: 'generator'; generatorId: string; multiplier: number };

export interface UpgradeDef {
  id: string;
  name: string;
  description: string;
  cost: number;
  effect: UpgradeEffect;
}

export interface LifetimeStats {
  ore: number;
  clicks: number;
  criticals: number;
  prestiges: number;
  ascensions: number;
}

export interface Boost {
  id: string;
  label: string;
  multiplier: number;
  expiresAt: number;
}

export interface GameState {
  ore: number;
  oreThisRun: number;
  clicks: number;
  generators: Record<string, number>;
  upgrades: string[];
  prestigePoints: number;
  crystals: number;
  ingots: number;
  shards: number;
  alloys: number;
  science: number;
  research: string[];
  stats: LifetimeStats;
  achievements: string[];
  activeBoosts: Boost[];
  talents: Record<string, number>;
  unlockedAutomations: string[];
  automationOn: Record<string, boolean>;
  lastClaimDay: string;
  loginStreak: number;
  dayStart: DailyBaseline;
  dailyChallengesDone: string[];
  activeChallenge: string | null;
  completedChallenges: string[];
  lastSeen: number;
}

export type ChallengeModifier = 'no-click' | 'no-generators' | 'expensive';

export interface ChallengeDef {
  id: string;
  name: string;
  description: string;
  modifier: ChallengeModifier;
  goal: number;
  reward: number;
}

export type DailyMetric = 'ore' | 'clicks' | 'criticals';

export interface DailyBaseline {
  date: string;
  ore: number;
  clicks: number;
  criticals: number;
}

export interface DailyChallengeDef {
  id: string;
  metric: DailyMetric;
  target: number;
  reward: number;
}

export interface AutomationDef {
  id: string;
  name: string;
  description: string;
  cost: number;
}

export type ResearchEffect =
  | { kind: 'global'; multiplier: number }
  | { kind: 'click'; multiplier: number }
  | { kind: 'science'; multiplier: number };

export interface ResearchDef {
  id: string;
  name: string;
  description: string;
  cost: number;
  requires: string | null;
  effect: ResearchEffect;
}

export type TalentEffect =
  | { kind: 'global'; perLevel: number }
  | { kind: 'click'; perLevel: number }
  | { kind: 'crit'; perLevel: number };

export interface TalentDef {
  id: string;
  name: string;
  description: string;
  maxLevel: number;
  baseCost: number;
  costGrowth: number;
  effect: TalentEffect;
}

export interface Meteo {
  id: string;
  label: string;
  description: string;
  multiplier: number;
}

export interface EraDef {
  name: string;
  fromIndex: number;
}

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  condition: (state: GameState) => boolean;
}
