import { useEffect, useRef } from 'react'
import { useAppState } from '../../engine/AppStateContext'
import { useWorkflowEngine, scenarios } from '../../engine/engine'
import WorkflowPlayer from './WorkflowPlayer'
import TenancyStatePanel from './TenancyStatePanel'
import DecisionTracePanel from './DecisionTracePanel'
import EventLogPanel from './EventLogPanel'
import HumanTaskPanel from './HumanTaskPanel'

export default function LiveDemoSection() {
  const { state, startScenario, setWorkflowState } = useAppState()
  const { nextStep } = useWorkflowEngine()

  useEffect(() => {
    // Start with search scenario by default
    if (!state.scenarioId) {
      startScenario('search', scenarios.search.initialTenancy)
    }
  }, [])

  const handleScenarioChange = (id) => {
    startScenario(id, scenarios[id].initialTenancy)
  }

  const handlePlay = () => {
    if (state.workflowState === 'IDLE' || state.workflowState === 'COMPLETE') {
      startScenario(state.scenarioId, scenarios[state.scenarioId].initialTenancy)
    } else {
      setWorkflowState('RUNNING')
    }
  }

  const handlePause = () => {
    setWorkflowState('PAUSED')
  }

  const handleRestart = () => {
    startScenario(state.scenarioId, scenarios[state.scenarioId].initialTenancy)
  }

  const isPlaying = state.workflowState === 'RUNNING'
  const hasStarted = state.workflowState !== 'IDLE' && state.workflowState !== 'COMPLETE'
  const currentScenario = state.scenarioId ? scenarios[state.scenarioId] : null

  return (
    <section className="live-demo section" id="live-demo" aria-labelledby="live-demo-heading">
      <div className="container">
        <div className="live-demo__intro" style={{ marginBottom: '40px' }}>
          <h2 id="live-demo-heading">Watch ZeroDispute LeaseOS run a tenancy.</h2>
          <p>An interactive simulation of one tenant journey. Select a scenario and watch the system process each stage.</p>
        </div>

        <div className="live-demo__scenarios" role="tablist" aria-label="Demo scenarios">
          {Object.values(scenarios).map((s) => (
            <button
              key={s.id}
              className={`live-demo__scenario-btn ${state.scenarioId === s.id ? 'live-demo__scenario-btn--active' : ''}`}
              onClick={() => handleScenarioChange(s.id)}
              role="tab"
              aria-selected={state.scenarioId === s.id}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="live-demo__controls" style={{ marginBottom: '32px' }}>
          {(!hasStarted && state.workflowState !== 'COMPLETE') ? (
            <button className="btn btn--primary btn--small" onClick={handlePlay}>
              Play tenant journey
            </button>
          ) : (
            <>
              {isPlaying ? (
                <button className="live-demo__control-btn live-demo__control-btn--active" onClick={handlePause}>
                  Pause
                </button>
              ) : (
                <button className="live-demo__control-btn" onClick={handlePlay}>
                  Play
                </button>
              )}
              <button className="live-demo__control-btn" onClick={nextStep} disabled={state.workflowState === 'WAITING_USER' || state.workflowState === 'WAITING_HUMAN'}>
                Next Step
              </button>
              <button className="live-demo__control-btn" onClick={handleRestart}>
                Restart
              </button>
            </>
          )}
        </div>

        {currentScenario && (
          <div className="live-demo__progress" role="progressbar" aria-valuenow={state.currentStepIndex + 1} aria-valuemin={1} aria-valuemax={currentScenario.steps.length}>
            {currentScenario.steps.map((_, i) => (
              <div
                key={i}
                className={`live-demo__progress-dot ${
                  i < state.currentStepIndex ? 'live-demo__progress-dot--done' :
                  i === state.currentStepIndex && hasStarted ? 'live-demo__progress-dot--active' : ''
                }`}
              />
            ))}
          </div>
        )}

        <div className="live-demo__grid">
          <div className="live-demo__col">
             <WorkflowPlayer />
          </div>
          
          <div className="live-demo__col live-demo__col--side">
             <TenancyStatePanel />
             <DecisionTracePanel />
          </div>

          <div className="live-demo__col live-demo__col--side">
             <HumanTaskPanel />
             <EventLogPanel />
          </div>
        </div>
      </div>
    </section>
  )
}
