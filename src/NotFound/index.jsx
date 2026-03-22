import { Link } from 'react-router-dom'
import './index.css'

const NotFound = () => (
    <div className="not-found-page">
        <div className="not-found-card">
            <p className="not-found-code">404</p>
            <h1 className="not-found-title">Page not found</h1>
            <p className="not-found-text">
                The page you are looking for does not exist or may have been moved.
            </p>
            <div className="not-found-actions">
                <Link to="/home" className="not-found-link primary-link">
                    Go to Home
                </Link>
                <Link to="/" className="not-found-link secondary-link">
                    Back to Start
                </Link>
            </div>
        </div>
    </div>
)

export default NotFound
