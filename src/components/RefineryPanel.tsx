import { ALLOY_BONUS, ALLOY_INGOT_COST, ALLOY_SHARD_COST, INGOT_BONUS } from '../game/config';
import { canForgeAlloy, canRefine, ingotCost } from '../game/engine';
import { formatNumber, type Notation } from '../game/format';
import type { GameState } from '../game/types';

interface Props {
  state: GameState;
  notation: Notation;
  onRefine: () => void;
  onForge: () => void;
}

export function RefineryPanel({ state, notation, onRefine, onForge }: Props) {
  const cost = ingotCost(state);
  const ingotPercent = Math.round(state.ingots * INGOT_BONUS * 100);
  const alloyPercent = Math.round(state.alloys * ALLOY_BONUS * 100);
  const showAlloys = state.alloys > 0 || state.shards > 0 || state.ingots >= ALLOY_INGOT_COST;

  return (
    <section className="panel refinery-panel">
      <div className="refinery-head">
        <h2>Refinery</h2>
        <span className="refinery-count">
          🪙 {formatNumber(state.ingots, notation)}
          {state.ingots > 0 && <span className="refinery-bonus"> +{ingotPercent}%</span>}
        </span>
      </div>
      <p className="prestige-desc">
        Smelt ore into ingots. Each ingot grants <strong>+{Math.round(INGOT_BONUS * 100)}%</strong>{' '}
        production (reset on prestige).
      </p>
      <button type="button" className="refinery-button" disabled={!canRefine(state)} onClick={onRefine}>
        Smelt ingot for {formatNumber(cost, notation)} ore
      </button>

      {showAlloys && (
        <>
          <div className="refinery-head refinery-alloy-head">
            <h2>Alloys</h2>
            <span className="refinery-count">
              🔩 {formatNumber(state.alloys, notation)}
              {state.alloys > 0 && <span className="refinery-bonus"> +{alloyPercent}%</span>}
            </span>
          </div>
          <p className="prestige-desc">
            Shards drop on critical hits ({formatNumber(state.shards, notation)} held). Forge them
            with ingots into alloys for a <strong>+{Math.round(ALLOY_BONUS * 100)}%</strong>{' '}
            permanent bonus.
          </p>
          <button
            type="button"
            className="refinery-button"
            disabled={!canForgeAlloy(state)}
            onClick={onForge}
          >
            Forge alloy for {ALLOY_INGOT_COST} 🪙 + {ALLOY_SHARD_COST} shards
          </button>
        </>
      )}
    </section>
  );
}
