/** Rend "Des [décorations] qui" avec les mots entre crochets en doré. */
export function Highlight({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\[[^\]]+\])/g).map((part, i) =>
        part.startsWith('[') ? (
          <span key={i} className="hl">
            {part.slice(1, -1)}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  )
}
