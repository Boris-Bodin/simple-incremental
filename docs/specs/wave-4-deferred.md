# Spec — Vague 4 : Sous-features reportées

> Source : reports des specs Vagues 2 & 3.
> Objectif : livrer les features mises de côté, en réutilisant l'architecture existante (state additif rétro-compatible, config data-driven, fonctions pures, boosts/gemmes en place).

## Lots

### 4A — Défis journaliers rotatifs (report de 2C)
- 3 défis/jour tirés d'un **pool déterministe par date**.
- Métriques suivies via **snapshot de début de jour** (delta sur `stats` : minerai gagné, clics, crits) — pas de modif du hot-path.
- Récompense : **gemmes** à réclamer une fois l'objectif atteint. Progression + claim persistent sur la journée, survivent au prestige/ascension.

### 4B — Défis de prestige (report de 3C)
- Runs **contraints** (ex. mains nues = clic désactivé, mono-générateur, inflation des coûts) activables depuis l'onglet Prestige.
- Un modificateur s'applique pendant le run ; atteindre l'objectif (minerai du run) octroie une **récompense permanente** (une fois).

### 4C — Ressource en drop % + alliages (report de 3D)
- **Éclats** (shards) : drop aléatoire au minage/crit.
- **Alliages** : 2ᵉ palier de raffinage (lingots + éclats → alliage) à bonus global.

### 4D — Arbre technologique (report de 3D)
- Ressource **science** (production passive/drop) dépensée dans des nœuds de recherche débloquant recettes/bonus.

## Principes techniques
- Champs ajoutés au `GameState` = additifs → rétro-compatibles (`loadState` merge sur `initialState`, `normalize` fournit les défauts).
- Nouvelles données dans `config.ts` (mêmes patterns que `GENERATORS`/`TALENTS`).
- Logique en fonctions pures dans `engine.ts` (+ `daily.ts` pour le déterministe), testées.
- Chaque lot : TDD domaine → UI → typecheck/tests/build → smoke test navigateur → commit.

## Critères d'acceptation (par lot)
- [ ] **4A** : 3 défis/jour identiques pour une date donnée ; progression = delta du jour ; claim octroie les gemmes une seule fois ; reset au changement de jour.
- [ ] **4B** : le modificateur s'applique pendant le défi ; la récompense permanente n'est accordée qu'une fois.
- [ ] **4C** : drop déterministe sous RNG mocké ; recette d'alliage respecte les coûts.
- [ ] **4D** : la science s'accumule ; un nœud débloqué applique son effet.
- [ ] Pour chaque lot : save antérieure chargée sans crash, `yarn typecheck`/`test`/`build` verts.
