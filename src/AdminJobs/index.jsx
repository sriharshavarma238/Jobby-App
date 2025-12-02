import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import AdminHeader from '../AdminHeader'
import { API_ENDPOINTS } from '../config/api'
import { FaStar, FaTrash, FaEdit } from 'react-icons/fa'
import { IoLocationSharp } from 'react-icons/io5'
import { PiShoppingBagFill } from 'react-icons/pi'
import './index.css'

const AdminJobs = () => {
    const [jobs, setJobs] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [deleteJobId, setDeleteJobId] = useState(null)

    const userType = Cookies.get('user_type')
    const jwtToken = Cookies.get('jwt_token')

    if (!jwtToken) {
        return <Navigate to="/" replace />
    }

    if (userType !== 'admin') {
        return <Navigate to="/home" replace />
    }

    const fetchJobs = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(API_ENDPOINTS.ADMIN_GET_JOBS, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            })
            const data = await response.json()
            if (response.ok) {
                setJobs(data.jobs || [])
            }
        } catch (error) {
            console.error('Failed to fetch jobs', error)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        fetchJobs()
    }, [jwtToken])

    const handleDelete = async (jobId) => {
        if (!window.confirm('Are you sure you want to delete this job?')) return

        setDeleteJobId(jobId)
        try {
            const response = await fetch(API_ENDPOINTS.ADMIN_DELETE_JOB(jobId), {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            })

            if (response.ok) {
                setJobs(jobs.filter(job => job._id !== jobId))
                alert('Job deleted successfully')
            } else {
                alert('Failed to delete job')
            }
        } catch (error) {
            alert('Error deleting job')
        } finally {
            setDeleteJobId(null)
        }
    }

    return (
        <div className="admin-jobs-container">
            <AdminHeader />
            <div className="admin-jobs-content">
                <div className="admin-jobs-header">
                    <h1>My Posted Jobs</h1>
                    <button
                        className="create-job-btn"
                        onClick={() => window.location.href = '/admin/create-job'}
                    >
                        + Create New Job
                    </button>
                </div>

                {isLoading ? (
                    <div className="loading-message">Loading jobs...</div>
                ) : jobs.length === 0 ? (
                    <div className="no-jobs">
                        <p>You haven't posted any jobs yet.</p>
                        <button
                            className="create-first-job-btn"
                            onClick={() => window.location.href = '/admin/create-job'}
                        >
                            Create Your First Job
                        </button>
                    </div>
                ) : (
                    <div className="admin-jobs-list">
                        {jobs.map(job => (
                            <div key={job._id} className="admin-job-card">
                                <div className="admin-job-header">
                                    {job.companyLogoUrl && (
                                        <img src={job.companyLogoUrl} alt="company logo" className="company-logo" />
                                    )}
                                    <div className="job-title-section">
                                        <h2>{job.title}</h2>
                                        <div className="job-rating">
                                            ⭐
                                            <span>{job.rating}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="job-details">
                                    <div className="job-info">
                                        <IoLocationSharp />
                                        <span>{job.location}</span>
                                    </div>
                                    <div className="job-info">
                                        <PiShoppingBagFill />
                                        <span>{job.employmentType}</span>
                                    </div>
                                    <p className="job-package">{job.packagePerAnnum}</p>
                                </div>

                                
                                <p className="admin-job-description">{job.jobDescription}</p>

                                <div className="job-actions">
                                    <button
                                        className="edit-btn"
                                        onClick={() => window.location.href = `/admin/edit-job/${job._id}`}
                                    >
                                        <FaEdit /> Edit
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(job._id)}
                                        disabled={deleteJobId === job._id}
                                    >
                                        <FaTrash /> {deleteJobId === job._id ? 'Deleting...' : 'Delete'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminJobs
