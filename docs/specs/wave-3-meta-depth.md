# Spec — Vague 3 : Profondeur méta

> Source : `docs/brainstorming/brainstorming-session-2026-07-25.md` (clusters F + G + H, puis I + J).
> Prérequis : Vagues 1 & 2. **Impact d'équilibrage majeur** → à livrer par sous-lots, chacun testé et équilibré séparément.
> Objectif : allonger fortement la durée de vie via de nouveaux systèmes de progression et du contenu horizontal.

## Objectif

Ajouter de la profondeur long-terme au-dessus du prestige existant (talents, ascension, automatisation) et étendre le contenu (2ᵉ ressource, couches de profondeur, nouveaux générateurs). Chaque sous-lot est **autonome et activable indépendamment**.

## Périmètre — par sous-lots

### Lot 3A — Talents de prestige (cluster F)
- **Monnaie de prestige dépensable** : les points de prestige deviennent dépensables (au lieu d'un unique bonus passif automatique).
- **Arbre de talents** : nœuds à débloquer (branches `clic` / `auto` / `offline`), effets exclusifs forçant des choix.
- **Respec payant** : réinitialiser l'arbre contre une taxe.
- **Milestones permanents** : paliers de minerai total / nb de prestiges / générateurs possédés.

### Lot 3B — Automatisation (cluster H)
- **Autobuyers** par générateur/amélioration (déblocables via talents/monnaie méta).
- **Auto-clic** après un milestone.
- **Auto-prestige** à seuil configurable.
- **File de priorité** d'automatisation.

### Lot 3C — Ascension (cluster G)
- **Couche de reset au-dessus du prestige** : reset des points de prestige → **cristaux** à effet permanent multiplicatif.
- **Défis de prestige** : runs contraints (mains nues, inflation des coûts, mono-générateur, no-offline) contre récompenses permanentes.

### Lot 3D — Ressources & raffinage (cluster I)
- **Ressource secondaire** (gemmes / cristaux) en drop % au minage.
- **Raffinage** : minerai → lingots → alliages (bonus globaux).
- Optionnel : ressource « science » alimentant un arbre technologique.

### Lot 3E — Monde & expansion (cluster J)
- **Couches de profondeur** (croûte → manteau → noyau → astéroïdes → dimensionnel) débloquant générateurs/améliorations par palier.
- **Ères** (pierre → industrielle → atomique → cosmique → dimensionnelle).
- **Nouveaux générateurs** au-delà du Planetary cruncher (Dyson Extractor, Black Hole Drill, Quantum Replicator…).

## Impacts techniques

| Zone | Changement |
| --- | --- |
| `game/types.ts` | Étendre `GameState` : `talents: Record<string, number>`, `crystals: number`, `ascensions: number`, `challengesDone: string[]`, `automation: AutomationConfig`, `resources: Record<string, number>` (gemmes/lingots/science), `unlockedDepth: number`. Champs additifs → rétro-compatibles. |
| `game/config.ts` | Nouveaux tableaux data-driven : `TALENTS`, `CHALLENGES`, `DEPTHS`, `ERAS`, `RECIPES`, extension de `GENERATORS`/`UPGRADES`. |
| `game/engine.ts` | Intégrer talents/cristaux/défis dans `globalMultiplier`, `clickPower`, `generatorMultiplier`. Nouvelles fonctions pures : `spendTalent`, `respec`, `doAscension`, `startChallenge`, `refine`, `dropSecondaryResource`, `runAutomation(state)`. |
| `game/engine.ts` | Généraliser `doPrestige` pour préserver les gains méta (talents/cristaux/milestones) au reset. |
| `hooks/useGame.ts` | Boucle d'automatisation dans `tick` (autobuyers, auto-prestige) ; nouvelles actions par lot. |
| `components/` | Nouveaux panneaux/onglets : `TalentTree`, `AscensionPanel`, `ChallengePanel`, `AutomationPanel`, `RefineryPanel`, `DepthMap`. |

> **Équilibrage** : chaque lot introduit un multiplicateur ou une ressource ; définir les courbes dans `config.ts` et **couvrir par tests** (`engine.test.ts`) les invariants (un prestige/ascension ne doit jamais faire régresser les gains méta permanents).

## Ordre de livraison recommandé

1. **3A Talents** — rend le prestige existant plus riche (plus fort levier de rétention méta).
2. **3B Automatisation** — supprime la corvée de clic tardive.
3. **3C Ascension** — nouvelle couche de reset une fois les talents maîtrisés.
4. **3D Ressources** puis **3E Monde** — contenu horizontal, le plus coûteux, en dernier.

## Critères d'acceptation (par lot)

- [ ] **3A** : dépenser un point de talent applique l'effet ; le respec rembourse et réinitialise ; les talents survivent au prestige.
- [ ] **3B** : les autobuyers achètent selon la file de priorité sans dépasser le solde ; l'auto-prestige déclenche au seuil.
- [ ] **3C** : l'ascension reset les points de prestige mais conserve cristaux/talents ; un défi complété octroie sa récompense permanente.
- [ ] **3D** : le drop secondaire est déterministe sous RNG mocké ; le raffinage respecte les ratios.
- [ ] **3E** : atteindre une profondeur débloque son contenu ; les nouveaux générateurs suivent le pattern `config.ts`.
- [ ] Pour chaque lot : sauvegarde antérieure chargée sans crash, `yarn typecheck`/`yarn build`/tests verts.

## Hors périmètre

Systèmes signalés « money pit » au brainstorming (sélecteur de biome en matrice, chaîne logistique à convoyeurs, météo souterraine, faune minière, marché fluctuant) : reportés tant que la valeur/effort n'est pas justifiée.
