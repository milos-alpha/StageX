import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import DashboardCard from '../../components/dashboard/DashboardCard';
import JobStatsChart from '../../components/dashboard/JobStatsChart';
import RecentApplications from '../../components/dashboard/RecentApplications';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const EmployerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [jobsRes, appsRes] = await Promise.all([
          api.get('/jobs?limit=5'),
          api.get('/applications?limit=5'),
        ]);
        
        const totalJobs = jobsRes.data.total;
        const totalApplications = appsRes.data.total;
        const recentJobs = jobsRes.data.data;
        const recentApplications = appsRes.data.data;
        
        setStats({
          totalJobs,
          totalApplications,
          recentJobs,
          recentApplications,
        });
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Employer Dashboard</h1>
          <Link 
            to="/post-job" 
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition duration-300"
          >
            Post New Job
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard 
            title="Total Jobs Posted"
            value={stats?.totalJobs ?? 0}
            icon="briefcase"
            color="primary"
          />
          <DashboardCard 
            title="Total Applications"
            value={stats?.totalApplications ?? 0}
            icon="document-text"
            color="secondary"
          />
          <DashboardCard 
            title="Active Listings"
            value={(stats?.recentJobs || []).filter(job => job.isActive).length}
            icon="check-circle"
            color="green"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Job Statistics</h2>
            <JobStatsChart jobs={stats?.recentJobs || []} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Recent Applications</h2>
            <RecentApplications applications={stats?.recentApplications || []} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Job Postings</h2>
            <Link 
              to="/jobs" 
              className="text-primary-600 hover:text-primary-800 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {(stats?.recentJobs && stats.recentJobs.length > 0) ? (
              stats.recentJobs.map(job => (
                <div key={job._id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-800">
                        <Link to={`/jobs/${job._id}`} className="hover:text-primary-600">
                          {job.title}
                        </Link>
                      </h3>
                      <p className="text-sm text-gray-600">{job.type} • {job.location}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      job.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {job.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No recent job postings</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;