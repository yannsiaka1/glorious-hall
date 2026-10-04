import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useLenis } from '../lib/scroll'

export type LightboxImage = { src: string; alt: string }

type Props = {
  images: LightboxImage[]
  index: number | null
  onChange: (i: number | null) => void
}

export function Lightbox({ images, index, onChange }: Props) {
  const lenis = useLenis()
  const closeRef = useRef<HTMLButtonElement>(null)
  const open = index !== null

  useEffect(() => {
    if (!open) return
    lenis?.stop()
    const prevFocus = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onChange(null)
      if (e.key === 'ArrowRight') onChange(((index ?? 0) + 1) % images.length)
      if (e.key === 'ArrowLeft') onChange(((index ?? 0) - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      lenis?.start()
      prevFocus?.focus()
    }
  }, [open, index, images.length, onChange, lenis])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Visionneuse de photos"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          onClick={() => onChange(null)}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={images[index].src}
              src={images[index].src}
              alt={images[index].alt}
              initial={{ opacity: 0, scale: 0.94, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.03 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="max-h-[82svh] max-w-[92vw] rounded-3xl object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </AnimatePresence>
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-sm text-white/70">
            {images[index].alt} · {index + 1} / {images.length}
          </p>
          <button
            ref={closeRef}
            onClick={() => onChange(null)}
            className="absolute right-5 top-5 grid h-12 w-12 place-items-center rounded-full border border-white/30 text-white transition hover:rotate-90 hover:border-gold-300 hover:text-gold-300"
            aria-label="Fermer"
          >
            <X />
          </button>
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); onChange((index - 1 + images.length) % images.length) }}
                className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-gold-300 hover:text-ink sm:left-6"
                aria-label="Photo précédente"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onChange((index + 1) % images.length) }}
                className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-gold-300 hover:text-ink sm:right-6"
                aria-label="Photo suivante"
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
