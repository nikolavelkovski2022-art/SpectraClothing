import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Customizer from './components/Customizer.jsx'
import HowItWorks from './components/HowItWorks.jsx'
import { Testimonials, Faq } from './components/FaqReviews.jsx'
import { SpectraMark } from './components/SpectraLogo.jsx'

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <span className="hero-kicker">Custom print studio</span>
        <h1>
          Your idea,
          <br />
          printed on
          <br />
          <em>anything you wear.</em>
        </h1>
        <p>
          Spectra Clothing prints custom designs on t-shirts, shirts, trousers and hoodies.
          Upload a picture or set your own letters — like <strong>G.O.A.T.</strong> — then
          drag it onto the front or back until it is perfect.
        </p>
        <div className="hero-actions">
          <a className="primary-btn" href="#customize">
            Start your design
          </a>
          <a className="ghost-btn" href="#how">
            See how it works
          </a>
        </div>
        <ul className="hero-facts">
          <li>No minimum order</li>
          <li>Front & back printing</li>
          <li>Mockup before we print</li>
        </ul>
      </div>

      <div className="hero-art" aria-hidden="true">
        <div className="hero-frame">
          <SpectraMark size={64} />
          <span className="hero-frame-label">Spectra · Custom Studio</span>
        </div>
      </div>
    </section>
  )
}

export default function App() {
  return (
    <div className="page">
      <Header />
      <main>
        <Hero />
        <Customizer />
        <HowItWorks />
        <Testimonials />
        <Faq />
      </main>
      <Footer />
    </div>
  )
}
