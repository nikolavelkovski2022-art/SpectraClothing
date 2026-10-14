import { DESIGN_TYPES } from '../data.js'

const ICONS = {
  upload: (
    <svg viewBox="0 0 48 48" className="pick-icon" aria-hidden="true">
      <rect x="8" y="12" width="32" height="26" rx="3" />
      <path d="M8 32 L18 22 L26 30 L32 26 L40 32" />
      <circle cx="31" cy="19" r="3" />
      <path d="M24 12 L24 4 M19 9 L24 4 L29 9" />
    </svg>
  ),
  text: (
    <svg viewBox="0 0 48 48" className="pick-icon" aria-hidden="true">
      <path d="M10 14 L38 14 M24 14 L24 36 M18 36 L30 36" />
    </svg>
  ),
  combo: (
    <svg viewBox="0 0 48 48" className="pick-icon" aria-hidden="true">
      <rect x="6" y="10" width="24" height="20" rx="3" />
      <path d="M6 25 L13 18 L19 24 L23 21 L30 25" />
      <path d="M12 36 L36 36 M12 42 L30 42" />
    </svg>
  ),
}

export default function StepDesignType({ value, onChange }) {
  return (
    <div className="step">
      <header className="step-head">
        <span className="step-kicker">Step 02</span>
        <h3>How should we build your design?</h3>
        <p>Upload artwork, set letters like “G.O.A.T.”, or mix both.</p>
      </header>

      <div className="card-grid card-grid--three">
        {DESIGN_TYPES.map((d) => {
          const active = value === d.id
          return (
            <button
              key={d.id}
              type="button"
              className={`pick-card pick-card--type ${active ? 'is-active' : ''}`}
              onClick={() => onChange(d.id)}
              aria-pressed={active}
            >
              <span className="pick-badge">{active ? 'Selected' : 'Option'}</span>
              {ICONS[d.id]}
              <span className="pick-title">{d.label}</span>
              <span className="pick-tagline">{d.tagline}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
