import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="not-found">
      <div className="container">
        <div className="not-found__content">
          <div className="not-found__label">Error 404</div>
          <h1 className="serif">This address doesn't exist.</h1>
          <p>Looks like this tenancy state is unavailable or the requested page has been moved.</p>
          
          <div className="btn-group">
            <Link to="/" className="btn btn--primary" id="notfound-home-btn">Return to ZeroDispute LeaseOS</Link>
            <Link to="/start" className="btn btn--secondary" id="notfound-start-btn">Start a tenancy</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
