# Backend Integration Guide

## Changes Made

The frontend has been updated to work with your custom backend API. Here's what was changed:

### 1. API Configuration (`src/config/api.js`)
- Created centralized API endpoint configuration
- All API URLs are in one place for easy updates after deployment
- **ACTION REQUIRED**: Update `API_BASE_URL` with your deployed backend URL

### 2. Authentication Updates

#### LoginPage (`src/LoginPage/index.jsx`)
- Changed from `https://apis.ccbp.in/login` to your backend `/user/signin`
- Updated to handle backend response format: `{ message, token }`
- Added Content-Type header for JSON requests

### 3. Field Name Mappings

Your backend uses **camelCase** instead of **snake_case**. Updated mappings:

| Old API Field | New Backend Field |
|---------------|-------------------|
| `company_logo_url` | `companyLogoUrl` |
| `employment_type` | `employmentType` |
| `package_per_annum` | `packagePerAnnum` |
| `job_description` | `jobDescription` |
| `profile_image_url` | `profileImageUrl` |
| `short_bio` | `shortBio` |
| `id` | `_id` (MongoDB ObjectId) |

### 4. Component Updates

#### JobsPage (`src/JobsPage/index.jsx`)
- Updated to fetch from `/user/profile` and `/user/jobs`
- Fixed field name mappings for profile and jobs data
- Filter logic updated to use `employmentType` and `packagePerAnnum`

#### JobItem (`src/JobItem/index.jsx`)
- Updated all field names to camelCase
- Changed navigation to use `_id` instead of `id`

#### JobDetails (`src/JobDetails/index.jsx`)
- Updated to fetch all jobs and filter by ID (since no single job endpoint exists)
- Removed fields not in backend schema:
  - `company_website_url`
  - `skills`
  - `life_at_company`
- Similar jobs logic updated to filter by `employmentType`

## Backend Endpoints Used

### User Authentication
- POST `/user/signup` - Register new user
- POST `/user/signin` - Login (returns `{ message, token }`)

### User Profile
- GET `/user/profile` - Get profile (requires Bearer token)
- PUT `/user/profile` - Update profile

### Jobs
- GET `/user/jobs` - Get all jobs (requires Bearer token)

### Job Applications
- POST `/jobApplication/apply` - Apply to job
- GET `/jobApplication/` - Get user's applications
- DELETE `/jobApplication/:applicationId` - Delete application

## After Backend Deployment

### Step 1: Update API Base URL
Edit `src/config/api.js`:
```javascript
const API_BASE_URL = 'https://your-deployed-backend.com'; // Replace with your URL
```

### Step 2: Test All Features
1. Login/Signup
2. View profile
3. Browse jobs
4. Filter jobs (by type, salary, search)
5. View job details
6. Apply to jobs (if implemented)

### Step 3: Enable CORS on Backend
Make sure your backend allows requests from your frontend domain:
```javascript
// In server.js
const cors = require('cors');
app.use(cors({
  origin: 'https://your-frontend-domain.com', // or '*' for development
  credentials: true
}));
```

## Missing Backend Features (Optional Enhancements)

Consider adding these to your backend for better functionality:

### 1. Single Job Endpoint
```javascript
// In routes/user.js
userRouter.get('/jobs/:jobId', userAuth, async (req, res) => {
  try {
    const job = await jobModel.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ job });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching job', error: err.message });
  }
});
```

### 2. Enhanced Job Schema
Add these optional fields to `jobSchema` in `db.js`:
```javascript
const jobSchema = new Schema({
  // ... existing fields
  companyWebsiteUrl: String,
  skills: [{ name: String, imageUrl: String }],
  lifeAtCompany: {
    description: String,
    imageUrl: String
  }
});
```

### 3. Apply Job Feature Integration
The frontend is ready for job applications. Backend already has:
- POST `/jobApplication/apply` - Apply to job
- GET `/jobApplication/` - Get applications
- DELETE `/jobApplication/:applicationId` - Delete application

You can add an "Apply" button in JobDetails component if needed.

## Development vs Production

### Development (Local)
```javascript
// src/config/api.js
const API_BASE_URL = 'http://localhost:3000';
```

### Production
```javascript
// src/config/api.js
const API_BASE_URL = 'https://your-backend-url.com';
```

Or use environment variables:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
```

Then create `.env` files:
```
# .env.development
VITE_API_BASE_URL=http://localhost:3000

# .env.production
VITE_API_BASE_URL=https://your-backend-url.com
```

## Testing Checklist

- [ ] Update API_BASE_URL in config/api.js
- [ ] Test user signup
- [ ] Test user signin
- [ ] Verify JWT token is stored in cookies
- [ ] Test jobs page loads with profile
- [ ] Test job filtering works
- [ ] Test job details page
- [ ] Test navigation between pages
- [ ] Test logout functionality
- [ ] Verify protected routes require authentication
- [ ] Test CORS is configured correctly

## Notes

- All API calls now include `Authorization: Bearer <token>` header
- Token is stored in cookies as `jwt_token`
- Profile is created automatically on user signup
- Jobs use MongoDB `_id` for identification
- Similar jobs are filtered by `employmentType` on frontend
