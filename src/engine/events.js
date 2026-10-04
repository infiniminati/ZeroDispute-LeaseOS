export const EVENT_TYPES = {
  REQUEST_CREATED: 'request.created',
  PROFILE_CREATED: 'profile.created',
  SEARCH_STARTED: 'search.started',
  CANDIDATES_FILTERED: 'candidates.filtered',
  PROPERTY_SELECTED: 'property.selected',
  VERIFICATION_TASK_CREATED: 'verification.task.created',
  HUMAN_REPORT_RECEIVED: 'human.report.received',
  EVIDENCE_ACCEPTED: 'evidence.accepted',
  EVIDENCE_REJECTED: 'evidence.rejected',
  PAYMENT_REQUESTED: 'payment.requested',
  PAYMENT_SUCCESS: 'payment.success',
  PAYMENT_FAILED: 'payment.failed',
  VISIT_PROPOSED: 'visit.proposed',
  VISIT_CONFIRMED: 'visit.confirmed',
  AGREEMENT_GENERATED: 'agreement.generated',
  AGREEMENT_REVIEWED: 'agreement.reviewed',
  ONBOARDING_CONFIRMED: 'onboarding.confirmed',
  MOVE_QUOTE_CREATED: 'move.quote.created',
  MAINTENANCE_CREATED: 'maintenance.created',
  VENDOR_SELECTED: 'vendor.selected',
  VENDOR_COMPLETED: 'vendor.completed',
  INSPECTION_FAILED: 'inspection.failed',
  INSPECTION_RESCANNED: 'inspection.rescanned',
  SETTLEMENT_APPROVED: 'settlement.approved',
  PAYOUT_SCHEDULED: 'payout.scheduled',
  TENANCY_STATE_UPDATED: 'tenancy.state.updated',
  ADDRESS_VALIDATED: 'address.validated',
}

export const AGENTS = {
  INTAKE: 'Intake Agent',
  ARBITER: 'Tenancy Arbiter',
  SEARCH: 'Search Agent',
  VERIFICATION: 'Verification Agent',
  VOICE: 'Voice Agent',
  MAINTENANCE: 'Maintenance Agent',
  FINANCE: 'Finance Agent',
  LOGISTICS: 'Logistics Agent',
  SCHEDULING: 'Scheduling Agent',
  AGREEMENT: 'Agreement Agent',
  SETTLEMENT: 'Settlement Agent',
}

export const RAILS = {
  NOBROKER: 'NoBroker',
  GNANI: 'Gnani',
  DELHIVERY: 'Delhivery',
  PINE_LABS: 'Pine Labs',
}

export const ACTORS = {
  TENANT: 'Tenant',
  LANDLORD: 'Landlord',
  HUMAN_INSPECTOR: 'Human Inspector',
  HUMAN_TECHNICIAN: 'Human Technician',
  SYSTEM: 'ZeroDispute LeaseOS',
}

export const STATUS = {
  REAL: 'REAL',
  SIMULATED: 'SIMULATED',
  PROPOSED: 'PROPOSED',
}

export function createEvent(type, source, payload = {}, mode = STATUS.SIMULATED) {
  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    type,
    source,
    payload,
    mode,
  }
}

export function createDecision(input, source, rule, decision, action, connector = null) {
  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    input,
    source,
    rule,
    decision,
    action,
    connector,
  }
}
