import reception from './assets/img/reception.webp'
import mariageScene from './assets/img/mariage-scene.webp'
import ceremonie from './assets/img/ceremonie-exterieur.webp'
import oiseaux from './assets/img/oiseaux-cristal.webp'
import anniversaire from './assets/img/anniversaire.webp'
import monogrammeNoir from './assets/img/monogramme-noir.webp'
import video1 from './assets/img/video-1.webp'
import video2 from './assets/img/video-2.webp'
import video3 from './assets/img/video-3.webp'
import video4 from './assets/img/video-4.webp'

/* ---------------------------------------------------------------------------
 * Coordonnées : reprises du site de référence (glorioushall.com)
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
  address: 'Bonamoussadi, Carrefour Témoin, entrée après celle du Yapaki Prestique, Douala',
  mapsLink: 'https://www.google.com/maps/search/?api=1&query=Carrefour+T%C3%A9moin+Bonamoussadi+Douala',
  mapsEmbed: 'https://www.google.com/maps?q=Carrefour+T%C3%A9moin+Bonamoussadi+Douala&z=16&output=embed',
}

/** Laisser vide tant qu'il n'y a pas de vidéo : le bouton lecture ouvre alors la galerie. */
export const heroVideo = ''

export const nav = [
  { id: 'accueil', label: 'Accueil' },
  { id: 'services', label: 'Nos services' },
  { id: 'galerie', label: 'Galerie' },
  { id: 'a-propos', label: 'À propos' },
  { id: 'avis', label: 'Avis' },
  { id: 'contact', label: 'Contact' },
] as const

export const heroSlides = [
  { src: reception, alt: 'Salle de réception Glorious Hall dressée en blanc, bleu et or' },
  { src: mariageScene, alt: 'Table des mariés en orange et or sur la terrasse extérieure' },
  { src: ceremonie, alt: 'Allée de cérémonie fleurie en orange et blanc' },
  { src: anniversaire, alt: 'Salle décorée en lavande pour un premier anniversaire' },
]

export const heroStats = [
  { icon: 'users', value: '500', label: 'invités' },
  { icon: 'pin', value: 'Douala,', label: 'Bonamoussadi' },
  { icon: 'calendar', value: '+100', label: 'événements' },
  { icon: 'speaker', value: 'Sonorisation', label: 'intégrée' },
  { icon: 'gem', value: 'Modernité', label: 'wifi, clim, cuisine' },
] as const

export const included = [
  { icon: 'wind', label: 'Salle climatisée' },
  { icon: 'zap', label: 'Groupe électrogène' },
  { icon: 'shield', label: 'Agents de sécurité' },
  { icon: 'headphones', label: 'DJ & sonorisation' },
  { icon: 'soup', label: 'Cuisine moderne' },
] as const

export const options = [
  { icon: 'flower', label: 'Décoration' },
  { icon: 'chef', label: 'Service traiteur' },
  { icon: 'wine', label: 'Boissons' },
  { icon: 'mic', label: 'Maître de cérémonie' },
  { icon: 'video', label: 'Couverture médiatique' },
  { icon: 'user', label: 'Hôtesses & filles de salle' },
] as const

/** Les mots entre [crochets] sont mis en doré. */
export type ServiceSlide = {
  key: string
  caption: string
  captionSub: string
  image: string
  imageAlt: string
  imageFit?: 'cover' | 'contain'
  title: string[]
  text: string
  points: string[]
  pointsBg: string
}

export const services: ServiceSlide[] = [
  {
    key: 'decoration',
    caption: 'Décoration',
    captionSub: 'Intérieur & extérieur',
    image: oiseaux,
    imageAlt: 'Oiseaux de cristal suspendus sous un plafond cerclé d’or',
    title: ['Des [décorations] qui', 'donnent vie à l’[imagination].'],
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
    captionSub: '500 places assises · intérieur + extérieur',
    image: mariageScene,
    imageAlt: 'Table d’honneur des mariés avec fauteuils dorés et drapé orange',
    title: ['Un cadre de [célébration]', 'de [mariage]', 'digne des [romans].'],
    text: 'Pourquoi choisir entre un mariage en extérieur ou un mariage en intérieur quand vous pouvez avoir les deux ? Appelez-nous !',
    points: [
      'Faire la mairie dans votre cadre',
      'Un grand espace extérieur',
      'Une grande salle pour vos convives',
      'Confort maximal',
    ],
    pointsBg: ceremonie,
  },
  {
    key: 'anniversaire',
    caption: 'Anniversaire',
    captionSub: '500 places assises · intérieur + extérieur',
    image: anniversaire,
    imageAlt: 'Décor papillons lavande pour un premier anniversaire',
    title: ['Un espace qui nous permet', 'de [célébrer] ceux', 'qui [comptent] vraiment.'],
    text: 'Premier anniversaire, fête surprise ou grand jubilé : nous habillons la salle à l’image de la personne que vous célébrez.',
    points: [
      'Château gonflable et aire de jeux aménageable',
      'Un grand espace extérieur',
      'Une grande salle pour vos convives',
      'Confort maximal',
    ],
    pointsBg: anniversaire,
  },
  {
    key: 'seminaires',
    caption: 'Séminaires & réunions',
    captionSub: 'Salle intérieure + sono',
    image: reception,
    imageAlt: 'Salle intérieure climatisée et sonorisée',
    title: ['Un cadre [professionnel]', 'pour vos [rencontres]', 'qui comptent.'],
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
    captionSub: 'Service clés en main',
    image: monogrammeNoir,
    imageAlt: 'Monogramme Glorious Hall',
    imageFit: 'contain',
    title: ['Une organisation', 'de [clés] en [main].'],
    text: 'Faites-nous part de vos rêves et voyez-les se réaliser, pour votre plus grand bonheur.',
    points: ['Organisation', 'Salle modulable selon vos besoins', 'Décoration', '0 % stress, 100 % plaisir'],
    pointsBg: oiseaux,
  },
]

export type GalleryCategory = 'Mariage' | 'Anniversaire' | 'Extérieur' | 'Décoration'
export const galleryFilters: ('Tous' | GalleryCategory)[] = [
  'Tous',
  'Mariage',
  'Anniversaire',
  'Extérieur',
  'Décoration',
]

export const gallery: { src: string; alt: string; category: GalleryCategory }[] = [
  { src: oiseaux, alt: 'Oiseaux de cristal au plafond', category: 'Décoration' },
  { src: video1, alt: 'Allée fleurie avec portraits des mariés', category: 'Décoration' },
  { src: video2, alt: 'Table d’honneur fleurie de blanc', category: 'Mariage' },
  { src: video3, alt: 'Salle dressée en rose pour un anniversaire', category: 'Anniversaire' },
  { src: video4, alt: 'Centres de table fleuris en extérieur', category: 'Extérieur' },
  { src: mariageScene, alt: 'Table des mariés en extérieur', category: 'Mariage' },
  { src: reception, alt: 'Réception blanc, bleu et or', category: 'Mariage' },
  { src: anniversaire, alt: 'Premier anniversaire thème papillons', category: 'Anniversaire' },
  { src: ceremonie, alt: 'Cérémonie en plein air orange et blanc', category: 'Extérieur' },
]

export const aboutStats = [
  { value: 320, suffix: '+', label: 'Places' },
  { value: 2, suffix: '', label: 'Espaces' },
  { value: 100, suffix: ' %', label: 'Climatisé' },
  { value: 100, suffix: '+', label: 'Événements' },
]

/** À remplacer par de vrais avis Google (le carrousel s'adapte au nombre d'avis). */
export const testimonials = [
  {
    quote:
      'Une révélation. J’ai redécouvert la salle sur internet et leur équipe a sublimé mon mariage par un savoir-faire d’exception. Glorious Hall n’est pas une marque, c’est un art de vivre.',
    author: 'Camille Verrier',
    source: 'Avis Google',
  },
]
