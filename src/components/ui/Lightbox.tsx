import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useEffect, useRef, type SyntheticEvent } from 'react'
import type { VideoGalerie } from '@/content/videos'
import { EASE } from '@/lib/animation'
import { useDefileur } from '@/lib/defileur'

type Props = {
  videos: VideoGalerie[]
  /** Vidéo ouverte, ou `null` quand la visionneuse est fermée. */
  index: number | null
  onChange: (index: number | null) => void
}

type FenetreProps = {
  videos: VideoGalerie[]
  index: number
  onChange: (index: number | null) => void
}

/**
 * Fenêtre modale native (`<dialog>` ouvert avec showModal) : le navigateur
 * garde le focus à l'intérieur, rend le reste de la page inerte et gère la
 * touche Échap. Elle reste montée pendant l'animation de sortie.
 */
function Fenetre({ videos, index, onChange }: FenetreProps) {
  const defileur = useDefileur()
  const fenetre = useRef<HTMLDialogElement>(null)
  const fermerRef = useRef(() => onChange(null))
  const video = videos[index]

  useEffect(() => {
    fermerRef.current = () => onChange(null)
  })

  useEffect(() => {
    const dialogue = fenetre.current
    if (!dialogue) return
    const focusPrecedent = document.activeElement instanceof HTMLElement ? document.activeElement : null
    // Un clic sur le fond (le dialogue lui-même, hors de son contenu) ferme la
    // fenêtre ; au clavier, Échap fait de même (événement « cancel »).
    const surClicFond = (evenement: MouseEvent) => {
      if (evenement.target === dialogue) fermerRef.current()
    }
    dialogue.addEventListener('click', surClicFond)
    dialogue.showModal()
    defileur.bloquer()
    return () => {
      dialogue.removeEventListener('click', surClicFond)
      dialogue.close()
      defileur.debloquer()
      focusPrecedent?.focus()
    }
  }, [defileur])

  useEffect(() => {
    const surTouche = (evenement: KeyboardEvent) => {
      if (evenement.key === 'ArrowRight') onChange((index + 1) % videos.length)
      if (evenement.key === 'ArrowLeft') onChange((index - 1 + videos.length) % videos.length)
    }
    window.addEventListener('keydown', surTouche)
    return () => window.removeEventListener('keydown', surTouche)
  }, [index, videos.length, onChange])

  // Échap : on laisse l'animation de sortie se jouer au lieu de fermer net.
  const surAnnulation = (evenement: SyntheticEvent) => {
    evenement.preventDefault()
    onChange(null)
  }

  const changer = (pas: number) => () => onChange((index + pas + videos.length) % videos.length)

  if (!video) return null

  return (
    <dialog
      ref={fenetre}
      aria-label={`Vidéo : ${video.titre}`}
      onCancel={surAnnulation}
      className="m-0 h-dvh max-h-none w-dvw max-w-none bg-transparent p-0 backdrop:bg-black/92 backdrop:backdrop-blur-md"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="pointer-events-none flex h-full flex-col items-center justify-center p-4"
      >
        <AnimatePresence mode="wait">
          <motion.video
            key={video.slug}
            src={video.src}
            poster={video.affiche}
            controls
            autoPlay
            playsInline
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="pointer-events-auto max-h-[78svh] w-full max-w-[min(92vw,1100px)] rounded-3xl bg-black shadow-2xl"
          />
        </AnimatePresence>
        <p className="mt-5 text-center text-sm tracking-[0.06em] text-white/75">
          <span className="font-bold text-gold-300">{video.categorie}</span> · {video.titre} · {index + 1} /{' '}
          {videos.length}
        </p>
      </motion.div>

      <button
        type="button"
        onClick={() => onChange(null)}
        aria-label="Fermer la vidéo"
        className="absolute top-5 right-5 grid h-12 w-12 place-items-center rounded-full border border-white/30 text-white transition hover:rotate-90 hover:border-gold-300 hover:text-gold-300"
      >
        <X />
      </button>
      {videos.length > 1 && (
        <>
          <button
            type="button"
            onClick={changer(-1)}
            aria-label="Vidéo précédente"
            className="absolute top-1/2 left-3 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-gold-300 hover:text-ink sm:left-6"
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            onClick={changer(1)}
            aria-label="Vidéo suivante"
            className="absolute top-1/2 right-3 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-gold-300 hover:text-ink sm:right-6"
          >
            <ChevronRight />
          </button>
        </>
      )}
    </dialog>
  )
}

/**
 * Visionneuse plein écran : vidéo entière avec le son.
 * Clavier : Échap ferme, flèches gauche / droite changent de vidéo.
 */
export function Lightbox({ videos, index, onChange }: Props) {
  return (
    <AnimatePresence>
      {index !== null && videos[index] && (
        <Fenetre key="visionneuse" videos={videos} index={index} onChange={onChange} />
      )}
    </AnimatePresence>
  )
}
