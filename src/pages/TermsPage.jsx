export default function TermsPage() {
  return (
    <div className="legal-page">
      <div className="container">
        <div className="legal-page__content">
          <span className="eyebrow" style={{ marginBottom: '16px', display: 'block' }}>ZeroDispute LeaseOS</span>
          <h1>Terms of Service</h1>
          <div className="legal-page__updated">Last Updated: October 4, 2026</div>

          <h2>1. Product Nature</h2>
          <p>
            ZeroDispute LeaseOS provides an autonomous tenancy operating system designed to coordinate the rental lifecycle. The system acts as a central arbiter to evaluate evidence and execute workflows across discovery, verification, transaction, logistics, operation, and exit.
          </p>

          <h2>2. User Responsibilities</h2>
          <p>
            Users must provide accurate information when building their tenancy profile or submitting evidence (such as move-in/move-out condition scans). You are responsible for maintaining the confidentiality of your account access and for all activities that occur under your profile.
          </p>

          <h2>3. Automation Boundaries</h2>
          <p>
            ZeroDispute LeaseOS operates on the principle of bounded autonomy. The system can execute routine actions within predefined policy boundaries (Level 4 autonomy). However, ZeroDispute LeaseOS will pause execution and escalate to human review under the following conditions:
          </p>
          <ul>
            <li>When evidence provided is insufficient for verification.</li>
            <li>When payment authentication fails or a beneficiary cannot be verified.</li>
            <li>When there is a contractual interpretation conflict or dispute between tenant and landlord.</li>
            <li>When an action requires authority exceeding the configured monetary limits.</li>
          </ul>

          <h2>4. Third-Party Services</h2>
          <p>
            ZeroDispute LeaseOS relies on external infrastructure rails to perform specific actions. By using ZeroDispute LeaseOS, you acknowledge that execution of certain services involves third parties:
          </p>
          <ul>
            <li><strong>NoBroker:</strong> For tenancy context and property data.</li>
            <li><strong>Gnani:</strong> For voice interaction and speech processing.</li>
            <li><strong>Delhivery:</strong> For logistics planning and address validation.</li>
            <li><strong>Pine Labs:</strong> For processing payments and authorised payouts.</li>
          </ul>

          <h2>5. Payments and Settlements</h2>
          <p>
            All financial transactions, including rent payments and security deposit settlements, are routed through authenticated payment gateways. ZeroDispute LeaseOS calculates deposit deductions based on a comparison of move-out evidence against the verified move-in baseline, in accordance with the lease terms.
          </p>

          <h2>6. Dispute Escalation</h2>
          <p>
            In the event of a dispute regarding evidence or financial deductions, ZeroDispute LeaseOS will halt autonomous settlement and forward the complete tenancy record to human mediation teams for resolution.
          </p>

          <h2>7. Limitations of Liability</h2>
          <p>
            To the maximum extent permitted by law, ZeroDispute LeaseOS shall not be liable for any indirect, incidental, or consequential damages resulting from the use of the platform, third-party service failures, or decisions made within the declared automation boundaries.
          </p>

          <h2>8. Termination</h2>
          <p>
            We may suspend or terminate your access to the service if you violate these Terms or provide falsified evidence during the tenancy lifecycle.
          </p>

          <h2>9. Contact</h2>
          <p>For legal inquiries regarding these terms, please contact:</p>
          <p>Email: <a href="mailto:legal@zerodisputeleaseos.in" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>legal@zerodisputeleaseos.in</a></p>

          <div style={{ marginTop: '48px', padding: '16px', border: '1px solid var(--color-warning)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
            <strong style={{ color: 'var(--color-warning)' }}>Important Notice:</strong> This platform is a strategic product concept demonstrating an autonomous tenancy workflow. It should not be interpreted as representing live financial, legal, or property guarantees unless separately contracted.
          </div>
        </div>
      </div>
    </div>
  )
}
