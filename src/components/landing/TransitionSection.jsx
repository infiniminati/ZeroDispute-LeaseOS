export default function TransitionSection() {
  return (
    <section className="transition-section" aria-labelledby="transition-heading">
      <div className="container container--narrow text-center">
        <h2 id="transition-heading" className="transition-section__headline">
          FROM MANY HANDOFFS<br/>TO ONE TENANCY STATE.
        </h2>
        
        <div className="transition-section__visual">
          <div className="transition-section__inputs">
            <span>Tenant</span>
            <span>Landlord</span>
            <span>Property</span>
            <span>Lease</span>
            <span>Payments</span>
            <span>Services</span>
            <span>Evidence</span>
            <span>Logistics</span>
          </div>
          
          <div className="transition-section__arrow">↓</div>
          
          <div className="transition-section__arbiter">
            TENANCY ARBITER
          </div>
          
          <div className="transition-section__arrow">↓</div>
          
          <div className="transition-section__output">
            ONE SHARED TENANCY STATE
          </div>
        </div>
      </div>
    </section>
  )
}
