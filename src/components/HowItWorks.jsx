import { SpectraMark } from './SpectraLogo.jsx'

const STEPS = [
  {
    n: '01',
    title: 'Choose the garment',
    body: 'T-shirt, button-down shirt, trousers or hoodie — pick what carries your design.',
  },
  {
    n: '02',
    title: 'Bring the design',
    body: 'Upload a picture, set letters like “G.O.A.T.”, or combine both into one artwork.',
  },
  {
    n: '03',
    title: 'Place it exactly',
    body: 'Drag it on the front or back, set the size, and see the mockup update live.',
  },
  {
    n: '04',
    title: 'We print & deliver',
    body: 'You get a final mockup and quote first. Then we print it and ship it to you.',
  },
]

export default function HowItWorks() {
  return (
    <section className="how" id="how">
      <div className="section-head">
        <span className="step-kicker">How it works</span>
        <h2>From an idea to a printed piece</h2>
        <p>No design skills needed. If you can describe it, we can print it.</p>
      </div>

      <ol className="how-grid">
        {STEPS.map((s) => (
          <li key={s.n} className="how-card">
            <span className="how-num">{s.n}</span>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
          </li>
        ))}
      </ol>

      <div className="stats">
        <div className="stat">
          <SpectraMark size={30} />
          <strong>3,200+</strong>
          <span>custom pieces printed</span>
        </div>
        <div className="stat">
          <SpectraMark size={30} />
          <strong>48h</strong>
          <span>average turnaround</span>
        </div>
        <div className="stat">
          <SpectraMark size={30} />
          <strong>100%</strong>
          <span>black & white precision</span>
        </div>
      </div>
    </section>
  )
}
