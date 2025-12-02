import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'
import JobItem from '../JobItem'
import { API_ENDPOINTS } from '../config/api'
import './index.css'
import { FaStar } from "react-icons/fa"
import { IoLocationSharp } from "react-icons/io5"
import { PiShoppingBagFill } from "react-icons/pi"
import BeatLoader from 'react-spinners/BeatLoader'
import { Link } from 'react-router-dom'

const JobDetails = () => {
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [similarJobs, setSimilarJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isApplying, setIsApplying] = useState(false)
  const [applyMessage, setApplyMessage] = useState('')
  const [hasApplied, setHasApplied] = useState(false)

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) {
        setError('Invalid job ID')
        setIsLoading(false)
        return
      }
      setIsLoading(true)
      setError(null)
      const option = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Cookies.get("jwt_token")}`,
        },
      }
      try {
        // Fetch specific job with application status
        const response = await fetch(API_ENDPOINTS.GET_JOB_DETAILS(id), option)
        const data = await response.json()

        if (response.ok && data.job) {
          setJob(data.job)
          setHasApplied(data.hasApplied || false)
          
          // Fetch all jobs for similar jobs
          const allJobsResponse = await fetch(API_ENDPOINTS.GET_ALL_JOBS, option)
          const allJobsData = await allJobsResponse.json()
          
          if (allJobsResponse.ok && allJobsData.jobs) {
            const similar = allJobsData.jobs.filter(
              j => j._id !== id && j.employmentType === data.job.employmentType
            ).slice(0, 4)
            setSimilarJobs(similar)
          }
        } else {
          setError('Job not found')
          setJob(null)
        }
      } catch (error) {
        setError('Failed to fetch job details')
        setJob(null)
      }
      setIsLoading(false)
    }
    fetchJob()
  }, [id])

  if (isLoading) return (
    <div className="loading-container" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <BeatLoader color="#ff5733" />
    </div>
  )
  if (error) return <div>{error}</div>
  if (!job) return <div>Job not found</div>

  const {
    companyLogoUrl,
    title,
    rating,
    location,
    employmentType,
    packagePerAnnum,
    jobDescription,
  } = job

  const handleApply = async () => {
    setIsApplying(true)
    setApplyMessage('')
    try {
      const response = await fetch(API_ENDPOINTS.APPLY_JOB, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('jwt_token')}`,
        },
        body: JSON.stringify({ jobId: id }),
      })

      const data = await response.json()

      if (response.ok) {
        setApplyMessage('✓ Applied successfully!')
        setHasApplied(true) // Update state so button changes immediately
      } else {
        setApplyMessage(data.message || 'Failed to apply')
      }
    } catch (error) {
      setApplyMessage('Error applying to job')
    } finally {
      setIsApplying(false)
    }
  }

  return (
    <div className="job-item-details-page">
      <Header />
      <div className="job-details-container">
        <li className="job-item">
          <div className="job-item-header">
            <img src={companyLogoUrl} alt="company logo" className="company-logo" />
            <div className="job-item-title-container">
              <h1 className="job-title">{title}</h1>
              <div className="job-rating">
                ⭐
                <p>{rating}</p>
              </div>
            </div>
          </div>
          <div className="job-item-details">
            <div className="job-details">
              <IoLocationSharp className="location-icon" />
              <p className="job-location"><strong>Location:</strong> {location}</p>
              <PiShoppingBagFill className="employ" />
              <p className="job-employment-type"><strong>Type:</strong> {employmentType}</p>
            </div>
            <p className="job-package"><strong>Package:</strong> {packagePerAnnum}</p>
          </div>
          <hr className="hr" />
          <div className="job-description-container">
            <h2 className="job-description-heading">Description</h2>
          </div>
          <p className="job-description">{jobDescription}</p>

          {/* Note: Skills and Life at Company not available in current backend */}
          {/* Add these fields to your backend job schema if needed */}
        </li>
        <div className="job-detail-actions">
          {hasApplied ? (
            <div className="already-applied-message">
              <p>✓ You have already applied for this job</p>
            </div>
          ) : (
            <button
              className="apply-job-btn"
              onClick={handleApply}
              disabled={isApplying}
            >
              {isApplying ? 'Applying...' : 'Apply Now'}
            </button>
          )}
          <Link to="/jobs" >
            <button className='back-to-jobs-btn'>Back To Jobs</button>
          </Link>
        </div>
        {applyMessage && (
          <p className={`apply-message ${applyMessage.includes('✓') ? 'success' : 'error'}`}>
            {applyMessage}
          </p>
        )}
      </div>
      <div className="similar-jobs-container">
        <h2 className="similar-jobs-heading">Similar Jobs</h2>
        <div className="similar-jobs-list">
          {similarJobs.length === 0 ? (
            <p style={{ color: "#fff" }}>No similar jobs found.</p>
          ) : (
            similarJobs.map(similarJob => (
              <JobItem key={similarJob._id} job={similarJob} />
            ))
          )}
        </div>
      </div>
    </div>

  )
}

export default JobDetails