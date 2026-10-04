# Glorious Hall — site vitrine

React 19 + TypeScript + Tailwind 4 (Vite), animations Motion, défilement fluide Lenis.

## Démarrer

```bash
npm install
npm run dev      # développement
npm run build    # production (dossier dist/)
```

Déploiement Vercel : framework « Vite », commande `npm run build`, dossier `dist`.

## Modifier le contenu

Tout le texte, les coordonnées, les images et les avis sont dans `src/content.ts`.

- Mots en doré dans les titres de services : entourez-les de crochets, ex. `Des [décorations] qui`.
- Vidéo du hero : renseignez `heroVideo` (sinon le bouton lecture ouvre la galerie).
- Avis : ajoutez des entrées à `testimonials`, le carrousel s'adapte.
- Images : déposez-les dans `src/assets/img/` (WebP conseillé) puis importez-les dans `content.ts`.

## Structure des animations

- `Hero.tsx` : chargement orchestré (image, ombre gauche, contenu) ; reste collé pendant que `Offer.tsx` monte par-dessus.
- `Services.tsx` : section épinglée (5 écrans), plante et boutons fixes, contenu qui change selon la progression.
- `Gallery.tsx` : section épinglée (3 écrans), le contenu s'efface puis l'image de fond reste seule.
- `Reveal.tsx` : apparitions au défilement réutilisables.
