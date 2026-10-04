import { useAppState } from '../../engine/AppStateContext'
import { scenarios } from '../../engine/engine'
import { EVENT_TYPES, RAILS } from '../../engine/events'

export default function WorkflowPlayer() {
  const { state, setWorkflowState, addEvent, createEvent } = useAppState()
  
  const currentScenario = state.scenarioId ? scenarios[state.scenarioId] : null
  const visibleSteps = currentScenario ? currentScenario.steps.slice(0, state.currentStepIndex + 1) : []

  const handleUserAction = (step) => {
    if (step.type === 'SELECTION') {
      setWorkflowState('RUNNING')
    } else if (step.type === 'PAYMENT') {
      setWorkflowState('RUNNING')
    } else if (step.type === 'AGREEMENT') {
      setWorkflowState('RUNNING')
    } else if (step.type === 'ONBOARDING') {
      setWorkflowState('RUNNING')
    }
  }

  return (
    <div className="workflow-player">
      <div className="panel-header">
        <h3 className="panel-title">Workflow Execution</h3>
      </div>
      <div className="workflow-player__timeline">
        {visibleSteps.map((step, i) => {
          const isLast = i === visibleSteps.length - 1
          const isWaiting = isLast && (state.workflowState === 'WAITING_USER' || state.workflowState === 'WAITING_HUMAN')
          
          return (
            <div key={step.id} className={`demo-state demo-state--visible ${isWaiting ? 'demo-state--waiting' : ''}`}>
              <div className="demo-state__header">
                <span className="demo-state__label">{step.label}</span>
                {step.type === 'HITL' && <span className="demo-badge demo-badge--human">Human Required</span>}
                {step.type === 'USER_INPUT' && <span className="demo-badge demo-badge--user">Tenant Input</span>}
                {step.type === 'SELECTION' && <span className="demo-badge demo-badge--user">Tenant Action</span>}
                {step.type === 'PAYMENT' && <span className="demo-badge demo-badge--user">Tenant Action</span>}
                {step.type === 'AGREEMENT' && <span className="demo-badge demo-badge--user">Tenant Action</span>}
                {step.type === 'ONBOARDING' && <span className="demo-badge demo-badge--user">Tenant Action</span>}
              </div>
              <div className="demo-state__body">
                {step.content.message && (
                  <div className={`demo-state__message ${step.content.from === 'Tenant' ? 'demo-state__message--user' : 'demo-state__message--agent'}`}>
                    {step.content.message}
                  </div>
                )}
                
                {step.content.data && (
                  <div className="demo-state__data">
                    {step.content.data.map((row, idx) => (
                      <div key={idx} className="demo-state__data-row">
                        <span className="demo-state__data-key">{row.label}</span>
                        <span className={`demo-state__data-value ${row.highlight ? `demo-state__data-value--${row.highlight}` : ''}`}>
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {step.content.properties && (
                  <div className="demo-properties">
                    {step.content.properties.map(p => (
                      <div key={p.id} className="property-card">
                        <div className="property-card__header">
                          <span className="property-card__name">{p.name}</span>
                          <span className="property-card__score">Score: {p.score}</span>
                        </div>
                        <div className="property-card__details">
                          <div className="property-card__detail-item"><span className="property-card__detail-label">Config</span><span className="property-card__detail-value">{p.config}</span></div>
                          <div className="property-card__detail-item"><span className="property-card__detail-label">Rent</span><span className="property-card__detail-value">₹{p.rent}</span></div>
                          <div className="property-card__detail-item"><span className="property-card__detail-label">Pet</span><span className="property-card__detail-value">{p.pet}</span></div>
                        </div>
                        {isLast && state.workflowState === 'WAITING_USER' && (
                          <button className="btn btn--primary btn--small" style={{width: '100%', marginTop: '12px'}} onClick={() => handleUserAction(step)}>Select Property</button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {step.type === 'PAYMENT' && (
                  <div className="demo-payment">
                    <div className="demo-payment__amount">₹{step.content.amount}</div>
                    <div className="demo-payment__ref">Ref: {step.content.reference}</div>
                    {isLast && state.workflowState === 'WAITING_USER' && (
                      <button className="btn btn--primary" style={{width: '100%', marginTop: '16px'}} onClick={() => handleUserAction(step)}>Pay ₹{step.content.amount} (Demo)</button>
                    )}
                  </div>
                )}
                
                {step.content.options && (
                  <div className="demo-options">
                    {step.content.options.map((opt, idx) => (
                      <button key={idx} className="btn btn--secondary btn--small" style={{display: 'block', width: '100%', marginBottom: '8px', textAlign: 'left'}} onClick={() => handleUserAction(step)} disabled={!isLast || state.workflowState !== 'WAITING_USER'}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}

                {step.type === 'AGREEMENT' && (
                  <div className="demo-agreement">
                    <div className="demo-state__data">
                      {Object.entries(step.content.terms).map(([k, v]) => (
                        <div key={k} className="demo-state__data-row">
                          <span className="demo-state__data-key" style={{textTransform: 'capitalize'}}>{k}</span>
                          <span className="demo-state__data-value">{v}</span>
                        </div>
                      ))}
                    </div>
                    {isLast && state.workflowState === 'WAITING_USER' && (
                      <button className="btn btn--primary btn--small" style={{width: '100%', marginTop: '16px'}} onClick={() => handleUserAction(step)}>I have reviewed the terms</button>
                    )}
                  </div>
                )}

                {step.type === 'ONBOARDING' && isLast && state.workflowState === 'WAITING_USER' && (
                  <button className="btn btn--primary" style={{width: '100%', marginTop: '16px'}} onClick={() => handleUserAction(step)}>Confirm Onboarding</button>
                )}
              </div>
            </div>
          )
        })}
        {state.workflowState === 'COMPLETE' && (
          <div className="demo-state demo-state--visible">
            <div className="demo-state__header">
              <span className="demo-state__label">Workflow Complete</span>
            </div>
            <div className="demo-state__body">
              <p className="muted">The requested tenancy workflow has concluded.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
