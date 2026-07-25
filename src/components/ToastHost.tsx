import { useEffect } from 'react';
import { ACHIEVEMENTS } from '../game/config';
import type { AchievementToast } from '../hooks/useGame';

interface Props {
  toasts: AchievementToast[];
  onDismiss: (key: number) => void;
}

const nameOf = (id: string): string =>
  ACHIEVEMENTS.find((def) => def.id === id)?.name ?? id;

function Toast({ toast, onDismiss }: { toast: AchievementToast; onDismiss: (key: number) => void }) {
  useEffect(() => {
    const id = window.setTimeout(() => onDismiss(toast.key), 3500);
    return () => window.clearTimeout(id);
  }, [toast.key, onDismiss]);

  return (
    <button type="button" className="toast" onClick={() => onDismiss(toast.key)}>
      <span className="toast-badge" aria-hidden="true">🏆</span>
      <span className="toast-text">
        <span className="toast-title">Achievement unlocked</span>
        <span className="toast-name">{nameOf(toast.id)}</span>
      </span>
    </button>
  );
}

export function ToastHost({ toasts, onDismiss }: Props) {
  if (toasts.length === 0) return null;
  return (
    <div className="toast-host" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <Toast key={toast.key} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
