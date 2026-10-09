import type Lenis from 'lenis'
import type { VirtualScrollData } from 'lenis'

/**
 * Défilement par étapes.
 *
 * Une « zone » est une suite d'arrêts : des positions de défilement, en pixels
 * depuis le haut du document. Dans une zone :
 * - un cran de molette, un glissé au doigt ou une flèche du clavier amène
 *   exactement à l'arrêt suivant ou précédent ;
 * - les crans qui suivent dans le même geste (inertie d'un pavé tactile,
 *   molette tournée plusieurs fois) sont absorbés : un geste = une étape ;
 * - en arrivant d'au-dessus ou d'en dessous, le défilement est « attrapé »
 *   pile sur le premier ou le dernier arrêt.
 * Au-delà du dernier arrêt, le défilement redevient normal.
 *
 * Un arrêt peut imposer un temps de pause (`pause`, en ms) : à l'arrivée, les
 * gestes sont ignorés pendant ce délai pour que la section ait le temps de se
 * révéler entièrement avant l'étape suivante. De plus, l'étape suivante ne
 * part qu'avec un geste qui commence après un vrai silence : la traîne du
 * geste d'arrivée (inertie d'un pavé tactile, souvent irrégulière quand la
 * machine est chargée) ne peut pas la déclencher toute seule.
 */

export type Arret = {
  /** Position de défilement, en px depuis le haut du document. */
  y: number
  /** Pause imposée à l'arrivée sur cet arrêt, en millisecondes. */
  pause?: number
}

export type Zone = {
  id: string
  /** Arrêts dans l'ordre croissant, recalculés à chaque geste (le DOM peut changer). */
  arrets: () => Arret[]
  /** Appelé au lancement d'un pas, avec l'index de l'arrêt visé. */
  surEtape?: (index: number) => void
}

type Decision = { type: 'libre' } | { type: 'bord' } | { type: 'aller'; y: number; index: number; entree: boolean }
type Pas = { zone: Zone; decision: Extract<Decision, { type: 'aller' }> }

/** Durée d'un pas, en secondes. */
const DUREE_PAS = 1.05
/** Tolérance de position, en pixels (arrondis du navigateur). */
const TOLERANCE = 2
/** Au-delà de ce silence entre deux crans, on considère un nouveau geste. */
const SILENCE_GESTE_MS = 200
/** Distance minimale d'un glissé au doigt pour déclencher un pas. */
const GLISSE_MIN_PX = 26

const zones = new Map<string, Zone>()
let verrouJusqua = 0
/** Après un arrêt avec pause : seul un geste précédé d'un silence compte comme neuf. */
let silenceExige = false
const molette = { dernier: 0, recents: [] as number[] }
const doigt = { neuf: false, cumulY: 0, cumulX: 0 }

/** Enregistre une zone ; renvoie la fonction qui la retire. */
export function enregistrerZone(zone: Zone): () => void {
  zones.set(zone.id, zone)
  return () => {
    zones.delete(zone.id)
  }
}

/** Vrai pendant un pas : les composants ignorent alors la position brute du défilement. */
export function enCoursDePas(): boolean {
  return performance.now() < verrouJusqua
}

/** Position d'un élément dans le document, indépendante du défilement courant. */
export function hautDansDocument(element: Element): number {
  return element.getBoundingClientRect().top + window.scrollY
}

const accelereRalentit = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

function decider(courant: number, delta: number, arrets: Arret[]): Decision {
  const premier = arrets[0]
  const dernier = arrets[arrets.length - 1]
  if (!premier || !dernier) return { type: 'libre' }

  // En dehors de la zone : on n'attrape que si le geste franchit la limite.
  if (courant < premier.y - TOLERANCE) {
    return delta > 0 && courant + delta >= premier.y - TOLERANCE
      ? { type: 'aller', y: premier.y, index: 0, entree: true }
      : { type: 'libre' }
  }
  if (courant > dernier.y + TOLERANCE) {
    return delta < 0 && courant + delta <= dernier.y + TOLERANCE
      ? { type: 'aller', y: dernier.y, index: arrets.length - 1, entree: true }
      : { type: 'libre' }
  }

  // Dans la zone : arrêt suivant ou précédent, sinon on est au bord.
  if (delta > 0) {
    const index = arrets.findIndex((arret) => arret.y > courant + TOLERANCE)
    const arret = arrets[index]
    return arret ? { type: 'aller', y: arret.y, index, entree: false } : { type: 'bord' }
  }
  for (let index = arrets.length - 1; index >= 0; index--) {
    const arret = arrets[index]
    if (arret && arret.y < courant - TOLERANCE) return { type: 'aller', y: arret.y, index, entree: false }
  }
  return { type: 'bord' }
}

/** Interroge toutes les zones ; le pas le plus proche l'emporte. */
function choisir(courant: number, delta: number): { pas: Pas | null; auBord: boolean } {
  let pas: Pas | null = null
  let auBord = false
  for (const zone of zones.values()) {
    const decision = decider(courant, delta, zone.arrets())
    if (decision.type === 'bord') auBord = true
    if (decision.type === 'aller' && (!pas || Math.abs(decision.y - courant) < Math.abs(pas.decision.y - courant))) {
      pas = { zone, decision }
    }
  }
  return { pas, auBord }
}

/** Pause demandée par n'importe quel arrêt situé à cette position (toutes zones confondues). */
function pauseA(y: number): number {
  let pause = 0
  for (const zone of zones.values()) {
    for (const arret of zone.arrets()) {
      if (Math.abs(arret.y - y) <= TOLERANCE) pause = Math.max(pause, arret.pause ?? 0)
    }
  }
  return pause
}

function lancer(lenis: Lenis, zone: Zone, y: number, index: number): void {
  const pause = pauseA(y)
  verrouJusqua = performance.now() + DUREE_PAS * 1000 * 0.82 + pause
  silenceExige = pause > 0
  zone.surEtape?.(index)
  lenis.scrollTo(y, { duration: DUREE_PAS, easing: accelereRalentit, lock: true, force: true })
}

/**
 * Branché sur l'option `virtualScroll` de Lenis : chaque cran de molette et
 * chaque mouvement de doigt passe par ici. Renvoyer `false` consomme l'événement.
 */
export function gererDefilement(donnees: VirtualScrollData, lenis: Lenis | null): boolean {
  if (!lenis || lenis.isStopped || zones.size === 0) return true
  const evenement = donnees.event
  const maintenant = performance.now()
  const auDoigt = evenement.type.startsWith('touch')

  if (evenement.type === 'touchstart') {
    doigt.neuf = true
    doigt.cumulY = 0
    doigt.cumulX = 0
    return true
  }

  const delta = donnees.deltaY
  let gesteNeuf: boolean
  if (auDoigt) {
    if (evenement.type === 'touchmove') {
      doigt.cumulY += delta
      doigt.cumulX += donnees.deltaX
    }
    // Glissé surtout horizontal (carrousel, filtres) : on laisse faire.
    if (Math.abs(doigt.cumulX) > Math.abs(doigt.cumulY) * 1.2) return true
    gesteNeuf = doigt.neuf
  } else {
    // Nouveau geste : un silence entre deux crans, ou une nette accélération
    // (l'inertie d'un pavé tactile ne fait que décroître). Juste après un
    // arrêt avec pause, seul le silence compte.
    const amplitude = Math.abs(delta)
    const silence = maintenant - molette.dernier
    const pic = molette.recents.length > 0 ? Math.max(...molette.recents) : 0
    if (silence > SILENCE_GESTE_MS) silenceExige = false
    gesteNeuf = silence > SILENCE_GESTE_MS || (!silenceExige && amplitude > pic * 1.6 && amplitude > 6)
    molette.dernier = maintenant
    molette.recents = silence > SILENCE_GESTE_MS ? [amplitude] : [...molette.recents.slice(-3), amplitude]
  }
  if (delta === 0) return true

  const { pas, auBord } = choisir(lenis.targetScroll, delta)
  if (!pas && !auBord) return true

  const consommer = () => {
    if (evenement.cancelable) evenement.preventDefault()
    return false
  }
  const verrouille = maintenant < verrouJusqua

  // Au bord d'une zone : on ne la quitte qu'avec un geste neuf.
  if (!pas) return verrouille || !gesteNeuf ? consommer() : true
  if (verrouille) return consommer()
  if (!pas.decision.entree) {
    if (!gesteNeuf) return consommer()
    if (auDoigt && (evenement.type === 'touchend' || Math.abs(doigt.cumulY) < GLISSE_MIN_PX)) return consommer()
  }
  lancer(lenis, pas.zone, pas.decision.y, pas.decision.index)
  if (auDoigt) doigt.neuf = false
  return consommer()
}

/** Flèches, Page précédente / suivante et barre d'espace suivent les mêmes étapes. */
export function gererClavier(evenement: KeyboardEvent, lenis: Lenis | null): void {
  if (!lenis || lenis.isStopped || evenement.defaultPrevented) return
  if (evenement.altKey || evenement.ctrlKey || evenement.metaKey) return
  const cible = evenement.target instanceof Element ? evenement.target : null
  if (cible?.closest('input, textarea, select, video, [contenteditable], [role="dialog"], [role="tablist"]')) return
  if (evenement.key === ' ' && cible?.closest('button, a')) return

  const page = window.innerHeight * 0.9
  const deltas: Record<string, number> = {
    ArrowDown: 120,
    ArrowUp: -120,
    PageDown: page,
    PageUp: -page,
    ' ': evenement.shiftKey ? -page : page,
  }
  const delta = deltas[evenement.key]
  if (!delta) return

  const { pas } = choisir(lenis.targetScroll, delta)
  if (!pas) return
  evenement.preventDefault()
  if (performance.now() < verrouJusqua) return
  lancer(lenis, pas.zone, pas.decision.y, pas.decision.index)
}

/** Va directement à l'arrêt `index` d'une zone (flèches de navigation, pastilles). */
export function allerALEtape(lenis: Lenis | null, idZone: string, index: number): void {
  const zone = zones.get(idZone)
  if (!zone) return
  const arrets = zone.arrets()
  const borne = Math.max(0, Math.min(arrets.length - 1, index))
  const arret = arrets[borne]
  if (!arret) return
  if (!lenis) {
    zone.surEtape?.(borne)
    window.scrollTo({ top: arret.y, behavior: 'smooth' })
    return
  }
  lancer(lenis, zone, arret.y, borne)
}
