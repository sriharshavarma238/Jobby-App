import { Link } from 'react-router-dom'
import Cookies from 'js-cookie'
import { useNavigate, Navigate } from 'react-router'
import { PiShoppingBagFill } from "react-icons/pi"
import { MdLogout, MdAdd } from "react-icons/md"
import { IoMdHome } from "react-icons/io"
import './index.css'

const AdminHeader = () => {
    const navigate = useNavigate()
    const userType = Cookies.get('user_type')

    const onClickLogout = () => {
        Cookies.remove('jwt_token')
        Cookies.remove('user_type')
        navigate('/', { replace: true })
    }

    // If not admin, redirect to user home
    if (userType !== 'admin') {
        return <Navigate to="/home" replace />
    }

    return (
        <nav className="nav-header admin-nav-header">
            <div className="nav-content">
                <div className="nav-bar-mobile-logo-container">
                    <Link to="/admin/dashboard">
                        <img
                            className="website-logo"
                            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
                            alt="website logo"
                        />
                    </Link>

                    <div className="nav-menu-mobile">
                        <ul className="nav-menu-list-mobile">
                            <li className="nav-menu-item-mobile">
                                <Link to="/admin/dashboard" className="nav-link">
                                    <IoMdHome color='#222' />
                                </Link>
                            </li>
                            <li className="nav-menu-item-mobile">
                                <Link to="/admin/create-job" className="nav-link">
                                    <MdAdd color="#222" />
                                </Link>
                            </li>
                            <li className="nav-menu-item-mobile">
                                <Link to="/admin/jobs" className="nav-link">
                                    <PiShoppingBagFill className='employ' color="#222" />
                                </Link>
                            </li>
                            <li className="nav-menu-item-mobile" onClick={onClickLogout}>
                                <MdLogout color='#222' className='logou' />
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="nav-bar-large-container">
                    <Link to="/admin/dashboard">
                        <img
                            className="website-logo"
                            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
                            alt="website logo"
                        />
                    </Link>
                    <div className="nav-menu-desktop">
                        <ul className="nav-menu">
                            <Link to="/admin/dashboard" style={{ color: '#000', textDecoration: 'none' }}>
                                <li className="nav-link nav-menu-item">
                                    Dashboard
                                </li>
                            </Link>
                            <Link to="/admin/create-job" style={{ color: '#000', textDecoration: 'none' }}>
                                <li className="nav-link nav-menu-item">
                                    Create Job
                                </li>
                            </Link>
                            <Link to="/admin/jobs" style={{ color: '#000', textDecoration: 'none' }}>
                                <li className="nav-link nav-menu-item">
                                    My Jobs
                                </li>
                            </Link>
                        </ul>
                    </div>
                    <button
                        type="button"
                        className="logout-desktop-btn shiny-login-btn"
                        onClick={onClickLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default AdminHeader
