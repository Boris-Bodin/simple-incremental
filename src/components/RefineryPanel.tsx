import { INGOT_BONUS } from '../game/config';
import { canRefine, ingotCost } from '../game/engine';
import { formatNumber, type Notation } from '../game/format';
import type { GameState } from '../game/types';

interface Props {
  state: GameState;
  notation: Notation;
  onRefine: () => void;
}

export function RefineryPanel({ state, notation, onRefine }: Props) {
  const cost = ingotCost(state);
  const bonus = Math.round(state.ingots * INGOT_BONUS * 100);

  return (
    <section className="panel refinery-panel">
      <div className="refinery-head">
        <h2>Refinery</h2>
        <span className="refinery-count">
          🪙 {formatNumber(state.ingots, notation)}
          {state.ingots > 0 && <span className="refinery-bonus"> +{bonus}%</span>}
        </span>
      </div>
      <p className="prestige-desc">
        Smelt ore into ingots. Each ingot grants <strong>+{Math.round(INGOT_BONUS * 100)}%</strong>{' '}
        production (reset on prestige).
      </p>
      <button type="button" className="refinery-button" disabled={!canRefine(state)} onClick={onRefine}>
        Smelt ingot for {formatNumber(cost, notation)} ore
      </button>
    </section>
  );
}
