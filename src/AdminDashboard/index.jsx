import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import AdminHeader from '../AdminHeader'
import { API_ENDPOINTS } from '../config/api'
import './index.css'

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalJobs: 0, recentJobs: [] })
    const [isLoading, setIsLoading] = useState(true)
    const userType = Cookies.get('user_type')
    const jwtToken = Cookies.get('jwt_token')

    if (!jwtToken) {
        return <Navigate to="/" replace />
    }

    if (userType !== 'admin') {
        return <Navigate to="/home" replace />
    }

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true)
            try {
                const response = await fetch(API_ENDPOINTS.ADMIN_GET_JOBS, {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                })
                const data = await response.json()
                if (response.ok) {
                    setStats({
                        totalJobs: data.jobs.length,
                        recentJobs: data.jobs.slice(0, 5),
                    })
                }
            } catch (error) {
                console.error('Failed to fetch dashboard data', error)
            }
            setIsLoading(false)
        }
        fetchDashboardData()
    }, [jwtToken])

    return (
        <div className="admin-dashboard-container">
            <AdminHeader />
            <div className="admin-dashboard-content">
                <h1 className="dashboard-heading">Admin Dashboard</h1>

                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        <div className="stats-container">
                            <div className="stat-card">
                                <h2>Total Jobs Posted</h2>
                                <p className="stat-number">{stats.totalJobs}</p>
                            </div>
                        </div>

                        <div className="recent-jobs-section">
                            <h2>Recent Jobs</h2>
                            {stats.recentJobs.length === 0 ? (
                                <p className="no-jobs-message">No jobs posted yet. Create your first job!</p>
                            ) : (
                                <ul className="recent-jobs-list">
                                    {stats.recentJobs.map(job => (
                                        <li key={job._id} className="recent-job-item">
                                            <h3>{job.title}</h3>
                                            <p><strong>Location:</strong> {job.location} • <strong>Type:</strong> {job.employmentType}</p>
                                            <p><strong>Package:</strong> {job.packagePerAnnum}</p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="quick-actions">
                            <h2>Quick Actions</h2>
                            <div className="action-buttons">
                                <button
                                    className="action-btn create-job-btn"
                                    onClick={() => window.location.href = '/admin/create-job'}
                                >
                                    Create New Job
                                </button>
                                <button
                                    className="action-btn view-jobs-btn"
                                    onClick={() => window.location.href = '/admin/jobs'}
                                >
                                    View All Jobs
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default AdminDashboard
