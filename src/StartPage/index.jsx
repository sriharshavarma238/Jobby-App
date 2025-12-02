import { Link } from 'react-router-dom'
import Cookies from 'js-cookie'
import { Navigate } from 'react-router-dom'
import './index.css'

const StartPage = () => {
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
        return <Navigate to="/home" replace />
    }

    return (
        <div className="start-page-container">
            <div className="start-page-content">
                <img
                    src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
                    className="start-page-logo"
                    alt="website logo"
                />
                <h1 className="start-page-heading">Welcome to Jobby</h1>
                <p className="start-page-description">
                    Find the job that fits your life. Choose how you want to continue:
                </p>
                <div className="start-page-buttons">
                    <Link to="/login/user">
                        <button type="button" className="start-page-button user-button">
                            Continue as User
                        </button>
                    </Link>
                    <Link to="/login/admin">
                        <button type="button" className="start-page-button admin-button">
                            Continue as Admin
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default StartPage
