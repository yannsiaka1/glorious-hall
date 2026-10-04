import { motion } from 'motion/react'
import { ChevronRight, Headphones, Mail, MapPin, Phone } from 'lucide-react'
import reception from '../assets/img/reception.webp'
import logo from '../assets/img/monogramme-blanc.webp'
import branch from '../assets/img/branche-doree.webp'
import { contact, included, nav, options } from '../content'
import { icons } from '../lib/icons'
import { useScrollTo } from '../lib/scroll'
import { Reveal } from './Reveal'

function ColTitle({ children }: { children: string }) {
  return (
    <h3 className="font-serif text-2xl text-gold-300">
      {children}
      <motion.span
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.3 }}
        className="mt-2 block h-0.5 w-10 origin-left bg-gold-300"
      />
    </h3>
  )
}

export function Footer() {
  const scrollTo = useScrollTo()
  return (
    <footer className="relative overflow-hidden bg-black text-white">
      <img src={reception} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-45 blur-[3px]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(0_0_0/0.35)_0%,rgb(0_0_0/0.85)_45%,#000_100%)]" />
      <img src={branch} alt="" aria-hidden className="absolute -left-10 bottom-10 w-40 rotate-[200deg] animate-wind opacity-40" />
      <img src={branch} alt="" aria-hidden className="absolute -right-8 bottom-16 w-36 animate-wind opacity-40 [animation-delay:-3s]" />

      <div className="relative mx-auto grid max-w-[1400px] gap-12 px-6 pb-14 pt-32 sm:px-10 md:grid-cols-2 xl:grid-cols-[1.1fr_0.8fr_1.4fr_1.2fr] lg:px-16">
        <Reveal className="text-center">
          <img src={logo} alt="Glorious Hall" className="mx-auto w-36 animate-float" />
          <p className="mt-2 font-serif text-3xl tracking-[0.08em]">
            <span className="text-gold-300">GLORIOUS</span> HALL
          </p>
          <p className="mt-2 text-xs tracking-[0.3em]">ÉVÉNEMENTS D’EXCEPTION</p>
          <span className="mx-auto mt-5 block h-px w-24 bg-gold-300/70" />
          <p className="mt-5 font-script text-4xl leading-snug text-gold-300">
            Le lieu où vos meilleurs souvenirs prennent vie.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <ColTitle>Navigation</ColTitle>
          <ul className="mt-6 space-y-3">
            {nav.map((n) => (
              <li key={n.id}>
                <button onClick={() => scrollTo(n.id)} className="group flex w-44 items-center justify-between text-white/90 transition-colors hover:text-gold-300">
                  {n.label}
                  <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.2}>
          <ColTitle>Nos services</ColTitle>
          <ul className="mt-6 space-y-3">
            {included.slice(0, 4).map((s) => {
              const Icon = icons[s.icon]
              return (
                <li key={s.label} className="group flex items-center gap-4 text-white/90">
                  <Icon className="h-6 w-6 text-gold-300 transition-transform duration-300 group-hover:scale-110" />
                  {s.label}
                </li>
              )
            })}
          </ul>
          <span className="my-6 block h-px bg-gold-300/30" />
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            {options.map((s) => {
              const Icon = icons[s.icon]
              return (
                <li key={s.label} className="group flex items-center gap-3 text-white/85">
                  <Icon className="h-5 w-5 shrink-0 text-gold-300 transition-transform duration-300 group-hover:scale-110" />
                  {s.label}
                </li>
              )
            })}
          </ul>
        </Reveal>

        <Reveal delay={0.3}>
          <ColTitle>Notre emplacement</ColTitle>
          <ul className="mt-6 space-y-4 text-white/90">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-6 w-6 shrink-0 text-gold-300" />
              {contact.address}
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-6 w-6 shrink-0 text-gold-300" />
              <span className="flex flex-col">
                {contact.phones.map((p) => (
                  <a key={p.href} href={p.href} className="hover:text-gold-300">
                    {p.label}
                  </a>
                ))}
              </span>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-6 w-6 shrink-0 text-gold-300" />
              <a href={`mailto:${contact.email}`} className="hover:text-gold-300">
                {contact.email}
              </a>
            </li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={contact.mapsLink} target="_blank" rel="noreferrer" className="btn bg-gold-500 px-5 py-2.5 text-sm text-white hover:bg-gold-400">
              <MapPin className="h-4 w-4" /> Voir sur Google Maps
            </a>
            <a href={contact.whatsapp} target="_blank" rel="noreferrer" className="btn border border-gold-300 px-5 py-2.5 text-sm text-white hover:bg-gold-300 hover:text-ink">
              <Headphones className="h-4 w-4" /> Nous contacter
            </a>
          </div>
        </Reveal>
      </div>

      <div className="relative border-t border-gold-300/60">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-4 px-6 py-6 text-xs tracking-[0.2em] text-white/80 sm:flex-row sm:px-10 lg:px-16">
          <p>© {new Date().getFullYear()} GLORIOUS HALL. Tous droits réservés.</p>
          <span aria-hidden className="hidden items-center gap-3 sm:flex">
            <span className="h-px w-16 bg-gold-300/60" />
            <span className="h-3 w-3 rotate-45 bg-gold-300" />
            <span className="h-px w-16 bg-gold-300/60" />
          </span>
          <a href={contact.whatsapp} target="_blank" rel="noreferrer" className="tracking-[0.1em] hover:text-gold-300">
            Nous contacter
          </a>
        </div>
      </div>
    </footer>
  )
}
