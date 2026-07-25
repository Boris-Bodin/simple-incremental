import { CAVEIN_MALUS } from '../game/config';
import type { GameEvent } from '../hooks/useGame';

interface Props {
  event: GameEvent;
  onResolve: () => void;
}

const CONTENT: Record<GameEvent['kind'], { icon: string; text: string; action: string; danger: boolean }> = {
  'rich-vein': {
    icon: '✨',
    text: 'A rich vein appeared! Claim it for a production surge.',
    action: 'Claim',
    danger: false,
  },
  'cave-in': {
    icon: '⚠️',
    text: `Cave-in! Shore up the tunnel or production drops to ×${CAVEIN_MALUS}.`,
    action: 'Shore up',
    danger: true,
  },
};

export function EventBanner({ event, onResolve }: Props) {
  const content = CONTENT[event.kind];
  return (
    <div className={`event-banner${content.danger ? ' is-danger' : ''}`} role="alert">
      <span className="event-icon" aria-hidden="true">{content.icon}</span>
      <span className="event-text">{content.text}</span>
      <button type="button" className="event-action" onClick={onResolve}>
        {content.action}
      </button>
    </div>
  );
}
