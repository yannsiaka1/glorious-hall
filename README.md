# Glorious Hall — site vitrine

Site une page de Glorious Hall, salle événementielle à Bonamoussadi (Douala) :
mariages, anniversaires, séminaires et réceptions.

## Pile technique

| Choix                               | Pourquoi                                                                                                 |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Vite + React 19 + TypeScript**    | Rechargement instantané, découpage en composants, typage strict                                          |
| **vite-react-ssg** (comme Precious) | Le build génère un `index.html` complet : Google et les aperçus de partage lisent le contenu sans script |
| **Tailwind CSS v4**                 | Styles au plus près des composants ; jetons de design centralisés dans `@theme`                          |
| **Motion**                          | Animations d'apparition, transitions des diapositives, effets liés au défilement                         |
| **Lenis**                           | Défilement fluide, socle du défilement par étapes                                                        |

## Démarrer

```bash
npm install
npm run dev          # développement
npm run build        # build + prérendu dans dist/
npm run preview      # prévisualiser le build
npm run apercu       # build autonome à chemins relatifs (ouvrable depuis n'importe quel hébergement)
npm run lint         # oxlint (React, accessibilité, TypeScript)
npm run typecheck    # TypeScript strict
npm run format       # Prettier (+ tri des classes Tailwind)
```

Les vidéos sont livrées à part du code : voir la section [Vidéos](#vidéos) pour les installer.

Node 20.19 ou plus. Déploiement Vercel : `vercel.json` fixe la commande (`npm run build`), le dossier (`dist`),
le cache et les en-têtes de sécurité.

## Organisation

```
src/
├── content/              Tout l'éditorial : textes, coordonnées, vidéos, avis
│   ├── site.ts           Identité, coordonnées, navigation
│   ├── offre.ts          Capacité (120 + 200 = 320), atouts, prestations, chiffres
│   ├── services.ts       Diapositives « Nos services »
│   ├── videos.ts         Vidéos du hero (paysage / portrait) et de la galerie
│   └── avis.ts           Avis (exemples à remplacer)
├── components/
│   ├── layout/           En-tête, pied de page, défilement, données structurées
│   ├── sections/         Une section de la page = un composant
│   └── ui/               Briques réutilisables (icônes, visionneuse, logo animé…)
├── hooks/                useMediaQuery
├── lib/                  Défilement par étapes, médias, animations, utilitaires
└── styles/index.css      Jetons de design, base, animations
```

**Règle de travail :** modifier un texte, un chiffre ou une vidéo ne demande jamais de toucher à un composant :
tout le contenu vit dans `src/content/`. Aucune couleur de la charte n'est écrite en dur hors de `@theme`.

## Comportements de la page

- **Défilement par étapes** (`src/lib/steps.ts`) : un cran de molette, un glissé au doigt ou une flèche du clavier
  = une étape. Enchaînement : hero → section 2 (qui le recouvre) → services (un service par cran) → la galerie en
  un cran → logo seul → « À propos » en un cran → défilement libre. Les crans suivants d'un même geste sont
  absorbés. À l'arrivée sur la galerie, rien ne bouge avant un nouveau geste : la fin du geste d'arrivée (inertie
  d'un pavé tactile) ne compte pas.
- **Hero** : vidéos en fond, floutées. Écran en portrait (téléphone) : vidéos verticales, « 1 » et « 2 » d'abord ;
  sinon vidéos horizontales. Le bouton lecture passe en mode cinéma (flou retiré, son, textes masqués sauf le
  titre). Les textes suivent aussi la hauteur de l'écran : sur un portable où le navigateur laisse peu de hauteur,
  ils rétrécissent et restent toujours sous l'en-tête.
- **Vidéos** : lecture fiable sur iPhone et dans les navigateurs intégrés (WhatsApp, Facebook) : attribut `muted`
  posé dans le DOM et relance au premier geste si la lecture automatique est refusée (`src/lib/media.ts`).
- **Galerie** : vignettes nettes à l'arrivée ; la vidéo ne joue qu'au survol de la souris (la grande vignette lit la
  vidéo complète, plus nette que l'aperçu de 6 s). En fond, le logo vectorisé (net à toutes les tailles) s'anime —
  la signature s'écrit, l'arbre pousse puis se balance au vent, des feuilles d'or s'en détachent, un reflet glisse
  sur le G et le H.
- **Accessibilité** : réglage « réduire les animations » respecté, fenêtre vidéo native (`<dialog>`), focus
  visible, carrousel d'avis conforme aux recommandations WAI-ARIA, contenu lisible sans JavaScript.

## Référencement (SEO)

- Prérendu complet de la page (`vite-react-ssg`), une seule balise `h1`, titres hiérarchisés, textes alternatifs.
- `index.html` : titre, description, `robots`, `canonical`, Open Graph et carte Twitter (image `public/og-image.jpg`).
- Données structurées schema.org (`src/components/layout/StructuredData.tsx`) : `EventVenue` + `LocalBusiness`
  avec adresse, téléphones, capacité, équipements et prestations, tirés du contenu.
- `robots.txt` et `sitemap.xml` générés au build à partir du domaine.
- Polices et affiche du hero préchargées ; images hors écran chargées à la demande.

**Domaine :** défini une seule fois dans `.env` (`VITE_SITE_URL`). Il alimente `canonical`, Open Graph, les
données structurées, `robots.txt` et `sitemap.xml`.

## Vidéos

Trop lourdes pour l'archive du code (environ 115 Mo), les vidéos sont livrées dans des archives à part,
`glorious-hall-videos-*.zip`. Chacune contient déjà le chemin complet `glorious-hall/public/videos/…`. Le site
attend cette organisation :

```
public/videos/
├── paysage/     11 vidéos horizontales : hero sur ordinateur, galerie, visionneuse
├── apercus/     11 extraits muets de 6 s, joués au survol des vignettes de la galerie
├── portrait/     9 vidéos verticales : hero sur téléphone (écran en portrait)
└── affiches/    images affichées avant la lecture (livrées avec le code)
    ├── paysage/
    └── portrait/
```

**Installation :** placer les archives dans le dossier qui _contient_ `glorious-hall/` (pas à l'intérieur), puis les
extraire toutes au même endroit en fusionnant les dossiers :

```bash
# Windows (PowerShell)
Get-ChildItem glorious-hall-videos-*.zip | ForEach-Object { Expand-Archive -LiteralPath $_.FullName -DestinationPath . -Force }
# macOS / Linux
for z in glorious-hall-videos-*.zip; do unzip -o "$z"; done
```

**Vérification :** au démarrage, `npm run dev` affiche « Médias : 31 vidéos et 31 affiches présentes dans
public/videos. », ou la liste des dossiers où il manque des fichiers. Une vidéo absente reçoit une erreur 404 et son
chemin s'affiche dans le terminal. Sans les vidéos, le site montre les affiches fixes à leur place.

### Ajouter ou remplacer une vidéo

```bash
scripts/encoder-video.sh ~/Téléchargements/ma-video.mp4 mon-slug paysage 4   # 4 = seconde de l'affiche
scripts/encoder-video.sh ~/Téléchargements/ma-video.mp4 mon-slug portrait 2
```

Puis déclarer la vidéo dans `src/content/videos.ts` (`galerie`, `heroPaysage` ou `heroPortrait`), avec `debut` et
`fin` : la seconde où le hero passe à la vidéo suivante (avant un générique ou un fondu au noir).

### Héberger les vidéos ailleurs

Pour un CDN : un fichier JSON « chemin → adresse » passé au build
(`MEDIAS=medias.json npm run build`), voir `src/lib/media.ts`. Penser alors à ajouter le domaine du CDN à
`media-src` dans la politique de sécurité de `vercel.json`.

## À compléter avant la mise en ligne

1. **Avis** — `src/content/avis.ts` contient des avis d'exemple, signalés comme tels à l'écran : à remplacer par de
   vrais avis clients, avec leur accord.
2. **Domaine** — vérifier `VITE_SITE_URL` dans `.env`.
3. **Mentions légales et politique de confidentialité** — à rédiger.

## Ressources

`ressources/` contient le logo détouré en PNG transparent (`logo-clair.png` pour fonds sombres, `logo-sombre.png`
pour fonds clairs).
