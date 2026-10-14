import { SpectraLogo } from './SpectraLogo.jsx'

export default function Footer() {
  return (
    <footer className="site-footer" id="top-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <SpectraLogo size={42} />
          <p>
            Spectra Clothing is a custom print studio. You bring the idea — a photo, a
            drawing, a word — and we put it on the garment you choose.
          </p>
        </div>
        <div className="footer-col">
          <h5>Studio</h5>
          <a href="#customize">Start a design</a>
          <a href="#how">How it works</a>
          <a href="#faq">Print guide</a>
        </div>
        <div className="footer-col">
          <h5>Contact</h5>
          <a href="mailto:hello@spectraclothing.com">hello@spectraclothing.com</a>
          <a href="tel:+10000000000">+1 (000) 000-0000</a>
          <span>Mon–Sat · 9:00–18:00</span>
        </div>
      </div>
      <div className="footer-base">
        <span>© {new Date().getFullYear()} Spectra Clothing. All rights reserved.</span>
        <span>Designed in black &amp; white.</span>
      </div>
    </footer>
  )
}
