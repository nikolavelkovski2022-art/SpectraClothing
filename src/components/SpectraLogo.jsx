/**
 * Spectra Clothing brand mark — pure black & white, vector only.
 * A t-shirt silhouette holding an "S" spectrum shard (three ascending bars),
 * paired with the SPECTRA wordmark.
 */

export function SpectraMark({ size = 40, className = '' }) {
  return (
    <svg
      className={`spectra-mark ${className}`}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="Spectra Clothing logo"
    >
      <rect x="1" y="1" width="62" height="62" rx="14" className="mark-frame" />
      {/* t-shirt silhouette */}
      <path
        d="M12 28 L22 13 L42 13 L52 28 L45 32 L45 51 L19 51 L19 32 Z"
        className="mark-shirt"
      />
      {/* spectrum shard: three ascending bars = "S" for Spectra */}
      <rect x="25" y="38" width="4" height="7" className="mark-bar" />
      <rect x="30" y="34" width="4" height="11" className="mark-bar" />
      <rect x="35" y="29" width="4" height="16" className="mark-bar" />
    </svg>
  )
}

export function SpectraLogo({ size = 40, wordmark = true, className = '' }) {
  return (
    <div className={`spectra-logo ${className}`}>
      <SpectraMark size={size} />
      {wordmark && (
        <div className="spectra-wordmark">
          <span className="spectra-name">SPECTRA</span>
          <span className="spectra-sub">CLOTHING</span>
        </div>
      )}
    </div>
  )
}
