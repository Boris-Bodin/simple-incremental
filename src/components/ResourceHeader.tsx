import { formatNumber, formatRate } from '../game/format';
import { productionPerSecond } from '../game/engine';
import type { GameState } from '../game/types';
import { GemIcon } from './icons';

interface Props {
  state: GameState;
}

export function ResourceHeader({ state }: Props) {
  return (
    <header className="resource-header">
      <div className="resource-main">
        <span className="resource-amount">{formatNumber(state.ore)}</span>
        <span className="resource-label">ore</span>
      </div>
      <div className="resource-stats">
        <span>{formatRate(productionPerSecond(state))}</span>
        {state.prestigePoints > 0 && (
          <span className="prestige-badge">
            <GemIcon className="stat-icon" />
            {formatNumber(state.prestigePoints)}
          </span>
        )}
      </div>
    </header>
  );
}
