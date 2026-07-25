import type { GoldenOre as GoldenOreData } from '../hooks/useGame';

interface Props {
  ore: GoldenOreData;
  onCatch: () => void;
}

export function GoldenOre({ ore, onCatch }: Props) {
  return (
    <button
      type="button"
      className="golden-ore"
      style={{ left: `${ore.x}%`, top: `${ore.y}%` }}
      onClick={onCatch}
      aria-label="Catch the golden ore"
    >
      💎
    </button>
  );
}
