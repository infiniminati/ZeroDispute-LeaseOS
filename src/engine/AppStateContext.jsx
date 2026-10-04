import { createContext, useContext, useReducer, useCallback } from 'react'

const initialState = {
  scenarioId: null,
  tenancy: {
    tenant: null,
    property: null,
    lease: 'Not started',
    payment: 'Pending',
    verification: 'Pending',
    visit: 'Not scheduled',
    maintenance: '0 open tickets',
    moveIn: 'Not set',
    relocation: 'Not started',
    exit: 'Not started'
  },
  agents: {}, // { agentName: 'ACTIVE' | 'WAITING' | 'COMPLETE' | null }
  rails: {}, // { railName: 'ACTIVE' | 'SIMULATED' | null }
  humanTasks: [], // queue of current HITL tasks
  events: [],
  decisions: [],
  demoMode: true,
  // the scenario engine state
  currentStepIndex: 0,
  workflowState: 'IDLE', // 'IDLE' | 'RUNNING' | 'PAUSED' | 'WAITING_HUMAN' | 'WAITING_USER' | 'COMPLETE'
}

function appReducer(state, action) {
  switch (action.type) {
    case 'START_SCENARIO':
      return {
        ...initialState,
        scenarioId: action.payload.scenarioId,
        tenancy: { ...initialState.tenancy, ...action.payload.initialTenancyState },
        workflowState: 'RUNNING',
        events: [],
        decisions: [],
        agents: {},
        rails: {}
      }
    case 'SET_WORKFLOW_STATE':
      return { ...state, workflowState: action.payload }
    case 'SET_STEP_INDEX':
      return { ...state, currentStepIndex: action.payload }
    case 'ADD_EVENT':
      return { ...state, events: [...state.events, action.payload] }
    case 'ADD_DECISION':
      return { ...state, decisions: [...state.decisions, action.payload] }
    case 'SET_AGENT_STATE':
      return {
        ...state,
        agents: { ...state.agents, [action.payload.agent]: action.payload.status }
      }
    case 'SET_RAIL_STATE':
      return {
        ...state,
        rails: { ...state.rails, [action.payload.rail]: action.payload.status }
      }
    case 'UPDATE_TENANCY':
      return {
        ...state,
        tenancy: { ...state.tenancy, ...action.payload }
      }
    case 'ADD_HUMAN_TASK':
      return {
        ...state,
        humanTasks: [...state.humanTasks, action.payload],
        workflowState: 'WAITING_HUMAN'
      }
    case 'RESOLVE_HUMAN_TASK':
      return {
        ...state,
        humanTasks: state.humanTasks.filter(t => t.id !== action.payload),
        workflowState: 'RUNNING'
      }
    case 'CLEAR_ALL':
      return initialState
    default:
      return state
  }
}

const AppStateContext = createContext(null)

export function AppStateProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const value = {
    state,
    startScenario: (scenarioId, initialTenancyState = {}) => dispatch({ type: 'START_SCENARIO', payload: { scenarioId, initialTenancyState } }),
    setWorkflowState: (status) => dispatch({ type: 'SET_WORKFLOW_STATE', payload: status }),
    setStepIndex: (index) => dispatch({ type: 'SET_STEP_INDEX', payload: index }),
    addEvent: (event) => dispatch({ type: 'ADD_EVENT', payload: event }),
    addDecision: (decision) => dispatch({ type: 'ADD_DECISION', payload: decision }),
    setAgentState: (agent, status) => dispatch({ type: 'SET_AGENT_STATE', payload: { agent, status } }),
    setRailState: (rail, status) => dispatch({ type: 'SET_RAIL_STATE', payload: { rail, status } }),
    updateTenancy: (updates) => dispatch({ type: 'UPDATE_TENANCY', payload: updates }),
    addHumanTask: (task) => dispatch({ type: 'ADD_HUMAN_TASK', payload: task }),
    resolveHumanTask: (taskId) => dispatch({ type: 'RESOLVE_HUMAN_TASK', payload: taskId }),
    clearAll: () => dispatch({ type: 'CLEAR_ALL' })
  }

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  )
}

export function useAppState() {
  const context = useContext(AppStateContext)
  if (!context) throw new Error('useAppState must be used within AppStateProvider')
  return context
}
