/** Assemble des classes CSS en ignorant les valeurs fausses (`cond && 'classe'`). */
export const cn = (...classes: (string | false | null | undefined)[]): string => classes.filter(Boolean).join(' ')
