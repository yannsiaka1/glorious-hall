import {
  mdiAccountGroupOutline,
  mdiAccountTieHat,
  mdiAccountVoice,
  mdiBullhorn,
  mdiCalendarBlank,
  mdiChefHat,
  mdiDiamondStone,
  mdiGlassCocktail,
  mdiHeartCircle,
  mdiHumanFemale,
  mdiLightningBoltCircle,
  mdiMapMarker,
  mdiWeatherWindy,
  mdiYoutubeSubscription,
} from '@mdi/js'
import { useId, type ReactNode } from 'react'

/** Pictogrammes repris du jeu Material Design Icons (pleins, comme sur la maquette). */
const TRACES = {
  agent: mdiAccountTieHat,
  calendrier: mdiCalendarBlank,
  cocktail: mdiGlassCocktail,
  coeur: mdiHeartCircle,
  diamant: mdiDiamondStone,
  eclair: mdiLightningBoltCircle,
  hotesse: mdiHumanFemale,
  invites: mdiAccountGroupOutline,
  media: mdiYoutubeSubscription,
  micro: mdiAccountVoice,
  sono: mdiBullhorn,
  toque: mdiChefHat,
} as const

/** Pictogrammes dessinés pour le site, absents du jeu standard. */
type Dessine = 'clim' | 'dj' | 'louche' | 'repere'

export type NomIcone = keyof typeof TRACES | Dessine

type Props = { nom: NomIcone; className?: string }

/** Pictogramme plein, de la couleur du texte (`currentColor`). */
export function Icon({ nom, className = '' }: Props) {
  // Identifiant unique : chaque icône à masque a besoin du sien dans la page.
  const masque = `masque-${useId().replace(/:/g, '')}`
  const svg = (contenu: ReactNode) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" className={className}>
      {contenu}
    </svg>
  )

  switch (nom) {
    // Carré plein, souffle d'air évidé (climatisation)
    case 'clim':
      return svg(
        <>
          <mask id={masque}>
            <rect width="24" height="24" fill="white" />
            <path d={mdiWeatherWindy} fill="black" transform="translate(3.6 3.6) scale(0.7)" />
          </mask>
          <rect x="1.5" y="1.5" width="21" height="21" rx="1.6" mask={`url(#${masque})`} />
        </>,
      )
    // Repère plein avec un cœur évidé
    case 'repere':
      return svg(
        <>
          <mask id={masque}>
            <rect width="24" height="24" fill="white" />
            <path
              fill="black"
              d="M12 12.6l-.55-.5C9.5 10.36 8.2 9.2 8.2 7.78c0-1.15.9-2.05 2.05-2.05.65 0 1.27.3 1.67.78.4-.48 1.02-.78 1.67-.78 1.15 0 2.05.9 2.05 2.05 0 1.42-1.3 2.58-3.25 4.33l-.4.47z"
            />
          </mask>
          <path d={mdiMapMarker} mask={`url(#${masque})`} />
        </>,
      )
    // Personnage au casque derrière une console à deux platines
    case 'dj':
      return svg(
        <>
          <circle cx="12" cy="6.4" r="2.9" />
          <path d="M7.3 7.6a4.7 4.7 0 0 1 9.4 0" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <rect x="6.2" y="6.6" width="2.1" height="3.3" rx="1" />
          <rect x="15.7" y="6.6" width="2.1" height="3.3" rx="1" />
          <path d="M7.4 13.2c.4-1.9 2.3-3.1 4.6-3.1s4.2 1.2 4.6 3.1z" />
          <path
            fillRule="evenodd"
            d="M4.4 13.8h15.2l2.3 7.7H2.1zM8.7 15.5a2 2 0 1 0 0 4a2 2 0 1 0 0-4zm6.6 0a2 2 0 1 0 0 4a2 2 0 1 0 0-4z"
          />
        </>,
      )
    // Louche fumante (cuisine)
    case 'louche':
      return svg(
        <>
          <path d="M1.8 12.2h11.6a5.8 5.8 0 0 1-11.6 0z" />
          <path
            d="M12.9 12.9c2.6.1 3.9-1.6 4.4-3.8l1.25-5.4a1.15 1.15 0 0 1 2.2.55l-.3 1.3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <path
            d="M4.4 9.8c-.9-1 .9-2 0-3.1s.9-2.1 0-3.1M7.5 9.8c-.9-1 .9-2 0-3.1s.9-2.1 0-3.1M10.6 9.8c-.9-1 .9-2 0-3.1s.9-2.1 0-3.1"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
        </>,
      )
    default:
      return svg(<path d={TRACES[nom]} />)
  }
}
