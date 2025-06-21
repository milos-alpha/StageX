import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { JobProvider } from './context/JobContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Jobs from './pages/Jobs/Jobs';
import JobDetails from './pages/Jobs/JobDetails';
import PostJob from './pages/Jobs/PostJob';
import EmployerDashboard from './pages/Dashboard/EmployerDashboard';
import StudentDashboard from './pages/Dashboard/StudentDashboard';
import Profile from './pages/Profile/Profile';
import MyApplications from './pages/Applications/MyApplications';
import ProtectedRoute from './components/common/ProtectedRoute';
import NotFound from './pages/NotFound';
import ApplicationForm from './components/applications/ApplicationForm';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <JobProvider>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
              <Route path="/jobs/:id/apply" element={
                <ProtectedRoute allowedRoles={['student', 'employee']}>
                  <ApplicationForm />
                </ProtectedRoute>
              } />
              
              {/* Protected Employer Routes */}
              <Route path="/employer-dashboard" element={
                <ProtectedRoute allowedRoles={['employer', 'admin']}>
                  <EmployerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/post-job" element={
                <ProtectedRoute allowedRoles={['employer', 'admin']}>
                  <PostJob />
                </ProtectedRoute>
              } />
              
              {/* Protected Student Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute allowedRoles={['student', 'employee']}>
                  <StudentDashboard />
                </ProtectedRoute>
              } />
              
              {/* Common Protected Routes */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/my-applications" element={
                <ProtectedRoute>
                  <MyApplications />
                </ProtectedRoute>
              } />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </JobProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;