import { TALENTS } from '../game/config';
import { canBuyTalent, talentCost, talentLevel, talentPointsSpent } from '../game/engine';
import { formatNumber } from '../game/format';
import type { GameState } from '../game/types';
import { GemIcon } from './icons';

interface Props {
  state: GameState;
  onBuy: (talentId: string) => void;
  onRespec: () => void;
}

export function TalentTree({ state, onBuy, onRespec }: Props) {
  const spent = talentPointsSpent(state);

  return (
    <section className="panel">
      <div className="talent-head">
        <h2>Talents</h2>
        <button type="button" className="respec-button" disabled={spent === 0} onClick={onRespec}>
          Respec
        </button>
      </div>
      <p className="prestige-desc">
        Spend gems on permanent upgrades. You have{' '}
        <strong className="gem-inline">
          <GemIcon className="gem-inline-icon" />
          {formatNumber(state.prestigePoints)}
        </strong>{' '}
        to invest.
      </p>
      <ul className="card-list">
        {TALENTS.map((def) => {
          const level = talentLevel(state, def.id);
          const maxed = level >= def.maxLevel;
          const cost = talentCost(state, def.id);
          const affordable = canBuyTalent(state, def.id);
          return (
            <li key={def.id}>
              <button
                type="button"
                className="card"
                disabled={!affordable}
                onClick={() => onBuy(def.id)}
              >
                <div className="card-head">
                  <span className="card-name">{def.name}</span>
                  <span className="card-owned">
                    {level}/{def.maxLevel}
                  </span>
                </div>
                <p className="card-desc">{def.description}</p>
                <div className="card-foot">
                  <span className="card-cost">
                    {maxed ? (
                      'Maxed'
                    ) : (
                      <span className="gem-inline">
                        <GemIcon className="gem-inline-icon" />
                        {formatNumber(cost)}
                      </span>
                    )}
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
