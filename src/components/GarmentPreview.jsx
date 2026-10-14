import { GARMENT_ART, GARMENT_COLORS } from '../data.js'

/**
 * The live mockup: garment line-art + draggable design layer.
 * `design` = { src?, text?: {value, font, fill, spacing}, ... } for the ACTIVE side.
 */
export default function GarmentPreview({
  garmentId,
  side,
  color,
  design,
  onDragEnd,
  height = 460,
}) {
  const art = GARMENT_ART[garmentId]
  const zone = art.printZones[side]
  const swatch = GARMENT_COLORS.find((c) => c.id === color) ?? GARMENT_COLORS[0]

  const handlePointerDown = (e) => {
    if (!onDragEnd) return
    const stage = e.currentTarget.closest('.preview-stage')
    if (!stage) return
    const stageRect = stage.getBoundingClientRect()
    const startX = e.clientX
    const startY = e.clientY
    const origX = design.x
    const origY = design.y

    const move = (ev) => {
      const dx = ((ev.clientX - startX) / stageRect.width) * 320
      const dy = ((ev.clientY - startY) / stageRect.height) * 400
      onDragEnd({
        x: Math.max(0, Math.min(320, origX + dx)),
        y: Math.max(0, Math.min(400, origY + dy)),
      })
    }
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    e.preventDefault()
  }

  return (
    <div className="preview-stage" style={{ height }}>
      <svg
        className="garment-svg"
        viewBox="0 0 320 400"
        preserveAspectRatio="xMidYMid meet"
      >
        <g
          className="garment-body"
          fill={swatch.soft}
          stroke={swatch.ink}
          strokeWidth="3"
          strokeLinejoin="round"
          dangerouslySetInnerHTML={{ __html: art[side] }}
        />
        {design && (
          <g
            className="design-layer"
            style={{ cursor: onDragEnd ? 'grab' : 'default' }}
            onPointerDown={handlePointerDown}
          >
            {design.src ? (
              <image
                href={design.src}
                x={design.x - design.w / 2}
                y={design.y - design.h / 2}
                width={design.w}
                height={design.h}
                preserveAspectRatio="xMidYMid meet"
              />
            ) : (
              <text
                x={design.x}
                y={design.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={design.fill === 'outline' ? 'none' : swatch.ink}
                stroke={design.fill === 'outline' ? swatch.ink : 'none'}
                strokeWidth={design.fill === 'outline' ? 1.4 : 0}
                style={{
                  fontFamily: design.fontStack,
                  fontWeight: design.fontWeight,
                  fontSize: `${design.fontSize}px`,
                  letterSpacing: `${design.spacing}px`,
                }}
              >
                {design.textValue}
              </text>
            )}
          </g>
        )}
      </svg>
      <span className="preview-label">
        {side === 'front' ? 'Front' : 'Back'} · {zone.label}
      </span>
    </div>
  )
}
