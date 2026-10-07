import { BookOpen } from 'lucide-react'
import { useEffect, useState } from 'react'
import logoClair from '../assets/img/logo-clair.webp'
import logoSombre from '../assets/img/logo-sombre.webp'
import { contact, nav } from '../content'
import { cn } from '../lib/cn'
import { useScrollTo } from '../lib/scroll'

const ids = nav.map((item) => item.id)

/**
 * En-tête repris de Precious : toujours visible, hauteur et logo fixes.
 * - En haut de page : fond transparent sur le hero.
 * - Au défilement : voile translucide flouté. Sa teinte suit la section
 *   placée dessous (voile sombre sur les sections noires, crème sur les
 *   sections claires) pour que le texte reste lisible partout.
 */
export function Header() {
  const scrollTo = useScrollTo()
  const [active, setActive] = useState<string>('accueil')
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    const update = () => {
      setScrolled(window.scrollY > 24)
      const probe = window.innerWidth >= 1024 ? 64 : 48
      let next: 'dark' | 'light' = 'dark'
      document.querySelectorAll<HTMLElement>('[data-theme]').forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.top <= probe && r.bottom > probe) next = el.dataset.theme === 'light' ? 'light' : 'dark'
      })
      setTheme(next)
      // Section active : celle qui passe sous une ligne placée à 40 % de l'écran
      const line = window.innerHeight * 0.4
      let current = 'accueil'
      for (const id of ids) {
        const r = document.getElementById(id)?.getBoundingClientRect()
        if (r && r.top <= line && r.bottom > line) current = id
      }
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) current = 'contact'
      setActive(current)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const light = theme === 'light'
  const veiled = scrolled || open

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    scrollTo(id)
  }

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top,0px)] transition-[background-color,backdrop-filter,box-shadow,color] duration-300',
        veiled
          ? light
            ? 'bg-cream/70 shadow-[0_1px_0_rgba(20,20,18,0.08)] backdrop-blur-xl backdrop-saturate-150'
            : 'bg-[#0d0c0b]/55 shadow-[0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl backdrop-saturate-150'
          : 'bg-transparent',
        light ? 'text-ink' : 'text-white',
      )}
    >
      <div className="page-x flex min-h-24 items-center justify-between gap-6 lg:min-h-32">
        <a href="#accueil" onClick={go('accueil')} aria-label="Glorious Hall, accueil" className="relative shrink-0">
          <img
            src={logoClair}
            alt="Glorious Hall"
            width={688}
            height={578}
            className={cn('h-20 w-auto transition-opacity duration-300 lg:h-26', light && 'opacity-0')}
          />
          <img
            src={logoSombre}
            alt=""
            aria-hidden="true"
            width={688}
            height={578}
            className={cn('absolute inset-0 h-20 w-auto transition-opacity duration-300 lg:h-26', !light && 'opacity-0')}
          />
        </a>

        <nav aria-label="Navigation principale" className="hidden lg:block">
          <ul className="flex items-center gap-8 text-base font-bold xl:gap-11">
            {nav.map((item) => {
              const current = active === item.id
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={go(item.id)}
                    aria-current={current ? 'true' : undefined}
                    className={cn(
                      'relative block py-2 transition-colors duration-200',
                      'after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-right after:transition-transform after:duration-300 after:ease-(--ease-lux)',
                      'hover:after:origin-left hover:after:scale-x-100',
                      light ? 'after:bg-gold-600 hover:text-gold-700' : 'after:bg-gold-300 hover:text-gold-300',
                      current
                        ? cn('after:scale-x-100', light ? 'text-gold-700' : 'text-gold-300')
                        : cn('after:scale-x-0', light ? 'text-ink/85' : 'text-white/85'),
                    )}
                  >
                    {item.label}
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
              light ? 'bg-ink text-white' : 'bg-white text-ink',
            )}
          >
            Réserver maintenant
            <BookOpen className="h-4 w-4" aria-hidden />
          </a>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen((value) => !value)}
            className={cn(
              'inline-flex min-h-11 items-center gap-2.5 rounded-full border px-4 text-sm font-bold lg:hidden',
              light ? 'border-ink/20' : 'border-white/30',
            )}
          >
            {open ? 'Fermer' : 'Menu'}
            <span aria-hidden="true" className="grid gap-1">
              <span className={cn('block h-px w-4 bg-current transition-transform duration-300', open && 'translate-y-[3px] rotate-45')} />
              <span className={cn('block h-px w-4 bg-current transition-transform duration-300', open && '-translate-y-[3px] -rotate-45')} />
            </span>
          </button>
        </div>
      </div>

      <div
        id="menu-mobile"
        hidden={!open}
        className={cn(
          'page-x border-t pb-6 backdrop-blur-xl lg:hidden',
          light ? 'border-ink/10 bg-cream/95' : 'border-white/10 bg-[#0d0c0b]/92',
        )}
      >
        <nav aria-label="Navigation mobile">
          <ul className="grid font-bold">
            {nav.map((item) => (
              <li key={item.id} className={cn('border-b last:border-0', light ? 'border-ink/10' : 'border-white/10')}>
                <a
                  href={`#${item.id}`}
                  onClick={go(item.id)}
                  className={cn(
                    'block py-4 text-base',
                    active === item.id && (light ? 'text-gold-700' : 'text-gold-300'),
                  )}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a
          href={contact.whatsapp}
          target="_blank"
          rel="noreferrer"
          className={cn('btn mt-5 min-h-12 w-full rounded-full text-sm', light ? 'bg-ink text-white' : 'bg-white text-ink')}
        >
          Réserver maintenant
          <BookOpen className="h-4 w-4" aria-hidden />
        </a>
      </div>
    </header>
  )
}
