import Lenis from 'lenis'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

const LenisContext = createContext<Lenis | null>(null)

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    // Défilement natif si l'utilisateur préfère réduire les animations
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const instance = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 0.9 })
    let frame = 0
    const raf = (time: number) => {
      instance.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)
    setLenis(instance)
    return () => {
      cancelAnimationFrame(frame)
      instance.destroy()
      setLenis(null)
    }
  }, [])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}

/** Défile vers un id de section ou une position absolue en pixels. */
export function useScrollTo() {
  const lenis = useContext(LenisContext)
  return (target: string | number, offset = 0) => {
    const y =
      typeof target === 'number'
        ? target
        : (document.getElementById(target)?.getBoundingClientRect().top ?? 0) + window.scrollY
    if (lenis) lenis.scrollTo(y + offset, { duration: 1.4 })
    else window.scrollTo({ top: y + offset, behavior: 'smooth' })
  }
}

export function useLenis() {
  return useContext(LenisContext)
}
