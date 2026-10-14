import { useMemo, useState } from 'react'
import {
  GARMENT_TYPES,
  DESIGN_TYPES,
  GARMENT_COLORS,
  SIZES,
  PRINT_SIDES,
  GARMENT_ART,
  SIDE_PRICING,
} from '../data.js'
import StepGarment from './StepGarment.jsx'
import StepDesignType from './StepDesignType.jsx'
import DesignUploader from './DesignUploader.jsx'
import TextDesignControls, { FONT_OPTIONS } from './TextDesignControls.jsx'
import GarmentPreview from './GarmentPreview.jsx'

const DEFAULT_TEXT = { value: 'G.O.A.T.', font: 'block', fill: 'solid', spacing: 4 }

export default function Customizer() {
  const [garmentId, setGarmentId] = useState('tshirt')
  const [designType, setDesignType] = useState('upload')
  const [size, setSize] = useState('M')
  const [color, setColor] = useState('black')
  const [side, setSide] = useState('front')
  const [file, setFile] = useState(null)
  const [text, setText] = useState(DEFAULT_TEXT)
  const [note, setNote] = useState('')
  const [submitted, setSubmitted] = useState(false)

  // Placement for each side, stored separately so front and back can differ.
  const [placement, setPlacement] = useState({
    front: { x: 160, y: 190, w: 120, h: 120 },
    back: { x: 160, y: 190, w: 120, h: 120 },
  })

  const garment = GARMENT_TYPES.find((g) => g.id === garmentId)
  const fontStack = FONT_OPTIONS.find((f) => f.id === text.font) ?? FONT_OPTIONS[0]

  const activeDesign = useMemo(() => {
    const p = placement[side]
    if (designType === 'text') {
      return {
        textValue: text.value || 'TEXT',
        fontStack: fontStack.stack,
        fontWeight: fontStack.weight,
        fill: text.fill,
        spacing: text.spacing,
        fontSize: Math.max(12, p.w * 0.28),
        x: p.x,
        y: p.y,
      }
    }
    if (!file) return null
    return { src: file.dataUrl, x: p.x, y: p.y, w: p.w, h: p.h }
  }, [designType, text, file, placement, side, fontStack])

  const sidesUsed = PRINT_SIDES.filter(
    (s) => designType === 'text' || Boolean(file),
  ).length

  const estimate = useMemo(() => {
    const designFee = designType === 'text' ? 0 : garment.designPrice
    return (
      garment.basePrice +
      designFee * (designType === 'combo' ? 2 : 1) +
      SIDE_PRICING[sidesUsed]
    )
  }, [garment, designType, sidesUsed])

  const setSidePlacement = (patch) =>
    setPlacement((prev) => ({ ...prev, [side]: { ...prev[side], ...patch } }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 6000)
  }

  return (
    <section className="customizer" id="customize">
      <div className="customizer-head">
        <span className="step-kicker">The studio</span>
        <h2>Build your custom piece</h2>
        <p>Three steps: the garment, the design, the placement. We handle the rest.</p>
      </div>

      <div className="customizer-grid">
        <div className="customizer-steps">
          <StepGarment value={garmentId} onChange={setGarmentId} />
          <StepDesignType value={designType} onChange={setDesignType} />

          <div className="step">
            <header className="step-head">
              <span className="step-kicker">Step 03</span>
              <h3>Place it on the {garment.label.toLowerCase()}</h3>
              <p>
                Drag the design on the mockup, switch sides and set the size until it feels
                right.
              </p>
            </header>

            {(designType === 'upload' || designType === 'combo') && (
              <DesignUploader file={file} onFile={setFile} onClear={() => setFile(null)} />
            )}
            {(designType === 'text' || designType === 'combo') && (
              <TextDesignControls text={text} onText={setText} />
            )}
          </div>
        </div>

        <aside className="customizer-panel">
          <div className="panel-card">
            <GarmentPreview
              garmentId={garmentId}
              side={side}
              color={color}
              design={activeDesign}
              onDragEnd={({ x, y }) => setSidePlacement({ x, y })}
            />

            <div className="panel-controls">
              <div className="control-row">
                <span className="field-label">Side</span>
                <div className="segmented">
                  {PRINT_SIDES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className={side === s.id ? 'is-active' : ''}
                      onClick={() => setSide(s.id)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <label className="control-row">
                <span className="field-label">
                  Design size — {Math.round(placement[side].w)} px
                </span>
                <input
                  type="range"
                  min="40"
                  max="220"
                  value={placement[side].w}
                  onChange={(e) => {
                    const w = Number(e.target.value)
                    setSidePlacement({ w, h: w })
                  }}
                />
              </label>

              <div className="control-row">
                <span className="field-label">Garment colour</span>
                <div className="swatches">
                  {GARMENT_COLORS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      title={c.label}
                      aria-label={c.label}
                      className={`swatch ${color === c.id ? 'is-active' : ''}`}
                      style={{ background: c.hex }}
                      onClick={() => setColor(c.id)}
                    />
                  ))}
                </div>
              </div>

              <div className="control-row">
                <span className="field-label">Size</span>
                <div className="segmented segmented--wrap">
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={size === s ? 'is-active' : ''}
                      onClick={() => setSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <form className="order-card" onSubmit={handleSubmit}>
            <h4>Your order</h4>
            <ul className="order-list">
              <li>
                <span>Garment</span>
                <strong>
                  {garment.label} · {size}
                </strong>
              </li>
              <li>
                <span>Colour</span>
                <strong>{GARMENT_COLORS.find((c) => c.id === color).label}</strong>
              </li>
              <li>
                <span>Design</span>
                <strong>
                  {DESIGN_TYPES.find((d) => d.id === designType).label}
                  {designType !== 'text' && file ? ` (${file.name})` : ''}
                  {designType !== 'upload' ? ` · "${text.value || 'TEXT'}"` : ''}
                </strong>
              </li>
              <li>
                <span>Printed on</span>
                <strong>
                  {sidesUsed === 2 ? 'Front & back' : side === 'front' ? 'Front' : 'Back'}
                </strong>
              </li>
            </ul>

            <label className="field">
              <span className="field-label">Notes for the print team</span>
              <textarea
                rows={3}
                value={note}
                placeholder="e.g. keep the design 3 cm below the collar, matte finish please"
                onChange={(e) => setNote(e.target.value)}
              />
            </label>

            <div className="order-total">
              <span>Estimated total</span>
              <strong>${estimate}</strong>
            </div>

            <button type="submit" className="primary-btn">
              Send print request
            </button>
            {submitted && (
              <p className="order-success">
                Request saved — we'll reply with a final quote and mockup within 24 hours.
              </p>
            )}
            <p className="order-note">
              No payment now. We confirm price and timeline before anything is printed.
            </p>
          </form>
        </aside>
      </div>
    </section>
  )
}
