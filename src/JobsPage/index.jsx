import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import JobItem from '../JobItem';
import Cookies from 'js-cookie';
import Header from '../Header';
import BeatLoader from 'react-spinners/BeatLoader';
import { API_ENDPOINTS } from '../config/api';
import { FaUser } from 'react-icons/fa';
import './index.css';

const employmentTypes = [
  { label: 'Full Time', value: 'Full Time' },
  { label: 'Part Time', value: 'Part Time' },
  { label: 'Freelance', value: 'Freelance' },
  { label: 'Internship', value: 'Internship' },
];

const salaryRanges = [
  { label: '10 LPA and above', value: 10 },
  { label: '20 LPA and above', value: 20 },
  { label: '30 LPA and above', value: 30 },
  { label: '40 LPA and above', value: 40 },
];

const JobsPage = ({ onJobClick }) => {
  const [profileData, setProfileData] = useState({});
  const [allJobs, setAllJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedSalary, setSelectedSalary] = useState(null);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {

    console.log(Cookies.get('jwt_token'))
    const option = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${Cookies.get('jwt_token')}`,
      },
    };

    const getResponds = async () => {
      setIsLoading(true);
      try {
        const [profileRes, jobsRes] = await Promise.all([
          fetch(API_ENDPOINTS.GET_PROFILE, option),
          fetch(API_ENDPOINTS.GET_ALL_JOBS, option),
        ]);
        const profile = await profileRes.json();
        const jobs = await jobsRes.json();
        // Backend returns: { profileImageUrl, name, shortBio }
        setProfileData({
          profile_image_url: profile.profileImageUrl,
          name: profile.name,
          short_bio: profile.shortBio
        });
        // Backend returns: { jobs: [...] }
        setAllJobs(jobs.jobs || []);
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
      setIsLoading(false);
    };

    getResponds();
  }, []);

  // Checkbox handler
  const handleTypeChange = (e) => {
    const { value, checked } = e.target;
    setSelectedTypes(prev =>
      checked ? [...prev, value] : prev.filter(t => t !== value)
    );
  };

  // Radio handler
  const handleSalaryChange = (salary) => {
    setSelectedSalary(Number(salary));
  };

  // Search handler
  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };
  console.log(selectedTypes, allJobs.map(j => j.employmentType))
  // Filter logic
  const filteredJobs = allJobs.filter(job => {
    const matchesType =
      selectedTypes.length === 0 || selectedTypes.includes(job.employmentType);

    // Salary filter (parse "10 LPA" to 10)
    const jobSalary = parseInt((job.packagePerAnnum || '').replace(/\D/g, ''));
    const matchesSalary =
      !selectedSalary || (jobSalary >= selectedSalary);

    // Search filter
    const matchesSearch = job.title.toLowerCase().includes(searchText.toLowerCase());

    return matchesType && matchesSalary && matchesSearch;
  });

  const renderLoader = () => (
    <div className="loading-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <BeatLoader color="#ff5733" />
    </div>
  );

  const renderJobsList = () => (
    <>
      <Header />
      <div className="jobs-page">
        <div className="jobs-header">
          <div className="jobs-header-content">
            <Link to="/profile" className="profile-info-link">
              <div className="profile-info">
                {profileData.profile_image_url ? (
                  <img src={profileData.profile_image_url} alt="Profile" className="profile-image" />
                ) : (
                  <div className="profile-placeholder">
                    <FaUser size={40} color="#cbd5e1" />
                  </div>
                )}
                <p className="profile-name">{profileData.name || 'User'}</p>
                <p className="profile-bio">{profileData.short_bio || 'No bio available'}</p>
              </div>
            </Link>
          </div>
          <div className="filter">
            <h2 style={{ textAlign: "left" }}>Type of Employment</h2>
            <ul style={{ padding: '15px', listStyleType: "none" }}>
              {employmentTypes.map(type => (
                <li key={type.value} style={{ textAlign: "left" }}>
                  <input
                    type="checkbox"
                    value={type.value}
                    checked={selectedTypes.includes(type.value)}
                    onChange={handleTypeChange}
                  />
                  <label>{type.label}</label>
                </li>
              ))}
            </ul>
            <hr className="line" />
            <h2 style={{ textAlign: "left" }}>Salary range</h2>
            <ul style={{ padding: '15px', listStyleType: "none", textAlign: "left" }}>
              {salaryRanges.map((range) => (
                <li key={range.value}>
                  <input
                    type="radio"
                    name='salary'
                    value={range.value}
                    checked={selectedSalary === range.value}
                    onChange={e => handleSalaryChange(Number(e.target.value))}
                  />
                  <label>{range.label}</label>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="jobsList">
          <input
            className="search-input"
            type="text"
            placeholder="Filter jobs..."
            value={searchText}
            onChange={handleSearchChange}
          />
          <div className="job-list">
            {filteredJobs.map(job => (
              <JobItem key={job.id} job={job} />
            ))}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {isLoading ? renderLoader() : renderJobsList()}
    </>
  );
};

export default JobsPage;