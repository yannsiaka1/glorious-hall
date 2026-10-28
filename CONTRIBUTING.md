# Comment on travaille sur ce dépôt

Site de production, déployé automatiquement sur Vercel à chaque fusion dans
`main`. Un commit poussé sur `main` est en ligne quelques minutes plus tard,
devant de futurs clients de la salle. D'où les règles ci-dessous : elles
existent pour que rien n'atteigne la production sans avoir été vu.

## Le cycle

```
main ──┬──────────────────────────────────────────── fusion ──→ déploiement Vercel
       └── branche de travail ── PR ── aperçu ── relecture ──┘
```

1. **Une branche par sujet**, partant de `main` à jour.
2. **Une PR dès le premier commit**, même inachevée — en brouillon si le
   travail continue. Une PR ouverte tôt se relit par petits bouts ; une PR
   ouverte à la fin se relit mal ou pas du tout.
3. **Un aperçu avant toute validation.** Vercel construit chaque branche
   poussée et publie l'adresse de prévisualisation sur la PR. Pour tout ce qui
   touche à l'affichage, la PR est accompagnée de captures des sections
   modifiées, sur téléphone et sur ordinateur.
4. **Relecture.** Rien ne part en production sans avoir été regardé par
   quelqu'un d'autre que son auteur.
5. **Corrections** en commits supplémentaires sur la même branche, pas en
   réécriture de l'historique : le relecteur doit pouvoir voir ce qui a changé
   depuis sa remarque.
6. **Fusion** une fois la PR approuvée et la construction verte.
7. **Suppression de la branche** après fusion.

On ne pousse jamais directement sur `main`, sauf incident de production avéré
— et dans ce cas on ouvre la PR après coup, pour que la correction soit tracée.

## Nommer une branche

`type/description-courte-en-minuscules`

| Type       | Pour                                                    |
| ---------- | ------------------------------------------------------- |
| `feat`     | une fonctionnalité visible pour le visiteur             |
| `fix`      | une correction de comportement                          |
| `perf`     | une amélioration de performance sans changement visible |
| `refactor` | une réorganisation du code, sans effet observable       |
| `docs`     | la documentation, les textes du site, les pages légales |
| `chore`    | l'outillage, les dépendances, la configuration          |

Exemples : `feat/galerie-nouvelles-videos`, `fix/hero-texte-coupe-iphone`,
`docs/mentions-legales`.

## Écrire un message de commit

```
type: description a l'infinitif ou au substantif, en minuscules

Le corps explique POURQUOI, pas quoi — le diff dit deja quoi. Il repond a
la question que se posera quelqu'un dans six mois : « pourquoi ce choix
bizarre ? ». Lignes a 72 caracteres.

Sans accents dans le message, pour rester coherent avec l'historique du
depot.
```

Un titre de 72 caractères au plus, pas de point final.

Le corps n'est pas obligatoire pour un changement évident (`chore: mise a jour
des dependances`). Il l'est dès qu'un choix a été fait : une valeur de seuil,
un contournement, un compromis, une solution qui surprend.

Le préfixe de type n'est pas de la décoration : il permet de générer un
journal des versions automatiquement le jour où on en veut un, et il force à
se demander ce qu'on est réellement en train de faire avant de committer.

## Avant d'ouvrir une PR

```bash
npm run build          # TypeScript, construction complete et prerendu
npm run lint           # oxlint : aucune erreur
npm run format:check   # Prettier : rien a reformater
```

Et, pour tout ce qui touche à l'affichage :

- **une largeur de téléphone** — 390 px au minimum, 320 px si la
  modification touche une liste, un tableau ou un long numéro ;
- **les deux orientations du hero** — il charge des vidéos verticales sur un
  écran en portrait et horizontales sinon : une modification du hero se
  vérifie sur un téléphone _et_ sur un ordinateur ;
- **le défilement par étapes** (`src/lib/steps.ts`) — si une section change de
  hauteur ou de place, vérifier à la molette, au doigt et au clavier que
  chaque geste amène bien à l'étape suivante.

## La relecture

Le relecteur vérifie, dans cet ordre :

1. **Le comportement** — est-ce que ça fait ce que la PR annonce ?
2. **Les cas limites** — téléphone étroit, texte long, vidéo absente, réseau
   lent, animations réduites.
3. **La lisibilité** — est-ce qu'un tiers comprendra ce code dans six mois ?
4. **Le périmètre** — la PR ne contient-elle que ce qu'elle annonce ?

Une remarque de relecture est une question, pas un ordre. L'auteur peut y
répondre par un changement ou par une explication.

## Ce qu'on ne met pas dans le dépôt

**Les secrets.** Clés d'API, jetons, mots de passe : tout cela vit dans les
variables d'environnement Vercel. Attention, ici `.env` est suivi par git — il
ne contient que le domaine public du site (`VITE_SITE_URL`), et toute variable
`VITE_` finit de toute façon dans le code envoyé au navigateur. Aucun filet ne
rattrapera un secret écrit dans ce fichier : il serait publié.

**Les vidéos brutes.** Les vidéos du site sont dans `public/videos/`, déjà
encodées pour le web. Une nouvelle vidéo passe toujours par
`scripts/encoder-video.sh` avant d'entrer dans le dépôt : un fichier tel qu'il
sort du téléphone pèse souvent dix fois plus, et GitHub refuse tout fichier de
plus de 100 Mo.
