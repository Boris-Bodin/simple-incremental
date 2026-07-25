import { CHALLENGES, CHALLENGES_BY_ID } from '../game/config';
import { canCompleteChallenge } from '../game/engine';
import { formatNumber, type Notation } from '../game/format';
import type { GameState } from '../game/types';

interface Props {
  state: GameState;
  notation: Notation;
  onStart: (id: string) => void;
  onComplete: () => void;
  onAbandon: () => void;
}

export function ChallengePanel({ state, notation, onStart, onComplete, onAbandon }: Props) {
  const active = state.activeChallenge ? CHALLENGES_BY_ID[state.activeChallenge] : null;

  if (active) {
    const ratio = Math.min(1, state.oreThisRun / active.goal);
    const ready = canCompleteChallenge(state);
    return (
      <section className="panel challenge-active">
        <h2>Challenge: {active.name}</h2>
        <p className="prestige-desc">{active.description}</p>
        <div className="prestige-progress" role="progressbar" aria-valuenow={Math.round(ratio * 100)}>
          <div className="prestige-progress-bar" style={{ width: `${ratio * 100}%` }} />
        </div>
        <p className="prestige-next">
          {formatNumber(state.oreThisRun, notation)} / {formatNumber(active.goal, notation)} ore ·
          reward ×{active.reward} global
        </p>
        <div className="settings-actions">
          <button type="button" className="prestige-button" disabled={!ready} onClick={onComplete}>
            Complete
          </button>
          <button type="button" className="settings-button" onClick={onAbandon}>
            Abandon
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="panel">
      <h2>Prestige challenges</h2>
      <p className="prestige-desc">
        Start a constrained run for a permanent global multiplier. Starting resets your ore and
        boosts (you keep generators and upgrades).
      </p>
      <ul className="card-list">
        {CHALLENGES.map((def) => {
          const done = state.completedChallenges.includes(def.id);
          return (
            <li key={def.id}>
              <div className={`challenge-row${done ? ' is-done' : ''}`}>
                <div className="challenge-info-block">
                  <span className="card-name">
                    {def.name} {done && <span className="challenge-tick">✓ ×{def.reward}</span>}
                  </span>
                  <span className="card-desc">{def.description}</span>
                  <span className="card-desc">Goal: {formatNumber(def.goal, notation)} ore</span>
                </div>
                <button type="button" className="challenge-start" onClick={() => onStart(def.id)}>
                  {done ? 'Replay' : 'Start'}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
