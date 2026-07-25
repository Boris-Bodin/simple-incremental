import { clickPower } from '../game/engine';
import { formatNumber } from '../game/format';
import type { GameState } from '../game/types';
import { PickaxeIcon } from './icons';

interface Props {
  state: GameState;
  onMine: () => void;
}

export function ClickArea({ state, onMine }: Props) {
  return (
    <button type="button" className="click-area" onClick={onMine}>
      <PickaxeIcon className="click-icon" />
      <span className="click-label">Mine</span>
      <span className="click-power">+{formatNumber(clickPower(state))}</span>
    </button>
  );
}
