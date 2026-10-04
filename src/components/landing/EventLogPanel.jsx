import { useAppState } from '../../engine/AppStateContext'
import { useEffect, useRef } from 'react'

export default function EventLogPanel() {
  const { state } = useAppState()
  const listRef = useRef(null)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [state.events])

  return (
    <div className="side-panel">
      <div className="panel-header">
        <h3 className="panel-title">Live Event Stream</h3>
      </div>
      <div className="panel-content event-stream-container" ref={listRef}>
        {state.events.length === 0 ? (
          <div className="muted" style={{fontSize: '0.8125rem'}}>Awaiting events...</div>
        ) : (
          <div className="event-stream">
            {state.events.map((event, i) => {
              const time = new Date(event.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
              return (
                <div key={event.id || i} className="event-item">
                  <div className="event-item__time">{time}</div>
                  <div className="event-item__source">{event.source}</div>
                  <div className="event-item__type">{event.type}</div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
