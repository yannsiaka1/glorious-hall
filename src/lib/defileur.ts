import type Lenis from 'lenis'
import { createContext, useContext, useEffect, useRef } from 'react'
import { enregistrerZone, type Zone } from './steps'

/**
 * Accès au défilement de la page depuis les composants.
 *
 * Le « défileur » est stable : les composants l'appellent au moment d'agir
 * (clic, ouverture d'une fenêtre), sans se rafraîchir quand l'instance de
 * Lenis est créée. Il est fourni par <SmoothScroll>.
 */
export type Defileur = {
  /** Instance active, ou `null` avant le montage. */
  lenis: () => Lenis | null
  /** Défile vers une section (son id) ou vers une position en pixels. */
  allerA: (cible: string | number) => void
  /** Bloque le défilement de la page (fenêtre modale ouverte). */
  bloquer: () => void
  /** Rétablit le défilement de la page. */
  debloquer: () => void
}

export const DefileurContext = createContext<Defileur | null>(null)

export function useDefileur(): Defileur {
  const defileur = useContext(DefileurContext)
  if (!defileur) throw new Error('useDefileur doit être utilisé dans <SmoothScroll>.')
  return defileur
}

/**
 * Enregistre une zone de défilement par étapes pendant la vie du composant.
 * La zone est relue à chaque geste : ses arrêts suivent la mise en page.
 */
export function useZoneEtapes(zone: Zone): void {
  const derniere = useRef(zone)

  useEffect(() => {
    derniere.current = zone
  })

  useEffect(
    () =>
      enregistrerZone({
        id: zone.id,
        arrets: () => derniere.current.arrets(),
        surEtape: (index) => derniere.current.surEtape?.(index),
      }),
    [zone.id],
  )
}
