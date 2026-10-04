import { useState, useEffect } from 'react'
import { useAppState } from '../../engine/AppStateContext'
import { AGENTS, RAILS } from '../../engine/events'
import './Architecture.css'

const agents = [
  { id: AGENTS.INTAKE, name: 'Intake Agent', desc: 'Understands tenant intent from text, voice or form data.' },
  { id: AGENTS.SEARCH, name: 'Search Agent', desc: 'Finds relevant property candidates by location, budget, configuration, commute and timing.' },
  { id: AGENTS.VERIFICATION, name: 'Verification Agent', desc: 'Checks property evidence, listing consistency and condition baselines.' },
  { id: AGENTS.VOICE, name: 'Voice Agent', desc: 'Handles owner calls, tenant voice requests, multilingual communication and availability confirmation.' },
  { id: AGENTS.LOGISTICS, name: 'Logistics Agent', desc: 'Manages address verification, moving workflow, routing and logistics validation.' },
  { id: AGENTS.FINANCE, name: 'Finance Agent', desc: 'Handles rent payment, authorised payout, deposit settlement and payment state.' },
  { id: AGENTS.MAINTENANCE, name: 'Maintenance Agent', desc: 'Manages ticket creation, category routing, urgency assessment, vendor routing and SLA monitoring.' },
  { id: AGENTS.SETTLEMENT, name: 'Settlement Agent', desc: 'Handles move-out evidence, damage comparison, deposit deduction logic and settlement preparation.' },
  { id: AGENTS.SCHEDULING, name: 'Scheduling Agent', desc: 'Coordinates availability across parties.' },
  { id: AGENTS.AGREEMENT, name: 'Agreement Agent', desc: 'Drafts terms based on lease parameters.' },
]

const rails = [
  { id: RAILS.NOBROKER, name: 'NoBroker', desc: 'Tenancy context: property, tenant, owner, listing, lease, service history', status: 'Available rail' },
  { id: RAILS.GNANI, name: 'Gnani', desc: 'Voice infrastructure: speech recognition, voice interaction, multilingual communication', status: 'Proposed rail capability' },
  { id: RAILS.DELHIVERY, name: 'Delhivery', desc: 'Spatial and logistics: address validation, route intelligence, moving workflow', status: 'Proposed rail capability' },
  { id: RAILS.PINE_LABS, name: 'Pine Labs', desc: 'Payment infrastructure: rent transactions, authorised payouts, settlement', status: 'Proposed rail capability' },
]

export default function ArchitectureSection() {
  const { state } = useAppState()
  
  const [localDemoStep, setLocalDemoStep] = useState(0)
  const [isLocalDemoRunning, setIsLocalDemoRunning] = useState(false)
  
  useEffect(() => {
    let timer;
    if (isLocalDemoRunning) {
      timer = setTimeout(() => {
        setLocalDemoStep(prev => {
          if (prev >= 6) {
             setIsLocalDemoRunning(false);
             return 0;
          }
          return prev + 1;
        })
      }, 1500);
    }
    return () => clearTimeout(timer);
  }, [isLocalDemoRunning, localDemoStep])
  
  const isAgentActive = (agentId) => {
    if (isLocalDemoRunning) {
      if (localDemoStep === 1) return agentId === AGENTS.INTAKE || agentId === AGENTS.ARBITER
      if (localDemoStep === 2) return agentId === AGENTS.SEARCH || agentId === AGENTS.ARBITER
      if (localDemoStep === 3) return agentId === AGENTS.VERIFICATION || agentId === AGENTS.ARBITER
      if (localDemoStep === 4) return agentId === AGENTS.FINANCE || agentId === AGENTS.ARBITER
      if (localDemoStep === 5) return agentId === AGENTS.VOICE || agentId === AGENTS.ARBITER
      return false
    }
    return state.agents[agentId] === 'ACTIVE'
  }

  const isRailActive = (railId) => {
    if (isLocalDemoRunning) {
      if (localDemoStep === 1 || localDemoStep === 2) return railId === RAILS.NOBROKER
      if (localDemoStep === 3) return railId === RAILS.DELHIVERY
      if (localDemoStep === 4) return railId === RAILS.PINE_LABS
      if (localDemoStep === 5) return railId === RAILS.GNANI
      return false
    }
    return state.rails[railId] === 'ACTIVE'
  }

  const isArbiterActive = isLocalDemoRunning ? (localDemoStep > 0 && localDemoStep <= 5) : state.agents[AGENTS.ARBITER] === 'ACTIVE'
  
  const hasActiveWorkflow = state.workflowState === 'RUNNING' || isLocalDemoRunning

  return (
    <section className="architecture section" id="architecture" aria-labelledby="architecture-heading">
      <div className="container">
        <div className="architecture__intro">
          <h2 id="architecture-heading" className="serif">
            One tenancy.<br />Many specialists.<br />One arbiter.
          </h2>
          <p>The system architecture separates decision-making from execution. A central arbiter reads the tenancy state and delegates to specialised agents, each connected to real infrastructure rails.</p>
        </div>

        <div className="architecture__diagram" style={{display: 'flex', flexDirection: 'column', gap: '32px'}}>
          
          <div style={{textAlign: 'center', marginBottom: '16px'}}>
            <div className={`arch-arbiter ${isArbiterActive ? 'arch-arbiter--active' : ''}`}>
              <div className="arch-arbiter__title">TENANCY ARBITER</div>
              <div className="arch-arbiter__status">{isArbiterActive ? 'Evaluating Policy & Evidence' : 'Standby'}</div>
            </div>
          </div>

          <div className="arch-grid">
            <div className="arch-col">
              <h3 className="arch-col-title">Specialised Agents</h3>
              <div className="arch-cards">
                {agents.map((agent) => (
                  <div key={agent.id} className={`arch-card ${isAgentActive(agent.id) ? 'arch-card--active' : ''}`}>
                    <div className="arch-card__header">
                      <div className="arch-card__name">{agent.name}</div>
                      <div className="arch-card__status">{isAgentActive(agent.id) ? 'ACTIVE' : 'IDLE'}</div>
                    </div>
                    <div className="arch-card__desc">{agent.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="arch-col">
              <h3 className="arch-col-title">External Rails</h3>
              <div className="arch-cards">
                {rails.map((rail) => (
                  <div key={rail.id} className={`arch-card ${isRailActive(rail.id) ? 'arch-card--active' : ''}`}>
                    <div className="arch-card__header">
                      <div className="arch-card__name">{rail.name}</div>
                      <div className="arch-card__status">{isRailActive(rail.id) ? 'ACTIVE' : 'IDLE'}</div>
                    </div>
                    <div className="arch-card__desc">{rail.desc}</div>
                    <div className="arch-card__powered">{rail.status}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{textAlign: 'center', marginTop: '16px'}}>
            <button className="btn btn--secondary" onClick={() => {setIsLocalDemoRunning(true); setLocalDemoStep(1);}} disabled={hasActiveWorkflow}>
              {isLocalDemoRunning ? 'Simulating flow...' : 'Play Architectural Flow'}
            </button>
            {!hasActiveWorkflow && !isLocalDemoRunning && (
              <div className="muted" style={{fontSize: '0.875rem', marginTop: '16px'}}>
                Or start a scenario in the Live Demo to see the architecture react to real events.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
