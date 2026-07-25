import { DAILY_CHALLENGES_BY_ID } from '../game/config';
import { dailyChallengeIds } from '../game/daily';
import { dailyChallengeProgress, isDailyChallengeComplete } from '../game/engine';
import { formatNumber, type Notation } from '../game/format';
import type { DailyChallengeDef, GameState } from '../game/types';
import { GemIcon } from './icons';

interface Props {
  state: GameState;
  notation: Notation;
  onClaim: (id: string) => void;
}

const describe = (def: DailyChallengeDef, notation: Notation): string => {
  const amount = formatNumber(def.target, notation);
  switch (def.metric) {
    case 'ore':
      return `Earn ${amount} ore today`;
    case 'clicks':
      return `Mine ${amount} times today`;
    case 'criticals':
      return `Land ${amount} critical hits today`;
  }
};

export function DailyChallengesPanel({ state, notation, onClaim }: Props) {
  const ids = dailyChallengeIds();

  return (
    <section className="panel">
      <h2>Daily challenges</h2>
      <ul className="challenge-list">
        {ids.map((id) => {
          const def = DAILY_CHALLENGES_BY_ID[id];
          if (!def) return null;
          const done = state.dailyChallengesDone.includes(id);
          const complete = isDailyChallengeComplete(state, id);
          const progress = Math.min(dailyChallengeProgress(state, id), def.target);
          const ratio = progress / def.target;
          return (
            <li key={id} className={`challenge${done ? ' is-done' : ''}`}>
              <div className="challenge-info">
                <span className="challenge-desc">{describe(def, notation)}</span>
                <span className="challenge-reward">
                  <GemIcon className="gem-inline-icon" />
                  {def.reward}
                </span>
              </div>
              <div className="challenge-track">
                <div className="challenge-bar" style={{ width: `${ratio * 100}%` }} />
                <span className="challenge-count">
                  {formatNumber(progress, notation)}/{formatNumber(def.target, notation)}
                </span>
              </div>
              <button
                type="button"
                className="challenge-claim"
                disabled={done || !complete}
                onClick={() => onClaim(id)}
              >
                {done ? 'Claimed' : 'Claim'}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
