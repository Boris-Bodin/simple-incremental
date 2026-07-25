# Simple Incremental — Mine

Petit jeu incrémental (thème minier) en Vite + React + TypeScript, conçu pour être
déployé sur GitHub Pages et embarqué dans une `<iframe>` depuis un site agrégateur.

## Développement

```bash
yarn install
yarn dev        # serveur local
yarn build      # build de production dans dist/
yarn preview    # sert le build de production
yarn typecheck  # vérification des types
```

Les versions de Node et Yarn sont épinglées via [Volta](https://volta.sh)
(`node 22.13.0`, `yarn 1.22.22`).

## Architecture

```
src/
  game/         domaine pur (aucune dépendance React)
    types.ts    modèles de données
    config.ts   définition des générateurs, améliorations et constantes
    engine.ts   règles du jeu (fonctions pures)
    format.ts   formatage des nombres
    storage.ts  persistance localStorage + progression hors-ligne
  hooks/
    useGame.ts  boucle de jeu, sauvegarde auto, câblage moteur ↔ React
  components/   UI React (présentation uniquement)
  App.tsx
  main.tsx
```

La logique métier vit dans `game/` sous forme de fonctions pures ; React ne fait que
l'afficher et déclencher les actions. La sauvegarde est locale (`localStorage`).

## Déploiement

Le workflow `.github/workflows/deploy.yml` build et publie sur GitHub Pages à chaque
push sur `main`. Activer **Settings → Pages → Source : GitHub Actions** dans le dépôt.

`vite.config.ts` utilise `base: './'` (chemins relatifs) pour fonctionner à la fois
sous le sous-chemin Pages et dans une `<iframe>`.

## Intégration en iframe

```html
<iframe
  src="https://<user>.github.io/simple-incremental/"
  style="border:0;width:100%;height:640px"
  title="Mine incrémentale"
></iframe>
```
