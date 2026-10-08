import type { NomIcone } from '@/components/ui/Icon'

/**
 * Ce que propose la salle : capacité, atouts, prestations incluses et options.
 *
 * La capacité est déclarée une seule fois : le hero, les légendes des services,
 * les cartes « À propos » et les données structurées en dérivent.
 */

export const capacite = {
  interieur: 120,
  exterieur: 200,
} as const

export const capaciteTotale = capacite.interieur + capacite.exterieur

/** Barre d'atouts en bas du hero. */
export const atoutsHero: { icone: NomIcone; valeur: string; libelle: string }[] = [
  { icone: 'invites', valeur: String(capaciteTotale), libelle: 'invités' },
  { icone: 'repere', valeur: 'Douala,', libelle: 'Bonamoussadi' },
  { icone: 'calendrier', valeur: '+100', libelle: 'événements' },
  { icone: 'sono', valeur: 'Sonorisation', libelle: 'intégrée' },
  { icone: 'diamant', valeur: 'Modernité', libelle: 'wifi, clim, cuisine' },
]

/**
 * Prestations de la section 2. Les libellés sur deux lignes reprennent les
 * coupures de la maquette.
 */
export type Prestation = { icone: NomIcone; libelle: readonly string[] }

export const inclus: Prestation[] = [
  { icone: 'clim', libelle: ['Salle', 'climatisée'] },
  { icone: 'eclair', libelle: ['Groupe', 'électrogène'] },
  { icone: 'agent', libelle: ['Agents', 'de sécurité'] },
  { icone: 'dj', libelle: ['DJ &', 'sonorisation'] },
  { icone: 'louche', libelle: ['Cuisine', 'moderne'] },
]

export const options: Prestation[] = [
  { icone: 'coeur', libelle: ['Décoration'] },
  { icone: 'toque', libelle: ['Service', 'traiteur'] },
  { icone: 'cocktail', libelle: ['Boissons'] },
  { icone: 'micro', libelle: ['Maître de', 'cérémonie'] },
  { icone: 'media', libelle: ['Couverture', 'médiatique'] },
  { icone: 'hotesse', libelle: ['Hôtesses', '& filles de salle'] },
]

/** Cartes chiffrées de la section « À propos ». */
export const chiffres = [
  { valeur: capacite.interieur, suffixe: '', libelle: 'Places intérieures' },
  { valeur: capacite.exterieur, suffixe: '', libelle: 'Places extérieures' },
  { valeur: 2, suffixe: '', libelle: 'Espaces' },
  { valeur: 100, suffixe: ' %', libelle: 'Climatisé' },
  { valeur: 100, suffixe: '+', libelle: 'Événements' },
]
