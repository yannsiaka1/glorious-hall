import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { Video } from '../content'
import { useLenis } from '../lib/scroll'

type Props = {
  items: Video[]
  index: number | null
  onChange: (i: number | null) => void
}

/** Visionneuse plein écran : vidéo complète avec le son, navigation au clavier. */
export function Lightbox({ items, index, onChange }: Props) {
  const lenis = useLenis()
  const closeRef = useRef<HTMLButtonElement>(null)
  const open = index !== null && items.length > 0

  useEffect(() => {
    if (!open) return
    lenis?.stop()
    const prevFocus = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onChange(null)
      if (e.key === 'ArrowRight') onChange(((index ?? 0) + 1) % items.length)
      if (e.key === 'ArrowLeft') onChange(((index ?? 0) - 1 + items.length) % items.length)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      lenis?.start()
      prevFocus?.focus()
    }
  }, [open, index, items.length, onChange, lenis])

  const item = open ? items[index] : null

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Lecteur vidéo"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/92 p-4 backdrop-blur-md"
          onClick={() => onChange(null)}
        >
          <AnimatePresence mode="wait">
            <motion.video
              key={item.slug}
              src={item.src}
              poster={item.affiche}
              controls
              autoPlay
              playsInline
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="max-h-[78svh] w-full max-w-[min(92vw,1100px)] rounded-3xl bg-black shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </AnimatePresence>
          <p className="mt-5 text-center text-sm tracking-[0.06em] text-white/75">
            <span className="font-bold text-gold-300">{item.category}</span> · {item.titre} · {(index ?? 0) + 1} / {items.length}
          </p>
          <button
            ref={closeRef}
            onClick={() => onChange(null)}
            className="absolute right-5 top-5 grid h-12 w-12 place-items-center rounded-full border border-white/30 text-white transition hover:rotate-90 hover:border-gold-300 hover:text-gold-300"
            aria-label="Fermer"
          >
            <X />
          </button>
          {items.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onChange(((index ?? 0) - 1 + items.length) % items.length)
                }}
                className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-gold-300 hover:text-ink sm:left-6"
                aria-label="Vidéo précédente"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onChange(((index ?? 0) + 1) % items.length)
                }}
                className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-gold-300 hover:text-ink sm:right-6"
                aria-label="Vidéo suivante"
              >
                <ChevronRight />
              </button>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
