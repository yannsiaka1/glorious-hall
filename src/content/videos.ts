import { media } from '@/lib/media'

/**
 * Vidéos du site (dossier public/videos, préparées par scripts/encoder-video.sh).
 *
 * - Horizontales : fond du hero sur ordinateur, galerie et visionneuse.
 * - Verticales : fond du hero sur téléphone (écran en portrait).
 *
 * `debut` et `fin` bornent le passage montré dans le hero : à `fin`, le hero
 * enchaîne la vidéo suivante (on évite ainsi les génériques et les fondus au
 * noir). La visionneuse de la galerie, elle, montre la vidéo entière.
 */

export type CategorieGalerie = 'Mariage' | 'Anniversaire' | 'Extérieur' | 'Décoration'

export type Clip = {
  slug: string
  titre: string
  src: string
  affiche: string
  debut: number
  fin: number
}

export type VideoGalerie = Clip & {
  categorie: CategorieGalerie
  apercu: string
  afficheReduite: string
}

const paysage = (
  slug: string,
  titre: string,
  categorie: CategorieGalerie,
  debut: number,
  fin: number,
): VideoGalerie => ({
  slug,
  titre,
  categorie,
  debut,
  fin,
  src: media(`videos/paysage/${slug}.mp4`),
  apercu: media(`videos/apercus/${slug}.mp4`),
  affiche: media(`videos/affiches/paysage/${slug}.webp`),
  afficheReduite: media(`videos/affiches/paysage/${slug}-petit.webp`),
})

const portrait = (slug: string, titre: string, debut: number, fin: number): Clip => ({
  slug,
  titre,
  debut,
  fin,
  src: media(`videos/portrait/${slug}.mp4`),
  affiche: media(`videos/affiches/portrait/${slug}.webp`),
})

/*
 * Ordre des listes : de la plus belle image à la moins belle.
 *
 * La galerie montre ses cinq premières vidéos, la première en grand ; chaque
 * filtre garde cet ordre. Le hero commence par la première de sa liste. Mettre
 * en tête les vidéos les plus nettes, c'est donc soigner ce que l'on voit en
 * premier.
 *
 * Classement établi d'après :
 * 1. la définition réelle de la vidéo (1280×720 avant 960×544, avant 848×478,
 *    avant 640×360 et moins), qui fixe le détail maximal possible ;
 * 2. à définition égale, l'examen de chaque vidéo agrandie à sa taille
 *    d'affichage (netteté des contours, flou de bougé, compression visible),
 *    appuyé sur une mesure du détail fin (variance du laplacien) ;
 * 3. les vidéos portant le filigrane d'un tiers passent après les autres,
 *    quelle que soit leur netteté.
 *
 * Une nouvelle vidéo s'insère à sa place dans ce classement, pas en fin de liste.
 */

export const galerie: VideoGalerie[] = [
  paysage('anniversaire-papillons-roses', 'Anniversaire en rose et papillons', 'Anniversaire', 0.3, 46.2),
  paysage('deco-fleurs', 'Décoration florale', 'Décoration', 0.3, 41.8),
  paysage('anniversaire-60-ans', 'Anniversaire des 60 ans', 'Anniversaire', 0.3, 45),
  paysage('salle-doree', 'La salle et ses dorures', 'Décoration', 0.3, 43.6),
  paysage('soiree-exterieure', 'Soirée sous chapiteau', 'Extérieur', 0.3, 41.6),
  paysage('anniversaire-50-ans', 'Anniversaire des 50 ans', 'Anniversaire', 0.3, 26.5),
  paysage('ceremonie-exterieure', 'Cérémonie en extérieur', 'Extérieur', 0.3, 61),
  paysage('mariage-vert-or', 'Mariage vert et or', 'Mariage', 0.4, 43.6),
  paysage('mariage-cerapis-joel', 'Mariage de Cérapis et Joël', 'Mariage', 0.3, 49.5),
  // 848×478 mais très doux à l'écran (mise au point et surexposition) : classé après les 640×360 nets.
  paysage('mariage-mairie', 'Mariage civil sur place', 'Mariage', 0.3, 85.5),
  // Un mariage, malgré le nom du fichier (gardé tel quel pour ne pas renommer les vidéos déjà en place).
  paysage('anniversaire-rose', 'Mariage en rose', 'Mariage', 0.3, 50),
  paysage('reception-jardin', 'Réception au jardin', 'Extérieur', 0.3, 37.6),
  paysage('anniversaire-papillons', 'Anniversaire papillons', 'Anniversaire', 0.3, 53.4),
]

export const filtresGalerie = ['Tous', 'Mariage', 'Anniversaire', 'Extérieur', 'Décoration'] as const
export type FiltreGalerie = (typeof filtresGalerie)[number]

/**
 * Hero sur ordinateur : les plans horizontaux les plus larges et lumineux,
 * dans l'ordre du classement. La vidéo en 1280×720 ouvre la page : c'est la
 * seule qui reste nette en mode cinéma sur un grand écran.
 */
export const heroPaysage: Clip[] = [
  'anniversaire-papillons-roses',
  'deco-fleurs',
  'soiree-exterieure',
  'ceremonie-exterieure',
  'mariage-vert-or',
].map((slug) => {
  const clip = galerie.find((video) => video.slug === slug)
  if (!clip) throw new Error(`Vidéo du hero introuvable : ${slug}`)
  return clip
})

/** Hero sur téléphone : toutes les vidéos verticales, dans l'ordre du classement. */
export const heroPortrait: Clip[] = [
  portrait('reception-noir-argent', 'Réception en noir et argent', 0.3, 58),
  portrait('allee-fleurie', 'Allée fleurie', 0.2, 10),
  portrait('anniversaire-jungle', 'Anniversaire jungle', 0.2, 56),
  portrait('anniversaire-princesse', 'Anniversaire de princesse', 0.3, 60),
  portrait('mariage-violet', 'Mariage en violet', 0.2, 70.6),
  portrait('ceremonie-tapis-rouge', 'Cérémonie sur tapis rouge', 0.2, 56),
  portrait('mariage-fanny-adolphe', 'Mariage de Fanny et Adolphe', 0.3, 64.6),
  portrait('reception-chaises-dorees', 'Réception aux chaises dorées', 0.2, 56),
  // Filigranes de tiers : en fin de liste, malgré une bonne netteté pour la première.
  // Logo de l'application de montage CapCut, en haut à droite de toute la vidéo. On
  // commence à 1 s, après le grand logo d'ouverture, et on s'arrête avant les plans
  // d'écran d'ordinateur de la fin.
  portrait('seminaire-entreprise', "Événement d'entreprise", 1, 25),
  // Nom et numéro du décorateur incrustés en haut de l'image.
  portrait('anniversaire-baby-boss', 'Anniversaire Baby Boss', 0.2, 39.6),
  portrait('mariage-vert-blanc', 'Mariage en vert et blanc', 0.2, 35.5),
]
