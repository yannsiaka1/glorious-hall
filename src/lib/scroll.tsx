import Lenis from 'lenis'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { handleKeydown, handleVirtualScroll, registerZone, type StepZone } from './steps'

const LenisContext = createContext<Lenis | null>(null)

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    let instance: Lenis | null = null
    instance = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      // Le doigt passe aussi par Lenis : les étapes (une page par glissé)
      // fonctionnent de la même façon au téléphone qu'à la souris.
      syncTouch: true,
      syncTouchLerp: 0.09,
      touchInertiaExponent: 1.6,
      virtualScroll: (data) => handleVirtualScroll(data as never, instance),
    })
    let frame = 0
    const raf = (time: number) => {
      instance?.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)
    const onKey = (e: KeyboardEvent) => handleKeydown(e, instance)
    window.addEventListener('keydown', onKey)
    setLenis(instance)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('keydown', onKey)
      instance?.destroy()
      instance = null
      setLenis(null)
    }
  }, [])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}

export function useLenis() {
  return useContext(LenisContext)
}

/** Défile vers un id de section ou une position absolue (durée bornée, comme Precious). */
export function useScrollTo() {
  const lenis = useContext(LenisContext)
  return (target: string | number, offset = 0) => {
    const el = typeof target === 'string' ? document.getElementById(target) : null
    const margin = el ? parseFloat(getComputedStyle(el).scrollMarginTop) || 0 : 0
    const y = typeof target === 'number' ? target : (el?.getBoundingClientRect().top ?? 0) + window.scrollY - margin
    const top = Math.max(0, y + offset)
    if (lenis) {
      const distance = Math.abs(top - lenis.scroll)
      lenis.scrollTo(top, { duration: Math.min(1.6, Math.max(0.6, distance / 2400)), force: true })
    } else window.scrollTo({ top, behavior: 'smooth' })
  }
}

/** Enregistre une zone de défilement par étapes pendant la vie du composant. */
export function useStepZone(zone: StepZone, enabled = true) {
  useEffect(() => {
    if (!enabled) return
    return registerZone(zone)
    // La zone lit le DOM à chaque événement : pas besoin de la réenregistrer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zone.id, enabled])
}
