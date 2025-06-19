import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import JobItem from '../JobItem';
import Cookies from 'js-cookie';
import Header from '../Header';
import BeatLoader from 'react-spinners/BeatLoader';
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
          fetch('https://apis.ccbp.in/profile', option),
          fetch('https://apis.ccbp.in/jobs', option),
        ]);
        const profile = await profileRes.json();
        const jobs = await jobsRes.json();
        setProfileData(profile.profile_details);
        setAllJobs(jobs.jobs);
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
  console.log(selectedTypes, allJobs.map(j => j.employment_type))
  // Filter logic
  const filteredJobs = allJobs.filter(job => {
    const matchesType =
      selectedTypes.length === 0 || selectedTypes.includes(job.employment_type);

    // Salary filter (parse "10 LPA" to 10)
    const jobSalary = parseInt(job.package_per_annum.replace(/\D/g, ''));
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
            <div className="profile-info">
              <img src={profileData.profile_image_url} alt="Profile" />
              <p style={{color:"black"}}>{profileData.name}</p>
              <p style={{color:"black"}}>{profileData.short_bio}</p>
            </div>
          </div>
          <div className="filter">
            <h2 style={{textAlign:"left"}}>Type of Employment</h2>
            <ul style={{ padding: '15px', listStyleType:"none"}}>
              {employmentTypes.map(type => (
                <li key={type.value} style={{textAlign:"left"}}>
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
            <h2 style={{textAlign:"left"}}>Salary range</h2>
            <ul style={{ padding: '15px', listStyleType:"none", textAlign:"left"}}>
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