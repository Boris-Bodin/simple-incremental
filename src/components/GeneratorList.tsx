import { GENERATORS } from '../game/config';
import {
  canAffordGenerator,
  generatorCost,
  generatorProduction,
  ownedOf,
} from '../game/engine';
import { formatNumber, formatRate } from '../game/format';
import type { GameState } from '../game/types';

const REVEAL_RATIO = 0.4;

interface Props {
  state: GameState;
  onBuy: (generatorId: string) => void;
}

function isRevealed(state: GameState, index: number): boolean {
  const def = GENERATORS[index];
  if (index === 0 || ownedOf(state, def.id) > 0) return true;
  if (state.ore >= def.baseCost * REVEAL_RATIO) return true;
  return ownedOf(state, GENERATORS[index - 1].id) > 0;
}

export function GeneratorList({ state, onBuy }: Props) {
  return (
    <section className="panel">
      <h2>Generators</h2>
      <ul className="card-list">
        {GENERATORS.map((def, index) => {
          if (!isRevealed(state, index)) return null;
          const owned = ownedOf(state, def.id);
          const cost = generatorCost(state, def.id);
          const affordable = canAffordGenerator(state, def.id);
          return (
            <li key={def.id}>
              <button
                type="button"
                className="card"
                disabled={!affordable}
                onClick={() => onBuy(def.id)}
              >
                <div className="card-head">
                  <span className="card-name">{def.name}</span>
                  <span className="card-owned">×{owned}</span>
                </div>
                <p className="card-desc">{def.description}</p>
                <div className="card-foot">
                  <span className="card-cost">{formatNumber(cost)} ore</span>
                  <span className="card-rate">{formatRate(generatorProduction(state, def.id))}</span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
