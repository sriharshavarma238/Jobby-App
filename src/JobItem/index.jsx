import React from 'react'
import './index.css'
import { FaLocationDot } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";
import { IoBagHandleSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const JobItem = ({ job }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/jobs/${job._id}`, { state: { job } }); // Backend uses _id
    };

    const {
        companyLogoUrl,
        title,
        rating,
        location,
        employmentType,
        packagePerAnnum,
        jobDescription
    } = job

    return (
        <div onClick={handleClick}>
            <li className="job-item">
                <div className="job-item-header">
                    <img src={companyLogoUrl} alt="company logo" className="company-logo" style={{ borderRadius: '0%', width: '10%', height: '10%', paddingRight: '10px', alignSelf: 'center', marginBottom: '10px' }} />
                    <div className="job-item-title-container">
                        <h3 className="job-title">{title}</h3>
                        <p className="job-rating">
                            ⭐
                            {rating}</p>
                    </div>
                </div>
                <div className="job-item-details">
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <p className="job-location">
                            <FaLocationDot className='loc' />
                            {location}</p>
                        <p className="job-employment-type">
                            <IoBagHandleSharp className='bag' />
                            {employmentType}</p>
                    </div>
                    <p className="job-package">{packagePerAnnum}</p>
                </div>
                <hr style={{ border: '1px solid #ccc', margin: '10px 0' }} />
                <h3 className="job-description-heading">Description</h3>
                <p className="job-description">{jobDescription}</p>
            </li>
        </div>
    )
}
export default JobItem;