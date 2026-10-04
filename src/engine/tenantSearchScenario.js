import { createEvent, createDecision, AGENTS, RAILS, ACTORS, STATUS, EVENT_TYPES } from './events'

export const tenantSearchSteps = [
  {
    id: 'search_start',
    type: 'USER_INPUT',
    label: 'Profile Created',
    content: {
      message: 'I need a 2 BHK in Indiranagar, Bangalore. Budget 35,000. Fully furnished. I have a dog.',
      from: 'Tenant'
    },
    events: [createEvent(EVENT_TYPES.PROFILE_CREATED, ACTORS.TENANT, { location: 'Indiranagar', config: '2 BHK', budget: '35000', pets: 'Dog' })],
    activeAgents: [AGENTS.INTAKE]
  },
  {
    id: 'search_arbiter',
    type: 'SYSTEM',
    label: 'Tenancy Arbiter',
    content: {
      data: [
        { label: 'Action', value: 'Evaluate constraints' },
        { label: 'Location', value: 'Indiranagar, Bangalore' },
        { label: 'Budget ceiling', value: '35,000' },
        { label: 'Pet policy', value: 'Required: Dog-friendly', highlight: 'warning' },
      ]
    },
    events: [createEvent('arbiter.checked', AGENTS.ARBITER, { constraints: 'Loaded' })],
    decisions: [createDecision('Tenant has a dog', AGENTS.ARBITER, 'Pet policy is a hard matching constraint', 'Filter out all properties not explicitly dog-friendly', 'Pass constraints to Search Agent')],
    activeAgents: [AGENTS.ARBITER, AGENTS.SEARCH]
  },
  {
    id: 'search_agent',
    type: 'SYSTEM',
    label: 'Search Agent',
    content: {
      data: [
        { label: 'Candidates found', value: '22' },
        { label: 'Pet-compatible', value: '6' },
        { label: 'Ranked results', value: '3' },
      ]
    },
    events: [createEvent(EVENT_TYPES.CANDIDATES_FILTERED, AGENTS.SEARCH, { initial: 22, filtered: 6 })],
    activeAgents: [AGENTS.SEARCH],
    activeRails: [RAILS.NOBROKER]
  },
  {
    id: 'search_results',
    type: 'SELECTION',
    label: 'Select Property',
    userActionRequired: true,
    content: {
      properties: [
        { id: 'p1', name: 'PROPERTY 01', config: '2 BHK', location: 'Indiranagar', rent: '34,000', furnishing: 'Fully Furnished', pet: 'Dog friendly', score: 94 },
        { id: 'p2', name: 'PROPERTY 02', config: '2 BHK', location: 'Indiranagar', rent: '33,500', furnishing: 'Fully Furnished', pet: 'Dog friendly', score: 88 }
      ]
    }
  },
  {
    id: 'payment_req',
    type: 'PAYMENT',
    label: 'Verification Fee',
    userActionRequired: true,
    content: {
      amount: '149',
      reference: 'TENANCY-DEMO-001',
      status: 'Awaiting Payment'
    },
  },
  {
    id: 'payment_success',
    type: 'SYSTEM',
    label: 'Simulated Partner Response',
    content: {
      data: [
        { label: 'Status', value: 'SUCCESS', highlight: 'success' },
        { label: 'Reference', value: 'TENANCY-DEMO-001' }
      ]
    },
    events: [createEvent(EVENT_TYPES.PAYMENT_SUCCESS, RAILS.PINE_LABS, { amount: 149 })],
    activeAgents: [AGENTS.FINANCE],
    activeRails: [RAILS.PINE_LABS]
  },
  {
    id: 'verification_task',
    type: 'HITL',
    label: 'Physical Verification',
    content: {
      message: 'Field verification required for selected property.'
    },
    humanTask: {
      id: 'task-verify-1',
      title: 'Physical property inspection',
      source: 'Human inspector',
      knowns: ['Property: 2 BHK, Indiranagar', 'Tenant req: Dog friendly'],
      required: ['Photos', 'Condition report', 'Pet policy confirmation']
    },
    events: [createEvent(EVENT_TYPES.VERIFICATION_TASK_CREATED, AGENTS.VERIFICATION, { location: 'Indiranagar' })],
    activeAgents: [AGENTS.VERIFICATION]
  },
  {
    id: 'verification_result',
    type: 'SYSTEM',
    label: 'Property Verified',
    content: {
      data: [
        { label: 'Status', value: 'PASSED', highlight: 'success' },
        { label: 'Listing consistency', value: '94%' },
        { label: 'Dog policy', value: 'Confirmed allowed' }
      ]
    },
    events: [createEvent(EVENT_TYPES.HUMAN_REPORT_RECEIVED, ACTORS.HUMAN_INSPECTOR, { status: 'passed' })],
    tenancyUpdates: { verification: 'Passed' },
    activeAgents: [AGENTS.ARBITER]
  },
  {
    id: 'scheduling',
    type: 'SELECTION',
    label: 'Visit Scheduling',
    userActionRequired: true,
    content: {
      options: [
        { label: 'Tomorrow, 6:30 PM (Common window found)' }
      ]
    },
    activeAgents: [AGENTS.SCHEDULING]
  },
  {
    id: 'scheduling_confirmed',
    type: 'SYSTEM',
    label: 'Visit Confirmed',
    content: {
      message: 'Your property visit is confirmed for tomorrow at 6:30 PM.'
    },
    events: [createEvent(EVENT_TYPES.VISIT_CONFIRMED, AGENTS.SCHEDULING, { time: 'Tomorrow 6:30 PM' })],
    tenancyUpdates: { visit: 'Confirmed' }
  },
  {
    id: 'agreement',
    type: 'AGREEMENT',
    label: 'Draft Rental Agreement',
    userActionRequired: true,
    content: {
      terms: {
        rent: '34,000/mo',
        deposit: '1,50,000',
        notice: '2 months',
        lockin: '6 months'
      }
    },
    activeAgents: [AGENTS.AGREEMENT]
  },
  {
    id: 'onboarding_confirm',
    type: 'ONBOARDING',
    label: 'Onboarding Ready',
    userActionRequired: true,
    content: {
      message: 'Property verified, tenant confirmed, terms reviewed.'
    },
    activeAgents: [AGENTS.ARBITER]
  },
  {
    id: 'relocation',
    type: 'SYSTEM',
    label: 'Relocation & Rehabilitation',
    content: {
      data: [
        { label: 'Moving estimate', value: '₹4,800' },
        { label: 'Deep cleaning', value: '₹1,200' },
        { label: 'Total', value: '₹6,000' }
      ]
    },
    events: [createEvent(EVENT_TYPES.ONBOARDING_CONFIRMED, AGENTS.ARBITER, { status: 'Active' })],
    tenancyUpdates: { lease: 'Active', relocation: 'Prepared', property: '2 BHK, Indiranagar', moveIn: '10 Oct' },
    activeAgents: [AGENTS.LOGISTICS],
    activeRails: [RAILS.DELHIVERY]
  }
]
