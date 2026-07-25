import { CRYSTAL_BONUS } from '../game/config';
import { ascensionGain, canAscend } from '../game/engine';
import { formatNumber } from '../game/format';
import type { GameState } from '../game/types';

interface Props {
  state: GameState;
  onAscend: () => void;
}

export function AscensionPanel({ state, onAscend }: Props) {
  const gain = ascensionGain(state);
  const bonus = Math.round(state.crystals * CRYSTAL_BONUS * 100);

  const handleAscend = () => {
    if (
      window.confirm(
        'Ascend? This wipes your gems, talents, automations, generators and upgrades in exchange for crystals.',
      )
    ) {
      onAscend();
    }
  };

  return (
    <section className="panel ascension-panel">
      <h2>Ascension</h2>
      {state.crystals > 0 && (
        <p className="prestige-desc">
          You hold <strong>💠 {formatNumber(state.crystals)}</strong> — a{' '}
          <strong>+{bonus}%</strong> permanent production bonus.
        </p>
      )}
      <p className="prestige-desc">
        Ascending trades your entire prestige era for crystals. Each crystal grants{' '}
        <strong>+{Math.round(CRYSTAL_BONUS * 100)}%</strong> production that survives every reset.
      </p>
      <p className="prestige-next">
        {gain >= 1
          ? `Ascend now to claim 💠 ${formatNumber(gain)}.`
          : 'Earn more gems this era to unlock a crystal.'}
      </p>
      <button
        type="button"
        className="ascension-button"
        disabled={!canAscend(state)}
        onClick={handleAscend}
      >
        Ascend for 💠 {formatNumber(gain)}
      </button>
    </section>
  );
}
