import { useRef, useState } from 'react'

const MAX_FILE_BYTES = 8 * 1024 * 1024

export default function DesignUploader({ file, onFile, onClear }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')

  const acceptFile = (candidate) => {
    if (!candidate) return
    if (!candidate.type.startsWith('image/')) {
      setError('That file is not an image. Try a PNG, JPG, SVG or WEBP.')
      return
    }
    if (candidate.size > MAX_FILE_BYTES) {
      setError('That file is over 8 MB. Please compress it and try again.')
      return
    }
    setError('')
    const reader = new FileReader()
    reader.onload = () => onFile({ name: candidate.name, dataUrl: reader.result })
    reader.onerror = () => setError('We could not read that file. Please try another one.')
    reader.readAsDataURL(candidate)
  }

  return (
    <div className="uploader">
      <div
        className={`dropzone ${dragging ? 'is-dragging' : ''} ${file ? 'has-file' : ''}`}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          acceptFile(e.dataTransfer.files?.[0])
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => acceptFile(e.target.files?.[0])}
        />

        {file ? (
          <div className="dropzone-preview">
            <img src={file.dataUrl} alt={`Uploaded design: ${file.name}`} />
            <div className="dropzone-meta">
              <strong>{file.name}</strong>
              <span>Drag it anywhere on the garment to position it.</span>
            </div>
          </div>
        ) : (
          <div className="dropzone-empty">
            <svg viewBox="0 0 48 48" className="dropzone-icon" aria-hidden="true">
              <path d="M24 34 L24 12 M15 21 L24 12 L33 21" />
              <path d="M10 32 L10 38 L38 38 L38 32" />
            </svg>
            <strong>Drop your design here</strong>
            <span>or click to browse — PNG, JPG, SVG, WEBP up to 8 MB</span>
          </div>
        )}
      </div>

      {file && (
        <button type="button" className="ghost-btn" onClick={onClear}>
          Remove image
        </button>
      )}
      {error && <p className="field-error">{error}</p>}
    </div>
  )
}
