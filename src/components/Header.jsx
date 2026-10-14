import { SpectraLogo } from './SpectraLogo.jsx'

export default function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Spectra Clothing home">
        <SpectraLogo size={38} />
      </a>
      <nav className="site-nav" aria-label="Main">
        <a href="#customize">Customize</a>
        <a href="#how">How it works</a>
        <a href="#reviews">Reviews</a>
        <a href="#faq">FAQ</a>
      </nav>
      <a className="header-cta" href="#customize">
        Start your design
      </a>
    </header>
  )
}
