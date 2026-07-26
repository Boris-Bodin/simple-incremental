import { RESEARCH } from '../game/config';
import {
  canResearch,
  isResearched,
  researchPrerequisiteMet,
  scienceRate,
} from '../game/engine';
import { formatNumber, formatRate, type Notation } from '../game/format';
import type { GameState } from '../game/types';

interface Props {
  state: GameState;
  notation: Notation;
  onResearch: (id: string) => void;
}

export function ResearchPanel({ state, notation, onResearch }: Props) {
  return (
    <section className="panel">
      <div className="refinery-head">
        <h2>Research</h2>
        <span className="refinery-count">
          🔬 {formatNumber(state.science, notation)}
          <span className="refinery-bonus"> {formatRate(scienceRate(state), notation)}</span>
        </span>
      </div>
      <p className="prestige-desc">
        Science accrues from the variety of generators you run. Spend it on a tech tree of permanent
        bonuses — each node unlocks the next.
      </p>
      <ul className="card-list">
        {RESEARCH.map((def) => {
          const done = isResearched(state, def.id);
          const locked = !researchPrerequisiteMet(state, def.id);
          const affordable = canResearch(state, def.id);
          return (
            <li key={def.id}>
              <button
                type="button"
                className={`card${done ? ' is-done' : ''}`}
                disabled={done || !affordable}
                onClick={() => onResearch(def.id)}
              >
                <div className="card-head">
                  <span className="card-name">{def.name}</span>
                  {done && <span className="card-owned">Done</span>}
                </div>
                <p className="card-desc">{def.description}</p>
                <div className="card-foot">
                  <span className="card-cost">
                    {done ? '' : locked ? 'Locked' : `🔬 ${formatNumber(def.cost, notation)}`}
                  </span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
