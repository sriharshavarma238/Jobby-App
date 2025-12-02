// API Configuration
// TODO: Replace with your deployed backend URL after deployment
const API_BASE_URL = 'https://jobby-server-delta.vercel.app'; // Change this to your deployed backend URL

export const API_ENDPOINTS = {
    // User Auth
    USER_SIGNUP: `${API_BASE_URL}/user/signup`,
    USER_SIGNIN: `${API_BASE_URL}/user/signin`,

    // Admin Auth
    ADMIN_SIGNUP: `${API_BASE_URL}/admin/signup`,
    ADMIN_SIGNIN: `${API_BASE_URL}/admin/signin`,

    // Admin Job Management
    ADMIN_CREATE_JOB: `${API_BASE_URL}/admin/jobs`,
    ADMIN_UPDATE_JOB: (jobId) => `${API_BASE_URL}/admin/jobs/${jobId}`,
    ADMIN_DELETE_JOB: (jobId) => `${API_BASE_URL}/admin/jobs/${jobId}`,
    ADMIN_GET_JOBS: `${API_BASE_URL}/admin/jobs`,
    ADMIN_GET_ALL_JOBS: `${API_BASE_URL}/admin/all-jobs`,
    ADMIN_GET_JOB: (jobId) => `${API_BASE_URL}/admin/job/${jobId}`,

    // User Profile
    GET_PROFILE: `${API_BASE_URL}/user/profile`,
    UPDATE_PROFILE: `${API_BASE_URL}/user/profile`,

    // Jobs
    GET_ALL_JOBS: `${API_BASE_URL}/user/jobs`,
    GET_JOB_DETAILS: (jobId) => `${API_BASE_URL}/user/jobs/${jobId}`,

    // Job Applications
    APPLY_JOB: `${API_BASE_URL}/jobApplication/apply`,
    GET_APPLICATIONS: `${API_BASE_URL}/jobApplication/`,
    DELETE_APPLICATION: (applicationId) => `${API_BASE_URL}/jobApplication/${applicationId}`,
};

export default API_BASE_URL;