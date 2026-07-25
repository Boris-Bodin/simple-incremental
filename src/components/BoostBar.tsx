import { FRENZY_MULTIPLIER } from '../game/config';
import type { Boost } from '../game/types';

interface Props {
  boosts: Boost[];
  frenzyReadyAt: number;
  onFrenzy: () => void;
}

const remainingSeconds = (expiresAt: number): number =>
  Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));

export function BoostBar({ boosts, frenzyReadyAt, onFrenzy }: Props) {
  const cooldown = Math.max(0, Math.ceil((frenzyReadyAt - Date.now()) / 1000));
  const ready = cooldown === 0;

  return (
    <div className="boost-bar">
      <button
        type="button"
        className="frenzy-button"
        disabled={!ready}
        onClick={onFrenzy}
      >
        ⚡ {ready ? `Frenzy ×${FRENZY_MULTIPLIER}` : `Frenzy (${cooldown}s)`}
      </button>
      <div className="boost-list">
        {boosts.map((boost) => (
          <span
            key={boost.id}
            className={`boost-pill${boost.multiplier < 1 ? ' is-malus' : ''}`}
          >
            {boost.label} {boost.multiplier < 1 ? '' : '×'}
            {boost.multiplier} · {remainingSeconds(boost.expiresAt)}s
          </span>
        ))}
      </div>
    </div>
  );
}
