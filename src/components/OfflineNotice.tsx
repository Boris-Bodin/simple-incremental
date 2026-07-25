import { formatDuration, formatNumber } from '../game/format';
import type { OfflineProgress } from '../game/storage';
import { CloseIcon } from './icons';

interface Props {
  offline: OfflineProgress;
  onDismiss: () => void;
}

export function OfflineNotice({ offline, onDismiss }: Props) {
  return (
    <div className="offline-notice" role="status">
      <span className="offline-text">
        Welcome back! Your mines produced{' '}
        <strong>{formatNumber(offline.earned)} ore</strong> while you were away (
        {formatDuration(offline.seconds)}).
      </span>
      <button
        type="button"
        className="offline-dismiss"
        onClick={onDismiss}
        aria-label="Dismiss"
      >
        <CloseIcon />
      </button>
    </div>
  );
}
