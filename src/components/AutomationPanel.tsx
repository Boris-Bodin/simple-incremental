import { AUTOMATIONS } from '../game/config';
import { canUnlockAutomation, isAutomationOn, isAutomationUnlocked } from '../game/engine';
import { formatNumber } from '../game/format';
import type { GameState } from '../game/types';
import { GemIcon } from './icons';

interface Props {
  state: GameState;
  onUnlock: (id: string) => void;
  onToggle: (id: string) => void;
}

export function AutomationPanel({ state, onUnlock, onToggle }: Props) {
  return (
    <section className="panel">
      <h2>Automation</h2>
      <p className="prestige-desc">Unlock with gems, then toggle to free yourself from the grind.</p>
      <ul className="card-list">
        {AUTOMATIONS.map((def) => {
          const unlocked = isAutomationUnlocked(state, def.id);
          const on = isAutomationOn(state, def.id);
          return (
            <li key={def.id}>
              <div className={`automation-row${unlocked ? '' : ' is-locked'}`}>
                <div className="automation-text">
                  <span className="card-name">{def.name}</span>
                  <span className="card-desc">{def.description}</span>
                </div>
                {unlocked ? (
                  <button
                    type="button"
                    className={`automation-toggle${on ? ' is-on' : ''}`}
                    role="switch"
                    aria-checked={on}
                    onClick={() => onToggle(def.id)}
                  >
                    {on ? 'On' : 'Off'}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="automation-unlock"
                    disabled={!canUnlockAutomation(state, def.id)}
                    onClick={() => onUnlock(def.id)}
                  >
                    <GemIcon className="gem-inline-icon" />
                    {formatNumber(def.cost)}
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
