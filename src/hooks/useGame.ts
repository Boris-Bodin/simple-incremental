import { useCallback, useEffect, useRef, useState } from 'react';
import {
  buyGenerator,
  buyUpgrade,
  doPrestige,
  initialState,
  mine,
  tick,
} from '../game/engine';
import { clearSave, loadState, saveState } from '../game/storage';
import type { GameState } from '../game/types';

const TICK_MS = 100;
const AUTOSAVE_MS = 5000;

export interface GameApi {
  state: GameState;
  mineOnce: () => void;
  buyGenerator: (generatorId: string) => void;
  buyUpgrade: (upgradeId: string) => void;
  prestige: () => void;
  reset: () => void;
}

export function useGame(): GameApi {
  const [state, setState] = useState<GameState>(loadState);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    let last = performance.now();
    const loop = window.setInterval(() => {
      const now = performance.now();
      const delta = (now - last) / 1000;
      last = now;
      setState((prev) => tick(prev, delta));
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

  const mineOnce = useCallback(() => setState(mine), []);
  const buyGeneratorAction = useCallback(
    (generatorId: string) => setState((prev) => buyGenerator(prev, generatorId)),
    [],
  );
  const buyUpgradeAction = useCallback(
    (upgradeId: string) => setState((prev) => buyUpgrade(prev, upgradeId)),
    [],
  );
  const prestige = useCallback(() => setState(doPrestige), []);
  const reset = useCallback(() => {
    clearSave();
    setState(initialState());
  }, []);

  return {
    state,
    mineOnce,
    buyGenerator: buyGeneratorAction,
    buyUpgrade: buyUpgradeAction,
    prestige,
    reset,
  };
}
