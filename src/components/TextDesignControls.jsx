const FONT_OPTIONS = [
  { id: 'block', label: 'Block', stack: 'Arial, Helvetica, sans-serif', weight: 800 },
  { id: 'grotesk', label: 'Grotesk', stack: '"Space Grotesk", sans-serif', weight: 700 },
  { id: 'serif', label: 'Serif', stack: 'Georgia, "Times New Roman", serif', weight: 700 },
  { id: 'mono', label: 'Mono', stack: '"Courier New", monospace', weight: 700 },
]

export default function TextDesignControls({ text, onText }) {
  return (
    <div className="text-controls">
      <label className="field">
        <span className="field-label">Your letters</span>
        <input
          type="text"
          value={text.value}
          maxLength={24}
          placeholder="G.O.A.T."
          onChange={(e) => onText({ ...text, value: e.target.value })}
        />
      </label>

      <label className="field">
        <span className="field-label">Font</span>
        <select
          value={text.font}
          onChange={(e) => onText({ ...text, font: e.target.value })}
        >
          {FONT_OPTIONS.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span className="field-label">Letters only (no fill)</span>
        <select
          value={text.fill}
          onChange={(e) => onText({ ...text, fill: e.target.value })}
        >
          <option value="solid">Solid</option>
          <option value="outline">Outline</option>
        </select>
      </label>

      <label className="field">
        <span className="field-label">Spacing</span>
        <input
          type="range"
          min="0"
          max="24"
          value={text.spacing}
          onChange={(e) => onText({ ...text, spacing: Number(e.target.value) })}
        />
      </label>

      <p className="field-hint">
        Tip: hold and drag the design on the shirt to position it, and use the size slider below.
      </p>
    </div>
  )
}

export { FONT_OPTIONS }
