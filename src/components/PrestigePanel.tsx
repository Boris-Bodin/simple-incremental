import { PRESTIGE_BONUS_PER_POINT, PRESTIGE_ORE_PER_POINT } from '../game/config';
import { canPrestige, prestigeGain } from '../game/engine';
import { formatNumber } from '../game/format';
import type { GameState } from '../game/types';

interface Props {
  state: GameState;
  onPrestige: () => void;
}

export function PrestigePanel({ state, onPrestige }: Props) {
  const gain = prestigeGain(state);
  const bonusPercent = Math.round(PRESTIGE_BONUS_PER_POINT * 100);
  const currentBonus = Math.round(state.prestigePoints * PRESTIGE_BONUS_PER_POINT * 100);

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
          You hold <strong>💎 {formatNumber(state.prestigePoints)}</strong> — a{' '}
          <strong>+{currentBonus}%</strong> production bonus.
        </p>
      )}
      <p className="prestige-desc">
        Each gem grants <strong>+{bonusPercent}%</strong> permanent production.
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
        {gain >= 1
          ? `Reset now to claim 💎 ${formatNumber(gain)}.`
          : `Next gem at ${formatNumber(nextThreshold)} ore this run.`}
      </p>
      <button
        type="button"
        className="prestige-button"
        disabled={!canPrestige(state)}
        onClick={onPrestige}
      >
        Reset for <strong>💎 {formatNumber(gain)}</strong>
      </button>
    </section>
  );
}
