import { motion, type HTMLMotionProps } from 'motion/react'
import type { ReactNode } from 'react'
import { EASE } from '@/lib/animation'

type Props = HTMLMotionProps<'div'> & {
  delai?: number
  y?: number
  x?: number
  flou?: boolean
}

/**
 * Apparition douce à l'entrée dans l'écran (une seule fois).
 * `data-reveal` permet à la règle <noscript> d'index.html de tout afficher
 * quand JavaScript est désactivé.
 */
export function Reveal({ delai = 0, y = 28, x = 0, flou = true, children, ...props }: Props) {
  return (
    <motion.div
      data-reveal
      initial={{ opacity: 0, y, x, filter: flou ? 'blur(8px)' : 'blur(0px)' }}
      whileInView={{ opacity: 1, y: 0, x: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.95, delay: delai, ease: EASE }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

/**
 * Ligne de titre qui monte depuis un masque. L'observateur est posé sur le
 * parent : un élément entièrement masqué n'est jamais considéré « visible ».
 */
export function MaskLine({
  children,
  delai = 0,
  className = '',
}: {
  children: ReactNode
  delai?: number
  className?: string
}) {
  return (
    <motion.span
      className={`block overflow-hidden pb-[0.1em] ${className}`}
      initial="cache"
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
    >
      <motion.span
        data-reveal
        className="block"
        variants={{ cache: { y: '110%' }, visible: { y: '0%' } }}
        transition={{ duration: 1, delay: delai, ease: EASE }}
      >
        {children}
      </motion.span>
    </motion.span>
  )
}
