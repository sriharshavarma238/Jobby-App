import { BrowserRouter, Route, Routes } from 'react-router-dom';

import StartPage from './StartPage';
import LoginPage from './LoginPage';
import HomePage from './HomePage';
import JobsPage from './JobsPage';
import JobDetails from './JobDetails';
import Applications from './Applications';
import ProfilePage from './ProfilePage';
import AdminDashboard from './AdminDashboard';
import CreateJob from './CreateJob';
import EditJob from './EditJob';
import AdminJobs from './AdminJobs';
import './App.css';

const App = () => (
  <Routes>
    <Route path="/" element={<StartPage />} />
    <Route path="/login/:userType" element={<LoginPage />} />
    <Route path="/home" element={<HomePage />} />
    <Route path="/jobs" element={<JobsPage />} />
    <Route path="/jobs/:id" element={<JobDetails />} />
    <Route path="/applications" element={<Applications />} />
    <Route path="/profile" element={<ProfilePage />} />
    <Route path="/admin/dashboard" element={<AdminDashboard />} />
    <Route path="/admin/create-job" element={<CreateJob />} />
    <Route path="/admin/edit-job/:jobId" element={<EditJob />} />
    <Route path="/admin/jobs" element={<AdminJobs />} />
    {/* <Route path="*" element={<NotFound />} /> */}
  </Routes>
);

export default App;