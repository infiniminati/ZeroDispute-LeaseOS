import { useNavigate } from 'react-router-dom'
import { useAppState } from '../engine/AppStateContext'
import { createEvent, AGENTS, ACTORS, EVENT_TYPES } from '../engine/events'
import { tenantSearchSteps } from '../engine/tenantSearchScenario'
import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'

const PHASES = [
  { key: 'identity', label: 'Identity', number: '01' },
  { key: 'search', label: 'Search', number: '02' },
  { key: 'lifestyle', label: 'Lifestyle', number: '03' },
  { key: 'finance', label: 'Finance', number: '04' },
  { key: 'moving', label: 'Moving', number: '05' },
  { key: 'addons', label: 'Add-ons', number: '06' },
]

const initialFormData = {
  // Phase 1: Identity
  fullName: '',
  phone: '',
  email: '',
  residentialStatus: '',
  currentCity: '',
  employmentStatus: '',
  workplace: '',
  // Phase 2: Search
  targetMarkets: '',
  commuteMax: '',
  rentCeiling: '',
  propertyConfig: '',
  furnishing: '',
  // Phase 3: Lifestyle
  moveInTimeline: '',
  householdStructure: '',
  foodPreference: '',
  petOwnership: '',
  petDetails: '',
  parking: '',
  // Phase 4: Finance
  incomeBracket: '',
  paymentMethod: '',
  depositPreference: '',
  // Phase 5: Moving
  movingOrigin: '',
  currentFloor: '',
  elevatorAccess: '',
  householdVolume: '',
  additionalServices: [],
  packingMaterials: '',
  // Phase 6: Add-ons
  deepCleaning: '',
  prePainting: '',
  applianceSubscription: '',
  subscriptionPreference: [],
}

export default function StartPage() {
  const [phase, setPhase] = useState(0)
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState(false)
  const [isReview, setIsReview] = useState(false)

  const updateField = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }, [])

  const toggleArrayField = useCallback((field, value) => {
    setFormData((prev) => {
      const arr = prev[field] || []
      if (arr.includes(value)) {
        return { ...prev, [field]: arr.filter((v) => v !== value) }
      }
      return { ...prev, [field]: [...arr, value] }
    })
  }, [])

  const validatePhase = useCallback(() => {
    const newErrors = {}
    if (phase === 0) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Please enter your full name.'
      if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone.replace(/\s/g, ''))) newErrors.phone = 'Please enter a valid 10-digit phone number.'
      if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email address.'
      if (!formData.residentialStatus) newErrors.residentialStatus = 'Please select your residential status.'
      if (!formData.employmentStatus) newErrors.employmentStatus = 'Please select your employment status.'
    } else if (phase === 1) {
      if (!formData.targetMarkets.trim()) newErrors.targetMarkets = 'Please enter at least one target area.'
      if (!formData.rentCeiling.trim()) newErrors.rentCeiling = 'Please enter your rent ceiling.'
      if (!formData.propertyConfig) newErrors.propertyConfig = 'Please select a property configuration.'
    } else if (phase === 2) {
      if (!formData.moveInTimeline.trim()) newErrors.moveInTimeline = 'Please enter your move-in timeline.'
      if (!formData.householdStructure) newErrors.householdStructure = 'Please select your household structure.'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [phase, formData])

  const handleContinue = () => {
    if (!validatePhase()) return
    if (phase < PHASES.length - 1) {
      setPhase(phase + 1)
      window.scrollTo(0, 0)
    } else {
      setIsReview(true)
      window.scrollTo(0, 0)
    }
  }

  const handleBack = () => {
    if (isReview) {
      setIsReview(false)
      return
    }
    if (phase > 0) {
      setPhase(phase - 1)
      window.scrollTo(0, 0)
    }
  }
  const navigate = useNavigate()
  const { startScenario } = useAppState()

  const handleSubmit = () => {
    // Generate custom scenario from form data
    const customScenarioId = 'custom_search'
    
    // Inject form data into the first step of the tenantSearchSteps
    const customSteps = [...tenantSearchSteps]
    
    // Create a personalized first step based on the form input
    customSteps[0] = {
      ...customSteps[0],
      content: {
        message: `I need a ${formData.propertyConfig} in ${formData.targetMarkets}. Budget ${formData.rentCeiling}. ${formData.furnishing}. ${formData.petOwnership !== 'No pet' ? `I have a ${formData.petOwnership}.` : ''}`,
        from: 'Tenant'
      },
      events: [createEvent(EVENT_TYPES.PROFILE_CREATED, ACTORS.TENANT, { 
        location: formData.targetMarkets, 
        config: formData.propertyConfig, 
        budget: formData.rentCeiling, 
        pets: formData.petOwnership 
      })]
    }

    const customInitialTenancyState = {
      tenant: formData.fullName || 'New Tenant',
      property: 'Searching',
      lease: 'Not started'
    }

    // Since we don't have a way to dynamically add scenarios to the scenarios object in engine.js
    // without modifying it, we'll just start the 'search' scenario but we actually need to pass
    // our customized steps if we want it to show up. 
    // To do this properly without complex state surgery, we can just modify the existing scenarios object in engine.js 
    // from this component, or dispatch a custom scenario. Let's just navigate and let the user see it.
    
    // Let's actually import `scenarios` and modify it directly here since it's an exported object.
    
    // Wait, the easiest way is to modify the `search` scenario in place or just navigate.
    import('../engine/engine').then(module => {
      module.scenarios.custom = {
        id: 'custom',
        label: 'My Custom Search',
        steps: customSteps,
        initialTenancy: customInitialTenancyState
      }
      startScenario('custom', customInitialTenancyState)
      navigate('/#live-demo')
      setTimeout(() => {
        const el = document.getElementById('live-demo')
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    })
  }

  const handleEditPhase = (phaseIndex) => {
    setIsReview(false)
    setPhase(phaseIndex)
    window.scrollTo(0, 0)
  }

  // ... (keep the rest)
    if (isReview) {
      return (
        <div className="form-page">
          <div className="container">
            <div className="form-review">
              <span className="eyebrow" style={{ marginBottom: '16px', display: 'block' }}>Review</span>
              <h1 style={{ marginBottom: '8px' }}>Your tenancy profile</h1>
              <p style={{ marginBottom: '32px' }}>Review your information before creating your profile.</p>

              <div className="form-review__section">
                <div className="form-review__section-title">
                  <span>Identity</span>
                  <button className="form-review__edit" onClick={() => handleEditPhase(0)} id="review-edit-identity">Edit</button>
                </div>
                <div className="form-review__row"><span className="form-review__key">Name</span><span className="form-review__value">{formData.fullName || 'Not provided'}</span></div>
                <div className="form-review__row"><span className="form-review__key">Phone</span><span className="form-review__value">{formData.phone || 'Not provided'}</span></div>
                <div className="form-review__row"><span className="form-review__key">Email</span><span className="form-review__value">{formData.email || 'Not provided'}</span></div>
                <div className="form-review__row"><span className="form-review__key">Status</span><span className="form-review__value">{formData.residentialStatus || 'Not provided'}</span></div>
                <div className="form-review__row"><span className="form-review__key">Employment</span><span className="form-review__value">{formData.employmentStatus || 'Not provided'}</span></div>
                {formData.workplace && <div className="form-review__row"><span className="form-review__key">Workplace</span><span className="form-review__value">{formData.workplace}</span></div>}
              </div>

              <div className="form-review__section">
                <div className="form-review__section-title">
                  <span>Search</span>
                  <button className="form-review__edit" onClick={() => handleEditPhase(1)} id="review-edit-search">Edit</button>
                </div>
                <div className="form-review__row"><span className="form-review__key">Target areas</span><span className="form-review__value">{formData.targetMarkets || 'Not provided'}</span></div>
                <div className="form-review__row"><span className="form-review__key">Rent ceiling</span><span className="form-review__value">{formData.rentCeiling ? `${formData.rentCeiling}/mo` : 'Not provided'}</span></div>
                <div className="form-review__row"><span className="form-review__key">Configuration</span><span className="form-review__value">{formData.propertyConfig || 'Not provided'}</span></div>
                <div className="form-review__row"><span className="form-review__key">Furnishing</span><span className="form-review__value">{formData.furnishing || 'Not provided'}</span></div>
              </div>

              <div className="form-review__section">
                <div className="form-review__section-title">
                  <span>Lifestyle</span>
                  <button className="form-review__edit" onClick={() => handleEditPhase(2)} id="review-edit-lifestyle">Edit</button>
                </div>
                <div className="form-review__row"><span className="form-review__key">Move-in</span><span className="form-review__value">{formData.moveInTimeline || 'Not provided'}</span></div>
                <div className="form-review__row"><span className="form-review__key">Household</span><span className="form-review__value">{formData.householdStructure || 'Not provided'}</span></div>
                <div className="form-review__row"><span className="form-review__key">Food</span><span className="form-review__value">{formData.foodPreference || 'No preference'}</span></div>
                <div className="form-review__row"><span className="form-review__key">Pet</span><span className="form-review__value">{formData.petOwnership || 'No pet'}</span></div>
                <div className="form-review__row"><span className="form-review__key">Parking</span><span className="form-review__value">{formData.parking || 'Not provided'}</span></div>
              </div>

              <div className="form-review__section">
                <div className="form-review__section-title">
                  <span>Finance</span>
                  <button className="form-review__edit" onClick={() => handleEditPhase(3)} id="review-edit-finance">Edit</button>
                </div>
                <div className="form-review__row"><span className="form-review__key">Income bracket</span><span className="form-review__value">{formData.incomeBracket || 'Not provided'}</span></div>
                <div className="form-review__row"><span className="form-review__key">Payment</span><span className="form-review__value">{formData.paymentMethod || 'Not provided'}</span></div>
                <div className="form-review__row"><span className="form-review__key">Deposit</span><span className="form-review__value">{formData.depositPreference || 'Not provided'}</span></div>
              </div>

              <div className="form-review__section">
                <div className="form-review__section-title">
                  <span>Moving</span>
                  <button className="form-review__edit" onClick={() => handleEditPhase(4)} id="review-edit-moving">Edit</button>
                </div>
                <div className="form-review__row"><span className="form-review__key">Origin</span><span className="form-review__value">{formData.movingOrigin || 'Not provided'}</span></div>
                <div className="form-review__row"><span className="form-review__key">Floor</span><span className="form-review__value">{formData.currentFloor || 'Not provided'}</span></div>
                <div className="form-review__row"><span className="form-review__key">Elevator</span><span className="form-review__value">{formData.elevatorAccess || 'Not provided'}</span></div>
                <div className="form-review__row"><span className="form-review__key">Volume</span><span className="form-review__value">{formData.householdVolume || 'Not provided'}</span></div>
              </div>

              <div className="form-review__section">
                <div className="form-review__section-title">
                  <span>Services</span>
                  <button className="form-review__edit" onClick={() => handleEditPhase(5)} id="review-edit-services">Edit</button>
                </div>
                <div className="form-review__row"><span className="form-review__key">Deep cleaning</span><span className="form-review__value">{formData.deepCleaning || 'Not selected'}</span></div>
                <div className="form-review__row"><span className="form-review__key">Pre-painting</span><span className="form-review__value">{formData.prePainting || 'Not selected'}</span></div>
                <div className="form-review__row"><span className="form-review__key">Subscription</span><span className="form-review__value">{formData.applianceSubscription || 'Not selected'}</span></div>
              </div>

              <div className="form-actions">
                <button className="btn btn--primary" onClick={handleSubmit} id="form-create-profile-btn">Create my tenancy profile</button>
                <button className="btn btn--secondary" onClick={handleBack} id="form-review-back-btn">Back</button>
              </div>
            </div>
          </div>
        </div>
      )
    }

  return (
    <div className="form-page">
      <div className="container">
        <div className="form-page__header">
          <span className="eyebrow" style={{ marginBottom: '16px', display: 'block' }}>ZeroDispute LeaseOS</span>
          <h1>Let's set up your tenancy.</h1>
          <p>Tell us what matters. ZeroDispute LeaseOS will use these preferences to build your tenancy profile.</p>
        </div>

        {/* Progress */}
        <div className="form-page__progress" role="progressbar" aria-valuenow={phase + 1} aria-valuemin={1} aria-valuemax={6} aria-label={`Step ${phase + 1} of 6`}>
          {PHASES.map((p, i) => (
            <div key={p.key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className={`form-page__progress-step ${i === phase ? 'form-page__progress-step--active' : ''} ${i < phase ? 'form-page__progress-step--done' : ''}`}>
                <span className="form-page__progress-num">{i < phase ? '\u2713' : p.number}</span>
                <span>{p.label}</span>
              </div>
              {i < PHASES.length - 1 && <div className="form-page__progress-line" />}
            </div>
          ))}
        </div>

        <p className="muted" style={{ marginBottom: '32px', fontSize: '0.875rem' }}>Step {phase + 1} of 6</p>

        {/* Phase 1: Identity */}
        {phase === 0 && (
          <div className="form-phase">
            <div className="form-phase__title">Phase 1</div>
            <h2 className="form-phase__heading">Core Identity and Context</h2>
            <p className="form-phase__desc">This creates your baseline tenancy profile so ZeroDispute LeaseOS can personalise communication and decisions.</p>

            <div className="form-group">
              <label className="form-label" htmlFor="fullName">Full Name</label>
              <span className="form-hint">As it appears on your ID.</span>
              <input
                id="fullName"
                type="text"
                className={`form-input ${errors.fullName ? 'form-input--error' : ''}`}
                value={formData.fullName}
                onChange={(e) => updateField('fullName', e.target.value)}
                required
                aria-required="true"
                aria-describedby={errors.fullName ? 'fullName-error' : undefined}
              />
              {errors.fullName && <div className="form-error" id="fullName-error" role="alert">{errors.fullName}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="phone">Phone Number</label>
              <span className="form-hint">Your WhatsApp-enabled number.</span>
              <input
                id="phone"
                type="tel"
                className={`form-input ${errors.phone ? 'form-input--error' : ''}`}
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                required
                aria-required="true"
                aria-describedby={errors.phone ? 'phone-error' : undefined}
              />
              {errors.phone && <div className="form-error" id="phone-error" role="alert">{errors.phone}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                className={`form-input ${errors.email ? 'form-input--error' : ''}`}
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                required
                aria-required="true"
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && <div className="form-error" id="email-error" role="alert">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Current Residential Status</label>
              {errors.residentialStatus && <div className="form-error" role="alert">{errors.residentialStatus}</div>}
              <div className="form-radio-group">
                {['Living in this city', 'Relocating from another city', 'Relocating from another state'].map((opt) => (
                  <div
                    key={opt}
                    className={`form-radio ${formData.residentialStatus === opt ? 'form-radio--selected' : ''}`}
                    onClick={() => updateField('residentialStatus', opt)}
                    role="radio"
                    aria-checked={formData.residentialStatus === opt}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); updateField('residentialStatus', opt) } }}
                  >
                    <span className="form-radio__indicator" />
                    <span className="form-radio__label">{opt}</span>
                  </div>
                ))}
              </div>
            </div>

            {formData.residentialStatus && formData.residentialStatus !== 'Living in this city' && (
              <div className="form-group">
                <label className="form-label" htmlFor="currentCity">Current City / State</label>
                <span className="form-hint">Where you are relocating from.</span>
                <input
                  id="currentCity"
                  type="text"
                  className="form-input"
                  value={formData.currentCity}
                  onChange={(e) => updateField('currentCity', e.target.value)}
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Employment Status</label>
              {errors.employmentStatus && <div className="form-error" role="alert">{errors.employmentStatus}</div>}
              <div className="form-radio-group">
                {['Working', 'Studying', 'Self-employed', 'Business owner', 'Other'].map((opt) => (
                  <div
                    key={opt}
                    className={`form-radio ${formData.employmentStatus === opt ? 'form-radio--selected' : ''}`}
                    onClick={() => updateField('employmentStatus', opt)}
                    role="radio"
                    aria-checked={formData.employmentStatus === opt}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); updateField('employmentStatus', opt) } }}
                  >
                    <span className="form-radio__indicator" />
                    <span className="form-radio__label">{opt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="workplace">
                {formData.employmentStatus === 'Studying' ? 'College / Institution' : 'Workplace / Organisation'}
              </label>
              <span className="form-hint">{formData.employmentStatus === 'Studying' ? 'Name of your college or university.' : 'Organisation or company name.'}</span>
              <input
                id="workplace"
                type="text"
                className="form-input"
                value={formData.workplace}
                onChange={(e) => updateField('workplace', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Phase 2: Search */}
        {phase === 1 && (
          <div className="form-phase">
            <div className="form-phase__title">Phase 2</div>
            <h2 className="form-phase__heading">Hyper-Local Search and Budget</h2>
            <p className="form-phase__desc">Tell us where you want to live and what you can spend.</p>

            <div className="form-group">
              <label className="form-label" htmlFor="targetMarkets">Target Micro-Markets</label>
              <span className="form-hint">Enter neighbourhoods, tech parks or institutional hubs. Separate with commas.</span>
              <input
                id="targetMarkets"
                type="text"
                className={`form-input ${errors.targetMarkets ? 'form-input--error' : ''}`}
                value={formData.targetMarkets}
                onChange={(e) => updateField('targetMarkets', e.target.value)}
                required
                aria-describedby={errors.targetMarkets ? 'targetMarkets-error' : undefined}
              />
              {errors.targetMarkets && <div className="form-error" id="targetMarkets-error" role="alert">{errors.targetMarkets}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="commuteMax">Maximum Daily Commute Tolerance</label>
              <span className="form-hint">Distance in km or travel time in minutes.</span>
              <input
                id="commuteMax"
                type="text"
                className="form-input"
                value={formData.commuteMax}
                onChange={(e) => updateField('commuteMax', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="rentCeiling">Monthly Rent Ceiling (INR)</label>
              <input
                id="rentCeiling"
                type="number"
                className={`form-input ${errors.rentCeiling ? 'form-input--error' : ''}`}
                value={formData.rentCeiling}
                onChange={(e) => updateField('rentCeiling', e.target.value)}
                required
                aria-describedby={errors.rentCeiling ? 'rentCeiling-error' : undefined}
              />
              {errors.rentCeiling && <div className="form-error" id="rentCeiling-error" role="alert">{errors.rentCeiling}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Property Configuration</label>
              {errors.propertyConfig && <div className="form-error" role="alert">{errors.propertyConfig}</div>}
              <div className="form-radio-group">
                {['1 BHK', '2 BHK', '3 BHK', 'Studio Apartment', 'Independent Floor', 'Shared / Co-living'].map((opt) => (
                  <div
                    key={opt}
                    className={`form-radio ${formData.propertyConfig === opt ? 'form-radio--selected' : ''}`}
                    onClick={() => updateField('propertyConfig', opt)}
                    role="radio"
                    aria-checked={formData.propertyConfig === opt}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); updateField('propertyConfig', opt) } }}
                  >
                    <span className="form-radio__indicator" />
                    <span className="form-radio__label">{opt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Furnishing</label>
              <div className="form-radio-group">
                {['Unfurnished', 'Semi-Furnished', 'Fully Furnished'].map((opt) => (
                  <div
                    key={opt}
                    className={`form-radio ${formData.furnishing === opt ? 'form-radio--selected' : ''}`}
                    onClick={() => updateField('furnishing', opt)}
                    role="radio"
                    aria-checked={formData.furnishing === opt}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); updateField('furnishing', opt) } }}
                  >
                    <span className="form-radio__indicator" />
                    <span className="form-radio__label">{opt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Phase 3: Lifestyle */}
        {phase === 2 && (
          <div className="form-phase">
            <div className="form-phase__title">Phase 3</div>
            <h2 className="form-phase__heading">Lifestyle, Pets and Hard Constraints</h2>
            <p className="form-phase__desc">These act as hard matching constraints where appropriate.</p>

            <div className="form-group">
              <label className="form-label" htmlFor="moveInTimeline">Move-In Timeline</label>
              <span className="form-hint">When do you need to move in?</span>
              <input
                id="moveInTimeline"
                type="date"
                className={`form-input ${errors.moveInTimeline ? 'form-input--error' : ''}`}
                value={formData.moveInTimeline}
                onChange={(e) => updateField('moveInTimeline', e.target.value)}
                required
                aria-describedby={errors.moveInTimeline ? 'moveInTimeline-error' : undefined}
              />
              {errors.moveInTimeline && <div className="form-error" id="moveInTimeline-error" role="alert">{errors.moveInTimeline}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Preferred Household Structure</label>
              {errors.householdStructure && <div className="form-error" role="alert">{errors.householdStructure}</div>}
              <div className="form-radio-group">
                {['Bachelor, Male', 'Bachelor, Female', 'Married Couple', 'Family', 'Live-in Professionals'].map((opt) => (
                  <div
                    key={opt}
                    className={`form-radio ${formData.householdStructure === opt ? 'form-radio--selected' : ''}`}
                    onClick={() => updateField('householdStructure', opt)}
                    role="radio"
                    aria-checked={formData.householdStructure === opt}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); updateField('householdStructure', opt) } }}
                  >
                    <span className="form-radio__indicator" />
                    <span className="form-radio__label">{opt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Food / Lifestyle Preference</label>
              <div className="form-radio-group">
                {['Vegetarian-only preference', 'Non-vegetarian okay', 'No preference'].map((opt) => (
                  <div
                    key={opt}
                    className={`form-radio ${formData.foodPreference === opt ? 'form-radio--selected' : ''}`}
                    onClick={() => updateField('foodPreference', opt)}
                    role="radio"
                    aria-checked={formData.foodPreference === opt}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); updateField('foodPreference', opt) } }}
                  >
                    <span className="form-radio__indicator" />
                    <span className="form-radio__label">{opt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Pet Ownership</label>
              <div className="form-radio-group">
                {['No pet', 'Dog', 'Cat', 'Other'].map((opt) => (
                  <div
                    key={opt}
                    className={`form-radio ${formData.petOwnership === opt ? 'form-radio--selected' : ''}`}
                    onClick={() => updateField('petOwnership', opt)}
                    role="radio"
                    aria-checked={formData.petOwnership === opt}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); updateField('petOwnership', opt) } }}
                  >
                    <span className="form-radio__indicator" />
                    <span className="form-radio__label">{opt}</span>
                  </div>
                ))}
              </div>
            </div>

            {formData.petOwnership && formData.petOwnership !== 'No pet' && (
              <div className="form-group">
                <label className="form-label" htmlFor="petDetails">Pet Details</label>
                <span className="form-hint">Breed, size and any special needs.</span>
                <input
                  id="petDetails"
                  type="text"
                  className="form-input"
                  value={formData.petDetails}
                  onChange={(e) => updateField('petDetails', e.target.value)}
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Parking</label>
              <div className="form-radio-group">
                {['None', '1 Two-Wheeler', '1 Four-Wheeler', '2+ Cars'].map((opt) => (
                  <div
                    key={opt}
                    className={`form-radio ${formData.parking === opt ? 'form-radio--selected' : ''}`}
                    onClick={() => updateField('parking', opt)}
                    role="radio"
                    aria-checked={formData.parking === opt}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); updateField('parking', opt) } }}
                  >
                    <span className="form-radio__indicator" />
                    <span className="form-radio__label">{opt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Phase 4: Finance */}
        {phase === 3 && (
          <div className="form-phase">
            <div className="form-phase__title">Phase 4</div>
            <h2 className="form-phase__heading">Financial Setup</h2>
            <p className="form-phase__desc">Your financial preferences help us coordinate payment workflows.</p>

            <div className="form-group">
              <label className="form-label">Average Household Monthly Income Bracket</label>
              <div className="form-radio-group">
                {['Below 30,000', '30,000 to 50,000', '50,000 to 80,000', '80,000 to 1,20,000', '1,20,000 to 2,00,000', 'Above 2,00,000'].map((opt) => (
                  <div
                    key={opt}
                    className={`form-radio ${formData.incomeBracket === opt ? 'form-radio--selected' : ''}`}
                    onClick={() => updateField('incomeBracket', opt)}
                    role="radio"
                    aria-checked={formData.incomeBracket === opt}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); updateField('incomeBracket', opt) } }}
                  >
                    <span className="form-radio__indicator" />
                    <span className="form-radio__label">{opt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Preferred Rent Payment Method</label>
              <div className="form-radio-group">
                {['UPI', 'Net Banking', 'Credit Card'].map((opt) => (
                  <div
                    key={opt}
                    className={`form-radio ${formData.paymentMethod === opt ? 'form-radio--selected' : ''}`}
                    onClick={() => updateField('paymentMethod', opt)}
                    role="radio"
                    aria-checked={formData.paymentMethod === opt}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); updateField('paymentMethod', opt) } }}
                  >
                    <span className="form-radio__indicator" />
                    <span className="form-radio__label">{opt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Security Deposit Preference</label>
              <span className="form-hint">Choosing financing indicates interest. It does not guarantee approval.</span>
              <div className="form-radio-group">
                {['Pay full deposit upfront', 'Explore 3 to 12 month financing'].map((opt) => (
                  <div
                    key={opt}
                    className={`form-radio ${formData.depositPreference === opt ? 'form-radio--selected' : ''}`}
                    onClick={() => updateField('depositPreference', opt)}
                    role="radio"
                    aria-checked={formData.depositPreference === opt}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); updateField('depositPreference', opt) } }}
                  >
                    <span className="form-radio__indicator" />
                    <span className="form-radio__label">{opt}</span>
                  </div>
                ))}
              </div>
            </div>

            {formData.depositPreference === 'Explore 3 to 12 month financing' && (
              <div style={{ padding: '16px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', marginTop: '8px', fontSize: '0.875rem', color: 'var(--color-muted)' }}>
                Deposit financing is subject to eligibility verification and approval by financial partners. Selecting this option records your interest and does not constitute an approved credit line.
              </div>
            )}
          </div>
        )}

        {/* Phase 5: Moving */}
        {phase === 4 && (
          <div className="form-phase">
            <div className="form-phase__title">Phase 5</div>
            <h2 className="form-phase__heading">Moving and Logistics</h2>
            <p className="form-phase__desc">Help us prepare your relocation coordination.</p>

            <div className="form-group">
              <label className="form-label" htmlFor="movingOrigin">Moving Origin</label>
              <span className="form-hint">Current address or PIN code.</span>
              <input
                id="movingOrigin"
                type="text"
                className="form-input"
                value={formData.movingOrigin}
                onChange={(e) => updateField('movingOrigin', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="currentFloor">Current Property Floor</label>
              <input
                id="currentFloor"
                type="text"
                className="form-input"
                value={formData.currentFloor}
                onChange={(e) => updateField('currentFloor', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Elevator Access</label>
              <div className="form-radio-group">
                {['Yes', 'No', 'Unknown'].map((opt) => (
                  <div
                    key={opt}
                    className={`form-radio ${formData.elevatorAccess === opt ? 'form-radio--selected' : ''}`}
                    onClick={() => updateField('elevatorAccess', opt)}
                    role="radio"
                    aria-checked={formData.elevatorAccess === opt}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); updateField('elevatorAccess', opt) } }}
                  >
                    <span className="form-radio__indicator" />
                    <span className="form-radio__label">{opt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Household Volume</label>
              <div className="form-radio-group">
                {['Minimalist', '1 BHK volume', '2 to 3 BHK volume'].map((opt) => (
                  <div
                    key={opt}
                    className={`form-radio ${formData.householdVolume === opt ? 'form-radio--selected' : ''}`}
                    onClick={() => updateField('householdVolume', opt)}
                    role="radio"
                    aria-checked={formData.householdVolume === opt}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); updateField('householdVolume', opt) } }}
                  >
                    <span className="form-radio__indicator" />
                    <span className="form-radio__label">{opt}</span>
                  </div>
                ))}
              </div>
            </div>

            {formData.furnishing !== 'Fully Furnished' && (
              <div className="form-group">
                <label className="form-label">Additional Services</label>
                <span className="form-hint">Select all that apply.</span>
                <div className="form-checkbox-group">
                  {['AC uninstallation/reinstallation', 'RO purifier', 'TV mounting', 'Other appliances'].map((opt) => (
                    <div
                      key={opt}
                      className={`form-checkbox ${(formData.additionalServices || []).includes(opt) ? 'form-checkbox--selected' : ''}`}
                      onClick={() => toggleArrayField('additionalServices', opt)}
                      role="checkbox"
                      aria-checked={(formData.additionalServices || []).includes(opt)}
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleArrayField('additionalServices', opt) } }}
                    >
                      <span className="form-checkbox__indicator" />
                      <span className="form-checkbox__label">{opt}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Packing Materials</label>
              <div className="form-radio-group">
                {['Standard', 'Premium'].map((opt) => (
                  <div
                    key={opt}
                    className={`form-radio ${formData.packingMaterials === opt ? 'form-radio--selected' : ''}`}
                    onClick={() => updateField('packingMaterials', opt)}
                    role="radio"
                    aria-checked={formData.packingMaterials === opt}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); updateField('packingMaterials', opt) } }}
                  >
                    <span className="form-radio__indicator" />
                    <span className="form-radio__label">{opt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Phase 6: Add-ons */}
        {phase === 5 && (
          <div className="form-phase">
            <div className="form-phase__title">Phase 6</div>
            <h2 className="form-phase__heading">Post-Move Services</h2>
            <p className="form-phase__desc">Optional services to help you settle in.</p>

            <div className="form-group">
              <label className="form-label">Deep Cleaning</label>
              <div className="form-radio-group">
                {['Yes', 'No'].map((opt) => (
                  <div
                    key={opt}
                    className={`form-radio ${formData.deepCleaning === opt ? 'form-radio--selected' : ''}`}
                    onClick={() => updateField('deepCleaning', opt)}
                    role="radio"
                    aria-checked={formData.deepCleaning === opt}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); updateField('deepCleaning', opt) } }}
                  >
                    <span className="form-radio__indicator" />
                    <span className="form-radio__label">{opt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Pre-Move Painting</label>
              <div className="form-radio-group">
                {['Yes', 'No'].map((opt) => (
                  <div
                    key={opt}
                    className={`form-radio ${formData.prePainting === opt ? 'form-radio--selected' : ''}`}
                    onClick={() => updateField('prePainting', opt)}
                    role="radio"
                    aria-checked={formData.prePainting === opt}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); updateField('prePainting', opt) } }}
                  >
                    <span className="form-radio__indicator" />
                    <span className="form-radio__label">{opt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Home Appliance / Furniture Subscription</label>
              <div className="form-radio-group">
                {['Yes', 'No'].map((opt) => (
                  <div
                    key={opt}
                    className={`form-radio ${formData.applianceSubscription === opt ? 'form-radio--selected' : ''}`}
                    onClick={() => updateField('applianceSubscription', opt)}
                    role="radio"
                    aria-checked={formData.applianceSubscription === opt}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); updateField('applianceSubscription', opt) } }}
                  >
                    <span className="form-radio__indicator" />
                    <span className="form-radio__label">{opt}</span>
                  </div>
                ))}
              </div>
            </div>

            {formData.applianceSubscription === 'Yes' && (
              <div className="form-group">
                <label className="form-label">Subscription Preference</label>
                <span className="form-hint">Select all that apply.</span>
                <div className="form-checkbox-group">
                  {['Appliances', 'Furniture', 'Work-from-home setup', 'Other'].map((opt) => (
                    <div
                      key={opt}
                      className={`form-checkbox ${(formData.subscriptionPreference || []).includes(opt) ? 'form-checkbox--selected' : ''}`}
                      onClick={() => toggleArrayField('subscriptionPreference', opt)}
                      role="checkbox"
                      aria-checked={(formData.subscriptionPreference || []).includes(opt)}
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleArrayField('subscriptionPreference', opt) } }}
                    >
                      <span className="form-checkbox__indicator" />
                      <span className="form-checkbox__label">{opt}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Form Actions */}
        <div className="form-actions">
          {phase > 0 && (
            <button className="btn btn--secondary" onClick={handleBack} id="form-back-btn">Back</button>
          )}
          <button className="btn btn--primary" onClick={handleContinue} id="form-continue-btn">
            {phase === PHASES.length - 1 ? 'Review profile' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  )
}
