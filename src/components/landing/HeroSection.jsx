import { Link } from 'react-router-dom'
import './HeroSection.css'

export default function HeroSection() {
  const scrollToDemo = (e) => {
    e.preventDefault()
    const el = document.getElementById('live-demo')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="hero-section" aria-labelledby="hero-heading">
      <div className="hero__bg">
         <div className="hero__bg-grid"></div>
         <div className="hero__bg-markers">
           <span className="hero__bg-step">DISCOVER</span>
           <span className="hero__bg-arrow">→</span>
           <span className="hero__bg-step">VERIFY</span>
           <span className="hero__bg-arrow">→</span>
           <span className="hero__bg-step">DECIDE</span>
           <span className="hero__bg-arrow">→</span>
           <span className="hero__bg-step">ACT</span>
           <span className="hero__bg-arrow">→</span>
           <span className="hero__bg-step">CHECK</span>
         </div>
      </div>
      
      <div className="container hero__container">
        
        {/* Research Panels */}
        <div className="hero__research hero__research--1">
           <div className="hero__research-label">CUSTOMER VOICE RESEARCH NOTE</div>
           <div className="hero__research-quote">"Searching homes is no less than one hour every day. I just want to get one."</div>
        </div>

        <div className="hero__research hero__research--2">
           <div className="hero__research-label">CUSTOMER VOICE RESEARCH NOTE</div>
           <div className="hero__research-quote">"I just want my deposit back without having to chase the landlord."</div>
        </div>

        {/* Glass Panels */}
        <div className="hero__glass-panel hero__glass-panel--1">
           <div className="hero__glass-label">PROPERTY MATCH</div>
           <div className="hero__glass-value">94%</div>
        </div>
        
        <div className="hero__glass-panel hero__glass-panel--2">
           <div className="hero__glass-label">VERIFICATION</div>
           <div className="hero__glass-value">PASSED</div>
        </div>

        <div className="hero__glass-panel hero__glass-panel--3">
           <div className="hero__glass-label">TENANCY STATE</div>
           <div className="hero__glass-value">ACTIVE</div>
        </div>

        <div className="hero__glass-panel hero__glass-panel--4">
           <div className="hero__glass-label">PAYMENT</div>
           <div className="hero__glass-value">AUTHORISED</div>
        </div>

        {/* Main Center Content */}
        <div className="hero__content animate-fade-in-up">
          <div className="hero__eyebrow">
            AUTONOMOUS TENANCY<br/>OPERATING SYSTEM
          </div>

          <h1 id="hero-heading" className="hero__headline">
            YOUR TENANCY,<br/>
            <span className="hero__headline-accent">RUN.</span>
          </h1>

          <p className="hero__supporting">
            One agentic layer that coordinates the rental journey from property discovery to verified move-in, maintenance and move-out settlement.
          </p>

          <div className="hero__cta-area">
            <Link to="/start" className="btn btn--primary" id="hero-start-cta">START YOUR TENANCY</Link>
            <a href="#live-demo" className="btn btn--secondary" onClick={scrollToDemo} id="hero-demo-cta">WATCH LIVE DEMO</a>
          </div>
        </div>
      </div>
    </section>
  )
}
