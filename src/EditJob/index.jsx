import { useState, useEffect } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import Cookies from 'js-cookie'
import AdminHeader from '../AdminHeader'
import { API_ENDPOINTS } from '../config/api'
import './index.css'

const EditJob = () => {
    const { jobId } = useParams()
    const [formData, setFormData] = useState({
        title: '',
        rating: '',
        companyLogoUrl: '',
        location: '',
        jobDescription: '',
        employmentType: 'Full Time',
        packagePerAnnum: '',
    })
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const userType = Cookies.get('user_type')
    const jwtToken = Cookies.get('jwt_token')
    const navigate = useNavigate()

    if (!jwtToken) {
        return <Navigate to="/" replace />
    }

    if (userType !== 'admin') {
        return <Navigate to="/home" replace />
    }

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await fetch(API_ENDPOINTS.ADMIN_GET_JOB(jobId), {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                })
                const data = await response.json()
                if (response.ok && data.job) {
                    setFormData({
                        title: data.job.title || '',
                        rating: data.job.rating || '',
                        companyLogoUrl: data.job.companyLogoUrl || '',
                        location: data.job.location || '',
                        jobDescription: data.job.jobDescription || '',
                        employmentType: data.job.employmentType || 'Full Time',
                        packagePerAnnum: data.job.packagePerAnnum || '',
                    })
                } else {
                    setError('Failed to load job details')
                }
            } catch (err) {
                setError('Failed to connect to server')
            } finally {
                setIsLoading(false)
            }
        }

        fetchJob()
    }, [jobId, jwtToken])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError('')

        try {
            const response = await fetch(API_ENDPOINTS.ADMIN_UPDATE_JOB(jobId), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwtToken}`,
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (response.ok) {
                setSuccess(true)
                setTimeout(() => {
                    navigate('/admin/jobs')
                }, 1500)
            } else {
                setError(data.message || 'Failed to update job')
            }
        } catch (err) {
            setError('Failed to connect to server')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return (
            <div className="edit-job-container">
                <AdminHeader />
                <div className="edit-job-content">
                    <p className="loading-message">Loading job details...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="edit-job-container">
            <AdminHeader />
            <div className="edit-job-content">
                <h1 className="edit-job-heading">Edit Job</h1>

                {success ? (
                    <div className="success-message">
                        <p>✓ Job updated successfully! Redirecting...</p>
                    </div>
                ) : (
                    <form className="job-form" onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="title">Job Title <span style={{ color: "red" }}> *</span></label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Senior React Developer"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="rating">Rating (0-5) <span style={{ color: "red" }}> *</span></label>
                                <input
                                    type="number"
                                    id="rating"
                                    name="rating"
                                    value={formData.rating}
                                    onChange={handleChange}
                                    min="0"
                                    max="5"
                                    step="0.1"
                                    placeholder="4.5"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="location">Location <span style={{ color: "red" }}> *</span></label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="e.g. Hyderabad"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="employmentType">Employment Type <span style={{ color: "red" }}> *</span></label>
                                <select
                                    id="employmentType"
                                    name="employmentType"
                                    value={formData.employmentType}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="Full Time" style={{ color: "black" }}>Full Time</option>
                                    <option value="Part Time" style={{ color: "black" }}>Part Time</option>
                                    <option value="Freelance" style={{ color: "black" }}>Freelance</option>
                                    <option value="Internship" style={{ color: "black" }}>Internship</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="packagePerAnnum">Package Per Annum <span style={{ color: "red" }}> *</span></label>
                                <input
                                    type="text"
                                    id="packagePerAnnum"
                                    name="packagePerAnnum"
                                    value={formData.packagePerAnnum}
                                    onChange={handleChange}
                                    placeholder="e.g. 10 - 15 LPA"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="companyLogoUrl">Company Logo URL</label>
                                <input
                                    type="url"
                                    id="companyLogoUrl"
                                    name="companyLogoUrl"
                                    value={formData.companyLogoUrl}
                                    onChange={handleChange}
                                    placeholder="https://example.com/logo.png"
                                />
                            </div>
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="jobDescription">Job Description <span style={{ color: "red" }}> *</span></label>
                            <textarea
                                id="jobDescription"
                                name="jobDescription"
                                value={formData.jobDescription}
                                onChange={handleChange}
                                placeholder="Describe the job role, responsibilities, requirements..."
                                rows="6"
                                required
                            />
                        </div>

                        {error && <p className="error-message">{error}</p>}

                        <div className="form-actions">
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => navigate('/admin/jobs')}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Updating...' : 'Update Job'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}

export default EditJob
