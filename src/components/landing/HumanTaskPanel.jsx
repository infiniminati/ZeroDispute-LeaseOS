import { useAppState } from '../../engine/AppStateContext'
import { EVENT_TYPES, ACTORS, createEvent } from '../../engine/events'

export default function HumanTaskPanel() {
  const { state, resolveHumanTask, addEvent } = useAppState()
  const tasks = state.humanTasks || []

  if (tasks.length === 0) {
    return (
      <div className="side-panel">
        <div className="panel-header">
          <h3 className="panel-title">Human-in-the-Loop</h3>
        </div>
        <div className="panel-content">
          <div className="muted" style={{fontSize: '0.8125rem'}}>No pending human tasks. System operating autonomously.</div>
        </div>
      </div>
    )
  }

  const currentTask = tasks[0]

  const handleSubmit = () => {
    // Add event that report is received
    addEvent(createEvent(EVENT_TYPES.HUMAN_REPORT_RECEIVED, currentTask.source, { status: 'submitted' }))
    resolveHumanTask(currentTask.id)
  }

  return (
    <div className="side-panel side-panel--hitl">
      <div className="panel-header">
        <h3 className="panel-title" style={{color: 'var(--color-warning)'}}>Human Input Required</h3>
      </div>
      <div className="panel-content">
        <div className="hitl-task">
          <div className="hitl-row">
            <span className="hitl-label">TASK</span>
            <span className="hitl-value">{currentTask.title}</span>
          </div>
          <div className="hitl-row">
            <span className="hitl-label">SOURCE</span>
            <span className="hitl-value">{currentTask.source}</span>
          </div>
          
          <div className="hitl-section">
            <div className="hitl-label" style={{marginBottom: '4px'}}>WHAT AGENT KNOWS</div>
            <ul className="hitl-list">
              {currentTask.knowns.map((k, i) => <li key={i}>{k}</li>)}
            </ul>
          </div>
          
          <div className="hitl-section">
            <div className="hitl-label" style={{marginBottom: '4px'}}>REQUIRED EVIDENCE</div>
            <ul className="hitl-list">
              {currentTask.required.map((k, i) => <li key={i}>{k}</li>)}
            </ul>
          </div>
          
          <button className="btn btn--primary btn--small" style={{width: '100%', marginTop: '16px'}} onClick={handleSubmit}>
            Submit {currentTask.source} Report
          </button>
        </div>
      </div>
    </div>
  )
}
