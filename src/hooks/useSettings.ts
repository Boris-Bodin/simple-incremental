import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  defaultSettings,
  loadSettings,
  saveSettings,
  type JuiceLevel,
  type Settings,
} from '../game/settings';

export interface SettingsApi {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
  effectiveJuice: JuiceLevel;
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
  );
}

export function useSettings(): SettingsApi {
  const initial = useRef<Settings | null>(null);
  if (initial.current === null) initial.current = loadSettings();

  const [settings, setSettings] = useState<Settings>(initial.current ?? defaultSettings());
  const [reducedMotion, setReducedMotion] = useState<boolean>(prefersReducedMotion);

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      saveSettings(next);
      return next;
    });
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'auto') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', settings.theme);
  }, [settings.theme]);

  useEffect(() => {
    const query = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!query) return;
    const onChange = () => setReducedMotion(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  const effectiveJuice: JuiceLevel = reducedMotion ? 'off' : settings.juice;

  return useMemo(() => ({ settings, update, effectiveJuice }), [settings, update, effectiveJuice]);
}
