# Repères pour ce dépôt

Site vitrine de Glorious Hall — salle événementielle à Bonamoussadi, Douala :
mariages, anniversaires, séminaires, réceptions. Une seule page, déployée sur
Vercel à chaque fusion dans `main`. Domaine déclaré : https://www.glorioushall.com
(`VITE_SITE_URL` dans `.env`).

## Avant toute chose

Lire `CONTRIBUTING.md`. Le cycle de travail y est décrit et s'applique sans
exception : branche, PR, aperçu, relecture, fusion. **Jamais de push direct
sur `main`.**

## La pile

Vite 8 · React 19 · TypeScript strict · Tailwind v4 · `vite-react-ssg` en mode
page unique · Motion · Lenis · oxlint · Prettier (avec tri des classes
Tailwind). Aucune fonction serveur : le contact passe par des liens
(WhatsApp, téléphone, courriel, plan).

Le site est prérendu : `index.html` contient le contenu complet, React reprend
ensuite la main. Le `README.md` décrit en détail les comportements de la page
(défilement par étapes, hero, galerie, accessibilité, référencement).

## Où vivent les choses

| Chemin                     | Contenu                                                              |
| -------------------------- | -------------------------------------------------------------------- |
| `src/content/`             | Tous les textes, chiffres, coordonnées, vidéos et avis               |
| `src/components/sections/` | Une section de la page par fichier                                   |
| `src/components/layout/`   | En-tête, pied de page, défilement fluide, données structurées        |
| `src/components/ui/`       | Les briques réutilisées (icônes, visionneuse, logo animé…)           |
| `src/lib/steps.ts`         | Le défilement par étapes : un geste = une étape                      |
| `src/lib/media.ts`         | Adresses des médias et lecture fiable des vidéos (iPhone, WhatsApp…) |
| `src/styles/index.css`     | Jetons de la charte (`@theme`), base, animations du hero             |
| `public/videos/`           | Vidéos encodées : `paysage/`, `portrait/`, `apercus/`, `affiches/`   |
| `scripts/`                 | Encodage d'une nouvelle vidéo, étape de construction maison          |
| `ressources/`              | Logo détouré en PNG, pour les usages hors site                       |

Pour changer un texte, un chiffre, un numéro ou une vidéo : `src/content/`,
pas un composant.

## Règles de la maison

**Tout est commenté en français**, et les commentaires disent _pourquoi_, pas
_quoi_. Le dépôt est tenu pour qu'un tiers puisse le reprendre.

**Les messages de commit sont sans accents**, pour rester cohérents avec
l'historique existant. Les commentaires de code, eux, sont accentués
normalement.

**Aucun service tiers côté client.** Pas d'analytique, pas de pixel, pas de
police ni de carte distantes. La politique de sécurité du contenu
(`vercel.json`) est verrouillée sur `'self'` : toute dépendance externe ajoutée
doit être discutée, et la politique mise à jour dans la même PR.

**Aucune couleur de la charte écrite en dur** hors de `@theme`.

**Rien n'est inventé dans les contenus.** Tarifs, capacités, numéros,
prestations : si l'information n'a pas été fournie, on ne la met pas et on la
demande. Les avis de `src/content/avis.ts` sont des exemples, signalés comme
tels à l'écran : ils le restent tant qu'ils n'ont pas été remplacés par de
vrais avis, donnés avec l'accord de leurs auteurs.

**Une nouvelle vidéo passe par `scripts/encoder-video.sh`**, puis se déclare
dans `src/content/videos.ts` avec son `debut` et sa `fin`. Le hero joue les
vidéos `portrait/` sur un écran en portrait, `paysage/` sinon.

**Les textes restent lisibles par les robots.** Quand un texte est coupé en
lignes, un espace invisible sépare les lignes ; aucun texte n'est écrit deux
fois pour des écrans différents.

## L'aperçu avant validation

Chaque PR qui touche à l'affichage est montrée avant d'être validée :

1. construire (`npm run build`) et servir `dist/` en local ;
2. capturer les sections modifiées à 390 px et à 1440 px de large ;
3. vérifier l'absence de débordement horizontal de 320 à 1920 px, après avoir
   fait défiler toute la page pour déclencher les apparitions ;
4. envoyer les captures dans la conversation, avec le lien de la PR.

Vercel publie en plus une adresse de prévisualisation sur la PR. La fusion
n'intervient qu'après validation explicite.

## Vérifications attendues

```bash
npm run build          # TypeScript, construction complete, prerendu
npm run lint           # doit etre silencieux
npm run format:check   # rien a reformater
```

## Points connus, non traités

- Les avis sont des exemples (`src/content/avis.ts`), à remplacer par de vrais
  avis clients.
- Mentions légales et politique de confidentialité : à rédiger.
- La section « Vidéos » du `README.md` est dépassée : elle décrit des vidéos
  livrées dans des archives à part, alors qu'elles sont désormais suivies dans
  le dépôt (62 fichiers, environ 115 Mo).
- Deux vidéos du hero sur téléphone, `anniversaire-baby-boss` et
  `mariage-vert-blanc`, portent le filigrane du décorateur.
- `.env` est suivi par git. Il ne contient que le domaine public ; aucun
  secret ne doit y entrer.
- Aucun test automatisé, aucune vérification automatique sur les PR.
