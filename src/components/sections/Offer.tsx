import { motion, useTransform, type MotionValue } from 'motion/react'
import { forwardRef } from 'react'
import { Icon } from '@/components/ui/Icon'
import { EASE, EASE_DEVOILEMENT } from '@/lib/animation'
import { inclus, options, type Prestation } from '@/content/offre'
import { cn } from '@/lib/cn'
import { useDefileur } from '@/lib/defileur'

/*
 * Section 2, reprise de la maquette « section2 ».
 *
 * Sur ordinateur, les tailles `calc(N * var(--u))` sont en pixels de la
 * maquette (1728 × 1117) : la section se met à l'échelle comme l'image.
 * Sur téléphone et tablette, les trois rangées (prestations incluses,
 * « En option », options) tiennent dans le cadre noir : les pictogrammes et
 * les libellés se dimensionnent sur la largeur de l'écran.
 */

type TaillePrestation = 'grande' | 'petite'

const TAILLES_ICONE: Record<TaillePrestation, string> = {
  grande:
    'h-[clamp(1.6rem,8.6vw,3.2rem)] w-[clamp(1.6rem,8.6vw,3.2rem)] lg:h-[calc(80*var(--u))] lg:w-[calc(80*var(--u))]',
  petite:
    'h-[clamp(1.45rem,7.6vw,2.9rem)] w-[clamp(1.45rem,7.6vw,2.9rem)] lg:h-[calc(72*var(--u))] lg:w-[calc(72*var(--u))]',
}

function PrestationItem({
  prestation,
  rang,
  taille,
}: {
  prestation: Prestation
  rang: number
  taille: TaillePrestation
}) {
  return (
    <motion.li
      data-reveal
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.85, delay: 0.15 + rang * 0.07, ease: EASE }}
      className="group flex min-w-0 flex-col items-center text-center"
    >
      <span className="relative grid place-items-center transition-transform duration-500 ease-(--ease-lux) group-hover:-translate-y-1.5">
        <span className="absolute inset-[-20%] rounded-full bg-gold-300/25 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
        <Icon nom={prestation.icone} className={cn('relative text-gold-300', TAILLES_ICONE[taille])} />
      </span>
      <span className="mt-1.5 text-[clamp(0.52rem,2.35vw,0.9rem)] leading-[1.15] font-bold tracking-[0.02em] text-gold-300 transition-colors duration-300 group-hover:text-gold-200 lg:mt-[calc(8*var(--u))] lg:text-[calc(28*var(--u))] lg:tracking-[0.14em]">
        {prestation.libelle.map((ligne) => (
          <span key={ligne} className="block lg:whitespace-nowrap">
            {ligne}
          </span>
        ))}
      </span>
    </motion.li>
  )
}

type Props = {
  /** 0 → 1 pendant que la section monte et recouvre le hero. */
  recouvrement: MotionValue<number>
}

/** Remplace le hero en un cran : même hauteur que l'écran, coins qui se referment en arrivant. */
export const Offer = forwardRef<HTMLElement, Props>(function Offer({ recouvrement }, ref) {
  const defileur = useDefileur()
  const arrondi = useTransform(recouvrement, [0.6, 1], [48, 0])

  return (
    <section ref={ref} data-theme="sombre" aria-labelledby="offre-titre" className="relative z-10 u-scope">
      <motion.div
        style={{ borderTopLeftRadius: arrondi, borderTopRightRadius: arrondi }}
        className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden bg-[linear-gradient(98deg,#000_0%,#000_56%,#101010_62%,#222_70%,#363636_80%,#4b4b4b_90%,#5f5f5f_100%)] shadow-[0_-30px_60px_-20px_rgb(0_0_0/0.55)] lg:justify-start"
      >
        {/* Titre, sous-titre et bouton */}
        <div className="flex shrink-0 items-start justify-between gap-6 page-x pt-[var(--header-h)] max-lg:flex-col">
          <div>
            {/* L'observateur est sur le parent : un élément entièrement rogné n'est jamais « visible ». */}
            <motion.div initial="cache" whileInView="visible" viewport={{ once: true, amount: 0.5 }}>
              <motion.h2
                id="offre-titre"
                data-reveal
                variants={{
                  cache: { clipPath: 'inset(-30% 100% -30% 0)' },
                  visible: { clipPath: 'inset(-30% 0% -30% 0)' },
                }}
                transition={{ duration: 1.5, ease: EASE_DEVOILEMENT }}
                className="font-script text-[clamp(2.7rem,11vw,4.2rem)] leading-[1.2] text-gold-300 lg:text-[calc(110*var(--u))]"
              >
                Ce que nous vous offrons
              </motion.h2>
            </motion.div>
            <motion.p
              data-reveal
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1, delay: 0.35, ease: EASE }}
              className="font-roman leading-[1.15] text-white max-lg:mt-1 max-lg:text-[clamp(1.02rem,3.6vw,1.35rem)] lg:mt-[calc(24*var(--u))] lg:text-[calc(38*var(--u))]"
            >
              Nous mettons le meilleur de nous-mêmes à <br className="hidden lg:block" />
              votre disposition, parce que votre satisfaction est notre récompense.
            </motion.p>
          </div>
          <motion.button
            type="button"
            data-reveal
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
            onClick={() => defileur.allerA('contact')}
            className="btn shrink-0 rounded-2xl bg-gold-600 px-7 py-3 text-white shadow-[0_14px_30px_-12px_rgb(157_115_38/0.9)] hover:bg-gold-500 lg:mt-[calc(36*var(--u))] lg:h-[calc(95*var(--u))] lg:w-[calc(321*var(--u))] lg:rounded-[calc(24*var(--u))] lg:p-0 lg:text-[calc(32*var(--u))]"
          >
            Nous contacter
          </motion.button>
        </div>

        <div className="h-8 shrink-0 lg:h-auto lg:min-h-4 lg:flex-1" />

        {/* Cadre noir : prestations incluses puis options */}
        <div className="relative shrink-0">
          <motion.div
            aria-hidden="true"
            data-reveal
            initial={{ x: '-12%', opacity: 0 }}
            whileInView={{ x: '0%', opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.3, ease: EASE }}
            className="absolute inset-y-0 right-[4%] -left-8 rounded-r-[2.5rem] bg-[#050505] lg:right-[2.8%] lg:rounded-r-[calc(75*var(--u))]"
          />

          {/* Ordinateur : disposition de la maquette */}
          <div className="relative hidden lg:block lg:h-[calc(577*var(--u))]">
            <h3 className="sr-only">Inclus avec la salle</h3>
            <ul className="absolute top-[calc(45*var(--u))] left-[10.3%] grid w-[80%] grid-cols-5">
              {inclus.map((prestation, rang) => (
                <PrestationItem key={prestation.icone} prestation={prestation} rang={rang} taille="grande" />
              ))}
            </ul>
            <h3 className="absolute top-[calc(262*var(--u))] left-[10.6%] text-[calc(30*var(--u))] font-bold text-white">
              En option
            </h3>
            <ul className="absolute top-[calc(325*var(--u))] left-[8%] grid w-[85%] grid-cols-6">
              {options.map((prestation, rang) => (
                <PrestationItem key={prestation.icone} prestation={prestation} rang={rang + 5} taille="petite" />
              ))}
            </ul>
          </div>

          {/* Téléphone et tablette : trois rangées contenues dans le cadre */}
          <div className="relative space-y-[clamp(0.75rem,3.2svh,1.75rem)] py-[clamp(1rem,3svh,2rem)] pr-[calc(4%+0.9rem)] pl-[clamp(0.9rem,3.6vw,var(--gutter))] lg:hidden">
            <h3 className="sr-only">Inclus avec la salle</h3>
            <ul className="grid grid-cols-5 gap-x-1">
              {inclus.map((prestation, rang) => (
                <PrestationItem key={prestation.icone} prestation={prestation} rang={rang} taille="grande" />
              ))}
            </ul>
            <h3 className="text-[clamp(0.85rem,3.6vw,1.1rem)] font-bold text-white">En option</h3>
            <ul className="grid grid-cols-6 gap-x-1">
              {options.map((prestation, rang) => (
                <PrestationItem key={prestation.icone} prestation={prestation} rang={rang} taille="petite" />
              ))}
            </ul>
          </div>
        </div>

        <div className="h-2 shrink-0 lg:h-[calc(117*var(--u))]" />
      </motion.div>
    </section>
  )
})
