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

export interface GameState {
  ore: number;
  oreThisRun: number;
  clicks: number;
  generators: Record<string, number>;
  upgrades: string[];
  prestigePoints: number;
  lastSeen: number;
}
