import anniversaire from '@/assets/img/anniversaire.webp'
import logoSombre from '@/assets/img/logo-sombre.webp'
import mariageScene from '@/assets/img/mariage-scene.webp'
import oiseaux from '@/assets/img/oiseaux-cristal.webp'
import reception from '@/assets/img/reception.webp'
import seminaire from '@/assets/img/seminaire.webp'
import { capacite } from './offre'

/**
 * Diapositives de la section « Nos services » (une par cran de défilement).
 *
 * - Les mots entre [crochets] sont mis en doré.
 * - `retraits` décale chaque ligne du titre (en em), comme sur la maquette.
 * - `fondListe` est la photo floutée derrière la liste à puces.
 */
export type Service = {
  cle: string
  legende: string
  sousLegende: readonly string[]
  image: string
  descriptionImage: string
  /** `contain` pour un visuel à ne pas recadrer (le logo). */
  cadrage?: 'cover' | 'contain'
  titre: readonly string[]
  retraits: readonly number[]
  texte: string
  points: readonly string[]
  fondListe: string
}

const places = [`${capacite.interieur} places intérieures`, `${capacite.exterieur} places extérieures`]

export const services: Service[] = [
  {
    cle: 'decoration',
    legende: 'Décoration',
    sousLegende: ['Intérieur & extérieur'],
    image: oiseaux,
    descriptionImage: 'Oiseaux de cristal suspendus sous un plafond cerclé d’or',
    titre: ['Des [décorations] qui', 'donnent vie à l’[imagination].'],
    retraits: [0, 0],
    texte: 'Que ce soit pour un mariage, un séminaire ou une baby shower, nous vous offrons ce dont vous rêvez.',
    points: [
      'Habillage de la salle et du mobilier',
      'Décoration des tables',
      'Respect du thème et des couleurs',
      'Choix de la vaisselle',
    ],
    fondListe: reception,
  },
  {
    cle: 'mariage',
    legende: 'Mariage',
    sousLegende: places,
    image: mariageScene,
    descriptionImage: 'Table d’honneur des mariés avec fauteuils dorés et drapé orange',
    titre: ['Un cadre de [célébration]', 'de [mariage]', 'digne des [romans].'],
    retraits: [0, 2.5, 3.8],
    texte:
      'Pourquoi choisir entre un mariage en extérieur et un mariage en intérieur quand vous pouvez avoir les deux ? Appelez-nous !',
    points: [
      'Faire la mairie dans votre cadre',
      'Un grand espace extérieur',
      'Une grande salle pour vos convives',
      'Confort maximal',
    ],
    fondListe: oiseaux,
  },
  {
    cle: 'anniversaire',
    legende: 'Anniversaire',
    sousLegende: places,
    image: anniversaire,
    descriptionImage: 'Décor papillons lavande pour un premier anniversaire',
    titre: ['Un espace qui nous permet', 'de [célébrer] ceux', 'qui [comptent] vraiment.'],
    retraits: [0, 1.9, 0.3],
    texte:
      'Premier anniversaire, fête surprise ou grand jubilé : nous habillons la salle à l’image de la personne que vous célébrez.',
    points: [
      'Château gonflable et aire de jeux aménageable',
      'Un grand espace extérieur',
      'Une grande salle pour vos convives',
      'Confort maximal',
    ],
    fondListe: oiseaux,
  },
  {
    cle: 'seminaires',
    legende: 'Séminaires & réunions',
    sousLegende: ['Salle intérieure + sono'],
    image: seminaire,
    descriptionImage:
      'Salle en configuration séminaire : rangées de chaises blanches face à l’estrade et au grand écran',
    titre: ['Un cadre [professionnel]', 'pour vos [rencontres]', 'qui comptent.'],
    retraits: [0, 1.9, 0.3],
    texte: 'Conférences, formations ou lancements : une salle sonorisée, climatisée et alimentée en continu.',
    points: [
      'Salle intérieure parfaitement sonorisée',
      'Groupe électrogène disponible',
      'Zone accessible',
      'Confort maximal',
    ],
    fondListe: oiseaux,
  },
  {
    cle: 'cles-en-main',
    legende: 'On fait tout pour vous !',
    sousLegende: ['Service clés en main'],
    image: logoSombre,
    descriptionImage: 'Logo Glorious Hall',
    cadrage: 'contain',
    titre: ['Une organisation', 'de [clés] en [main].'],
    retraits: [0, 1.9],
    texte: 'Faites-nous part de vos rêves et voyez-les se réaliser, pour votre plus grand bonheur.',
    points: ['Organisation', 'Salle modulable selon vos besoins', 'Décoration', '0 % stress, 100 % plaisir'],
    fondListe: oiseaux,
  },
]
