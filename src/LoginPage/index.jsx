import { useState } from 'react'
import { useNavigate, Navigate, useParams } from 'react-router'
import Cookies from 'js-cookie'
import { API_ENDPOINTS } from '../config/api'

import './index.css'

const LoginPage = () => {
  const { userType } = useParams() // 'user' or 'admin'
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [isSignup, setIsSignup] = useState(false)
  const [showSubmitError, setShowSubmitError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate()

  const isAdmin = userType === 'admin'

  const onChangeUsername = event => {
    setUsername(event.target.value)
  }

  const onChangePassword = event => {
    setPassword(event.target.value)
  }

  const onChangeEmail = event => {
    setEmail(event.target.value)
  }

  const onChangeName = event => {
    setName(event.target.value)
  }

  const toggleMode = () => {
    setIsSignup(!isSignup)
    setShowSubmitError(false)
    setErrorMsg('')
  }

  const renderPasswordField = () => (
    <>
      <label className="input-label" htmlFor="password">
        PASSWORD
      </label>
      <input
        type="password"
        id="password"
        className="password-input-field"
        value={password}
        onChange={onChangePassword}
        placeholder="Password"
        required
      />
    </>
  )

  const renderUsernameField = () => (
    <>
      <label className="input-label" htmlFor="username">
        USERNAME
      </label>
      <input
        type="text"
        id="username"
        className="username-input-field"
        value={username}
        onChange={onChangeUsername}
        placeholder="Username"
        required
      />
    </>
  )

  const renderEmailField = () => (
    <>
      <label className="input-label" htmlFor="email">
        EMAIL
      </label>
      <input
        type="email"
        id="email"
        className="username-input-field"
        value={email}
        onChange={onChangeEmail}
        placeholder="Email"
        required
      />
    </>
  )

  const renderNameField = () => (
    <>
      <label className="input-label" htmlFor="name">
        NAME
      </label>
      <input
        type="text"
        id="name"
        className="username-input-field"
        value={name}
        onChange={onChangeName}
        placeholder="Full Name"
        required
      />
    </>
  )
  const onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, { expires: 30 })
    Cookies.set('user_type', userType, { expires: 30 })
    navigate('/home', { replace: true })
  }

  const onSubmitFailure = errorMsg => {
    setShowSubmitError(true)
    setErrorMsg(errorMsg)
  }

  const submitForm = async event => {
    event.preventDefault()
    setShowSubmitError(false)

    const endpoint = isSignup
      ? (isAdmin ? API_ENDPOINTS.ADMIN_SIGNUP : API_ENDPOINTS.USER_SIGNUP)
      : (isAdmin ? API_ENDPOINTS.ADMIN_SIGNIN : API_ENDPOINTS.USER_SIGNIN)

    const payload = isSignup
      ? { username, password, email, name }
      : { username, password }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }

    try {
      const response = await fetch(endpoint, options)
      const data = await response.json()

      if (response.ok === true) {
        if (isSignup) {
          // After successful signup, switch to login
          setIsSignup(false)
          setShowSubmitError(false)
          setErrorMsg('')
          alert('Signup successful! Please login.')
        } else {
          // Backend returns { message, token }
          onSubmitSuccess(data.token)
        }
      } else {
        onSubmitFailure(data.message || 'An error occurred')
      }
    } catch (error) {
      onSubmitFailure('Failed to connect to server')
    }
  }
  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken !== undefined) {
    return <Navigate to="/home" />
  }

  return (
    <div className="login-form-container">
      <form className="form-container" onSubmit={submitForm}>
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          className="login-website-logo-desktop-img"
          alt="website logo"
        />
        <h1 className="login-heading">
          {isSignup ? 'Sign Up' : 'Login'} as {isAdmin ? 'Admin' : 'User'}
        </h1>

        <div className="input-container">{renderUsernameField()}</div>
        {isSignup && (
          <>
            <div className="input-container">{renderNameField()}</div>
            <div className="input-container">{renderEmailField()}</div>
          </>
        )}
        <div className="input-container">{renderPasswordField()}</div>

        <button type="submit" className="login-button">
          {isSignup ? 'Sign Up' : 'Login'}
        </button>

        {showSubmitError && <p className="error-message">*{errorMsg}</p>}

        <div className="toggle-mode">
          <p>
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button type="button" className="toggle-button" onClick={toggleMode}>
              {isSignup ? 'Login' : 'Sign Up'}
            </button>
          </p>
        </div>

        <button
          type="button"
          className="back-to-start-button"
          onClick={() => navigate('/')}
        >
          Back to Start
        </button>
      </form>
    </div>
  )
}

export default LoginPage