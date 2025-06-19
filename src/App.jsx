import { BrowserRouter, Route, Routes } from 'react-router-dom';

import LoginPage from './LoginPage';
import HomePage from './HomePage';
import JobsPage from './JobsPage';
import JobDetails from './JobDetails';
import './App.css';

const App = () => (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/jobs" element={<JobsPage />} />
      <Route path="/jobs/:id" element={<JobDetails />} />
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
);

export default App;