import { GARMENT_TYPES, GARMENT_ART } from '../data.js'

function MiniArt({ garmentId, side = 'front' }) {
  return (
    <svg
      className="card-art"
      viewBox="0 0 320 400"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: GARMENT_ART[garmentId][side] }}
    />
  )
}

export default function StepGarment({ value, onChange }) {
  return (
    <div className="step">
      <header className="step-head">
        <span className="step-kicker">Step 01</span>
        <h3>What are we printing on?</h3>
        <p>Pick the piece of clothing that carries your design.</p>
      </header>

      <div className="card-grid">
        {GARMENT_TYPES.map((g) => {
          const active = value === g.id
          return (
            <button
              key={g.id}
              type="button"
              className={`pick-card ${active ? 'is-active' : ''}`}
              onClick={() => onChange(g.id)}
              aria-pressed={active}
            >
              <span className="pick-badge">{active ? 'Selected' : g.label}</span>
              <MiniArt garmentId={g.id} />
              <span className="pick-title">{g.label}</span>
              <span className="pick-tagline">{g.tagline}</span>
              <span className="pick-price">from ${g.basePrice}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
