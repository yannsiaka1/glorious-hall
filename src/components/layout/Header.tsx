import { BookOpen } from 'lucide-react'
import { useEffect, useRef, useState, type MouseEvent } from 'react'
import logoClair from '@/assets/img/logo-clair.webp'
import logoSombre from '@/assets/img/logo-sombre.webp'
import { contact, navigation, site, type SectionId } from '@/content/site'
import { cn } from '@/lib/cn'
import { useDefileur } from '@/lib/defileur'
import { dansZoneEtapes, enCoursDePas } from '@/lib/steps'

/** Ligne de lecture : la section active est celle qui passe sous ce point de l'écran. */
const LIGNE_SECTION_ACTIVE = 0.4
/**
 * Distance parcourue dans un même sens (px) avant que l'en-tête se cache ou
 * revienne : en dessous, les petits à-coups du défilement fluide le feraient
 * clignoter.
 */
const SEUIL_SENS = 12
/** Durée la plus longue d'un trajet lancé depuis la navigation (voir SmoothScroll), plus une marge (ms). */
const DUREE_TRAJET_NAVIGATION = 1800

/**
 * En-tête repris de Precious : même hauteur, même logo, même voile.
 * - En haut de page : fond transparent sur le hero.
 * - Au défilement : voile translucide flouté. Sa teinte suit la section placée
 *   dessous (`data-theme` sombre ou clair) pour que les liens restent lisibles.
 * - L'onglet de la section à l'écran reste doré et souligné.
 *
 * Il se retire quand on descend dans la partie libre de la page, et revient
 * dès qu'on remonte. Sur Precious, la page défile librement et ne passe sous
 * l'en-tête qu'un instant. Ici, la fin de page (À propos, Avis, Contact) se
 * lit en défilant, et un en-tête de 96 à 128 px, translucide, couvrait en
 * permanence les titres, les textes et les chiffres qui passaient dessous.
 *
 * Il reste en place :
 * - dans les zones à étapes (hero, services, galerie) : chaque section y
 *   réserve sa place en haut, il ne cache donc rien, et remonter d'un geste y
 *   change de section, il ne pourrait pas revenir ;
 * - pendant un pas, en haut de page, quand le menu est ouvert, quand le
 *   clavier est dans l'en-tête, et pendant un trajet lancé depuis la
 *   navigation.
 */
export function Header() {
  const defileur = useDefileur()
  const [active, setActive] = useState<SectionId>('accueil')
  const [ouvert, setOuvert] = useState(false)
  const [defile, setDefile] = useState(false)
  const [theme, setTheme] = useState<'sombre' | 'clair'>('sombre')
  const [retire, setRetire] = useState(false)
  /** Fin du trajet lancé depuis la navigation (horodatage `performance.now()`). */
  const finTrajet = useRef(0)
  /** Chemin parcouru dans le sens courant (px, positif vers le bas). */
  const cumul = useRef(0)

  /**
   * Fait revenir l'en-tête pour une autre raison que le défilement (clavier,
   * navigation) : le chemin déjà parcouru vers le bas est oublié, sinon le
   * prochain événement de défilement le retirerait aussitôt.
   */
  const montrer = () => {
    cumul.current = 0
    setRetire(false)
  }

  useEffect(() => {
    let dernierY = window.scrollY

    const mettreAJour = () => {
      const y = window.scrollY
      setDefile(y > 24)

      // Retrait au défilement : on cumule le chemin parcouru dans un même sens.
      // Un événement sans mouvement (redimensionnement, lissage) ne décide rien.
      const ecart = y - dernierY
      dernierY = y
      if (ecart !== 0) {
        if (Math.sign(ecart) !== Math.sign(cumul.current)) cumul.current = 0
        cumul.current += ecart
      }
      if (y <= 24 || dansZoneEtapes(y) || enCoursDePas() || performance.now() < finTrajet.current) {
        setRetire(false)
      } else if (ecart !== 0 && cumul.current > SEUIL_SENS) {
        setRetire(true)
      } else if (ecart !== 0 && cumul.current < -SEUIL_SENS) {
        setRetire(false)
      }

      // Teinte : celle de la section qui passe sous l'en-tête.
      const sonde = window.innerWidth >= 1024 ? 64 : 48
      let teinte: 'sombre' | 'clair' = 'sombre'
      for (const section of document.querySelectorAll<HTMLElement>('[data-theme]')) {
        const cadre = section.getBoundingClientRect()
        if (cadre.top <= sonde && cadre.bottom > sonde) teinte = section.dataset.theme === 'clair' ? 'clair' : 'sombre'
      }
      setTheme(teinte)

      // Section active ; tout en bas de page, c'est toujours « Contact ».
      const ligne = window.innerHeight * LIGNE_SECTION_ACTIVE
      let courante: SectionId = 'accueil'
      for (const { id } of navigation) {
        const cadre = document.getElementById(id)?.getBoundingClientRect()
        if (cadre && cadre.top <= ligne && cadre.bottom > ligne) courante = id
      }
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) courante = 'contact'
      setActive(courante)
    }

    mettreAJour()
    window.addEventListener('scroll', mettreAJour, { passive: true })
    window.addEventListener('resize', mettreAJour)
    return () => {
      window.removeEventListener('scroll', mettreAJour)
      window.removeEventListener('resize', mettreAJour)
    }
  }, [])

  // Échap referme le menu mobile.
  useEffect(() => {
    if (!ouvert) return
    const surTouche = (evenement: KeyboardEvent) => {
      if (evenement.key === 'Escape') setOuvert(false)
    }
    document.addEventListener('keydown', surTouche)
    return () => document.removeEventListener('keydown', surTouche)
  }, [ouvert])

  const clair = theme === 'clair'
  const voile = defile || ouvert
  const cache = retire && !ouvert

  const allerA = (id: SectionId) => (evenement: MouseEvent) => {
    evenement.preventDefault()
    setOuvert(false)
    // Le trajet descend souvent : sans cette marge, l'en-tête se retirerait
    // pendant qu'il emmène le visiteur là où il l'a demandé.
    finTrajet.current = performance.now() + DUREE_TRAJET_NAVIGATION
    montrer()
    defileur.allerA(id)
  }

  return (
    <header
      // Au clavier, la tabulation qui entre dans l'en-tête le fait revenir.
      onFocus={montrer}
      className={cn(
        'fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top,0px)] transition-[background-color,backdrop-filter,box-shadow,color,translate] duration-300 ease-(--ease-lux)',
        cache && '-translate-y-full',
        voile && clair && 'bg-cream/70 shadow-[0_1px_0_rgba(20,20,18,0.08)] backdrop-blur-xl backdrop-saturate-150',
        voile &&
          !clair &&
          'bg-[#0d0c0b]/55 shadow-[0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl backdrop-saturate-150',
        !voile && 'bg-transparent',
        clair ? 'text-ink' : 'text-white',
      )}
    >
      <div className="flex min-h-24 items-center justify-between gap-6 page-x lg:min-h-32">
        <a
          href="#accueil"
          onClick={allerA('accueil')}
          aria-label={`${site.nom}, accueil`}
          className="relative shrink-0"
        >
          <img
            src={logoClair}
            alt={site.nom}
            width={688}
            height={578}
            className={cn('h-20 w-auto transition-opacity duration-300 lg:h-26', clair && 'opacity-0')}
          />
          <img
            src={logoSombre}
            alt=""
            aria-hidden="true"
            loading="lazy"
            width={688}
            height={578}
            className={cn(
              'absolute inset-0 h-20 w-auto transition-opacity duration-300 lg:h-26',
              !clair && 'opacity-0',
            )}
          />
        </a>

        <nav aria-label="Navigation principale" className="hidden lg:block">
          <ul className="flex items-center gap-8 text-base font-bold xl:gap-11">
            {navigation.map(({ id, libelle }) => {
              const courante = active === id
              return (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={allerA(id)}
                    aria-current={courante ? 'true' : undefined}
                    className={cn(
                      'relative block py-2 transition-colors duration-200',
                      'after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-right after:transition-transform after:duration-300 after:ease-(--ease-lux)',
                      'hover:after:origin-left hover:after:scale-x-100',
                      clair ? 'after:bg-gold-600 hover:text-gold-700' : 'after:bg-gold-300 hover:text-gold-300',
                      courante && 'after:scale-x-100',
                      courante && (clair ? 'text-gold-700' : 'text-gold-300'),
                      !courante && 'after:scale-x-0',
                      !courante && (clair ? 'text-ink/85' : 'text-white/85'),
                    )}
                  >
                    {libelle}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3 sm:gap-5">
          <a
            href={contact.whatsapp}
            target="_blank"
            rel="noreferrer"
            className={cn(
              'btn hidden min-h-11 rounded-full px-5 text-sm sm:inline-flex',
              clair ? 'bg-ink text-white' : 'bg-white text-ink',
            )}
          >
            Réserver maintenant
            <BookOpen className="h-4 w-4" aria-hidden="true" />
          </a>
          <button
            type="button"
            aria-expanded={ouvert}
            aria-controls="menu-mobile"
            onClick={() => setOuvert((valeur) => !valeur)}
            className={cn(
              'inline-flex min-h-11 items-center gap-2.5 rounded-full border px-4 text-sm font-bold lg:hidden',
              clair ? 'border-ink/20' : 'border-white/30',
            )}
          >
            {ouvert ? 'Fermer' : 'Menu'}
            <span aria-hidden="true" className="grid gap-1">
              <span
                className={cn(
                  'block h-px w-4 bg-current transition-transform duration-300',
                  ouvert && 'translate-y-[3px] rotate-45',
                )}
              />
              <span
                className={cn(
                  'block h-px w-4 bg-current transition-transform duration-300',
                  ouvert && '-translate-y-[3px] -rotate-45',
                )}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        id="menu-mobile"
        hidden={!ouvert}
        className={cn(
          'border-t page-x pb-6 backdrop-blur-xl lg:hidden',
          clair ? 'border-ink/10 bg-cream/95' : 'border-white/10 bg-[#0d0c0b]/92',
        )}
      >
        <nav aria-label="Navigation mobile">
          <ul className="grid font-bold">
            {navigation.map(({ id, libelle }) => (
              <li key={id} className={cn('border-b last:border-0', clair ? 'border-ink/10' : 'border-white/10')}>
                <a
                  href={`#${id}`}
                  onClick={allerA(id)}
                  aria-current={active === id ? 'true' : undefined}
                  className={cn('block py-4 text-base', active === id && (clair ? 'text-gold-700' : 'text-gold-300'))}
                >
                  {libelle}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a
          href={contact.whatsapp}
          target="_blank"
          rel="noreferrer"
          className={cn(
            'btn mt-5 min-h-12 w-full rounded-full text-sm',
            clair ? 'bg-ink text-white' : 'bg-white text-ink',
          )}
        >
          Réserver maintenant
          <BookOpen className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </header>
  )
}
