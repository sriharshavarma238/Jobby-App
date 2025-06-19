import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'
import JobItem from '../JobItem'
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
        const url = `https://apis.ccbp.in/jobs/${id}`
        console.log('Fetching job with URL:', url)
        const response = await fetch(url, option)
        const data = await response.json()
        console.log(data)
        if (response.ok && data.job_details) {
          setJob(data.job_details)
          setSimilarJobs(data.similar_jobs || [])
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
    <div className="loading-container" style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
      <BeatLoader color="#ff5733" />
    </div>
  )
  if (error) return <div>{error}</div>
  if (!job) return <div>Job not found</div>

  const {
    company_logo_url,
    title,
    rating,
    location,
    employment_type,
    package_per_annum,
    job_description,
    company_website_url,
    skills = [],
    life_at_company = {},
  } = job

  return (
    <div className="job-item-details-page">
      <Header />
      <div className="job-details-container">
        <li className="job-item">
          <div className="job-item-header">
            <img src={company_logo_url} alt="company logo" className="company-logo" />
            <div className="job-item-title-container">
              <h1 className="job-title">{title}</h1>
              <div className="job-rating">
                <FaStar className="star-icon" />
                <p>{rating}</p>
              </div>
            </div>
          </div>
          <div className="job-item-details">
            <div className="job-details">
              <IoLocationSharp className="location-icon" />
              <p className="job-location">{location}</p>
              <PiShoppingBagFill className="employ" />
              <p className="job-employment-type">{employment_type}</p>
            </div>
            <p className="job-package">{package_per_annum}</p>
          </div>
          <hr className="hr" />
          <div className="job-description-container">
            <h2 className="job-description-heading">Description</h2>
            <p>
              <a href={company_website_url} className="visit-link" rel="noopener noreferrer">Visit</a>
            </p>
          </div>
          <p className="job-description">{job_description}</p>
          <h2 className="job-skills-heading">Skills</h2>
          <div className="job-skills">
            <ul className="skills-list">
              {skills.map(skill => (
                <li key={skill.name} className="skill-item">
                  <img src={skill.image_url} alt={skill.name} className="skill-image" />
                  <p>{skill.name}</p>
                </li>
              ))}
            </ul>
            <div className="life-at-company">
              <h2 className="life-at-company-heading">Life at Company</h2>
              <div className="life-at-company-content">
                <p>{life_at_company.description}</p>
                <img src={life_at_company.image_url} alt="Life at Company" />
              </div>
            </div>
          </div>
        </li>
        <Link to="/jobs" >
          <button className='back-to-jobs-btn'>Back To Jobs</button>
        </Link>
      </div>
      <div className="similar-jobs-container">
        <h2 className="similar-jobs-heading">Similar Jobs</h2>
        <div className="similar-jobs-list">
          {similarJobs.length === 0 ? (
            <p style={{color: "#fff"}}>No similar jobs found.</p>
          ) : (
            similarJobs.map(similarJob => (
              <JobItem key={similarJob.id} job={similarJob} />
            ))
          )}
        </div>
      </div>
    </div>
    
  )
}

export default JobDetails