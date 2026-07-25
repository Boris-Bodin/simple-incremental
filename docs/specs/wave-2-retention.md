# Spec — Vague 2 : Rétention

> Source : `docs/brainstorming/brainstorming-session-2026-07-25.md` (clusters C + D + E).
> Prérequis : Vague 1 (le juice sert de récompense visuelle aux événements/succès).
> Objectif : donner des **buts** et des **raisons de revenir**, tout en gardant tout côté client (localStorage, timers JS, déterminisme par date).

## Objectif

Introduire des boucles d'engagement court et moyen terme : événements dynamiques, succès/objectifs, et rendez-vous quotidiens. Impact d'équilibrage **maîtrisé** (bonus additifs, pas de refonte des courbes).

## Périmètre

### 1. Rétention court-terme (cluster C)
- **Clic critique** : chance % qu'un clic manuel rapporte ×N, avec feedback distinct (réutilise le juice V1).
- **Golden ore** : pépite dorée qui traverse rarement l'écran ; cliquée → bonus temporaire de débit (×M pendant T s).
- **Événements aléatoires** : `filon riche` (boost) / `effondrement` (malus annulable en cliquant vite). Pool déterministe, cadence bornée.
- **Boosts activables à cooldown** : bouton « Frénésie » (×3 pendant 60 s, recharge 10 min).
- **Récap de retour / coffre offline** : la notice hors-ligne devient une carte « coffre » cliquable révélant le gain (remplace `OfflineNotice`).

### 2. Rendez-vous quotidiens (cluster D)
- **Série de connexions** : compteur de jours consécutifs, récompense croissante, remise à zéro si oubli.
- **Défis journaliers rotatifs** : 3 mini-objectifs/jour tirés d'un **pool déterministe par date** (pas de RNG persistant à sauver).
- **Météo de la mine** : modificateur global du jour (ex. +20 % ou clics critiques doublés), fondé sur la date.

### 3. Succès, objectifs & collection (cluster E)
- **Mur des succès** : badges à débloquer (1er clic, X minerai, N générateurs…), chacun donnant un **petit bonus permanent** ou purement cosmétique.
- **Objectifs à étapes visibles** : quête toujours affichée « 100k → 1M → 10M ».
- **Écran Statistiques** : total de clics, minerai à vie, événements attrapés, boosts activés, records (min/s, plus gros gain offline).
- **Notifications de palier** : toast à chaque milestone/succès franchi.

## Impacts techniques

| Zone | Changement |
| --- | --- |
| `game/types.ts` | Étendre `GameState` : `achievements: string[]`, `stats: { totalClicks, totalOreEarned, eventsCaught, ... }`, `lastDailyClaim: number`, `loginStreak: number`, `activeBoosts: Boost[]`. **Champs additifs → rétro-compatibles** (loadState merge sur `initialState`). |
| `game/config.ts` | Nouveaux tableaux data-driven : `ACHIEVEMENTS`, `DAILY_CHALLENGES`, `EVENTS` (même pattern que `GENERATORS`/`UPGRADES`). |
| `game/engine.ts` | Fonctions pures : `checkAchievements(state)`, `applyBoost(state, boost)`, `expireBoosts(state, now)`, intégration des boosts/événements dans `globalMultiplier` et `clickPower`. Étendre `mine()` pour le clic critique (RNG injectable pour testabilité). |
| `game/daily.ts` | **Nouveau** : dérivation déterministe (seed = date) des défis du jour et de la météo — pas d'état RNG à persister. |
| `hooks/useGame.ts` | Timers pour spawn golden ore / événements, expiration des boosts dans `tick`. Nouvelles actions : `claimDaily`, `activateBoost`, `catchGoldenOre`, `resolveEvent`. |
| `components/` | Nouveaux : `AchievementsPanel`, `StatsPanel`, `DailyPanel`, `GoldenOre`, `EventBanner`, `BoostBar`, `ToastHost`. Remplacer `OfflineNotice` par `OfflineChest`. |
| `components/TabNav.tsx` | Nouveaux onglets (ex. `Succès`, `Défis`, `Stats`) avec pastille « action dispo ». |

> **Déterminisme** : golden ore et événements utilisent un RNG runtime (non sauvé) ; défis journaliers et météo sont **dérivés de la date** → identiques sans état à stocker. Le clic critique prend un RNG injectable pour rester testable.

## Critères d'acceptation

- [ ] Un clic critique multiplie le gain et déclenche un feedback distinct (test avec RNG mocké).
- [ ] Golden ore et événements apparaissent à cadence bornée et n'apparaissent pas hors-ligne.
- [ ] Un boost actif est pris en compte dans la production puis expire correctement (test sur `tick`).
- [ ] Les défis du jour et la météo sont **identiques pour une même date** et changent au jour suivant.
- [ ] La série de connexion s'incrémente à J+1 et se réinitialise après un jour manqué.
- [ ] Débloquer un succès applique son bonus et affiche un toast ; l'état survit au rechargement.
- [ ] Une sauvegarde **V1 (sans ces champs)** se charge sans crash (valeurs par défaut appliquées).
- [ ] `yarn typecheck`, `yarn build` et tests unitaires passent.

## Hors périmètre

Multijoueur, classements en ligne, vraies pubs, monétisation. Toute progression méta profonde (talents, ascension) → **Vague 3**.
