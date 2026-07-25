# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **Yarn** (pinned via Volta: `node 22.13.0`, `yarn 1.22.22`).

```bash
yarn dev            # local dev server (Vite)
yarn build          # tsc -b then vite build → dist/
yarn preview        # serve the production build
yarn typecheck      # tsc -b --noEmit
yarn test           # vitest run (single pass, used in CI)
yarn test:watch     # vitest in watch mode
```

Run a single test file or filter by name:

```bash
yarn test src/game/engine.test.ts       # one file
yarn test -t "round-trips a full state" # by test name (-t pattern)
```

## Architecture

Incremental/idle game (mining theme) — Vite + React 18 + TypeScript, deployed to GitHub Pages and embeddable in an `<iframe>`.

The core rule is a **strict separation between a pure domain (`src/game/`) and the React layer**. When changing behavior, put logic in `game/` and keep components presentation-only.

- **`src/game/`** — pure domain, no React import.
  - `types.ts` — `GameState`, generator/upgrade definitions, the `UpgradeEffect` discriminated union (`click` | `global` | `generator`).
  - `config.ts` — all `GENERATORS` and `UPGRADES` data plus tuning constants (`COST_GROWTH`, prestige and offline constants). `*_BY_ID` lookups are derived here. **Add or balance content by editing these arrays**, not the engine.
  - `engine.ts` — game rules as **pure functions** returning a new `GameState` (`mine`, `buyGenerator`, `buyUpgrade`, `tick`, `doPrestige`, and the derived getters `clickPower`, `productionPerSecond`, `generatorCost`, …). Purchase/prestige functions are no-ops when unaffordable/ineligible — they return the input state unchanged.
  - `format.ts` — number/rate/duration formatting for the UI.
  - `storage.ts` — `localStorage` persistence (key `simple-incremental:save:v1`), base64 export/import with `sanitize`, and offline-progress computation (`applyOfflineProgress`, capped by `OFFLINE_CAP_SECONDS`). All I/O is wrapped in try/catch and fails silently (private mode / blocked iframe).
- **`src/hooks/useGame.ts`** — the only bridge between the pure engine and React. Owns the game loop (`setInterval`, `TICK_MS = 100`), autosave (`AUTOSAVE_MS = 5000` plus flush on `pagehide`/`visibilitychange`), and exposes the `GameApi` actions. Load happens once via a `useRef` guard; `stateRef` keeps the latest state for save handlers.
- **`src/components/`** — presentational React only; they receive `state` and action callbacks as props. `App.tsx` wires everything and handles tab switching (`mining` / `prestige` / `settings`).

### Game model notes

- Multipliers compose multiplicatively: prestige points and `global` upgrades feed `globalMultiplier`, which multiplies both click power and every generator's output. `generator`-scoped upgrades multiply only their target.
- Generator cost scales as `baseCost * COST_GROWTH ** owned` (ceil).
- Prestige yields `floor(sqrt(oreThisRun / PRESTIGE_ORE_PER_POINT))` points and resets to `initialState()`, keeping accumulated `prestigePoints`.

## Deployment

`.github/workflows/deploy.yml` runs `yarn test` then `yarn build` and publishes `dist/` to GitHub Pages on every push to `main`. `vite.config.ts` uses `base: './'` (relative paths) so the build works both under the Pages sub-path and inside an `<iframe>`.
