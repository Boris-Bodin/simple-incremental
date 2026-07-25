import { GENERATORS } from '../game/config';
import {
  bestBuyGeneratorId,
  bulkCost,
  generatorProduction,
  maxAffordable,
  ownedOf,
  productionPerSecond,
} from '../game/engine';
import { formatDuration, formatNumber, formatRate, type Notation } from '../game/format';
import type { GameState } from '../game/types';
import type { BuyAmount } from './BuyAmountSelector';

const REVEAL_RATIO = 0.4;

interface Props {
  state: GameState;
  amount: BuyAmount;
  notation: Notation;
  onBuy: (generatorId: string, count: number) => void;
}

function isRevealed(state: GameState, index: number): boolean {
  const def = GENERATORS[index];
  if (index === 0 || ownedOf(state, def.id) > 0) return true;
  if (state.ore >= def.baseCost * REVEAL_RATIO) return true;
  return ownedOf(state, GENERATORS[index - 1].id) > 0;
}

export function GeneratorList({ state, amount, notation, onBuy }: Props) {
  const bestId = bestBuyGeneratorId(state);
  const requested = amount === 'max' ? Number.POSITIVE_INFINITY : amount;
  const pps = productionPerSecond(state);

  return (
    <section className="panel">
      <h2>Generators</h2>
      <ul className="card-list">
        {GENERATORS.map((def, index) => {
          if (!isRevealed(state, index)) return null;
          const owned = ownedOf(state, def.id);
          const affordableCount = maxAffordable(state, def.id);
          const buyCount = Math.min(requested, affordableCount);
          const affordable = buyCount >= 1;
          const shownCount = affordable ? buyCount : 1;
          const cost = bulkCost(state, def.id, shownCount);
          const fill = Math.min(1, state.ore / cost);
          const secondsLeft = pps > 0 ? (cost - state.ore) / pps : Infinity;

          return (
            <li key={def.id}>
              <button
                type="button"
                className="card"
                disabled={!affordable}
                onClick={() => onBuy(def.id, requested)}
              >
                <span className="card-fill" style={{ width: `${fill * 100}%` }} aria-hidden="true" />
                <div className="card-head">
                  <span className="card-name">
                    {def.id === bestId && <span className="best-buy" title="Best value">⭐</span>}
                    {def.name}
                  </span>
                  <span className="card-owned">×{owned}</span>
                </div>
                <p className="card-desc">{def.description}</p>
                <div className="card-foot">
                  <span className="card-cost">
                    {formatNumber(cost, notation)} ore
                    <span className="card-qty"> ×{shownCount}</span>
                  </span>
                  <span className="card-rate">
                    {affordable
                      ? formatRate(generatorProduction(state, def.id), notation)
                      : Number.isFinite(secondsLeft)
                        ? `in ${formatDuration(secondsLeft)}`
                        : '—'}
                  </span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
