import { contact } from '../content'

/**
 * Plan d'accès schématique, dans l'esprit de la maquette : rues, rond-point du
 * Carrefour Témoin, repère Glorious Hall et entrée après le Yapaki Prestige.
 * Un clic ouvre l'itinéraire précis dans Google Maps.
 */
export function MapCard({ className = '', compact = false }: { className?: string; compact?: boolean }) {
  return (
    <a
      href={contact.mapsLink}
      target="_blank"
      rel="noreferrer"
      aria-label="Ouvrir le plan d’accès dans Google Maps"
      className={`group relative block overflow-hidden bg-[#eceae6] ${className}`}
    >
      <svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" className="h-full w-full transition-transform duration-700 ease-(--ease-lux) group-hover:scale-105" aria-hidden="true">
        <rect width="400" height="260" fill="#eceae6" />
        {/* îlots et parcs */}
        <g fill="#e2dfda">
          <rect x="18" y="20" width="92" height="64" rx="4" />
          <rect x="128" y="18" width="70" height="52" rx="4" />
          <rect x="250" y="150" width="96" height="70" rx="4" />
          <rect x="30" y="160" width="110" height="78" rx="4" />
          <rect x="300" y="24" width="80" height="58" rx="4" />
        </g>
        <g fill="#cfe5c8">
          <path d="M44 118l46-36 22 28-46 36z" />
          <path d="M318 96l34-22 16 24-34 22z" />
          <path d="M196 214l28-18 14 20-28 18z" />
        </g>
        {/* rues secondaires */}
        <g stroke="#ffffff" strokeWidth="9" strokeLinecap="round" fill="none">
          <path d="M-10 140L410 60" />
          <path d="M-10 230L190 128" />
          <path d="M120 -10L170 270" />
          <path d="M250 270L300 -10" />
          <path d="M190 128L410 200" />
        </g>
        {/* grand axe */}
        <path d="M272 -10C262 70 244 118 206 150S150 230 140 270" stroke="#f7d27a" strokeWidth="12" fill="none" />
        <path d="M272 -10C262 70 244 118 206 150S150 230 140 270" stroke="#e7b94f" strokeWidth="1.5" strokeDasharray="6 7" fill="none" />
        {/* rond-point du Carrefour Témoin */}
        <circle cx="236" cy="110" r="15" fill="#ffffff" stroke="#f7d27a" strokeWidth="6" />
        {/* repères */}
        <g fontFamily="Arimo, Arial, sans-serif" fontWeight="700">
          <text x="78" y="112" fontSize="13" fill="#2f6fd6">Bonamoussadi</text>
          <path d="M236 66c0-6 5-11 11-11s11 5 11 11c0 8-11 18-11 18s-11-10-11-18z" fill="#3b82f6" />
          <text x="262" y="64" fontSize="12" fill="#2f6fd6">Carrefour</text>
          <text x="262" y="78" fontSize="12" fill="#2f6fd6">Témoin</text>
          <path d="M262 168c0-5 4-9 9-9s9 4 9 9c0 7-9 15-9 15s-9-8-9-15z" fill="#8aa5d8" />
          <text x="284" y="168" fontSize="11" fill="#5b7fc4">Yapaki</text>
          <text x="284" y="181" fontSize="11" fill="#5b7fc4">Prestige</text>
          <path d="M184 112c0-9 7-16 16-16s16 7 16 16c0 12-16 28-16 28s-16-16-16-28z" fill="#e53935" />
          <circle cx="200" cy="112" r="5.5" fill="#8e1414" />
          <text x="150" y="160" fontSize="13" fill="#d32f2f">GLORIOUS HALL</text>
        </g>
      </svg>
      {!compact && (
        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[#9a6a2e]/95 px-3 py-1.5 text-center text-[0.68rem] font-bold leading-tight text-white shadow-lg">
          Entrée après celle
          <br />
          du Yapaki Prestige
        </span>
      )}
    </a>
  )
}
