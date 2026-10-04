import { createEvent, createDecision, AGENTS, RAILS, ACTORS, STATUS, EVENT_TYPES } from './events'

export const maintenanceSteps = [
  {
    id: 'maint_start',
    type: 'USER_INPUT',
    label: 'Request Received',
    content: {
      message: 'My geyser stopped working and I need someone tomorrow morning.',
      from: 'Tenant'
    },
    activeAgents: [AGENTS.VOICE],
    activeRails: [RAILS.GNANI]
  },
  {
    id: 'maint_gnani',
    type: 'SYSTEM',
    label: 'Gnani',
    content: {
      data: [
        { label: 'Input', value: 'Voice transcription' },
        { label: 'Intent', value: 'Geyser repair' },
        { label: 'Timing', value: 'Tomorrow morning' }
      ]
    },
    events: [createEvent('voice.transcribed', RAILS.GNANI, { intent: 'geyser repair' })]
  },
  {
    id: 'maint_agent',
    type: 'SYSTEM',
    label: 'Maintenance Agent',
    content: {
      data: [
        { label: 'Category', value: 'Geyser repair' },
        { label: 'Urgency', value: 'High', highlight: 'warning' },
        { label: 'Estimated cost', value: '₹1,850' }
      ]
    },
    events: [createEvent(EVENT_TYPES.MAINTENANCE_CREATED, AGENTS.MAINTENANCE, { category: 'Geyser repair', cost: 1850 })],
    activeAgents: [AGENTS.MAINTENANCE]
  },
  {
    id: 'maint_arbiter',
    type: 'SYSTEM',
    label: 'Tenancy Arbiter',
    content: {
      data: [
        { label: 'Lease responsibility', value: 'Landlord' },
        { label: 'Autonomy limit', value: '₹3,000' },
        { label: 'Decision', value: 'Proceed inside policy', highlight: 'success' }
      ]
    },
    decisions: [createDecision('Estimated cost ₹1,850', AGENTS.ARBITER, 'Repairs under ₹3,000 for landlord responsibility are auto-approved', 'Auto-approve and route to vendor', 'Pass to Vendor Agent')],
    events: [createEvent('policy.checked', AGENTS.ARBITER, { decision: 'Proceed' })],
    activeAgents: [AGENTS.ARBITER]
  },
  {
    id: 'maint_vendor',
    type: 'SELECTION',
    label: 'Vendor Selection',
    userActionRequired: true,
    content: {
      options: [
        { label: 'NoBroker Services (Tomorrow 9:00 AM)', score: 98 },
        { label: 'Local Technician (Tomorrow 11:00 AM)', score: 85 }
      ]
    },
    activeAgents: [AGENTS.SCHEDULING]
  },
  {
    id: 'maint_booked',
    type: 'SYSTEM',
    label: 'Vendor Booked',
    content: {
      message: 'Technician scheduled for tomorrow at 9:00 AM.'
    },
    events: [createEvent(EVENT_TYPES.VENDOR_SELECTED, AGENTS.SCHEDULING, { time: '9:00 AM' })],
    activeAgents: [AGENTS.MAINTENANCE]
  },
  {
    id: 'maint_task',
    type: 'HITL',
    label: 'Human Service Task',
    content: {
      message: 'Technician on site.'
    },
    humanTask: {
      id: 'task-maint-1',
      title: 'Submit technician report',
      source: 'Human technician',
      knowns: ['Issue: Geyser repair'],
      required: ['Repair status', 'Final cost', 'Test result']
    }
  },
  {
    id: 'maint_verify',
    type: 'SYSTEM',
    label: 'Verification Agent',
    content: {
      data: [
        { label: 'Evidence', value: 'Valid' },
        { label: 'Final cost', value: '₹1,760' },
        { label: 'Status', value: 'Completed' }
      ]
    },
    events: [createEvent(EVENT_TYPES.VENDOR_COMPLETED, ACTORS.HUMAN_TECHNICIAN, { cost: 1760 })],
    activeAgents: [AGENTS.VERIFICATION]
  },
  {
    id: 'maint_payment',
    type: 'SYSTEM',
    label: 'Pine Labs',
    content: {
      data: [
        { label: 'Action', value: 'Service Payment Ready' },
        { label: 'Status', value: 'Processing' }
      ]
    },
    events: [createEvent(EVENT_TYPES.PAYMENT_SUCCESS, RAILS.PINE_LABS, { amount: 1760 })],
    activeAgents: [AGENTS.FINANCE],
    activeRails: [RAILS.PINE_LABS]
  },
  {
    id: 'maint_close',
    type: 'SYSTEM',
    label: 'Ticket Closed',
    content: {
      message: 'Maintenance history recorded in Tenancy Memory.'
    },
    events: [createEvent(EVENT_TYPES.TENANCY_STATE_UPDATED, AGENTS.ARBITER, { maintenance: 'Closed' })],
    tenancyUpdates: { maintenance: '0 open tickets' }
  }
]
