/** Courbe d'animation commune au site : départ vif, arrivée très douce. */
export const EASE = [0.22, 1, 0.36, 1] as const

/** Courbe des dévoilements par masque (titres manuscrits, bandeaux) : accélère puis ralentit. */
export const EASE_DEVOILEMENT = [0.65, 0, 0.35, 1] as const
