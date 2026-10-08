import type { CSSProperties } from 'react'
import arbre from '@/assets/img/logo/arbre.webp'
import masqueMonogramme from '@/assets/img/logo/monogramme-masque.svg'
import monogramme from '@/assets/img/logo/monogramme.svg'
import signature from '@/assets/img/logo/signature.svg'
import { cn } from '@/lib/cn'

/**
 * Logo animé, en fond de la galerie.
 *
 * Le logo a été vectorisé (G, H et signature tracés en courbes) : il reste net
 * à toutes les tailles, du téléphone au grand écran. Seul l'arbre doré reste
 * une image, affichée à une taille où elle ne perd pas en netteté.
 *
 * Animations (styles dans index.css, section « Scène du logo ») :
 * - au repos, le logo attend en retrait derrière le contenu de la galerie ;
 * - quand le contenu s'efface (`actif`), le monogramme s'illumine, la
 *   signature s'écrit de gauche à droite et l'arbre pousse ;
 * - puis, en continu : l'arbre se balance au vent comme la branche des
 *   services, des feuilles d'or s'en détachent, un reflet glisse sur le G et
 *   le H, et des paillettes scintillent autour.
 */

/** Position de l'arbre dans le cadre du logo, relevée sur le tracé. */
const POSITION_ARBRE: CSSProperties = { left: '21.86%', top: '70.08%', width: '23.94%' }

/** Feuilles qui se détachent de l'arbre : départ, dérive, rotation, durée, délai. */
const FEUILLES = [
  { x: 27, y: 72, dx: 22, dy: 7, r: 320, duree: 7.5, delai: 0.9, taille: 1.3 },
  { x: 33, y: 71, dx: 30, dy: 12, r: 420, duree: 9, delai: 2.6, taille: 1 },
  { x: 38, y: 74, dx: 18, dy: 15, r: 260, duree: 8.2, delai: 4.1, taille: 1.2 },
  { x: 30, y: 76, dx: 26, dy: 4, r: 380, duree: 10, delai: 5.8, taille: 0.9 },
  { x: 41, y: 73, dx: 34, dy: 9, r: 300, duree: 8.8, delai: 7.2, taille: 1.1 },
  { x: 25, y: 75, dx: 20, dy: 13, r: 440, duree: 9.6, delai: 8.6, taille: 1 },
]

/** Paillettes : positions pseudo-aléatoires mais fixes (identiques au prérendu et dans le navigateur). */
const PAILLETTES = Array.from({ length: 40 }, (_, i) => {
  const hasard = (n: number) => (((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1) + 1) % 1
  return {
    gauche: hasard(1) * 100,
    haut: hasard(2) * 100,
    taille: 2 + hasard(3) * 8,
    delai: hasard(4) * 4,
    floue: hasard(5) > 0.65,
  }
})

export function LogoScene({ actif }: { actif: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={cn('scene-logo absolute inset-0 grid place-items-center pt-[var(--header-h)]', actif && 'est-active')}
    >
      <div className="scene-halo" />

      {PAILLETTES.map((paillette, i) => (
        <span
          key={i}
          className="absolute animate-twinkle rounded-full bg-gold-300 shadow-[0_0_12px_rgb(224_190_128/0.8)]"
          style={{
            left: `${paillette.gauche}%`,
            top: `${paillette.haut}%`,
            width: paillette.taille,
            height: paillette.taille,
            animationDelay: `${paillette.delai}s`,
            filter: paillette.floue ? 'blur(2px)' : undefined,
          }}
        />
      ))}

      {/* Cadre aux proportions du logo (2740 × 2326 unités de tracé) */}
      <div className="relative aspect-[2740/2326] w-[min(88vw,calc((100svh-var(--header-h)-4rem)*1.178),820px)]">
        <img src={monogramme} alt="" loading="lazy" className="scene-monogramme absolute inset-0 h-full w-full" />
        <span
          className="scene-reflet absolute inset-0"
          style={{ maskImage: `url(${masqueMonogramme})`, WebkitMaskImage: `url(${masqueMonogramme})` }}
        />
        <img src={signature} alt="" loading="lazy" className="scene-signature absolute inset-0 h-full w-full" />

        {/* Trois calques : apparition, rafale à l'arrivée, balancement continu */}
        <div className="scene-arbre absolute" style={POSITION_ARBRE}>
          <div className="scene-rafale">
            <img src={arbre} alt="" loading="lazy" className="w-full origin-[50%_94%] animate-wind" />
          </div>
        </div>

        {FEUILLES.map((feuille, i) => (
          <span
            key={i}
            className="scene-feuille"
            style={
              {
                '--x': `${feuille.x}%`,
                '--y': `${feuille.y}%`,
                '--dx': `${feuille.dx}vmin`,
                '--dy': `${feuille.dy}vmin`,
                '--r': `${feuille.r}deg`,
                '--duree': `${feuille.duree}s`,
                '--delai': `${feuille.delai}s`,
                '--taille': `${feuille.taille * 1.15}%`,
              } as CSSProperties
            }
          />
        ))}
      </div>
    </div>
  )
}
