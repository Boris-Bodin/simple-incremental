import { PRESTIGE_BONUS_PER_POINT } from '../game/config';
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

  if (gain < 1 && state.prestigePoints === 0) return null;

  return (
    <section className="panel prestige-panel">
      <h2>Prestige</h2>
      <p className="prestige-desc">
        Each gem grants <strong>+{bonusPercent}%</strong> permanent production.
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
