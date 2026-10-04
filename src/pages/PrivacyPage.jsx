export default function PrivacyPage() {
  return (
    <div className="legal-page">
      <div className="container">
        <div className="legal-page__content">
          <span className="eyebrow" style={{ marginBottom: '16px', display: 'block' }}>ZeroDispute LeaseOS</span>
          <h1>Privacy Policy</h1>
          <div className="legal-page__updated">Last Updated: October 4, 2026</div>

          <p>
            ZeroDispute LeaseOS ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by ZeroDispute LeaseOS.
          </p>
          
          <h2>1. Information We Collect</h2>
          <p>We collect information you provide directly to us when you create a tenancy profile or use our services. This may include:</p>
          <ul>
            <li><strong>Identity Information:</strong> Name, phone number, email address, and residential status.</li>
            <li><strong>Contextual Information:</strong> Employment status, workplace, and relocation details.</li>
            <li><strong>Preferences:</strong> Property configuration, budget, move-in timeline, lifestyle preferences (e.g., food, pets, parking).</li>
            <li><strong>Financial Preferences:</strong> Income bracket, preferred rent payment method, and security deposit preference.</li>
            <li><strong>Logistics Data:</strong> Moving origin, current property details, household volume, and required services.</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>ZeroDispute LeaseOS uses the collected information to operate the tenancy workflow autonomously. Specifically, we process this data to:</p>
          <ul>
            <li>Build and maintain your persistent tenancy state.</li>
            <li>Match your requirements with available property inventory.</li>
            <li>Coordinate property visits and physical verifications.</li>
            <li>Facilitate the rental agreement process.</li>
            <li>Route and manage maintenance requests based on lease responsibility and property baselines.</li>
            <li>Coordinate move-in and move-out logistics, including address validation.</li>
            <li>Prepare and manage security deposit settlements.</li>
          </ul>

          <h2>3. Information Sharing and Disclosure</h2>
          <p>ZeroDispute LeaseOS operates by connecting to specialised infrastructure rails. We share necessary data with these third-party services to execute specific actions:</p>
          <ul>
            <li><strong>NoBroker:</strong> Tenancy context, property availability, and ecosystem distribution.</li>
            <li><strong>Gnani:</strong> Voice interaction and multilingual communication data (e.g., call recordings for intent extraction).</li>
            <li><strong>Delhivery:</strong> Address details and logistics requirements for validation and moving workflows.</li>
            <li><strong>Pine Labs:</strong> Payment preferences and settlement instructions for executing financial transactions.</li>
          </ul>
          <p>We do not sell your personal data. Information is shared strictly for the purpose of executing the tenancy workflow you have requested.</p>

          <h2>4. Data Security</h2>
          <p>We implement appropriate technical and organisational measures to protect your personal data against accidental or unlawful destruction, loss, alteration, or unauthorised disclosure. However, no internet-based service can be entirely secure.</p>

          <h2>5. Data Retention</h2>
          <p>We retain your tenancy profile and operational state (including maintenance history, property baselines, and evidence captures) for as long as your tenancy is active, and for a legally required period thereafter to resolve disputes and process final settlements.</p>

          <h2>6. Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal data. You may also request a copy of the tenancy state maintained by the system.</p>

          <h2>7. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy or how your data is handled, please contact us at:</p>
          <p>Email: <a href="mailto:privacy@zerodisputeleaseos.in" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>privacy@zerodisputeleaseos.in</a></p>
          
          <div style={{ marginTop: '48px', padding: '16px', border: '1px solid var(--color-warning)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
            <strong style={{ color: 'var(--color-warning)' }}>Disclaimer:</strong> This is a concept product designed around the NoBroker ecosystem. This Privacy Policy is for demonstrative purposes and does not represent a live, legally binding data collection agreement.
          </div>
        </div>
      </div>
    </div>
  )
}
