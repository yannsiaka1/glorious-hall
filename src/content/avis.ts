/**
 * Avis affichés dans la section « Leurs avis ».
 *
 * ⚠ AVIS D'EXEMPLE — à remplacer par de vrais avis de clients (Google, Facebook,
 * WhatsApp), avec leur accord. Ils servent à mettre la navigation en place et
 * sont signalés comme exemples à l'écran (`source`) tant qu'ils restent là.
 * Le carrousel s'adapte au nombre d'avis : on en ajoute ou retire librement.
 */
export type Avis = {
  citation: string
  auteur: string
  source: string
}

const EXEMPLE = 'Avis d’exemple, à remplacer'

export const avis: Avis[] = [
  {
    citation:
      'Une révélation. J’ai découvert la salle sur internet et leur équipe a sublimé mon mariage par un savoir-faire d’exception. Glorious Hall n’est pas une marque, c’est un art de vivre.',
    auteur: 'Mariage',
    source: EXEMPLE,
  },
  {
    citation:
      'Nous avions peur de manquer de place : la salle et le jardin ont accueilli tout le monde sans difficulté, et la décoration était exactement celle de nos croquis.',
    auteur: 'Anniversaire',
    source: EXEMPLE,
  },
  {
    citation:
      'Climatisation, sonorisation, groupe électrogène : tout a fonctionné du début à la fin de notre séminaire. Une équipe réactive et attentionnée.',
    auteur: 'Séminaire',
    source: EXEMPLE,
  },
  {
    citation:
      'De la mairie sur place jusqu’à la soirée dansante, nous n’avons eu à nous occuper de rien. Nos invités en parlent encore.',
    auteur: 'Mariage civil',
    source: EXEMPLE,
  },
  {
    citation:
      'Un cadre élégant, un accueil chaleureux et une organisation sans fausse note pour le baptême de notre fils.',
    auteur: 'Baptême',
    source: EXEMPLE,
  },
]
