import { motion, type HTMLMotionProps } from 'motion/react'
import type { ReactNode } from 'react'

type Props = HTMLMotionProps<'div'> & { delay?: number; y?: number; x?: number; blur?: boolean }

/** Apparition douce à l'entrée dans le viewport (une seule fois). */
export function Reveal({ delay = 0, y = 28, x = 0, blur = true, children, ...rest }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y, x, filter: blur ? 'blur(8px)' : 'blur(0px)' }}
      whileInView={{ opacity: 1, y: 0, x: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.95, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

/** Ligne de titre qui glisse depuis un masque (le parent est observé, pas l'enfant masqué). */
export function MaskLine({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.span
      className={`block overflow-hidden pb-[0.1em] ${className}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
    >
      <motion.span
        className="block"
        variants={{ hidden: { y: '110%' }, show: { y: '0%' } }}
        transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </motion.span>
  )
}
