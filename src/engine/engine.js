import { useEffect, useRef } from 'react'
import { useAppState } from './AppStateContext'
import { createEvent, createDecision, AGENTS, RAILS, ACTORS, STATUS, EVENT_TYPES } from './events'
import { tenantSearchSteps } from './tenantSearchScenario'
import { maintenanceSteps } from './maintenanceScenario'
import { moveoutSteps } from './moveoutScenario'

export const scenarios = {
  search: {
    id: 'search',
    label: 'Tenant search',
    steps: tenantSearchSteps,
    initialTenancy: {
      tenant: 'Riya Mehta',
      property: 'Searching',
      lease: 'Not started'
    }
  },
  maintenance: {
    id: 'maintenance',
    label: 'Maintenance request',
    steps: maintenanceSteps,
    initialTenancy: {
      tenant: 'Aarav Kumar',
      property: '2 BHK, Indiranagar',
      lease: 'Active',
      maintenance: '1 open ticket'
    }
  },
  moveout: {
    id: 'moveout',
    label: 'Move-out settlement',
    steps: moveoutSteps,
    initialTenancy: {
      tenant: 'Neha Sharma',
      property: '1 BHK, Sector 62',
      lease: 'Ending',
      deposit: '48,000'
    }
  }
}

export function useWorkflowEngine() {
  const { state, setWorkflowState, setStepIndex, addEvent, addDecision, setAgentState, setRailState, updateTenancy, addHumanTask, clearAll } = useAppState()
  
  const currentScenario = state.scenarioId ? scenarios[state.scenarioId] : null
  const currentStep = currentScenario?.steps[state.currentStepIndex]
  
  const timerRef = useRef(null)

  const processNextStep = () => {
    if (!currentScenario || state.workflowState !== 'RUNNING') return

    if (state.currentStepIndex >= currentScenario.steps.length - 1) {
      setWorkflowState('COMPLETE')
      return
    }

    const nextIndex = state.currentStepIndex + 1
    const nextStep = currentScenario.steps[nextIndex]

    if (nextStep) {
      setStepIndex(nextIndex)
      
      // Execute side effects for the new step
      if (nextStep.events) {
        nextStep.events.forEach(e => addEvent(e))
      }
      
      if (nextStep.decisions) {
        nextStep.decisions.forEach(d => addDecision(d))
      }

      if (nextStep.activeAgents) {
        // Clear all previous agent states, set new ones
        Object.keys(AGENTS).forEach(key => setAgentState(AGENTS[key], null))
        nextStep.activeAgents.forEach(a => setAgentState(a, 'ACTIVE'))
      }

      if (nextStep.activeRails) {
        Object.keys(RAILS).forEach(key => setRailState(RAILS[key], null))
        nextStep.activeRails.forEach(r => setRailState(r, 'ACTIVE'))
      }

      if (nextStep.tenancyUpdates) {
        updateTenancy(nextStep.tenancyUpdates)
      }

      if (nextStep.humanTask) {
        addHumanTask(nextStep.humanTask)
      } else if (nextStep.userActionRequired) {
        setWorkflowState('WAITING_USER')
      }
    }
  }

  useEffect(() => {
    if (state.workflowState === 'RUNNING') {
      timerRef.current = setTimeout(() => {
        processNextStep()
      }, 2500) // Default step duration
    }
    return () => clearTimeout(timerRef.current)
  }, [state.workflowState, state.currentStepIndex, currentScenario])

  const nextStep = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    processNextStep()
  }

  return { nextStep }
}
