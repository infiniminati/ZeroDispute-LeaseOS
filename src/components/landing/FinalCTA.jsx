import { Link } from 'react-router-dom'

export default function FinalCTA() {
  const scrollToDemo = (e) => {
    e.preventDefault()
    const el = document.getElementById('live-demo')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="final-cta section--dark" aria-labelledby="final-cta-heading">
      <div className="container">
        <h2 id="final-cta-heading" className="serif">Your next move can run itself.</h2>
        <p>Start with what you need. ZeroDispute LeaseOS will build the tenancy state from there.</p>
        <div className="btn-group">
          <Link to="/start" className="btn btn--primary" id="final-start-cta">Start my tenancy</Link>
          <a href="#live-demo" className="btn btn--secondary btn--on-dark" onClick={scrollToDemo} id="final-demo-cta">See the live demo</a>
        </div>
      </div>
    </section>
  )
}
