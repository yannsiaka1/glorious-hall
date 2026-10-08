import { useSyncExternalStore } from 'react'

/**
 * Suit une requête média CSS (`(orientation: portrait)`, `(min-width: 1024px)`…).
 *
 * Renvoie `null` pendant le prérendu et l'hydratation : le serveur ne connaît
 * pas l'écran. Le composant affiche alors une version neutre, puis la bonne
 * version dès que le navigateur a répondu.
 */
export function useMediaQuery(requete: string): boolean | null {
  return useSyncExternalStore(
    (onChange) => {
      const liste = window.matchMedia(requete)
      liste.addEventListener('change', onChange)
      return () => liste.removeEventListener('change', onChange)
    },
    () => window.matchMedia(requete).matches,
    () => null,
  )
}
