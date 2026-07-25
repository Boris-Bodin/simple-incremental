# Spec — Vague 1 : Juice & Qualité de vie

> Source : `docs/brainstorming/brainstorming-session-2026-07-25.md` (clusters A + B).
> Objectif : rendre le jeu **agréable et lisible** sans toucher à l'équilibrage. Aucune nouvelle mécanique de progression.

## Objectif

Améliorer le ressenti (feedback de clic/achat/palier) et le confort d'achat, en restant léger (CSS/canvas/WebAudio, pas de nouvelle dépendance), performant en `<iframe>` et respectueux de l'accessibilité.

## Périmètre

### 1. Juice de clic (cluster A)
- **Nombre flottant** : à chaque clic, afficher `+<gain>` qui monte et disparaît en fondu depuis le point du clic.
- **Éclats de pierre** : 3–5 particules projetées avec gravité, recyclées via un **pool** unique en `requestAnimationFrame` (canvas ou divs).
- **Enfoncement du filon** : `scale(0.97)` + retour élastique du bloc au clic.
- **Flash de palier** : halo + léger shake du header au franchissement d'un palier rond (1K, 1M, 1B…).

### 3. Réglage d'intensité + accessibilité (cluster A)
- **Curseur unique « Intensité »** : `Off / Sobre / Max` pilotant particules + shake + flash + son d'un coup.
- **Respect de `prefers-reduced-motion`** : force `Off` sur les animations si l'OS le demande.

### 4. QoL d'achat (cluster B)
- **Achat en masse** : sélecteur global `×1 / ×10 / ×100 / Max` appliqué à toutes les cartes générateur.
- **Coût + temps estimé** sur chaque carte : `coût` et `temps avant de pouvoir acheter` = `(coût − ore) / productionPerSecond`.
- **Barre de remplissage** intégrée au bouton d'achat (ore / coût).
- **Pastille « meilleur achat » ⭐** : marque la carte au meilleur ratio production ajoutée / coût.

### 5. Lisibilité des nombres (cluster B)
- **Notation commutable** dans les réglages : abrégée (K/M/B — déjà en place) ↔ scientifique. Étend `format.ts`.
- **Dark / Light** : auto via `prefers-color-scheme` + toggle manuel persistant.

## Impacts techniques

| Zone | Changement |
| --- | --- |
| `game/engine.ts` | Ajouter `bulkCost(state, id, count)` et `maxAffordable(state, id)` (fonctions pures) pour l'achat en masse. Aucune modif des règles existantes. |
| `game/engine.ts` | Exposer helper `productionAddedBy(state, id)` pour le ratio « meilleur achat ». |
| `game/format.ts` | Ajouter mode scientifique + fonction de bascule (`formatNumber(value, notation)`). |
| `game/types.ts` | **Nouveau `Settings`** (juice: 'off'\|'sober'\|'max', sound: boolean, notation, theme) — stocké hors `GameState` (préférences, pas progression) dans une clé localStorage dédiée. |
| `hooks/useGame.ts` | Aucun impact sur la boucle. Nouveau hook `useSettings` séparé. |
| `components/` | Nouveaux : `FloatingNumbers`, `ClickParticles`, `BuyAmountSelector`. Étendre `GeneratorList`, `ResourceHeader`, `SettingsPanel`, `ClickArea`. |
| `game/audio.ts` | **Nouveau** module WebAudio (oscillateurs courts), sans asset. |

> **Compat sauvegarde** : les réglages vivent dans une clé localStorage distincte (`simple-incremental:settings:v1`). `GameState` inchangé → aucune migration.

## Critères d'acceptation

- [ ] Un clic produit nombre flottant + particules + enfoncement, coupables via « Intensité = Off ».
- [ ] `prefers-reduced-motion: reduce` désactive automatiquement toutes les animations.
- [ ] `×10 / Max` achète le bon nombre au bon coût cumulé (couvert par tests `engine.test.ts`).
- [ ] Chaque carte affiche coût + temps estimé ; la pastille ⭐ suit le meilleur ratio.
- [ ] Le thème et la notation persistent après rechargement.
- [ ] `yarn typecheck` et `yarn build` passent ; les tests unitaires du moteur restent verts.
- [ ] Aucune régression de perf visible en `<iframe>` (pool de particules, throttle du rendu si besoin).

## Hors périmètre

Export/Import (**déjà implémenté** dans `storage.ts`), sons à base de fichiers, refonte visuelle complète, tout ce qui modifie la production/l'équilibrage.
