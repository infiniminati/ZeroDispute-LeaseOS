import { useAppState } from '../../engine/AppStateContext'

export default function DecisionTracePanel() {
  const { state } = useAppState()
  const decisions = state.decisions || []

  if (decisions.length === 0) return null

  // Show the most recent decision
  const latest = decisions[decisions.length - 1]

  return (
    <div className="side-panel">
      <div className="panel-header">
        <h3 className="panel-title">Why did ZeroDispute LeaseOS do this?</h3>
      </div>
      <div className="panel-content decision-trace-content">
        <div className="decision-row">
          <div className="decision-key">INPUT</div>
          <div className="decision-value">{latest.input}</div>
        </div>
        <div className="decision-row">
          <div className="decision-key">RULE</div>
          <div className="decision-value">{latest.rule}</div>
        </div>
        <div className="decision-row">
          <div className="decision-key">DECISION</div>
          <div className="decision-value decision-value--highlight">{latest.decision}</div>
        </div>
        <div className="decision-row">
          <div className="decision-key">ACTION</div>
          <div className="decision-value">{latest.action}</div>
        </div>
        <div className="decision-row">
          <div className="decision-key">SOURCE</div>
          <div className="decision-value">{latest.source}</div>
        </div>
        {latest.connector && (
          <div className="decision-row">
            <div className="decision-key">CONNECTOR</div>
            <div className="decision-value">{latest.connector}</div>
          </div>
        )}
      </div>
    </div>
  )
}
