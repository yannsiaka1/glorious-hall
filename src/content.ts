import reception from './assets/img/reception.webp'
import mariageScene from './assets/img/mariage-scene.webp'
import oiseaux from './assets/img/oiseaux-cristal.webp'
import anniversaire from './assets/img/anniversaire.webp'
import logoSombre from './assets/img/logo-sombre.webp'

/* ---------------------------------------------------------------------------
 * Coordonnées : reprises du site de référence (glorioushall.com) et des
 * génériques des vidéos officielles.
 * ------------------------------------------------------------------------- */
const WHATSAPP_NUMBER = '237640823166'
const WHATSAPP_TEXT = 'Bonjour, j’aimerais avoir plus d’informations sur vos services.'

export const contact = {
  whatsapp: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_TEXT)}`,
  phones: [
    { label: '+237 6 72 96 23 64', href: 'tel:+237672962364' },
    { label: '+237 6 40 82 31 66', href: 'tel:+237640823166' },
  ],
  email: 'info@glorioushall.com',
  address: 'Bonamoussadi, Carrefour Témoin, entrée après celle du Yapaki Prestige, Douala',
  addressShort: 'Rond-point Carrefour Témoin, entrée après celle du Yapaki Prestige.',
  mapsLink: 'https://www.google.com/maps/search/?api=1&query=Carrefour+T%C3%A9moin+Bonamoussadi+Douala',
  mapsEmbed: 'https://www.google.com/maps?q=Carrefour+T%C3%A9moin+Bonamoussadi+Douala&z=16&output=embed',
}

export const nav = [
  { id: 'accueil', label: 'Accueil' },
  { id: 'services', label: 'Nos services' },
  { id: 'galerie', label: 'Galerie' },
  { id: 'a-propos', label: 'À propos' },
  { id: 'avis', label: 'Avis' },
  { id: 'contact', label: 'Contact' },
] as const

/* ---------------------------------------------------------------------------
 * Vidéos (dossier public/videos). `fin` = seconde où commence le générique
 * de fin : le hero enchaîne la vidéo suivante à ce moment-là.
 * ------------------------------------------------------------------------- */
const BASE = import.meta.env.BASE_URL
const v = (slug: string) => ({
  src: `${BASE}videos/${slug}.mp4`,
  apercu: `${BASE}videos/apercus/${slug}.mp4`,
  affiche: `${BASE}videos/affiches/${slug}.webp`,
  afficheSmall: `${BASE}videos/affiches/${slug}-petit.webp`,
})

export type GalleryCategory = 'Mariage' | 'Anniversaire' | 'Extérieur' | 'Décoration'

export type Video = ReturnType<typeof v> & {
  slug: string
  titre: string
  category: GalleryCategory
  debut: number
  fin: number
}

type VideoMeta = Omit<Video, keyof ReturnType<typeof v>>

const meta: VideoMeta[] = [
  { slug: 'mariage-vert-or', titre: 'Mariage vert et or', category: 'Mariage', debut: 0.4, fin: 43.6 },
  { slug: 'mariage-cerapis-joel', titre: 'Mariage de Cérapis et Joël', category: 'Mariage', debut: 0.3, fin: 49.5 },
  { slug: 'mariage-mairie', titre: 'Mariage civil sur place', category: 'Mariage', debut: 0.3, fin: 85.5 },
  { slug: 'anniversaire-60-ans', titre: 'Anniversaire des 60 ans', category: 'Anniversaire', debut: 0.3, fin: 45 },
  { slug: 'anniversaire-papillons', titre: 'Anniversaire papillons', category: 'Anniversaire', debut: 0.3, fin: 53.4 },
  { slug: 'anniversaire-rose', titre: 'Anniversaire en rose', category: 'Anniversaire', debut: 0.3, fin: 50 },
  { slug: 'ceremonie-exterieure', titre: 'Cérémonie en extérieur', category: 'Extérieur', debut: 0.3, fin: 61 },
  { slug: 'soiree-exterieure', titre: 'Soirée sous chapiteau', category: 'Extérieur', debut: 0.3, fin: 41.6 },
  { slug: 'reception-jardin', titre: 'Réception au jardin', category: 'Extérieur', debut: 0.3, fin: 37.6 },
  { slug: 'deco-fleurs', titre: 'Décoration florale', category: 'Décoration', debut: 0.3, fin: 41.8 },
  { slug: 'salle-doree', titre: 'La salle et ses dorures', category: 'Décoration', debut: 0.3, fin: 43.6 },
]
const videos: Video[] = meta.map((item) => ({ ...item, ...v(item.slug) }))

export const gallery = videos

/** Ordre de lecture du hero : les plans les plus larges et lumineux. */
export const heroVideos = ['mariage-vert-or', 'soiree-exterieure', 'deco-fleurs', 'ceremonie-exterieure'].map(
  (slug) => videos.find((item) => item.slug === slug)!,
)

export const galleryBackground = {
  src: `${BASE}videos/galerie-fond.mp4`,
  affiche: `${BASE}videos/affiches/galerie-fond.webp`,
}

export const galleryFilters: ('Tous' | GalleryCategory)[] = ['Tous', 'Mariage', 'Anniversaire', 'Extérieur', 'Décoration']

export const heroStats = [
  { icon: 'users', value: '500', label: 'invités' },
  { icon: 'pin', value: 'Douala,', label: 'Bonamoussadi' },
  { icon: 'calendar', value: '+100', label: 'événements' },
  { icon: 'bullhorn', value: 'Sonorisation', label: 'intégrée' },
  { icon: 'gem', value: 'Modernité', label: 'wifi, clim, cuisine' },
] as const

/** Les libellés sur deux lignes reprennent les coupures de la maquette. */
export const included = [
  { icon: 'clim', label: ['Salle', 'climatisée'] },
  { icon: 'bolt', label: ['Groupe', 'électrogène'] },
  { icon: 'agent', label: ['Agents', 'de sécurité'] },
  { icon: 'dj', label: ['DJ &', 'sonorisation'] },
  { icon: 'ladle', label: ['Cuisine', 'moderne'] },
] as const

export const options = [
  { icon: 'heart', label: ['Décoration'] },
  { icon: 'chef', label: ['Service', 'traiteur'] },
  { icon: 'cocktail', label: ['Boissons'] },
  { icon: 'voice', label: ['Maître de', 'cérémonie'] },
  { icon: 'media', label: ['Couverture', 'médiatique'] },
  { icon: 'hostess', label: ['Hôtesses', '& filles de salle'] },
] as const

/**
 * Diapositives de la section services. Les mots entre [crochets] sont dorés ;
 * `retraits` décale chaque ligne du titre (en em), comme sur la maquette.
 */
export type ServiceSlide = {
  key: string
  caption: string
  captionLines: string[]
  image: string
  imageAlt: string
  imageFit?: 'cover' | 'contain'
  title: string[]
  retraits: number[]
  text: string
  points: string[]
  pointsBg: string
}

export const services: ServiceSlide[] = [
  {
    key: 'decoration',
    caption: 'Décoration',
    captionLines: ['Intérieur & extérieur'],
    image: oiseaux,
    imageAlt: 'Oiseaux de cristal suspendus sous un plafond cerclé d’or',
    title: ['Des [décorations] qui', 'donnent vie à l’[imagination].'],
    retraits: [0, 0],
    text: 'Que ce soit pour un mariage, un séminaire ou une baby shower, nous vous offrons ce dont vous rêvez.',
    points: [
      'Habillage de la salle et du mobilier',
      'Décoration des tables',
      'Respect du thème et des couleurs',
      'Choix de la vaisselle',
    ],
    pointsBg: reception,
  },
  {
    key: 'mariage',
    caption: 'Mariage',
    captionLines: ['120 places intérieures', '150 places extérieures'],
    image: mariageScene,
    imageAlt: 'Table d’honneur des mariés avec fauteuils dorés et drapé orange',
    title: ['Un cadre de [célébration]', 'de [mariage]', 'digne des [romans].'],
    retraits: [0, 2.5, 3.8],
    text: 'Pourquoi choisir entre un mariage en extérieur et un mariage en intérieur quand vous pouvez avoir les deux ? Appelez-nous !',
    points: [
      'Faire la mairie dans votre cadre',
      'Un grand espace extérieur',
      'Une grande salle pour vos convives',
      'Confort maximal',
    ],
    pointsBg: oiseaux,
  },
  {
    key: 'anniversaire',
    caption: 'Anniversaire',
    captionLines: ['120 places intérieures', '150 places extérieures'],
    image: anniversaire,
    imageAlt: 'Décor papillons lavande pour un premier anniversaire',
    title: ['Un espace qui nous permet', 'de [célébrer] ceux', 'qui [comptent] vraiment.'],
    retraits: [0, 1.9, 0.3],
    text: 'Premier anniversaire, fête surprise ou grand jubilé : nous habillons la salle à l’image de la personne que vous célébrez.',
    points: [
      'Château gonflable et aire de jeux aménageable',
      'Un grand espace extérieur',
      'Une grande salle pour vos convives',
      'Confort maximal',
    ],
    pointsBg: oiseaux,
  },
  {
    key: 'seminaires',
    caption: 'Séminaires & réunions',
    captionLines: ['Salle intérieure + sono'],
    image: reception,
    imageAlt: 'Salle intérieure climatisée et sonorisée',
    title: ['Un cadre [professionnel]', 'pour vos [rencontres]', 'qui comptent.'],
    retraits: [0, 1.9, 0.3],
    text: 'Conférences, formations ou lancements : une salle sonorisée, climatisée et alimentée en continu.',
    points: [
      'Salle intérieure parfaitement sonorisée',
      'Groupe électrogène disponible',
      'Zone accessible',
      'Confort maximal',
    ],
    pointsBg: oiseaux,
  },
  {
    key: 'cles-en-main',
    caption: 'On fait tout pour vous !',
    captionLines: ['Service clés en main'],
    image: logoSombre,
    imageAlt: 'Logo Glorious Hall',
    imageFit: 'contain',
    title: ['Une organisation', 'de [clés] en [main].'],
    retraits: [0, 1.9],
    text: 'Faites-nous part de vos rêves et voyez-les se réaliser, pour votre plus grand bonheur.',
    points: ['Organisation', 'Salle modulable selon vos besoins', 'Décoration', '0 % stress, 100 % plaisir'],
    pointsBg: oiseaux,
  },
]

export const aboutStats = [
  { value: 120, suffix: '', label: 'Places intérieures' },
  { value: 150, suffix: '', label: 'Places extérieures' },
  { value: 2, suffix: '', label: 'Espaces' },
  { value: 100, suffix: ' %', label: 'Climatisé' },
  { value: 100, suffix: '+', label: 'Événements' },
]

/** À remplacer par de vrais avis Google (le carrousel s'adapte au nombre d'avis). */
export const testimonials = [
  {
    quote:
      'Une révélation. J’ai découvert la salle sur internet et leur équipe a sublimé mon mariage par un savoir-faire d’exception. Glorious Hall n’est pas une marque, c’est un art de vivre.',
    author: 'Camille Verrier',
    source: 'Avis Google',
  },
]
