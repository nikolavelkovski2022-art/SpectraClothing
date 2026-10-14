import { useState } from 'react'
import { TESTIMONIALS, FAQS } from '../data.js'

export function Testimonials() {
  return (
    <section className="reviews" id="reviews">
      <div className="section-head">
        <span className="step-kicker">Reviews</span>
        <h2>People wear their ideas</h2>
      </div>
      <div className="review-grid">
        {TESTIMONIALS.map((t) => (
          <figure key={t.name} className="review-card">
            <blockquote>“{t.quote}”</blockquote>
            <figcaption>
              <strong>{t.name}</strong>
              <span>{t.meta}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

export function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <section className="faq" id="faq">
      <div className="section-head">
        <span className="step-kicker">FAQ</span>
        <h2>Good to know</h2>
      </div>
      <div className="faq-list">
        {FAQS.map((item, i) => (
          <div key={item.q} className={`faq-item ${open === i ? 'is-open' : ''}`}>
            <button
              type="button"
              className="faq-q"
              aria-expanded={open === i}
              onClick={() => setOpen(open === i ? -1 : i)}
            >
              <span>{item.q}</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 5 L12 19 M5 12 L19 12" />
              </svg>
            </button>
            <div className="faq-a">
              <p>{item.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
