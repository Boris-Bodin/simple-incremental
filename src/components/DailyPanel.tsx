import type { Meteo } from '../game/types';

interface Props {
  meteo: Meteo;
  streak: number;
  canClaim: boolean;
  onClaim: () => void;
}

const meteoIcon = (multiplier: number): string => {
  if (multiplier >= 1.4) return '🔥';
  if (multiplier > 1) return '☀️';
  if (multiplier < 1) return '🌧️';
  return '⛅';
};

export function DailyPanel({ meteo, streak, canClaim, onClaim }: Props) {
  return (
    <div className="daily-panel">
      <span className="daily-meteo">
        <span className="daily-meteo-icon" aria-hidden="true">{meteoIcon(meteo.multiplier)}</span>
        <span className="daily-meteo-text">
          <span className="daily-meteo-label">{meteo.label} · ×{meteo.multiplier}</span>
          <span className="daily-meteo-desc">{meteo.description}</span>
        </span>
      </span>
      <button type="button" className="daily-claim" disabled={!canClaim} onClick={onClaim}>
        {canClaim ? `🎁 Daily reward` : `✓ Claimed`}
        <span className="daily-streak">streak {streak}</span>
      </button>
    </div>
  );
}
