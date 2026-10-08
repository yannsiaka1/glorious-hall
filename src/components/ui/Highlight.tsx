/** Rend « Des [décorations] qui » avec les mots entre crochets en doré. */
export function Highlight({ texte }: { texte: string }) {
  return (
    <>
      {texte.split(/(\[[^\]]+\])/g).map((morceau, index) =>
        morceau.startsWith('[') ? (
          <span key={index} className="text-gold-600">
            {morceau.slice(1, -1)}
          </span>
        ) : (
          <span key={index}>{morceau}</span>
        ),
      )}
    </>
  )
}
