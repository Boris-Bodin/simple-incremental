---
stepsCompleted: [1, 2, 3]
inputDocuments: []
session_topic: 'Nouvelles fonctionnalités et contenu pour le jeu incrémental minier'
session_goals: 'Générer un maximum d idées de features et de contenu, puis les organiser en pistes actionnables'
selected_approach: 'ai-recommended'
techniques_used:
  [
    'What If Scenarios',
    'First Principles Thinking',
    'Time Shifting',
    'Morphological Analysis',
    'Cross-Pollination',
    'Concept Blending',
    'Role Playing',
    'Reverse Brainstorming',
    'SCAMPER',
    'Sensory Exploration',
    'Analogical Thinking',
    'Solution Matrix',
  ]
ideas_generated_count: 168
context_file: ''
---

# Brainstorming Session Results

**Facilitator:** Boris
**Date:** 2026-07-25

## Session Overview

**Topic:** Plus de fonctionnalités et de contenu pour la mine incrémentale (Vite + React + TS, GitHub Pages, `<iframe>`, localStorage).
**Goals:** Diverger au maximum (168 idées générées), puis converger en pistes actionnables priorisées.
**Approche :** techniques recommandées par l'IA, génération déléguée à 4 agents parallèles sur domaines orthogonaux (protocole anti-biais).

### Contexte du jeu (état actuel)

- Ressource unique : **minerai**. Minage au clic + 10 générateurs (coût ×1.15/achat) + 16 améliorations (clic / par-générateur / global).
- **Prestige** : points = √(minerai du run / 1M), +2% global/point.
- **Progression hors-ligne** (cap 8 h). UI en onglets (minage / prestige) + réglages.

### Techniques appliquées

| Domaine | Techniques |
| --- | --- |
| Méta-progression | What If Scenarios, First Principles, Time Shifting |
| Contenu horizontal | Morphological Analysis, Cross-Pollination, Concept Blending |
| Boucles d'engagement | Role Playing (personas), Reverse Brainstorming, SCAMPER |
| Feel / UX / juice | Sensory Exploration, SCAMPER, Analogical Thinking |
| Convergence | Solution Matrix (impact × effort) |

---

## Convergence — Clusters thématiques

Les 168 idées brutes (listées en annexe) se regroupent en **10 clusters**. Les doublons inter-agents (golden ore, clic critique, achat groupé, milestones par générateur, indicateur de rentabilité, export/import, dark mode…) sont fusionnés.

### A. Juice de clic & feedback sensoriel

Nombre flottant, éclats de pierre au clic, enfoncement élastique du filon, fissures cumulatives qui brisent le bloc, flash de palier, sons WebAudio (ping de minage, jingle d'achat, rumble de prestige), pitch montant en combo, vibration mobile. **Réglage unique d'intensité du juice** (Off / Sobre / Max) + respect de `prefers-reduced-motion`.

### B. Qualité de vie (QoL) d'achat

Achat en masse **×1/×10/×100/Max**, coût dynamique + **temps estimé avant achat**, barre de remplissage sur carte, pastille **« meilleur achat » ⭐** (ROI), tooltip riche, bouton **« tout acheter rentable »**, notation des grands nombres commutable (K/M/B ↔ scientifique), compteur odomètre.

### C. Boucle de rétention court-terme

**Golden ore** (pépite dorée à attraper), **clic critique** (×10 aléatoire), **événements aléatoires** (filon riche / effondrement), **boosts activables à cooldown** (Frénésie ×3), combo de clics, récap de retour, **coffre offline cliquable**, boost de rattrapage hors-ligne.

### D. Rétention long-terme / rendez-vous

**Série de connexions quotidiennes**, calendrier 7 jours, **défis journaliers rotatifs** (déterministes par date), météo de la mine (modificateur global du jour), boost publicitaire simulé à cooldown long.

### E. Succès, objectifs & collection

**Mur des succès** (badges + bonus permanents), succès secrets, **objectifs à étapes visibles** (quête « 100k → 1M → 10M »), chaîne de quêtes narrative, **codex** (générateurs / ressources) avec bonus de complétion, complétion en %, journal de records, statistiques de vie.

### F. Méta-progression — profondeur du prestige

**Arbre de talents de prestige** (branches clic / auto / offline, respec payant), **monnaie de prestige dépensable** (boutique méta), milestones permanents (minerai total, nb de prestiges, générateurs possédés), multiplicateur « héritage » (garde un % au reset), courbe de prestige scalable.

### G. Méta-progression — nouvelles couches de reset

**Ascension** (reset des points de prestige → cristaux permanents), Singularité (3e couche), défis de prestige (mains nues, inflation, mono-générateur, no-offline… contre récompenses permanentes), cartes de run à choix (roguelite léger).

### H. Automatisation

**Autobuyers** par générateur/amélioration, **auto-clic** après milestone, **auto-prestige** configurable, file d'automatisation priorisable. (Déblocables via monnaie méta — récompense de fin de courbe.)

### I. Contenu horizontal — ressources & transformation

**Ressource secondaire** (gemmes / cristaux d'énergie / métaux rares en drop %), **raffinage** (minerai → lingots → alliages), convertisseur/marché, ressource « science » pour un **arbre technologique**, reliques/artefacts (avec set bonus).

### J. Contenu horizontal — monde & expansion

**Couches de profondeur** (croûte → manteau → noyau → astéroïdes → failles dimensionnelles) débloquant générateurs/améliorations, **ères** (pierre → industrielle → atomique → cosmique → dimensionnelle), nouveaux générateurs au-delà du Planetary cruncher (Dyson Extractor, Black Hole Drill, Quantum Replicator), biomes miniers à bonus propres.

---

## Priorisation — Matrice impact × effort

### 🟢 Quick wins (fort impact, faible effort) — à faire en premier

1. Nombre flottant + éclats + enfoncement au clic (cluster A)
2. Clic critique ×10 (C)
3. Golden ore (C)
4. Achat en masse ×1/×10/Max (B)
5. Coût dynamique + temps estimé + barre sur carte (B)
6. Pastille « meilleur achat » ⭐ (B)
7. Notation des nombres commutable + dark mode (B/A)
8. Mur des succès + notifications de palier (E)
9. Récap de retour / coffre offline cliquable (C)
10. Export / import base64 de la sauvegarde (QoL)
11. Réglage intensité du juice + `prefers-reduced-motion` (A)
12. Écran statistiques / journal de records (E)

### 🔵 Big bets (fort impact, gros effort) — la profondeur du jeu

- Arbre de talents de prestige + monnaie dépensable (F)
- Couches de profondeur débloquant du contenu (J)
- Ressource secondaire + raffinage lingots (I)
- Ascension / 2ᵉ couche de reset (G)
- Défis de prestige (G)
- Synergies entre générateurs (F)
- Autobuyers / automatisation (H)
- Événements aléatoires + boosts activables (C)
- Quotidiennes / série de connexion (D)

### ⚪ Fill-ins (faible impact, faible effort) — bouche-trous sympas

Flavor text évolutif, succès secrets, vibration mobile, titres/cosmétiques de prestige, timer « prochain palier dans ~2 min ».

### 🔴 Money pits (faible impact, gros effort) — à éviter/reporter

Sélecteur de biome en matrice générateur×biome, chaîne logistique à convoyeurs, météo souterraine, faune minière, marché à taux fluctuant.

---

## Roadmap suggérée (3 vagues)

- **Vague 1 — Juice & QoL** : clusters A + B (aucun impact sur l'équilibrage, gros gain de ressenti). Rend le jeu « agréable » immédiatement.
- **Vague 2 — Rétention** : clusters C + D + E (donne des raisons de revenir et des buts).
- **Vague 3 — Profondeur méta** : clusters F + G + H, puis I + J (allonge la durée de vie ; à équilibrer soigneusement).

---

## Annexe — Idées brutes (168)

### Domaine 1 — Méta-progression (40)

1. Reset Layer 2 — Ascension [L] · 2. Reset Layer 3 — Singularité [L] · 3. Monnaie de prestige dépensable [M] · 4. Arbre de talents de prestige [L] · 5. Respec payant [S] · 6. Milestones permanents de minerai total [M] · 7. Milestones de générateurs possédés [S] · 8. Milestones de nombre de prestiges [S] · 9. Défi mains nues [M] · 10. Défi inflation des coûts [M] · 11. Défi un seul générateur [M] · 12. Défi pas d'offline [S] · 13. Défi décroissance [M] · 14. Stacking de complétions de défis [M] · 15. Synergies entre générateurs adjacents [M] · 16. Synergie de diversité [S] · 17. Générateurs qui produisent d'autres générateurs [L] · 18. Synergie déblocable via prestige [M] · 19. Autobuyer [M] · 20. Auto-prestige [M] · 21. Auto-clic [S] · 22. File d'automatisation priorisable [M] · 23. Booster « veine de minerai » [S] · 24. Booster offline accumulé [M] · 25. Frénésie de clic [S] · 26. Boost publicitaire simulé [S] · 27. 2ᵉ ressource — poussière [L] · 28. Convertisseur de ressources [M] · 29. Chronofragments (fast-forward) [M] · 30. Déblocage par profondeur [M] · 31. Cartes de mine à choix (roguelite) [L] · 32. Collection permanente (codex) [S] · 33. Objectifs long-terme (quêtes idle) [M] · 34. Prestige à courbe scalable [M] · 35. Bonus de rythme de prestige [M] · 36. Multiplicateur « héritage » [S] · 37. Générateur de points de prestige passif [M] · 38. Reset élastique (retour partiel) [M] · 39. Mine épuisable [L] · 40. Palier endgame auto-simulé [L]

### Domaine 2 — Contenu horizontal (48)

1. Gemme brute (drop %) [S] · 2. Cristaux d'énergie [M] · 3. Métaux rares [M] · 4. Poussière stellaire [S] · 5. Lingots (raffinage) [M] · 6. Alliages [L] · 7. Ratio de pureté [S] · 8. Scories recyclables [M] · 9. Marché des ressources [M] · 10. Catalyseurs consommables [S] · 11. Couche Croûte [S] · 12. Couche Manteau [M] · 13. Couche Noyau [M] · 14. Ceinture d'astéroïdes [M] · 15. Failles dimensionnelles [L] · 16. Jauge chaleur/pression [M] · 17. Poches de gaz [S] · 18. Cartographie de veines [M] · 19. Ascenseur minier [S] · 20. Strate cristalline [S] · 21. Biome Mine de glace [M] · 22. Biome Caldeira [M] · 23. Biome Grotte luminescente [S] · 24. Biome Désert de sel [S] · 25. Biome Mine hantée [M] · 26. Sélecteur de biome (matrice) [L] · 27. Météo souterraine [M] · 28. Faune minière [M] · 29. Filon signature [M] · 30. Biome corrompu [S] · 31. Ère Âge de pierre [S] · 32. Ère Révolution industrielle [M] · 33. Ère Âge atomique [M] · 34. Ère Âge cosmique [M] · 35. Ère Âge dimensionnel [L] · 36. Générateur Dyson Extractor [S] · 37. Générateur Black Hole Drill [M] · 38. Générateur Quantum Replicator [M] · 39. Générateur Galaxy Harvester [S] · 40. Générateur Reality Miner [M] · 41. Arbre technologique (science) [L] · 42. Blueprints de raffinage [M] · 43. Reliques archéologiques [M] · 44. Set de reliques [M] · 45. Fragments d'artefact [S] · 46. Chaîne logistique (convoyeurs) [L] · 47. Établi d'alchimie [M] · 48. Codex géologique [S]

### Domaine 3 — Boucles d'engagement (40)

1. Mur des succès [M] · 2. Journal de records [S] · 3. Complétion en % [S] · 4. Codex des générateurs [M] · 5. Objectif « session café » à l'ouverture [S] · 6. Récap de retour [S] · 7. Bouton « coup de collecte » [S] · 8. File d'auto-achat suggéré [M] · 9. Calculateur ROI [M] · 10. Défis d'efficience [L] · 11. Tableau de bord des multiplicateurs [M] · 12. Événement filon riche [M] · 13. Événement effondrement [M] · 14. Golden ore [M] · 15. Clic critique [S] · 16. Objectifs à étapes visibles [S] · 17. Boosts activables à cooldown [M] · 18. Notifications de palier [S] · 19. Décision aléatoire à choix [M] · 20. Anti-mur de coût (quête express) [M] · 21. Compte à rebours de fraîcheur [S] · 22. Combo de clics [M] · 23. Achat + succès fusionnés [S] · 24. Défi chronométré 60 s [M] · 25. Loot box de pioche (quotidienne) [M] · 26. Clic qui change de rôle [L] · 27. Minerai réinvesti en tickets [M] · 28. Clic « chargé » unique [M] · 29. Objectifs inversés / malus [S] · 30. Achat groupé ×10/max [S] · 31. Chaîne de quêtes narrative [L] · 32. Série de connexions quotidiennes [M] · 33. Calendrier de récompenses 7 jours [M] · 34. Défis journaliers rotatifs [M] · 35. Météo de la mine [M] · 36. Succès secrets [S] · 37. Paliers de prestige célébrés [S] · 38. Objectif long « carte au trésor » [M] · 39. Boost de rattrapage hors-ligne [S] · 40. Statistiques de vie [S]

### Domaine 4 — Feel / UX / juice (40)

1. Éclats au clic [M] · 2. Nombre flottant [S] · 3. Enfoncement du filon [S] · 4. Fissures cumulatives [M] · 5. Ping de minage (WebAudio) [M] · 6. Pitch montant en combo [M] · 7. Flash de palier [S] · 8. Jingle d'achat [M] · 9. Étincelle d'achat [S] · 10. Rumble de prestige [M] · 11. Achat en masse ×1/×10/×100/Max [M] · 12. Coût dynamique + délai estimé [M] · 13. Barre de remplissage sur carte [S] · 14. Cartes grisées réservables [S] · 15. Onglets en icônes + badge [S] · 16. Header en jauge de débit [M] · 17. Fusion clic + auto (anneau) [M] · 18. Réglages en tiroir [S] · 19. Éliminer le scroll (grille) [M] · 20. Notice offline en coffre [M] · 21. Compteur odomètre [M] · 22. Golden nugget [M] · 23. Indicateur de rentabilité ⭐ [S] · 24. Fil narratif discret [S] · 25. Tooltip riche [M] · 26. Milestones par générateur [M] · 27. Écran stats minimaliste [S] · 28. Notation abrégée commutable [S] · 29. Dark/Light auto + toggle [S] · 30. Palette « profondeur » [M] · 31. Navigation clavier complète [M] · 32. `prefers-reduced-motion` [S] · 33. ARIA live sur les gains [M] · 34. Export/Import base64 [S] · 35. Pool de particules canvas [M] · 36. Feedback tactile mobile (vibrate) [S] · 37. Batch des rendus (throttle 10 fps) [M] · 38. Bouton « tout acheter rentable » [M] · 39. Timer avant plein régime [S] · 40. Réglage intensité du juice [S]
