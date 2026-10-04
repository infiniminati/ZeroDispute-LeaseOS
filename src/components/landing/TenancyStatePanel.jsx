import { useAppState } from '../../engine/AppStateContext'

export default function TenancyStatePanel() {
  const { state } = useAppState()
  
  return (
    <div className="side-panel">
      <div className="panel-header">
        <h3 className="panel-title">Tenancy State</h3>
      </div>
      <div className="panel-content">
        <div className="tenancy-state-list">
          {Object.entries(state.tenancy).map(([key, value]) => {
            if (value === null || value === undefined) return null
            return (
              <div key={key} className="tenancy-state-item">
                <span className="tenancy-state-key" style={{textTransform: 'capitalize'}}>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <span className="tenancy-state-value">{value}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
