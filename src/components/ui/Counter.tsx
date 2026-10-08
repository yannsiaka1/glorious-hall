import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from 'motion/react'
import { useEffect, useLayoutEffect, useRef } from 'react'

// useLayoutEffect n'existe pas au prérendu : on retombe sur useEffect côté serveur.
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

/**
 * Nombre qui défile de 0 à sa valeur quand il apparaît à l'écran.
 *
 * Le prérendu affiche la valeur finale (lisible par les moteurs de recherche
 * et sans JavaScript) ; dans le navigateur, le compteur repart de 0 avant la
 * première peinture, puis s'anime à son entrée dans l'écran.
 */
export function Counter({ valeur, suffixe = '' }: { valeur: number; suffixe?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const visible = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  const reduit = useReducedMotion()
  const compte = useMotionValue(valeur)
  const arrondi = useTransform(compte, (v) => Math.round(v))

  useIsomorphicLayoutEffect(() => {
    if (!reduit) compte.set(0)
  }, [compte, reduit])

  useEffect(() => {
    if (!visible || reduit) return
    const animation = animate(compte, valeur, { duration: 2.2, ease: [0.16, 1, 0.3, 1] })
    return () => animation.stop()
  }, [compte, visible, valeur, reduit])

  return (
    <span ref={ref}>
      <span aria-hidden="true">
        <motion.span>{arrondi}</motion.span>
        {suffixe}
      </span>
      <span className="sr-only">
        {valeur}
        {suffixe}
      </span>
    </span>
  )
}
