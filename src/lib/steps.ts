import type Lenis from 'lenis'

/**
 * Défilement par étapes.
 *
 * Une « zone » est une suite d'arrêts (positions de défilement, en px dans le
 * document). Dans une zone, un cran de molette, un glissé au doigt ou une
 * touche fléchée amène exactement à l'arrêt suivant ; les crans qui suivent
 * dans le même geste (inertie du pavé tactile, molette tournée plusieurs fois)
 * sont absorbés. En arrivant d'au-dessus ou d'en dessous, le défilement est
 * « attrapé » pile sur le premier ou le dernier arrêt. Au-delà du dernier arrêt,
 * le défilement redevient normal.
 */
export type StepZone = {
  id: string
  /** Positions des arrêts, croissantes, en px depuis le haut du document. */
  stops: () => number[]
  /** Appelé dès qu'un pas est lancé, avec l'index de l'arrêt visé. */
  onStep?: (index: number) => void
}

type Decision =
  | { kind: 'free' }
  | { kind: 'edge' }
  | { kind: 'go'; to: number; index: number; entry: boolean }

const zones = new Map<string, StepZone>()
const STEP_DURATION = 1.05
const EPS = 2

let lockUntil = 0
const wheel = { last: 0, recent: [] as number[] }
const touch = { fresh: false, accum: 0, accumX: 0 }

export function registerZone(zone: StepZone) {
  zones.set(zone.id, zone)
  return () => {
    zones.delete(zone.id)
  }
}

/** Vrai pendant l'animation d'un pas (les composants ignorent alors la position brute). */
export function isStepping() {
  return performance.now() < lockUntil
}

/** Position d'un élément dans le document (indépendante du défilement courant). */
export function docTop(el: HTMLElement) {
  return el.getBoundingClientRect().top + window.scrollY
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

function decide(cur: number, delta: number, stops: number[]): Decision {
  if (!stops.length) return { kind: 'free' }
  const first = stops[0]
  const last = stops[stops.length - 1]
  if (cur < first - EPS) {
    return delta > 0 && cur + delta >= first - EPS ? { kind: 'go', to: first, index: 0, entry: true } : { kind: 'free' }
  }
  if (cur > last + EPS) {
    return delta < 0 && cur + delta <= last + EPS
      ? { kind: 'go', to: last, index: stops.length - 1, entry: true }
      : { kind: 'free' }
  }
  if (delta > 0) {
    const i = stops.findIndex((s) => s > cur + EPS)
    return i === -1 ? { kind: 'edge' } : { kind: 'go', to: stops[i], index: i, entry: false }
  }
  for (let i = stops.length - 1; i >= 0; i--) {
    if (stops[i] < cur - EPS) return { kind: 'go', to: stops[i], index: i, entry: false }
  }
  return { kind: 'edge' }
}

function pick(cur: number, delta: number) {
  let go: { zone: StepZone; d: Extract<Decision, { kind: 'go' }> } | null = null
  let edge = false
  for (const zone of zones.values()) {
    const d = decide(cur, delta, zone.stops())
    if (d.kind === 'edge') edge = true
    if (d.kind === 'go' && (!go || Math.abs(d.to - cur) < Math.abs(go.d.to - cur))) go = { zone, d }
  }
  return { go, edge }
}

function start(lenis: Lenis, zone: StepZone, to: number, index: number) {
  lockUntil = performance.now() + STEP_DURATION * 1000 * 0.82
  zone.onStep?.(index)
  lenis.scrollTo(to, { duration: STEP_DURATION, easing: easeInOut, lock: true, force: true })
}

/** Branché sur l'option `virtualScroll` de Lenis : renvoyer `false` consomme l'événement. */
export function handleVirtualScroll(
  data: { deltaX: number; deltaY: number; event: WheelEvent | TouchEvent },
  lenis: Lenis | null,
): boolean {
  if (!lenis || lenis.isStopped || !zones.size) return true
  const e = data.event
  const now = performance.now()
  const isTouch = e.type.startsWith('touch')

  if (e.type === 'touchstart') {
    touch.fresh = true
    touch.accum = 0
    touch.accumX = 0
    return true
  }

  const delta = data.deltaY
  let fresh: boolean
  if (isTouch) {
    if (e.type === 'touchmove') {
      touch.accum += delta
      touch.accumX += data.deltaX
    }
    // glissé surtout horizontal : on laisse faire
    if (Math.abs(touch.accumX) > Math.abs(touch.accum) * 1.2) return true
    fresh = touch.fresh
  } else {
    // Nouveau geste = pause de plus de 200 ms, ou nette accélération
    // (l'inertie d'un pavé tactile ne fait que décroître).
    const abs = Math.abs(delta)
    const gap = now - wheel.last
    const peak = wheel.recent.length ? Math.max(...wheel.recent) : 0
    fresh = gap > 200 || (abs > peak * 1.6 && abs > 6)
    wheel.last = now
    wheel.recent = gap > 200 ? [abs] : [...wheel.recent.slice(-3), abs]
  }
  if (!delta) return true

  const { go, edge } = pick(lenis.targetScroll, delta)
  if (!go && !edge) return true

  const consume = () => {
    if (e.cancelable) e.preventDefault()
    return false
  }
  const locked = now < lockUntil

  if (!go) {
    // Au bord d'une zone : on ne sort qu'avec un geste neuf.
    return locked || !fresh ? consume() : true
  }
  if (locked) return consume()
  if (!go.d.entry) {
    if (!fresh) return consume()
    if (isTouch && (e.type === 'touchend' || Math.abs(touch.accum) < 26)) return consume()
  }
  start(lenis, go.zone, go.d.to, go.d.index)
  if (isTouch) touch.fresh = false
  return consume()
}

/** Flèches, Page suivante/précédente et barre d'espace suivent les mêmes étapes. */
export function handleKeydown(e: KeyboardEvent, lenis: Lenis | null) {
  if (!lenis || lenis.isStopped || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return
  const target = e.target as HTMLElement | null
  if (target?.closest('input, textarea, select, video, [contenteditable], [role="dialog"], [role="tablist"]')) return
  if (e.key === ' ' && target?.closest('button, a')) return
  const page = window.innerHeight * 0.9
  const delta =
    e.key === 'ArrowDown' ? 120
    : e.key === 'ArrowUp' ? -120
    : e.key === 'PageDown' ? page
    : e.key === 'PageUp' ? -page
    : e.key === ' ' ? (e.shiftKey ? -page : page)
    : 0
  if (!delta) return
  const { go } = pick(lenis.targetScroll, delta)
  if (!go) return
  e.preventDefault()
  if (performance.now() < lockUntil) return
  start(lenis, go.zone, go.d.to, go.d.index)
}

/** Va directement à l'arrêt `index` d'une zone (flèches, pastilles). */
export function stepTo(lenis: Lenis | null, id: string, index: number) {
  const zone = zones.get(id)
  if (!zone) return
  const stops = zone.stops()
  const i = Math.max(0, Math.min(stops.length - 1, index))
  if (!lenis) {
    zone.onStep?.(i)
    window.scrollTo({ top: stops[i], behavior: 'smooth' })
    return
  }
  start(lenis, zone, stops[i], i)
}
