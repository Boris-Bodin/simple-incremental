import { ACHIEVEMENTS, ACHIEVEMENT_BONUS, CRIT_MULTIPLIER } from '../game/config';
import { critChance } from '../game/engine';
import { formatNumber, type Notation } from '../game/format';
import type { GameState } from '../game/types';

interface Props {
  state: GameState;
  notation: Notation;
}

export function StatsPanel({ state, notation }: Props) {
  const unlocked = state.achievements.length;
  const rows: { label: string; value: string }[] = [
    { label: 'Total ore earned', value: formatNumber(state.stats.ore, notation) },
    { label: 'Manual clicks', value: formatNumber(state.stats.clicks, notation) },
    { label: 'Critical hits', value: formatNumber(state.stats.criticals, notation) },
    { label: 'Prestiges', value: formatNumber(state.stats.prestiges, notation) },
    { label: 'Login streak', value: `${state.loginStreak} day${state.loginStreak === 1 ? '' : 's'}` },
    { label: 'Critical chance', value: `${Math.round(critChance(state) * 100)}%` },
    { label: 'Critical power', value: `×${CRIT_MULTIPLIER}` },
    {
      label: 'Achievement bonus',
      value: `+${Math.round(unlocked * ACHIEVEMENT_BONUS * 100)}% global`,
    },
  ];

  return (
    <div className="stats">
      <section className="panel">
        <h2>Lifetime stats</h2>
        <dl className="stat-grid">
          {rows.map((row) => (
            <div key={row.label} className="stat-row">
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="panel">
        <h2>
          Achievements <span className="achv-count">{unlocked}/{ACHIEVEMENTS.length}</span>
        </h2>
        <ul className="achv-list">
          {ACHIEVEMENTS.map((def) => {
            const done = state.achievements.includes(def.id);
            return (
              <li key={def.id} className={`achv${done ? ' is-unlocked' : ''}`}>
                <span className="achv-badge" aria-hidden="true">
                  {done ? '🏆' : '🔒'}
                </span>
                <span className="achv-text">
                  <span className="achv-name">{def.name}</span>
                  <span className="achv-desc">{def.description}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
