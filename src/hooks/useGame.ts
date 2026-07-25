import { useCallback, useEffect, useRef, useState } from 'react';
import {
  CAVEIN_DURATION_MS,
  CAVEIN_MALUS,
  EVENT_MAX_INTERVAL_MS,
  EVENT_MIN_INTERVAL_MS,
  EVENT_PROMPT_MS,
  FRENZY_COOLDOWN_MS,
  FRENZY_DURATION_MS,
  FRENZY_MULTIPLIER,
  GOLDEN_DURATION_MS,
  GOLDEN_MAX_INTERVAL_MS,
  GOLDEN_MIN_INTERVAL_MS,
  GOLDEN_MULTIPLIER,
} from '../game/config';
import {
  activateBoost,
  buyGenerator,
  buyGeneratorBulk,
  buyTalent,
  buyUpgrade,
  canClaimDaily,
  claimDaily,
  critChance,
  doAscension,
  doPrestige,
  grantAchievements,
  initialState,
  mine,
  mineCritical,
  newlyUnlockedAchievements,
  respecTalents,
  runAutomation,
  tick,
  toggleAutomation,
  unlockAutomation,
} from '../game/engine';
import { dailyMeteo, endOfDay } from '../game/daily';
import {
  clearSave,
  exportSave as serializeSave,
  importSave as parseSave,
  loadState,
  saveState,
} from '../game/storage';
import type { LoadResult, OfflineProgress } from '../game/storage';
import type { Boost, GameState, Meteo } from '../game/types';

const METEO_BOOST_ID = 'meteo';

const TICK_MS = 100;
const AUTOSAVE_MS = 5000;
const GOLDEN_VISIBLE_MS = 6000;
const RICH_VEIN_MULTIPLIER = 5;
const RICH_VEIN_DURATION_MS = 30_000;

export interface AchievementToast {
  key: number;
  id: string;
}

export type GameEventKind = 'rich-vein' | 'cave-in';

export interface GameEvent {
  kind: GameEventKind;
  expiresAt: number;
}

export interface GoldenOre {
  x: number;
  y: number;
}

export interface GameApi {
  state: GameState;
  offline: OfflineProgress | null;
  dismissOffline: () => void;
  mineOnce: () => boolean;
  buyGenerator: (generatorId: string, count: number) => void;
  buyUpgrade: (upgradeId: string) => void;
  prestige: () => void;
  ascend: () => void;
  buyTalent: (talentId: string) => void;
  respecTalents: () => void;
  unlockAutomation: (id: string) => void;
  toggleAutomation: (id: string) => void;
  reset: () => void;
  exportSave: () => string;
  importSave: (raw: string) => boolean;
  toasts: AchievementToast[];
  dismissToast: (key: number) => void;
  goldenOre: GoldenOre | null;
  catchGoldenOre: () => void;
  event: GameEvent | null;
  resolveEvent: () => void;
  triggerFrenzy: () => void;
  frenzyReadyAt: number;
  meteo: Meteo;
  canClaimDaily: boolean;
  claimDailyReward: () => void;
}

const randDelay = (min: number, max: number): number => min + Math.random() * (max - min);

export function useGame(): GameApi {
  const initial = useRef<LoadResult | null>(null);
  if (initial.current === null) initial.current = loadState();

  const [state, setState] = useState<GameState>(initial.current.state);
  const [offline, setOffline] = useState<OfflineProgress | null>(initial.current.offline);
  const [toasts, setToasts] = useState<AchievementToast[]>([]);
  const [goldenOre, setGoldenOre] = useState<GoldenOre | null>(null);
  const [event, setEvent] = useState<GameEvent | null>(null);
  const [frenzyReadyAt, setFrenzyReadyAt] = useState(0);
  const toastKey = useRef(0);
  const stateRef = useRef(state);
  stateRef.current = state;

  const addBoost = useCallback((boost: Boost) => {
    setState((prev) => activateBoost(prev, boost));
  }, []);

  useEffect(() => {
    let last = performance.now();
    const loop = window.setInterval(() => {
      const now = performance.now();
      const delta = (now - last) / 1000;
      last = now;
      setState((prev) => runAutomation(tick(prev, delta)));
    }, TICK_MS);

    const save = window.setInterval(() => saveState(stateRef.current), AUTOSAVE_MS);
    const flush = () => saveState(stateRef.current);
    window.addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', flush);

    return () => {
      window.clearInterval(loop);
      window.clearInterval(save);
      window.removeEventListener('pagehide', flush);
      document.removeEventListener('visibilitychange', flush);
      saveState(stateRef.current);
    };
  }, []);

  useEffect(() => {
    const unlocked = newlyUnlockedAchievements(state);
    if (unlocked.length === 0) return;
    setState((prev) => grantAchievements(prev, unlocked));
    setToasts((prev) => [
      ...prev,
      ...unlocked.map((id) => ({ key: (toastKey.current += 1), id })),
    ]);
  }, [state]);

  const dismissToast = useCallback((key: number) => {
    setToasts((prev) => prev.filter((toast) => toast.key !== key));
  }, []);

  useEffect(() => {
    let spawn: number;
    let despawn: number;
    const schedule = () => {
      spawn = window.setTimeout(() => {
        setGoldenOre({ x: 8 + Math.random() * 78, y: 18 + Math.random() * 60 });
        despawn = window.setTimeout(() => setGoldenOre(null), GOLDEN_VISIBLE_MS);
        schedule();
      }, randDelay(GOLDEN_MIN_INTERVAL_MS, GOLDEN_MAX_INTERVAL_MS));
    };
    schedule();
    return () => {
      window.clearTimeout(spawn);
      window.clearTimeout(despawn);
    };
  }, []);

  useEffect(() => {
    let timer: number;
    const schedule = () => {
      timer = window.setTimeout(() => {
        const kind: GameEventKind = Math.random() < 0.5 ? 'rich-vein' : 'cave-in';
        setEvent({ kind, expiresAt: Date.now() + EVENT_PROMPT_MS });
        schedule();
      }, randDelay(EVENT_MIN_INTERVAL_MS, EVENT_MAX_INTERVAL_MS));
    };
    schedule();
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!event) return;
    const timer = window.setTimeout(() => {
      setEvent((current) => {
        if (current?.kind === 'cave-in') {
          addBoost({
            id: `cave-in-${Date.now()}`,
            label: 'Cave-in',
            multiplier: CAVEIN_MALUS,
            expiresAt: Date.now() + CAVEIN_DURATION_MS,
          });
        }
        return null;
      });
    }, Math.max(0, event.expiresAt - Date.now()));
    return () => window.clearTimeout(timer);
  }, [event, addBoost]);

  const triggerFrenzy = useCallback(() => {
    if (Date.now() < frenzyReadyAt) return;
    addBoost({
      id: `frenzy-${Date.now()}`,
      label: 'Frenzy',
      multiplier: FRENZY_MULTIPLIER,
      expiresAt: Date.now() + FRENZY_DURATION_MS,
    });
    setFrenzyReadyAt(Date.now() + FRENZY_COOLDOWN_MS);
  }, [addBoost, frenzyReadyAt]);

  const catchGoldenOre = useCallback(() => {
    addBoost({
      id: `golden-${Date.now()}`,
      label: 'Golden ore',
      multiplier: GOLDEN_MULTIPLIER,
      expiresAt: Date.now() + GOLDEN_DURATION_MS,
    });
    setGoldenOre(null);
  }, [addBoost]);

  const resolveEvent = useCallback(() => {
    setEvent((current) => {
      if (current?.kind === 'rich-vein') {
        addBoost({
          id: `rich-vein-${Date.now()}`,
          label: 'Rich vein',
          multiplier: RICH_VEIN_MULTIPLIER,
          expiresAt: Date.now() + RICH_VEIN_DURATION_MS,
        });
      }
      return null;
    });
  }, [addBoost]);

  useEffect(() => {
    const ensureMeteo = () => {
      const meteo = dailyMeteo();
      setState((prev) =>
        prev.activeBoosts.some((boost) => boost.id === METEO_BOOST_ID)
          ? prev
          : activateBoost(prev, {
              id: METEO_BOOST_ID,
              label: meteo.label,
              multiplier: meteo.multiplier,
              expiresAt: endOfDay(),
            }),
      );
    };
    ensureMeteo();
    const timer = window.setInterval(ensureMeteo, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const claimDailyReward = useCallback(() => {
    setState((prev) => claimDaily(prev, Date.now()));
  }, []);

  const mineOnce = useCallback((): boolean => {
    const critical = Math.random() < critChance(stateRef.current);
    setState(critical ? mineCritical : mine);
    return critical;
  }, []);
  const buyGeneratorAction = useCallback(
    (generatorId: string, count: number) =>
      setState((prev) =>
        count === 1 ? buyGenerator(prev, generatorId) : buyGeneratorBulk(prev, generatorId, count),
      ),
    [],
  );
  const buyUpgradeAction = useCallback(
    (upgradeId: string) => setState((prev) => buyUpgrade(prev, upgradeId)),
    [],
  );
  const prestige = useCallback(() => setState(doPrestige), []);
  const ascend = useCallback(() => setState(doAscension), []);
  const buyTalentAction = useCallback(
    (talentId: string) => setState((prev) => buyTalent(prev, talentId)),
    [],
  );
  const respecTalentsAction = useCallback(() => setState(respecTalents), []);
  const unlockAutomationAction = useCallback(
    (id: string) => setState((prev) => unlockAutomation(prev, id)),
    [],
  );
  const toggleAutomationAction = useCallback(
    (id: string) => setState((prev) => toggleAutomation(prev, id)),
    [],
  );
  const dismissOffline = useCallback(() => setOffline(null), []);
  const reset = useCallback(() => {
    clearSave();
    setState(initialState());
    setOffline(null);
    setGoldenOre(null);
    setEvent(null);
    setFrenzyReadyAt(0);
  }, []);

  const exportSave = useCallback(() => serializeSave(stateRef.current), []);
  const importSave = useCallback((raw: string): boolean => {
    const parsed = parseSave(raw);
    if (!parsed) return false;
    setState(parsed);
    setOffline(null);
    saveState(parsed);
    return true;
  }, []);

  return {
    state,
    offline,
    dismissOffline,
    mineOnce,
    buyGenerator: buyGeneratorAction,
    buyUpgrade: buyUpgradeAction,
    prestige,
    ascend,
    buyTalent: buyTalentAction,
    respecTalents: respecTalentsAction,
    unlockAutomation: unlockAutomationAction,
    toggleAutomation: toggleAutomationAction,
    reset,
    exportSave,
    importSave,
    toasts,
    dismissToast,
    goldenOre,
    catchGoldenOre,
    event,
    resolveEvent,
    triggerFrenzy,
    frenzyReadyAt,
    meteo: dailyMeteo(),
    canClaimDaily: canClaimDaily(state),
    claimDailyReward,
  };
}
