import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { FaEdit, FaUser } from 'react-icons/fa';
import Header from '../Header';
import { API_ENDPOINTS } from '../config/api';
import './index.css';

const ProfilePage = () => {
    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ name: '', shortBio: '', profileImageUrl: '' });
    const navigate = useNavigate();

    const defaultAvatar = 'https://ui-avatars.com/api/?name=User&background=3b82f6&color=fff&size=200';

    useEffect(() => {
        const token = Cookies.get('jwt_token');
        if (!token) {
            navigate('/login');
            return;
        }
        fetchProfile();
    }, [navigate]);

    const fetchProfile = async () => {
        const token = Cookies.get('jwt_token');
        try {
            const response = await fetch(API_ENDPOINTS.GET_PROFILE, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setProfileData(data);
                setEditData({
                    name: data.name || '',
                    shortBio: data.shortBio || '',
                    profileImageUrl: data.profileImageUrl || ''
                });
            } else {
                setError('Failed to fetch profile');
            }
        } catch (err) {
            setError('Error fetching profile');
            console.error('Profile fetch error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        const token = Cookies.get('jwt_token');
        try {
            const response = await fetch(API_ENDPOINTS.UPDATE_PROFILE, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(editData),
            });

            if (response.ok) {
                const data = await response.json();
                setProfileData(data);
                setIsEditing(false);
                alert('Profile updated successfully!');
            } else {
                alert('Failed to update profile');
            }
        } catch (err) {
            console.error('Update error:', err);
            alert('Error updating profile');
        }
    };

    if (isLoading) {
        return (
            <>
                <Header />
                <div className="profile-page-container">
                    <div className="loader-container">
                        <div className="loader"></div>
                    </div>
                </div>
            </>
        );
    }

    if (error || !profileData) {
        return (
            <>
                <Header />
                <div className="profile-page-container">
                    <div className="error-message">
                        <h2>Unable to load profile</h2>
                        <p>{error || 'Profile data not available'}</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="profile-page-container">
                <div className="profile-content-wrapper">
                    {/* Single Profile Card */}
                    <div className="profile-main-card">
                        {/* Profile Header Section */}
                        <div className="profile-card-header">
                            <div className="profile-avatar-container">
                                {profileData.profileImageUrl ? (
                                    <img
                                        src={profileData.profileImageUrl}
                                        alt="profile"
                                        className="profile-avatar-large"
                                        onError={(e) => { e.target.src = defaultAvatar; }}
                                    />
                                ) : (
                                    <div className="profile-avatar-placeholder-large">
                                        <FaUser size={100} color="#cbd5e1" />
                                    </div>
                                )}
                            </div>
                            <div className="profile-header-details">
                                <h1 className="profile-name-title">{profileData.name || 'User'}</h1>
                                <p className="profile-bio-text">
                                    {profileData.shortBio || 'No bio available. Click edit to add one!'}
                                </p>
                                <button className="edit-profile-btn" onClick={handleEditToggle}>
                                    <FaEdit /> {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                                </button>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="profile-card-divider"></div>

                        {/* Profile Details Section */}
                        {!isEditing ? (
                            <div className="profile-details-section">
                                <h2 className="details-section-title">Profile Information</h2>
                                <div className="profile-info-grid">
                                    <div className="profile-info-item">
                                        <span className="info-item-label">Full Name</span>
                                        <span className="info-item-value">{profileData.name || 'Not provided'}</span>
                                    </div>
                                    <div className="profile-info-item">
                                        <span className="info-item-label">Short Bio</span>
                                        <span className="info-item-value">{profileData.shortBio || 'Not provided'}</span>
                                    </div>
                                    <div className="profile-info-item">
                                        <span className="info-item-label">Profile Image URL</span>
                                        <span className="info-item-value profile-url">
                                            {profileData.profileImageUrl || 'Not provided'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="profile-edit-section">
                                <h2 className="details-section-title">Edit Profile</h2>
                                <form onSubmit={handleSave} className="profile-edit-form">
                                    <div className="form-group">
                                        <label htmlFor="name">Full Name</label>
                                        <input
                                            id="name"
                                            type="text"
                                            value={editData.name}
                                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                            placeholder="Enter your name"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="bio">Short Bio</label>
                                        <textarea
                                            id="bio"
                                            value={editData.shortBio}
                                            onChange={(e) => setEditData({ ...editData, shortBio: e.target.value })}
                                            placeholder="Tell us about yourself"
                                            rows="4"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="imageUrl">Profile Image URL</label>
                                        <input
                                            id="imageUrl"
                                            type="url"
                                            value={editData.profileImageUrl}
                                            onChange={(e) => setEditData({ ...editData, profileImageUrl: e.target.value })}
                                            placeholder="https://example.com/image.jpg"
                                        />
                                    </div>
                                    <div className="form-actions">
                                        <button type="submit" className="save-btn">
                                            <FaEdit /> Save Changes
                                        </button>
                                        <button type="button" className="cancel-btn" onClick={handleEditToggle}>
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfilePage;
