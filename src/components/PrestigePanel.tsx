import { PRESTIGE_ORE_PER_POINT } from '../game/config';
import { canPrestige, prestigeGain } from '../game/engine';
import { formatNumber } from '../game/format';
import type { GameState } from '../game/types';
import { GemIcon } from './icons';

interface Props {
  state: GameState;
  onPrestige: () => void;
}

export function PrestigePanel({ state, onPrestige }: Props) {
  const gain = prestigeGain(state);

  const prevThreshold = gain ** 2 * PRESTIGE_ORE_PER_POINT;
  const nextThreshold = (gain + 1) ** 2 * PRESTIGE_ORE_PER_POINT;
  const progress = Math.min(
    1,
    (state.oreThisRun - prevThreshold) / (nextThreshold - prevThreshold),
  );

  return (
    <section className="panel prestige-panel">
      <h2>Prestige</h2>
      {state.prestigePoints > 0 && (
        <p className="prestige-desc">
          You hold{' '}
          <strong className="gem-inline">
            <GemIcon className="gem-inline-icon" />
            {formatNumber(state.prestigePoints)}
          </strong>{' '}
          to spend on talents.
        </p>
      )}
      <p className="prestige-desc">
        Resetting trades this run for gems — spend them in the talent tree below for permanent power.
      </p>
      <div
        className="prestige-progress"
        role="progressbar"
        aria-valuenow={Math.round(progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="prestige-progress-bar" style={{ width: `${progress * 100}%` }} />
      </div>
      <p className="prestige-next">
        {gain >= 1 ? (
          <>
            Reset now to claim{' '}
            <span className="gem-inline">
              <GemIcon className="gem-inline-icon" />
              {formatNumber(gain)}
            </span>
            .
          </>
        ) : (
          `Next gem at ${formatNumber(nextThreshold)} ore this run.`
        )}
      </p>
      <button
        type="button"
        className="prestige-button"
        disabled={!canPrestige(state)}
        onClick={onPrestige}
      >
        Reset for{' '}
        <strong className="gem-inline">
          <GemIcon className="gem-inline-icon" />
          {formatNumber(gain)}
        </strong>
      </button>
    </section>
  );
}
