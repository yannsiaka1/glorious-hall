import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { BookOpen, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import logo from '../assets/img/monogramme-blanc.webp'
import { contact, nav } from '../content'
import { useLenis, useScrollTo } from '../lib/scroll'

export function Header() {
  const scrollTo = useScrollTo()
  const lenis = useLenis()
  const { scrollY } = useScroll()
  const [solid, setSolid] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<string>('accueil')

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setSolid(y > 80)
    // Se cache en descendant, réapparaît en remontant
    setHidden(y > 600 && y > prev + 4 && !open)
    if (y < prev - 4) setHidden(false)
  })

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    nav.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (open) lenis?.stop()
    else lenis?.start()
  }, [open, lenis])

  const go = (id: string) => {
    setOpen(false)
    scrollTo(id)
  }

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: hidden ? -120 : 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: hidden ? 0 : 0.2 }}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-5"
      >
        <div
          className={`mx-auto flex max-w-[1400px] items-center justify-between gap-4 rounded-full px-3 py-2 transition-all duration-500 sm:px-5 ${
            solid ? 'bg-ink/75 shadow-[0_10px_40px_-12px_rgb(0_0_0/0.6)] backdrop-blur-xl' : 'bg-transparent'
          }`}
        >
          <button onClick={() => go('accueil')} className="group flex items-center gap-3 text-left" aria-label="Glorious Hall, retour en haut">
            <img
              src={logo}
              alt=""
              className={`transition-all duration-500 group-hover:rotate-[-4deg] ${solid ? 'h-11 w-11' : 'h-14 w-14 sm:h-16 sm:w-16'}`}
            />
            <span className="hidden leading-none text-white sm:block">
              <span className="block font-serif text-lg tracking-[0.14em]">GLORIOUS HALL</span>
              <span className="mt-1.5 block text-[0.6rem] tracking-[0.28em] text-white/80">ÉVÉNEMENTS D’EXCEPTION</span>
              <span className="mt-1 block text-center text-[0.55rem] tracking-[0.3em] text-white/60">DOUALA</span>
            </span>
          </button>

          <nav aria-label="Navigation principale" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => go(item.id)}
                    className={`relative rounded-full px-4 py-1.5 text-sm transition-colors duration-300 ${
                      active === item.id ? 'text-white' : 'text-white/75 hover:text-gold-300'
                    }`}
                  >
                    {active === item.id && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full border border-white/70 bg-white/5"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={contact.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="btn bg-white px-4 py-2.5 text-sm text-ink shadow-lg hover:shadow-gold-400/30 sm:px-5"
            >
              <span className="hidden sm:inline">Réserver maintenant</span>
              <span className="sm:hidden">Réserver</span>
              <BookOpen className="h-4 w-4" aria-hidden />
            </a>
            <button
              onClick={() => setOpen((v) => !v)}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/30 text-white transition hover:border-gold-300 hover:text-gold-300 lg:hidden"
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-mobile"
            initial={{ clipPath: 'circle(0% at 92% 4%)' }}
            animate={{ clipPath: 'circle(150% at 92% 4%)' }}
            exit={{ clipPath: 'circle(0% at 92% 4%)' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-ink px-8 lg:hidden"
          >
            <ul className="space-y-2">
              {nav.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <button
                    onClick={() => go(item.id)}
                    className={`font-script text-5xl transition-colors ${active === item.id ? 'text-gold-300' : 'text-white hover:text-gold-300'}`}
                  >
                    {item.label}
                  </button>
                </motion.li>
              ))}
            </ul>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-12 max-w-xs font-serif text-sm leading-relaxed text-white/60"
            >
              {contact.address}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
