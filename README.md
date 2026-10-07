# Glorious Hall — site vitrine

React 19 + TypeScript + Tailwind 4 (Vite), animations Motion, défilement fluide Lenis.

## Démarrer

```bash
npm install
npm run dev      # développement
npm run build    # production (dossier dist/)
```

Déploiement Vercel : framework « Vite », commande `npm run build`, dossier `dist`.

Aperçu autonome (polices intégrées au CSS) : `APERCU=1 npm run build`.

## Modifier le contenu

Tout le texte, les coordonnées, les vidéos et les avis sont dans `src/content.ts`.

- Mots en doré dans les titres de services : entourez-les de crochets, ex. `Des [décorations] qui`.
  `retraits` décale chaque ligne du titre (en em), comme sur la maquette.
- Vidéos : fichiers dans `public/videos/` (complètes), `public/videos/apercus/` (6 s, survol des vignettes)
  et `public/videos/affiches/` (images fixes). `fin` = seconde où commence le générique : le hero passe
  à la vidéo suivante à ce moment-là.
- Avis : ajoutez des entrées à `testimonials`, le carrousel s'adapte.
- Logo : `src/assets/img/logo-clair.webp` (fonds sombres) et `logo-sombre.webp` (fonds clairs).
  Les mêmes en PNG transparent sont dans `ressources/` pour un usage hors du site.

## Comportements

- `src/lib/steps.ts` : défilement par étapes. Un cran de molette, un glissé ou une flèche du clavier
  = une étape (hero → section 2, chaque service, galerie). Les crans suivants du même geste sont absorbés ;
  au-delà de la dernière étape le défilement redevient normal.
- `Hero.tsx` : vidéos en fond (floutées), bouton lecture = mode cinéma (flou retiré, son, textes masqués
  sauf le titre).
- `Offer.tsx` : section 2 mise à l'échelle de la maquette (unité `--u`), défilement latéral sur mobile.
- `Services.tsx` : cadre photo découpé selon la forme relevée sur la maquette (`FRAME_PATH`).
- `Gallery.tsx` : 1er cran, le contenu s'efface sur le générique doré ; 2e cran, section suivante.
- En-tête (`Header.tsx`) : repris de Precious (hauteur fixe, voile flouté au défilement, soulignement
  animé, menu déroulant sur mobile) ; la teinte du voile suit la section en dessous (`data-theme`).
- Marges de page : `--gutter` (4,4 % de la largeur, comme Precious), classe `page-x`.
