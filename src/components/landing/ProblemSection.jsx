export default function ProblemSection() {
  const problems = [
    { stage: 'DISCOVERY', task: 'Find suitable homes.', friction: 'Stale listings, irrelevant inventory, repeated calls.' },
    { stage: 'OWNER CONTACT', task: 'Reach the decision maker.', friction: 'Unresponsive owners, missing details, brokered listings.' },
    { stage: 'VISIT', task: 'Confirm the property.', friction: 'Coordination and verification.' },
    { stage: 'VERIFICATION', task: 'Check listing accuracy.', friction: 'Hidden condition issues and missing amenities.' },
    { stage: 'AGREEMENT', task: 'Sign the lease.', friction: 'Unclear terms and lack of standardisation.' },
    { stage: 'PAYMENT', task: 'Pay rent and deposit.', friction: 'Manual tracking and unverified beneficiaries.' },
    { stage: 'MOVE', task: 'Relocate household.', friction: 'Coordinating packers, movers, and deep cleaning.' },
    { stage: 'MAINTENANCE', task: 'Get a repair completed.', friction: 'Repeated follow-up and unclear responsibility.' },
    { stage: 'MOVE-OUT', task: 'Recover deposit.', friction: 'Evidence disputes.' },
    { stage: 'SETTLEMENT', task: 'Finalise accounts.', friction: 'Delayed refunds and arbitrary deductions.' }
  ];

  return (
    <section className="problem-section" aria-labelledby="problem-heading">
      <div className="container container--narrow">
        <h2 id="problem-heading" className="problem-section__headline">
          RENTING IS A CHAIN OF HANDOFFS.
        </h2>
        
        <div className="problem-section__timeline">
          {problems.map((item, index) => (
            <div key={item.stage} className="problem-item">
              <div className="problem-item__node"></div>
              <div className="problem-item__content">
                <div className="problem-item__stage">{item.stage}</div>
                <div className="problem-item__details">
                  <span className="problem-item__label">TASK</span>
                  <span className="problem-item__text">{item.task}</span>
                </div>
                <div className="problem-item__details">
                  <span className="problem-item__label">FRICTION</span>
                  <span className="problem-item__text problem-item__text--friction">{item.friction}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
