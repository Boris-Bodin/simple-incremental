import { UPGRADES } from '../game/config';
import { canAffordUpgrade, hasUpgrade } from '../game/engine';
import { formatNumber, type Notation } from '../game/format';
import type { GameState } from '../game/types';

const REVEAL_RATIO = 0.4;

interface Props {
  state: GameState;
  notation: Notation;
  onBuy: (upgradeId: string) => void;
}

export function UpgradeList({ state, notation, onBuy }: Props) {
  const available = UPGRADES.filter(
    (def) => !hasUpgrade(state, def.id) && state.ore >= def.cost * REVEAL_RATIO,
  );

  if (available.length === 0) return null;

  return (
    <section className="panel">
      <h2>Upgrades</h2>
      <ul className="card-list">
        {available.map((def) => {
          const affordable = canAffordUpgrade(state, def.id);
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
                </div>
                <p className="card-desc">{def.description}</p>
                <div className="card-foot">
                  <span className="card-cost">{formatNumber(def.cost, notation)} ore</span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
