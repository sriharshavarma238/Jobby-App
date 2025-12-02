import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import Header from '../Header'
import { API_ENDPOINTS } from '../config/api'
import { FaStar, FaTrash } from 'react-icons/fa'
import { IoLocationSharp } from 'react-icons/io5'
import { PiShoppingBagFill } from 'react-icons/pi'
import BeatLoader from 'react-spinners/BeatLoader'
import './index.css'

const Applications = () => {
    const [applications, setApplications] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [deletingId, setDeletingId] = useState(null)

    const jwtToken = Cookies.get('jwt_token')

    if (!jwtToken) {
        return <Navigate to="/" replace />
    }

    const fetchApplications = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(API_ENDPOINTS.GET_APPLICATIONS, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            })
            const data = await response.json()
            if (response.ok) {
                setApplications(data.applications || [])
            }
        } catch (error) {
            console.error('Failed to fetch applications', error)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        fetchApplications()
    }, [jwtToken])

    const handleDelete = async (applicationId) => {
        if (!window.confirm('Are you sure you want to withdraw this application?')) return

        setDeletingId(applicationId)
        try {
            const response = await fetch(API_ENDPOINTS.DELETE_APPLICATION(applicationId), {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            })

            if (response.ok) {
                setApplications(applications.filter(app => app._id !== applicationId))
            } else {
                alert('Failed to delete application')
            }
        } catch (error) {
            alert('Error deleting application')
        } finally {
            setDeletingId(null)
        }
    }

    if (isLoading) {
        return (
            <div>
                <Header />
                <div className="loading-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
                    <BeatLoader color="#3b82f6" />
                </div>
            </div>
        )
    }

    return (
        <div className="applications-container">
            <Header />
            <div className="applications-content">
                <h1 className="applications-heading">My Applications</h1>

                {applications.length === 0 ? (
                    <div className="no-applications">
                        <p>You haven't applied to any jobs yet.</p>
                        <button
                            className="browse-jobs-btn"
                            onClick={() => window.location.href = '/jobs'}
                        >
                            Browse Jobs
                        </button>
                    </div>
                ) : (
                    <div className="applications-list">
                        {applications.map(application => {
                            const job = application.job || {}
                            return (
                                <div key={application._id} className="application-card">
                                    <div className="application-header">
                                        {job.companyLogoUrl && (
                                            <img src={job.companyLogoUrl} alt="company logo" className="company-logo" />
                                        )}
                                        <div className="job-title-section">
                                            <h2 style={{ color: '#ffffff', fontSize: '22px', fontWeight: 700 }}>{job.title || 'Job Title Not Available'}</h2>
                                            {job.rating && (
                                                <div className="job-rating" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f1f5f9' }}>
                                                    ⭐
                                                    <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{job.rating}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="job-details">
                                        {job.location && (
                                            <div className="job-info" style={{ color: '#f1f5f9' }}>
                                                <IoLocationSharp style={{ color: '#a0aec0' }} />
                                                <span style={{ color: '#f1f5f9' }}><strong style={{ color: '#ffffff' }}>Location:</strong> {job.location}</span>
                                            </div>
                                        )}
                                        {job.employmentType && (
                                            <div className="job-info" style={{ color: '#f1f5f9' }}>
                                                <PiShoppingBagFill style={{ color: '#a0aec0' }} />
                                                <span style={{ color: '#f1f5f9' }}><strong style={{ color: '#ffffff' }}>Type:</strong> {job.employmentType}</span>
                                            </div>
                                        )}
                                    </div>

                                    {job.packagePerAnnum && <p className="job-package" style={{ color: '#34d399', fontSize: '18px', fontWeight: 700 }}><strong style={{ color: '#34d399' }}>Package:</strong> {job.packagePerAnnum}</p>}
                                    {job.jobDescription && <p className="job-description" style={{ color: '#e2e8f0', fontSize: '15px', lineHeight: 1.7 }}>{job.jobDescription}</p>}

                                    <div className="application-actions">
                                        <button
                                            className="withdraw-btn"
                                            onClick={() => handleDelete(application._id)}
                                            disabled={deletingId === application._id}
                                        >
                                            <FaTrash /> {deletingId === application._id ? 'Withdrawing...' : 'Withdraw Application'}
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Applications
