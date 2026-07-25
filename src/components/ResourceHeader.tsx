import { useEffect, useRef, useState } from 'react';
import { formatNumber, formatRate, type Notation } from '../game/format';
import { productionPerSecond } from '../game/engine';
import type { JuiceLevel } from '../game/settings';
import type { GameState } from '../game/types';
import { GemIcon } from './icons';

interface Props {
  state: GameState;
  notation: Notation;
  juice: JuiceLevel;
}

function milestoneTier(ore: number): number {
  return ore >= 1000 ? Math.floor(Math.log10(ore) / 3) : 0;
}

export function ResourceHeader({ state, notation, juice }: Props) {
  const [flash, setFlash] = useState(false);
  const tierRef = useRef(milestoneTier(state.ore));

  useEffect(() => {
    const tier = milestoneTier(state.ore);
    if (tier > tierRef.current && juice !== 'off') {
      setFlash(true);
      const id = window.setTimeout(() => setFlash(false), 500);
      tierRef.current = tier;
      return () => window.clearTimeout(id);
    }
    tierRef.current = tier;
  }, [state.ore, juice]);

  return (
    <header className={`resource-header${flash ? ' is-flashing' : ''}`}>
      <div className="resource-main">
        <span className="resource-amount">{formatNumber(state.ore, notation)}</span>
        <span className="resource-label">ore</span>
      </div>
      <div className="resource-stats">
        <span>{formatRate(productionPerSecond(state), notation)}</span>
        {state.prestigePoints > 0 && (
          <span className="prestige-badge">
            <GemIcon className="stat-icon" />
            {formatNumber(state.prestigePoints, notation)}
          </span>
        )}
      </div>
    </header>
  );
}
