/**
 * Accès aux médias du dossier public/ et lecture fiable des vidéos.
 */

/**
 * Adresse d'un fichier de public/ (vidéo, affiche).
 *
 * La table `__MEDIAS__` (définie dans vite.config.ts à partir de la variable
 * MEDIAS) permet de servir certains fichiers depuis un autre hébergement : un
 * CDN, ou le stockage de l'aperçu en ligne. Elle est vide par défaut et les
 * fichiers sont alors servis par le site lui-même.
 */
export function media(chemin: string): string {
  return __MEDIAS__[chemin] ?? `${import.meta.env.BASE_URL}${chemin}`
}

/**
 * Prépare une vidéo d'ambiance (muette, lue dans la page) pour la lecture
 * automatique. React ne pose que la propriété `muted`, pas l'attribut : or
 * Safari sur iPhone exige l'attribut pour autoriser la lecture sans geste.
 */
export function preparerVideoMuette(video: HTMLVideoElement): void {
  video.muted = true
  video.defaultMuted = true
  video.setAttribute('muted', '')
  video.setAttribute('playsinline', '')
  video.setAttribute('webkit-playsinline', '')
}

/** Vidéos dont la lecture a été refusée et qui attendent un geste. */
const enAttente = new Set<HTMLVideoElement>()

const GESTES = ['pointerdown', 'touchstart', 'keydown'] as const

function relancerApresGeste(): void {
  for (const video of enAttente) {
    if (video.isConnected) void video.play().catch(() => undefined)
  }
  enAttente.clear()
  for (const geste of GESTES) window.removeEventListener(geste, relancerApresGeste, true)
}

/**
 * Lance la lecture d'une vidéo.
 *
 * Certains contextes refusent la lecture automatique, même muette : mode
 * économie d'énergie d'iOS, navigateurs intégrés à WhatsApp ou Facebook (par
 * où passent beaucoup de liens partagés). La vidéo repart alors au premier
 * geste de la personne sur la page, au lieu de rester figée sur son affiche.
 */
export function lire(video: HTMLVideoElement): void {
  video.play().catch((erreur: unknown) => {
    if (!(erreur instanceof DOMException) || erreur.name !== 'NotAllowedError') return
    if (enAttente.size === 0) {
      for (const geste of GESTES) window.addEventListener(geste, relancerApresGeste, { capture: true, passive: true })
    }
    enAttente.add(video)
  })
}

/** Met une vidéo en pause et annule une éventuelle relance en attente. */
export function arreter(video: HTMLVideoElement): void {
  enAttente.delete(video)
  video.pause()
}
