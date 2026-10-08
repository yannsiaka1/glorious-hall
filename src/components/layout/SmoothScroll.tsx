import Lenis from 'lenis'
import { useEffect, useMemo, useRef, type ReactNode } from 'react'
import { DefileurContext, type Defileur } from '@/lib/defileur'
import { gererClavier, gererDefilement, hautDansDocument } from '@/lib/steps'

/**
 * Position à atteindre pour une section. Une section « collante » (le hero) se
 * lit à la position de son conteneur : une fois la page défilée, sa position
 * apparente est celle où elle reste collée, et non son emplacement réel.
 */
function positionDeSection(id: string): number | null {
  const section = document.getElementById(id)
  if (!section) return null
  const style = getComputedStyle(section)
  const reference = style.position === 'sticky' ? (section.parentElement ?? section) : section
  return hautDansDocument(reference) - (parseFloat(style.scrollMarginTop) || 0)
}

/**
 * Défilement fluide (Lenis) et défilement par étapes pour toute la page.
 * Le réglage « réduire les animations » du système est respecté par Lenis.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const instance = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis: Lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      // Le doigt passe aussi par Lenis : les étapes (un glissé = une étape)
      // se comportent de la même façon au téléphone qu'à la souris.
      syncTouch: true,
      syncTouchLerp: 0.09,
      touchInertiaExponent: 1.6,
      virtualScroll: (donnees): boolean => gererDefilement(donnees, lenis),
    })
    instance.current = lenis

    let image = 0
    const animer = (temps: number) => {
      lenis.raf(temps)
      image = requestAnimationFrame(animer)
    }
    image = requestAnimationFrame(animer)

    const surTouche = (evenement: KeyboardEvent) => gererClavier(evenement, lenis)
    window.addEventListener('keydown', surTouche)

    return () => {
      cancelAnimationFrame(image)
      window.removeEventListener('keydown', surTouche)
      lenis.destroy()
      instance.current = null
    }
  }, [])

  const defileur = useMemo<Defileur>(
    () => ({
      lenis: () => instance.current,
      allerA: (cible) => {
        const y = typeof cible === 'number' ? cible : positionDeSection(cible)
        if (y === null) return
        const haut = Math.max(0, y)
        const lenis = instance.current
        if (!lenis) {
          window.scrollTo({ top: haut, behavior: 'smooth' })
          return
        }
        // Durée bornée, comme sur Precious : un long trajet ne traîne pas.
        const distance = Math.abs(haut - lenis.scroll)
        lenis.scrollTo(haut, { duration: Math.min(1.6, Math.max(0.6, distance / 2400)), force: true })
      },
      bloquer: () => instance.current?.stop(),
      debloquer: () => instance.current?.start(),
    }),
    [],
  )

  return <DefileurContext.Provider value={defileur}>{children}</DefileurContext.Provider>
}
