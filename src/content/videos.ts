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

export const galerie: VideoGalerie[] = [
  paysage('mariage-vert-or', 'Mariage vert et or', 'Mariage', 0.4, 43.6),
  paysage('mariage-cerapis-joel', 'Mariage de Cérapis et Joël', 'Mariage', 0.3, 49.5),
  paysage('mariage-mairie', 'Mariage civil sur place', 'Mariage', 0.3, 85.5),
  paysage('anniversaire-60-ans', 'Anniversaire des 60 ans', 'Anniversaire', 0.3, 45),
  paysage('anniversaire-papillons', 'Anniversaire papillons', 'Anniversaire', 0.3, 53.4),
  paysage('anniversaire-rose', 'Anniversaire en rose', 'Anniversaire', 0.3, 50),
  paysage('ceremonie-exterieure', 'Cérémonie en extérieur', 'Extérieur', 0.3, 61),
  paysage('soiree-exterieure', 'Soirée sous chapiteau', 'Extérieur', 0.3, 41.6),
  paysage('reception-jardin', 'Réception au jardin', 'Extérieur', 0.3, 37.6),
  paysage('deco-fleurs', 'Décoration florale', 'Décoration', 0.3, 41.8),
  paysage('salle-doree', 'La salle et ses dorures', 'Décoration', 0.3, 43.6),
]

export const filtresGalerie = ['Tous', 'Mariage', 'Anniversaire', 'Extérieur', 'Décoration'] as const
export type FiltreGalerie = (typeof filtresGalerie)[number]

/** Hero sur ordinateur : les plans horizontaux les plus larges et lumineux. */
export const heroPaysage: Clip[] = ['mariage-vert-or', 'soiree-exterieure', 'deco-fleurs', 'ceremonie-exterieure'].map(
  (slug) => {
    const clip = galerie.find((video) => video.slug === slug)
    if (!clip) throw new Error(`Vidéo du hero introuvable : ${slug}`)
    return clip
  },
)

/** Hero sur téléphone : les vidéos verticales « 1 » et « 2 » d'abord, puis les autres. */
export const heroPortrait: Clip[] = [
  portrait('anniversaire-baby-boss', 'Anniversaire Baby Boss', 0.2, 39.6),
  portrait('mariage-vert-blanc', 'Mariage en vert et blanc', 0.2, 35.5),
  portrait('mariage-violet', 'Mariage en violet', 0.2, 70.6),
  portrait('ceremonie-tapis-rouge', 'Cérémonie sur tapis rouge', 0.2, 56),
  portrait('mariage-fanny-adolphe', 'Mariage de Fanny et Adolphe', 0.3, 64.6),
  portrait('reception-chaises-dorees', 'Réception aux chaises dorées', 0.2, 56),
  portrait('allee-fleurie', 'Allée fleurie', 0.2, 10),
  portrait('anniversaire-jungle', 'Anniversaire jungle', 0.2, 56),
  portrait('anniversaire-princesse', 'Anniversaire de princesse', 0.3, 60),
]
