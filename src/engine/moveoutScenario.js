import { createEvent, createDecision, AGENTS, RAILS, ACTORS, STATUS, EVENT_TYPES } from './events'

export const moveoutSteps = [
  {
    id: 'moveout_start',
    type: 'USER_INPUT',
    label: 'Request Received',
    content: {
      message: 'I am moving out today. Please return my 48,000 deposit and arrange my move.',
      from: 'Tenant'
    },
    activeAgents: [AGENTS.VOICE],
    activeRails: [RAILS.GNANI]
  },
  {
    id: 'moveout_arbiter',
    type: 'SYSTEM',
    label: 'Tenancy Arbiter',
    content: {
      data: [
        { label: 'Deposit state', value: '48,000' },
        { label: 'Action', value: 'Move-out capture requested' }
      ]
    },
    events: [createEvent('moveout.requested', ACTORS.TENANT, { deposit: 48000 })],
    activeAgents: [AGENTS.ARBITER]
  },
  {
    id: 'moveout_scan1',
    type: 'SYSTEM',
    label: 'First Inspection',
    content: {
      data: [
        { label: 'Confidence', value: '61%', highlight: 'error' },
        { label: 'Required', value: '82%' },
        { label: 'Status', value: 'Insufficient' }
      ]
    },
    events: [createEvent(EVENT_TYPES.INSPECTION_FAILED, AGENTS.VERIFICATION, { confidence: 61 })],
    activeAgents: [AGENTS.VERIFICATION]
  },
  {
    id: 'moveout_rescan',
    type: 'SELECTION',
    label: 'Rescan Required',
    userActionRequired: true,
    content: {
      message: 'The current capture is not strong enough to verify the bathroom. Please submit another capture.',
      options: [
        { label: 'Submit Rescan' }
      ]
    }
  },
  {
    id: 'moveout_scan2',
    type: 'SYSTEM',
    label: 'Second Inspection',
    content: {
      data: [
        { label: 'Confidence', value: '91%', highlight: 'success' },
        { label: 'Damage delta', value: '₹0' },
        { label: 'Status', value: 'Passed' }
      ]
    },
    events: [createEvent(EVENT_TYPES.INSPECTION_RESCANNED, AGENTS.VERIFICATION, { confidence: 91 })],
    activeAgents: [AGENTS.VERIFICATION]
  },
  {
    id: 'moveout_human',
    type: 'HITL',
    label: 'Human Exit Inspection',
    content: {
      message: 'Independent human verification required for final settlement.'
    },
    humanTask: {
      id: 'task-exit-1',
      title: 'Submit exit evidence',
      source: 'Human inspector',
      knowns: ['Move-in baseline: Clean', 'Current scan: Clean'],
      required: ['Property condition', 'Chargeable damage']
    },
    activeAgents: [AGENTS.ARBITER]
  },
  {
    id: 'moveout_settlement',
    type: 'SYSTEM',
    label: 'Tenancy Arbiter',
    content: {
      data: [
        { label: 'Deposit', value: '₹48,000' },
        { label: 'Deduction', value: '₹0' },
        { label: 'Autonomy limit', value: '₹50,000' },
        { label: 'Decision', value: 'FULL REFUND', highlight: 'success' }
      ]
    },
    decisions: [createDecision('Verified clean exit, deduction ₹0', AGENTS.ARBITER, 'Limit < ₹50,000 auto-approved', 'Full Refund', 'Trigger payouts')],
    events: [createEvent(EVENT_TYPES.SETTLEMENT_APPROVED, AGENTS.ARBITER, { amount: 48000 })],
    activeAgents: [AGENTS.ARBITER, AGENTS.SETTLEMENT]
  },
  {
    id: 'moveout_delhivery',
    type: 'SYSTEM',
    label: 'Delhivery',
    content: {
      data: [
        { label: 'Destination', value: 'Validated', highlight: 'success' },
        { label: 'Relocation quote', value: 'Prepared' }
      ]
    },
    events: [createEvent(EVENT_TYPES.ADDRESS_VALIDATED, RAILS.DELHIVERY, {})],
    activeAgents: [AGENTS.LOGISTICS],
    activeRails: [RAILS.DELHIVERY]
  },
  {
    id: 'moveout_pinelabs',
    type: 'SYSTEM',
    label: 'Pine Labs',
    content: {
      data: [
        { label: 'Instruction', value: 'Payout Scheduled', highlight: 'success' },
        { label: 'Amount', value: '₹48,000' }
      ]
    },
    events: [createEvent(EVENT_TYPES.PAYOUT_SCHEDULED, RAILS.PINE_LABS, { amount: 48000 })],
    activeAgents: [AGENTS.FINANCE],
    activeRails: [RAILS.PINE_LABS]
  },
  {
    id: 'moveout_complete',
    type: 'SYSTEM',
    label: 'Move-out Verified',
    content: {
      message: 'Your ₹48,000 refund instruction has been scheduled.'
    },
    events: [createEvent(EVENT_TYPES.TENANCY_STATE_UPDATED, AGENTS.ARBITER, { exit: 'Sealed' })],
    tenancyUpdates: { exit: 'Sealed', lease: 'Terminated', relocation: 'Prepared' }
  }
]
