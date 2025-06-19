import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {useNavigate} from 'react-router'
import { PiShoppingBagFill } from "react-icons/pi";
import { MdLogout } from "react-icons/md";
import { IoMdHome } from "react-icons/io";

import './index.css'

const Header = () => {
const navigate = useNavigate()
const onClickLogout = () => {
    Cookies.remove('jwt_token')
    navigate('/', {replace: true})
}

return (
    <nav className="nav-header">
    <div className="nav-content">
        <div className="nav-bar-mobile-logo-container">
        <Link to="/">
            <img
            className="website-logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            />  
        </Link>

    <div className="nav-menu-mobile">
        <ul className="nav-menu-list-mobile">
        <li className="nav-menu-item-mobile">
            <Link to="/home" className="nav-link" style={{fontSize: '20px', marginTop: '0px'}}>
            <IoMdHome color='#222'/>
            </Link>
        </li>

        <li className="nav-menu-item-mobile">
            <Link to="/jobs" className="nav-link">
                <PiShoppingBagFill className='employ' color="#222"/>
            </Link>
        </li>
        <li className="nav-menu-item-mobile" onClick={onClickLogout}>
                <Link to="/cart" className="nav-link">
                <MdLogout color='#222' className='logou'/>
                </Link>
   
        </li>
        </ul>
    </div>
        </div>

        <div className="nav-bar-large-container">
        <Link to="/">
            <img
            className="website-logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            />
        </Link>
        <div className="nav-menu-desktop">
            <ul className="nav-menu">
                <Link to="/" style={{color: '#000',textDecoration: 'none'}}>
                    <li className="nav-link nav-menu-item">
                        Home
                    </li>
                </Link>
                <Link to="/jobs" style={{color: '#000',textDecoration: 'none'}}>
                    <li className="nav-link nav-menu-item">
                        Jobs
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

export default Header